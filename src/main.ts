import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FE_URL } from '@common/constants/environment.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [FE_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  await app.listen(8080);
}
bootstrap();
