import { IsArray } from 'class-validator';
export class UpdateUserBook {
  @IsArray()
  bookIds: number[];
}
