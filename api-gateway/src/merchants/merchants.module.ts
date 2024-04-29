import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MerchantsController } from './merchants.controller';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.registerAsync([
      {
        name: 'MERCHANTS_CLIENT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get<string>('rabbitmq.host', { infer: true })}:5672`,
            ],
            queue: 'merchants',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
      {
        name: 'TRANSACTIONS_CLIENT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get<string>('rabbitmq.host', { infer: true })}:5672`,
            ],
            queue: 'transactions',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
      {
        name: 'PAYABLES_CLIENT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get<string>('rabbitmq.host', { infer: true })}:5672`,
            ],
            queue: 'payables',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [MerchantsController],
  providers: [MerchantsService, ...CommandHandlers, ...EventHandlers],
  exports: [MerchantsService],
})
export class MerchantsModule {}
