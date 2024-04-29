import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePayableDto } from './dto/create-payable.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAllByMerchantId } from './dto/find-all-by-merchant-id.dto';
import { PayableModel } from './factory/payable.factory';
import { Repository } from 'typeorm';
import { Payable } from './entities/payable.entity';
import { addDays, endOfDay, isBefore, startOfDay } from 'date-fns';

@Injectable()
export class PayablesService {
  constructor(
    @InjectRepository(Payable)
    private readonly payablesRepository: Repository<Payable>,
  ) {}

  create(createPayableDto: CreatePayableDto) {
    const model = new PayableModel(createPayableDto);
    const create = model.createObject();
    return this.payablesRepository.save(this.payablesRepository.create(create));
  }

  async findAll({ merchantId, filters, pagination }: FindAllByMerchantId) {
    const queryBuilder = this.payablesRepository
      .createQueryBuilder('entity')
      .where('entity.merchantId = :merchantId', {
        merchantId,
      });

    if (filters?.betweenDates) {
      const { startDate, endDate } = this.validateBetweenDates({
        startDate: filters.betweenDates.startDate,
        endDate: filters.betweenDates.endDate,
      });

      queryBuilder
        .andWhere('entity.createdAt >= :startDate', {
          startDate,
        })
        .andWhere('entity.createdAt <= :endDate', {
          endDate,
        });
    }

    const [data, total] = await queryBuilder
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .orderBy('entity.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  private validateBetweenDates = ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }): { startDate: Date; endDate: Date } => {
    const startDateOfDay = startOfDay(new Date(startDate));
    const endDateOfDay = endOfDay(addDays(new Date(endDate), 1));

    if (!isBefore(startDateOfDay, endDateOfDay)) {
      throw new HttpException(
        'A data de inicio deve ser menor que a data final',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { startDate: startDateOfDay, endDate: endDateOfDay };
  };
}
