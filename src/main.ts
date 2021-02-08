import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FE_URL, FE_AD_FREE_URL, PORT } from '@common/constants/environment.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [FE_URL, FE_AD_FREE_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  await app.listen(PORT || 8080);
}
bootstrap();
