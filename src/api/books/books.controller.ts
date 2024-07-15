import { Body, Controller, Get, Patch, Res, Session } from '@nestjs/common';
import { Book } from 'src/entities/book.entity';
import { CategorizeBookDto } from './dto/categorizeBook.dto';
import { Response } from 'express';
import { BooksService } from './books.service';
import { UserIdNotFoundException } from 'src/exceptions/userIdNotFound.exception';

@Controller('users/me/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getUserBooksByUserIds(
    @Session() session: Record<string, any>,
  ): Promise<Book[]> {
    const userId = session.userId;
    if (!userId) {
      throw new UserIdNotFoundException();
    }

    return this.booksService.findBooksByUserId(userId);
  }

  @Patch()
  async categorizeBooks(
    @Body() categrozieBookDtos: CategorizeBookDto[],
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const userId = session.userId;
    if (!userId) {
      throw new UserIdNotFoundException();
    }

    const data = await this.booksService.categorizeBook(
      categrozieBookDtos,
      userId,
    );

    response.cookie('readingType', data.userReadingType);
    return { data };
  }
}
