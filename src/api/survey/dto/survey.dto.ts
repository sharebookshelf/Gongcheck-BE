import { IsDefined } from 'class-validator';
import { User } from 'src/entities/user.entity';
export class SurveyDto {
  @IsDefined()
  question1: number;

  @IsDefined()
  question2: number;

  @IsDefined()
  question3: number;

  userId: number;
}
