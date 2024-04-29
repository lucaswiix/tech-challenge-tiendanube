import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MerchantsController } from './merchants.controller';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
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
      {
        name: 'TRANSACTIONS_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'transactions',
          queueOptions: {
            durable: false,
          },
        },
      },
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
  ],
  controllers: [MerchantsController],
  providers: [MerchantsService, ...CommandHandlers, ...EventHandlers],
  exports: [MerchantsService],
})
export class MerchantsModule {}
