import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
// import { UpdateUserBook } from '../dto/update-userBook.dto';
import { UserIdNotFoundException } from 'src/exceptions/userIdNotFound.exception';
import { UploadBookshelfPasswordDto } from '../dto/upload-bookshelf-password.dto';
import { LikeDto } from '../dto/like.dto';

@Controller('users/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Patch('feedback')
  async updateFeedback(
    @Query('isAgree') isAgree: string,
    @Body('feedback') feedback: string,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId;
    if (!userId) {
      throw new UserIdNotFoundException();
    }

    await this.usersService.updateFeedback(isAgree, userId, feedback);
    return { message: 'sucessfully updated feedback' };
  }

  @Post('bookshelves/like')
  async like(
    @Body() likeDto: LikeDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId;
    if (!userId) {
      throw new UserIdNotFoundException();
    }

    await this.usersService.like(userId, likeDto.likeStatus, likeDto.postId);

    return { message: '좋아요 상태를 변경했습니다' };
  }

  @Get('bookshelves/likes')
  async findLikes(@Session() session: Record<string, any>) {
    const userId = session.userId;
    if (!userId) {
      throw new UserIdNotFoundException();
    }

    return this.usersService.findLikes(userId);
  }

  @Get('bookshelves/images')
  async findUserBookshelves(@Session() session: Record<string, any>) {
    const userId = session.userId;
    if (!userId) {
      throw new UserIdNotFoundException();
    }

    return this.usersService.findUserBookshelves(userId);
  }

  @Patch('bookshelves/password')
  async updateBookshelfPassword(
    @Body() uploadBookshelfPasswordDto: UploadBookshelfPasswordDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId;
    if (!userId) {
      throw new UserIdNotFoundException();
    }

    await this.usersService.updateBookshelfPassword(
      userId,
      uploadBookshelfPasswordDto.password,
    );

    return { message: '책장 및 비밀번호를 성공적으로 등록했습니다.' };
  }
}
