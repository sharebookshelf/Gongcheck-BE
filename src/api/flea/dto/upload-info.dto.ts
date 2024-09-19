import { IsDefined, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class BookInfoDto {
  @IsDefined()
  title: string;

  @IsDefined()
  author: string;

  @IsDefined()
  publisher: string;

  @IsDefined()
  image: string;

  @IsDefined()
  isbn: string;
}

export class UploadInfoDto {
  @IsDefined()
  nickname: string;

  @IsDefined()
  birth: string;

  @IsDefined()
  gender: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookInfoDto)
  books: BookInfoDto[];
}
