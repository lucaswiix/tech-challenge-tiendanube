import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from './services.constants';
import { firstValueFrom, timeout } from 'rxjs';
import { Merchant } from './models/merchant.model';
import { IMerchant } from './merchants.interfaces';
import { EVENT_TIMEOUT } from 'src/utils/constants';

@Injectable()
export class MerchantsService {
  constructor(
    @Inject('MERCHANTS_CLIENT') private readonly merchantsClient: ClientProxy,
    @Inject('PAYABLES_CLIENT') private readonly payableClient: ClientProxy,
  ) {}

  private readonly logger = new Logger(MerchantsService.name);

  async findOne(id: string): Promise<Merchant> {
    this.logger.debug('[Request] MerchantsService.findOne.response', id);
    const response: IMerchant = await firstValueFrom(
      this.merchantsClient
        .send(MESSAGE_PATTERNS.merchant.findOne, {
          id,
        })
        .pipe(timeout(EVENT_TIMEOUT)),
    );

    if (!response) {
      throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
    }
    this.logger.debug('[Request] MerchantsService.findOne.response', response);

    const merchant = new Merchant(response.id);

    return merchant;
  }

  async findAll(
    id: string,
    {
      filters,
      pagination,
    }: {
      filters?: {
        betweenDates?: {
          startDate: string;
          endDate: string;
        };
      };
      pagination: {
        page: number;
        limit: number;
      };
    },
  ) {
    this.logger.debug('[Request] MerchantsService.findAll');

    const response = await firstValueFrom(
      this.payableClient.send(MESSAGE_PATTERNS.payable.findAll, {
        merchantId: id,
        filters,
        pagination,
      }),
    );

    this.logger.debug('[Request] MerchantsService.findAll.response', response);

    return response;
  }
}
