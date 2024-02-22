import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { UserBook } from 'src/entities/userBook.entity';
import { EntityNotFoundError, In, Repository } from 'typeorm';
import { CategorizeBookDto } from './dto/categorizeBook.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(UserBook)
    private userBookRepository: Repository<UserBook>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async findBooksByUserId(userId: number): Promise<any> {
    const books = await this.userBookRepository.find({
      select: {
        bookId: true,
      },
      where: { userId },
    });

    const result = await this.bookRepository.find({
      where: {
        bookId: In(books.map((book) => book.bookId)),
      },
    });

    return result;
  }

  async categorizeBook(
    categorizeBookDtos: CategorizeBookDto[],
    id: number,
  ): Promise<any> {
    console.log(categorizeBookDtos);

    await Promise.all(
      categorizeBookDtos.map(async (update) => {
        const userBook = await this.userBookRepository.findOne({
          where: { userId: id, bookId: update.bookId },
        });
        try {
          userBook.status = update.status;
          userBook.rank = update.rank;
          await this.userBookRepository.save(userBook);
        } catch (e) {
          throw new EntityNotFoundError(
            UserBook,
            '해당 하는 레코드가 없습니다.',
          );
        }
      }),
    );
    return null;
  }
}
