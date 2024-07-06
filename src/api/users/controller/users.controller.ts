import { Body, Controller, Get, Patch, Query, Session } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UpdateUserBook } from '../dto/update-userBook.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Patch()
  async updateFeedback(
    @Query('isAgree') isAgree: string,
    // @Req() request: Request,
    @Body('feedback') feedback: string,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId;
    if (!userId) {
      throw new Error('세션이 만료되었습니다.');
    }
    await this.usersService.updateFeedback(isAgree, userId, feedback);
    return { message: 'sucessfully updated feedback' };
  }

  @Patch()
  async updateUserBookStatus(
    @Body() updateBookStatusDto: UpdateUserBook,
    // @Req() request: Request,
    @Session() session: Record<string, any>,
  ) {
    // const userId = request.cookies['userId'];
    const userId = session.userId;
    if (!userId) {
      throw new Error('세션이 만료되었습니다.');
    }
    await this.usersService.updateUserBookStatus(
      updateBookStatusDto.bookIds,
      userId,
    );
    return { message: 'sucessfully updated userBookStatus' };
  }

  @Get('/bookshelves')
  async findUserBookshelves(@Session() session: Record<string, any>) {
    const userId = session.userId;
    if (!userId) {
      throw new Error('세션이 만료되었습니다.');
    }

    return this.usersService.findUserBookshelves(userId);
  }
}
