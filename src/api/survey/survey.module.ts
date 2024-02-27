import { Module } from '@nestjs/common';
import { SurveyController } from './controller/survey.controller';
import { SurveyService } from './service/survey.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from 'src/entities/survey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survey])],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}
