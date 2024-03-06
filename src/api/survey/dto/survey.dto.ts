import { IsDefined } from 'class-validator';

export class SurveyDto {
  @IsDefined()
  question1: number;

  @IsDefined()
  question2: number;

  @IsDefined()
  question3: number;
}
