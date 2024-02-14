import { IsDefined } from 'class-validator';
import { User } from 'src/entities/user.entity';
export class SurveyDto {
  id: number;

  @IsDefined()
  question1: number;

  @IsDefined()
  question2: number;

  @IsDefined()
  question3: number;

  @IsDefined()
  status: string;

  createdAt: Date;
  updatedAt: Date;

  userId: User;
}
