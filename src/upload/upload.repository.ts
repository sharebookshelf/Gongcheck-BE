import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { BaseRepository } from 'src/common/base-repository';
import { DataSource } from 'typeorm';
import { Bookshelf } from 'src/entities/bookshelf.entity';
import { UserBook } from './../entities/userBook.entity';
import { Book } from 'src/entities/book.entity';
import { REQUEST } from '@nestjs/core';
import { CreateBook } from './interface/creatBook';

@Injectable({ scope: Scope.REQUEST })
export class UploadRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createBookshelf(url: string, userId: number) {
    const uploadRepository = this.getRepository(Bookshelf);

    const bookshelf = uploadRepository.create({
      bookShelfImage: url,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await uploadRepository.insert(bookshelf);

    return bookshelf;
  }

  async createBook(books: Array<CreateBook>) {
    const uploadRepository = this.getRepository(Book);

    const newBooks = books.map((book) => {
      return uploadRepository.create({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        titleUrl: book.titleUrl,
        eaAddCode: '',
        eaIsbn: '',
        setIsbn: '',
        setAddCode: '',
        prePrice: '',
        inputDate: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    return await uploadRepository.save(newBooks);
  }

  async createUserBook(userId: number, bookIds: number[]) {
    const uploadRepository = this.getRepository(UserBook);

    const newUserBook = bookIds.map((id) => {
      return uploadRepository.create({
        userId,
        bookId: id,
      });
    });

    await uploadRepository.insert(newUserBook);

    return newUserBook;
  }
}
