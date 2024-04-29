import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventHandlers } from './events/handlers';
import { CommandHandlers } from './commands/handlers';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'PAYABLES_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'payables',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, ...CommandHandlers, ...EventHandlers],
})
export class TransactionsModule {}
