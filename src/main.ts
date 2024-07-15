import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { WINSTMiddleware } from './utils/logger.middleware';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { UserIdNotFoundFilter } from './filters/userIdNotFound.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new UserIdNotFoundFilter());
  app.use(
    session({
      secret: 'gongcheck-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 },
    }),
  );
  app.use(cookieParser());
  await app.listen(8080);
}
bootstrap();
