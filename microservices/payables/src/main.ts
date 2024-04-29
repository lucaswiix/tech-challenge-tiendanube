import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'payables',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();
}

((): void => {
  const PORT = process.env.APP_PORT || 3000;
  bootstrap()
    .then(() => process.stdout.write(`Listening on port ${PORT}...\n`))
    .catch((err) => {
      process.stderr.write(`Error: ${err.message}\n`);
      process.exit(1);
    });
})();
