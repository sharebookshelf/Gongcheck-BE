import { IsDefined } from 'class-validator';

export class UploadBookshelfPasswordDto {
  @IsDefined()
  password: string;
}
