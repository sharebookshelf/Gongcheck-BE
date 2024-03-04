import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { WINSTMiddleware } from './utils/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
