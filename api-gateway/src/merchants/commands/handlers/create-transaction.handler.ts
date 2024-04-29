import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import * as clc from 'cli-color';
import { CreateTransactionCommand } from '../impl/create-transaction.command';
import { MerchantsService } from 'src/merchants/merchants.service';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    private readonly merchantsService: MerchantsService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateTransactionCommand) {
    console.log(clc.greenBright('ConsultingMerchant...'));

    const { merchantId, transaction } = command;
    const merchant = this.publisher.mergeObjectContext(
      await this.merchantsService.findOne(merchantId),
    );
    merchant.createTransaction(transaction);
    merchant.commit();
  }
}
