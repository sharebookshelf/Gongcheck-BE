import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfig } from './config/typeorm.config';
import { UploadModule } from './upload/upload.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { SurveyModule } from './survey/survey.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    NestjsFormDataModule,
    UploadModule,
    SurveyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
