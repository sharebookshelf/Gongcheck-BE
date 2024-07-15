import { Controller, Post, Body, Session } from '@nestjs/common';
import { SurveysService } from '../service/surveys.service';
import { SurveyDto } from '../dto/survey.dto';
import { UserIdNotFoundException } from 'src/exceptions/userIdNotFound.exception';

@Controller('users/me/surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post()
  async create(
    @Body() surveyDto: SurveyDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId;

    if (!userId) {
      throw new UserIdNotFoundException();
    }

    await this.surveysService.create(surveyDto, userId);
    return { message: 'successfully updated survey' };
  }
}
