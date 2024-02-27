import { Controller, Post, Body, Headers } from '@nestjs/common';
import { SurveyService } from '../service/survey.service';
import { SurveyDto } from '../dto/survey.dto';
import { User } from 'src/entities/user.entity';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  create(@Body() surveyDto: SurveyDto, @Headers('user-id') userId: string) {
    surveyDto.userId = parseInt(userId);

    return this.surveyService.create(surveyDto);
  }
}
