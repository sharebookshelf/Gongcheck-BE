import { IsDefined, IsNumber } from 'class-validator';
export class CategorizeBookDto {
  @IsNumber()
  @IsDefined()
  bookId: number;

  @IsDefined()
  status: string;

  @IsNumber()
  rank?: number;
}
