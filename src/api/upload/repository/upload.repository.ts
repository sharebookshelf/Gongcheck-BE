import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { BaseRepository } from 'src/common/base-repository';
import { DataSource } from 'typeorm';
import { Bookshelf } from 'src/entities/bookshelf.entity';
import { UserBook } from '../../../entities/userBook.entity';
import { Book } from 'src/entities/book.entity';
import { REQUEST } from '@nestjs/core';
import { CreateBook, UserInfo } from '../interface/createBook';
import { User } from 'src/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UploadRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async createBookshelf(url: string, userId: string) {
    const uploadRepository = this.getRepository(Bookshelf);

    const bookshelf = uploadRepository.create({
      bookShelfImage: url,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: { userId },
    });
    await uploadRepository.insert(bookshelf);

    return bookshelf;
  }

  async createBook(books: Array<CreateBook>) {
    const uploadRepository = this.getRepository(Book);

    const newBooks = [];
    const bookIds = [];
    let existingBook;
    for (const book of books) {
      existingBook = await uploadRepository.findOne({
        where: {
          title: book.title,
          author: book.author,
          publisher: book.publisher,
        },
      });
      if (!existingBook) {
        const newBook = uploadRepository.create({
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
        newBooks.push(newBook);
      } else {
        bookIds.push(existingBook.bookId);
      }
    }
    if (newBooks.length > 0) {
      console.log(`${newBooks.length}개 책 저장!`);
      const createdBook = await uploadRepository.save(newBooks);
      return { createdBook, existingBookIds: bookIds };
    } else {
      return { createdBook: [], existingBookIds: bookIds };
    }
  }

  async createUserBook(userId: string, bookIds: number[]) {
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

  async createUser(userInfo: UserInfo) {
    const uploadRepository = this.getRepository(User);

    const newUser = uploadRepository.create({
      nickname: userInfo.nickname,
      gender: userInfo.gender,
      birth: userInfo.birth,
      userId: userInfo.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const insertUserInfo = await uploadRepository.insert(newUser);

    return insertUserInfo;
  }
}
