import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from 'src/entities/survey.entity';
import { Repository } from 'typeorm';
import { SurveyDto } from '../dto/survey.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
  ) {}

  async create(surveyDto: SurveyDto, userId: number) {
    const newSurvey = this.surveyRepository.create({
      ...surveyDto,
      userId,
    });

    console.log(newSurvey);

    await this.surveyRepository.save(newSurvey);
    return { message: 'success' };
  }
}
