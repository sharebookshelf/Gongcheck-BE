import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  Session,
} from '@nestjs/common';
import { Book } from 'src/entities/book.entity';
import { BookService } from './book.service';
import { CategorizeBookDto } from './dto/categorizeBook.dto';
import { Response } from 'express';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getUserBooksByUserIds(
    @Session() session: Record<string, any>,
  ): Promise<Book[]> {
    // const id = request.cookies['userId'];
    const userId = session.userId;
    console.log(userId);
    if (!userId) {
      throw new Error('세션이 만료되었습니다.');
    }
    return this.bookService.findBooksByUserId(userId);
  }

  @Post()
  async categorizeBooks(
    @Body() categrozieBookDtos: CategorizeBookDto[],
    // @Req() request: Request,
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const userId = session.userId;
    if (!userId) {
      throw new Error('세션이 만료되었습니다.');
    }

    const data = await this.bookService.categorizeBook(
      categrozieBookDtos,
      userId,
    );

    response.cookie('readingType', data.userReadingType);
    return { data };
  }

  @Get('/bookshelf')
  async getBookshelf(
    @Query('page') page: number,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId;
    if (!userId) {
      throw new Error('세션이 만료되었습니다.');
    }

    const data = await this.bookService.getBookshelf(page);
    return data;
  }
}
