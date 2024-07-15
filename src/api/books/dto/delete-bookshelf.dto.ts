import { IsArray, IsDefined } from 'class-validator';
export class DeleteBookshelfDto {
  @IsArray()
  ids: number[];

  @IsDefined()
  password: string;
}
