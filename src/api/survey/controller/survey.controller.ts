import { Controller, Post, Body, Session } from '@nestjs/common';
import { SurveyService } from '../service/survey.service';
import { SurveyDto } from '../dto/survey.dto';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  create(
    @Body() surveyDto: SurveyDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId;
    console.log(surveyDto, userId);
    if (!userId) {
      throw new Error('세션이 만료되었습니다.');
    }
    return this.surveyService.create(surveyDto, userId);
  }
}
