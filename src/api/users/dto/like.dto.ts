import { IsBoolean, IsDefined, IsNumber } from 'class-validator';
export class LikeDto {
  @IsDefined()
  @IsNumber()
  postId: number;

  @IsDefined()
  @IsBoolean()
  likeStatus: boolean;
}
