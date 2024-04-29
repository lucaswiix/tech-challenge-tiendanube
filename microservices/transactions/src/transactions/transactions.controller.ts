import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './commands/impl/create-transaction.command';

@Controller()
export class TransactionsController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern('createTransactions')
  create(@Payload() createTransactionDto: CreateTransactionDto) {
    return this.commandBus.execute(
      new CreateTransactionCommand(createTransactionDto),
    );
  }
}
