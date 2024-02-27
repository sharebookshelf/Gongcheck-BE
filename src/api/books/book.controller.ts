import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Book } from 'src/entities/book.entity';
import { BookService } from './book.service';
import { CategorizeBookDto } from './dto/categorizeBook.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get(':id')
  getUserBooksByUserId(@Param('id', ParseIntPipe) id: number): Promise<Book[]> {
    console.log(id);
    return this.bookService.findBooksByUserId(id);
  }

  @Post(':id')
  categorizeBook(
    @Body() categrozieBookDtos: CategorizeBookDto[],
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Book[]> {
    return this.bookService.categorizeBook(categrozieBookDtos, id);
  }
}
