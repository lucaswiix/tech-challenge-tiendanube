import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MerchantsModule } from 'src/merchants/merchants.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [
    CqrsModule,
    MerchantsModule,
    ClientsModule.register([
      {
        name: 'MERCHANTS_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'merchants',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [],
})
export class TransactionsModule {}
