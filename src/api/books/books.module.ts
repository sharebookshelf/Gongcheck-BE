import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { UserBook } from 'src/entities/userBook.entity';
import { User } from 'src/entities/user.entity';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { UserType } from 'src/entities/userType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBook, Book, User, UserType])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
