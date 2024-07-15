import { IsDefined } from 'class-validator';

export class CreateBookshelfDto {
  @IsDefined()
  nickname: string;

  @IsDefined()
  birth: string;

  @IsDefined()
  gender: string;
}
