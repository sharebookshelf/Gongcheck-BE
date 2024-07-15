import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from 'src/entities/survey.entity';
import { Repository } from 'typeorm';
import { SurveyDto } from '../dto/survey.dto';

@Injectable()
export class SurveysService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveysRepository: Repository<Survey>,
  ) {}

  async create(surveyDto: SurveyDto, userId: string) {
    const newSurvey = this.surveysRepository.create({
      ...surveyDto,
      userId,
    });

    await this.surveysRepository.save(newSurvey);
  }
}
