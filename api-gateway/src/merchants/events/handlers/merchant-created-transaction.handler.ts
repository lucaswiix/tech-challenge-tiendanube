import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { MerchantCreatedTransactionEvent } from '../impl/merchant-created-transaction.event';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from 'src/merchants/services.constants';

@EventsHandler(MerchantCreatedTransactionEvent)
export class MerchantCreatedTransactionHandler
  implements IEventHandler<MerchantCreatedTransactionEvent>
{
  constructor(
    @Inject('TRANSACTIONS_CLIENT') private readonly client: ClientProxy,
  ) {}

  handle(event: MerchantCreatedTransactionEvent) {
    this.client.emit(MESSAGE_PATTERNS.transactions.create, {
      merchantId: event.merchantId,
      ...event.transaction,
    });
  }
}
