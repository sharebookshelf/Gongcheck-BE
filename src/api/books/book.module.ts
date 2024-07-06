import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { UserBook } from 'src/entities/userBook.entity';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { User } from 'src/entities/user.entity';
import { Bookshelf } from 'src/entities/bookshelf.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBook, Book, User, Bookshelf])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
