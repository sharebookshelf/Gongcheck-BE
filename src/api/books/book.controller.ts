import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Book } from 'src/entities/book.entity';
import { BookService } from './book.service';
import { CategorizeBookDto } from './dto/categorizeBook.dto';
import { Request } from 'express';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getUserBooksByUserIds(@Req() request: Request): Promise<Book[]> {
    const id = request.cookies['userId'];
    return this.bookService.findBooksByUserId(id);
  }

  @Post()
  categorizeBooks(
    @Body() categrozieBookDtos: CategorizeBookDto[],
    @Req() request: Request,
  ): Promise<any> {
    const id = request.cookies['userId'];
    return this.bookService.categorizeBook(categrozieBookDtos, id);
  }
}
