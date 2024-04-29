import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import * as clc from 'cli-color';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TransactionModel } from 'src/transactions/models/transaction.model';
import { CreateTransactionCommand } from '../impl/create-transaction.command';
import { transactionToPayableSerialize } from 'src/utils/serializes/transaction-to-payable';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute({ transaction: command }: CreateTransactionCommand) {
    console.log(clc.greenBright('Creating Transaction'));

    const createdTranscation = await this.transactionsService.create(command);

    const transaction = this.publisher.mergeObjectContext(
      new TransactionModel(createdTranscation.id),
    );
    transaction.createPayable(transactionToPayableSerialize(command));
    transaction.commit();
  }
}
