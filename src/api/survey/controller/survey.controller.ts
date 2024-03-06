import { Controller, Post, Body, Req } from '@nestjs/common';
import { SurveyService } from '../service/survey.service';
import { SurveyDto } from '../dto/survey.dto';
import { Request } from 'express';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  create(@Body() surveyDto: SurveyDto, @Req() request: Request) {
    const userId = request.cookies['userId'];
    console.log(userId);
    return this.surveyService.create(surveyDto, userId);
  }
}
