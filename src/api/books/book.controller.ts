import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Book } from 'src/entities/book.entity';
import { BookService } from './book.service';
import { CategorizeBookDto } from './dto/categorizeBook.dto';
import { Request, Response } from 'express';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getUserBooksByUserIds(@Req() request: Request): Promise<Book[]> {
    const id = request.cookies['userId'];
    return this.bookService.findBooksByUserId(id);
  }

  @Post()
  async categorizeBooks(
    @Body() categrozieBookDtos: CategorizeBookDto[],
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const id = request.cookies['userId'];
    const data = await this.bookService.categorizeBook(categrozieBookDtos, id);
    response.cookie('readingType', data.userReadingType);
    return { data };
  }
}
