import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PayablesService } from './payables.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { FindAllByMerchantId } from './dto/find-all-by-merchant-id.dto';
import { infinityPagination } from 'src/utils/infinity-pagination';

@Controller()
export class PayablesController {
  constructor(private readonly payablesService: PayablesService) {}

  @MessagePattern('createPayables')
  create(@Payload() createPayableDto: CreatePayableDto) {
    return this.payablesService.create(createPayableDto);
  }

  @MessagePattern('findAllPayables')
  async findAll(@Payload() request: FindAllByMerchantId) {
    const limit =
      (request?.pagination?.limit || 20) > 20 ? 20 : request.pagination.limit;

    const { data, total } = await this.payablesService.findAll(request);

    return infinityPagination(data, {
      total,
      limit,
      page: request?.pagination?.page || 1,
    });
  }
}
