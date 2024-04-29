import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MerchantsModule } from 'src/merchants/merchants.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionsController } from './transactions.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@Module({
  imports: [
    CqrsModule,
    MerchantsModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'MERCHANTS_CLIENT',
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
    ]),
  ],
  controllers: [TransactionsController],
  providers: [],
})
export class TransactionsModule {}
