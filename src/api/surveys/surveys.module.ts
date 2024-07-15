import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from 'src/entities/survey.entity';
import { SurveysService } from './service/surveys.service';
import { SurveysController } from './controller/surveys.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Survey])],
  controllers: [SurveysController],
  providers: [SurveysService],
})
export class SurveysModule {}
