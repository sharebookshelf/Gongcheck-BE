import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfig } from './config/typeorm.config';
import { UploadModule } from './api/upload/upload.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { LoggerModule } from './logger/logger.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { SurveyModule } from './api/survey/survey.module';
import { BookModule } from './api/books/book.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    NestjsFormDataModule.config({ isGlobal: true }),
    UploadModule,
    LoggerModule,
    SurveyModule,
    BookModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
