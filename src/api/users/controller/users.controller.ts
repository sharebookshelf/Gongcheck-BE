import { Controller, Patch, Query, Req } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Patch()
  async updateFeedback(
    @Query('isAgree') isAgree: string,
    @Req() request: Request,
  ) {
    const userId = request.cookies['userId'];
    await this.usersService.updateFeedback(isAgree, parseInt(userId, 10));
    return { message: 'sucessfully updated feedback' };
  }
}
