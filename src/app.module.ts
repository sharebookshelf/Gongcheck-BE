import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfig } from './config/typeorm.config';
// import { FileSystemStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { LoggerModule } from './logger/logger.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { SurveysModule } from './api/surveys/surveys.module';
import { AnalysisModule } from './api/analysis/analysis.module';
import { UsersModule } from './api/users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// import { MulterModule } from '@nestjs/platform-express';
import { BookshelvesModule } from './api/bookshelves/bookshelves.module';
import { BooksModule } from './api/books/books.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveStaticOptions: { index: false, redirect: false },
      renderPath: '/asset',
    }),
    // MulterModule.register({
    //   dest: '../public/asset',
    // }),
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    // NestjsFormDataModule.config({
    //   fileSystemStoragePath: join(__dirname, '..', 'public'),
    //   storage: FileSystemStoredFile,
    //   isGlobal: true,
    // }),
    LoggerModule,
    SurveysModule,
    BooksModule,
    AnalysisModule,
    UsersModule,
    BookshelvesModule,
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
