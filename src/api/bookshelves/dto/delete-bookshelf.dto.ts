import { IsDefined } from 'class-validator';
export class DeleteBookshelfDto {
  @IsDefined()
  postId: number;

  @IsDefined()
  password: string;
}
