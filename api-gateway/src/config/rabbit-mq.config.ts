import { registerAs } from '@nestjs/config';
import { RabbitMQ } from './config.type';

export default registerAs<RabbitMQ>('rabbitmq', () => ({
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  host: process.env.REDIS_HOST || 'localhost',
}));
