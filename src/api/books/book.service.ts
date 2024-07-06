import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { UserBook } from 'src/entities/userBook.entity';
import { In, Not, Repository } from 'typeorm';
import { CategorizeBookDto } from './dto/categorizeBook.dto';
import { User } from 'src/entities/user.entity';
import { IAnalysisResult } from './interfaces/type';
import { Bookshelf } from 'src/entities/bookshelf.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(UserBook)
    private userBookRepository: Repository<UserBook>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Bookshelf)
    private bookshelfRepository: Repository<Bookshelf>,
  ) {}

  async findBooksByUserId(userId: string): Promise<any> {
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
    userId: string,
  ): Promise<any> {
    // console.log(categorizeBookDtos);

    const userBooks = await this.userBookRepository.find({ where: { userId } });

    for (const userBook of userBooks) {
      const update = categorizeBookDtos.find(
        (categorizeBookDtos) => categorizeBookDtos.bookId === userBook.bookId,
      );
      if (update) {
        userBook.status = 'y';
        userBook.rank = update.rank;
      } else {
        userBook.status = 'n';
      }
    }

    await this.userBookRepository.save(userBooks);

    const { preferredCategory: userReadingType, standardizedScores } =
      await this.anlaysisCategory(userId);

    await this.userRepository.update(
      { userId },
      { readingType: userReadingType },
    );

    return { userReadingType, standardizedScores };
  }

  async anlaysisCategory(userId: string): Promise<IAnalysisResult> {
    // TODO: eaAddCode 추가되면 주석 해제하기
    // const books = await this.userBookRepository.find({
    //   relations: ['book'],
    //   where: { userId },
    // });

    console.log(userId);

    // const refinedBooks = books.map(({ status, rank, book: { eaAddCode } }) => ({
    //   status,
    //   rank,
    //   eaAddCode,
    // }));
    // console.log(refinedBooks);

    const READ_BOOK_SCORE = 10;
    const NOT_READ_BOOK_SCORE = 1;

    const refinedBooks = [
      { status: 'y', rank: 1, eaAddCode: '03890' },
      { status: 'n', rank: 0, eaAddCode: '93300' },
      { status: 'y', rank: 2, eaAddCode: '93550' },
      { status: 'y', rank: 4, eaAddCode: '93690' },
      { status: 'n', rank: 0, eaAddCode: '93330' },
      { status: 'y', rank: 3, eaAddCode: '17670' },
      { status: 'n', rank: 0, eaAddCode: '13710' },
      { status: 'n', rank: 0, eaAddCode: '03620' },
      { status: 'n', rank: 0, eaAddCode: '53410' },
      { status: 'n', rank: 0, eaAddCode: '68740' },
      { status: 'n', rank: 0, eaAddCode: '53410' },
      { status: 'n', rank: 0, eaAddCode: '94320' },
    ];

    // 카테고리별 점수 계산
    const categoryScores = refinedBooks.reduce((acc, item) => {
      const category = item.eaAddCode[2]; // 3번째 자리 추출
      let finalScore = 0;

      if (item.status === 'y') {
        // 읽은 책에 대한 점수 처리
        finalScore += READ_BOOK_SCORE;
        // 순위가 매겨진 책에 대한 추가 점수 처리
        if (item.rank > 0) {
          finalScore += 6 - item.rank; // 순위에 따른 추가 점수
        }
      } else if (item.status === 'n') {
        // 안 읽은 책에 대한 점수 처리
        finalScore += NOT_READ_BOOK_SCORE;
      }

      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += finalScore;

      return acc;
    }, {});

    console.log('categoryScores', categoryScores);

    // 표준화를 위해 가장 큰 점수 찾기
    const scores = Object.values(categoryScores) as number[];
    const maxScore = Math.max(...scores);

    // 카테고리별 점수를 표준화
    const standardizedScores = {};
    Object.keys(categoryScores).forEach((category) => {
      standardizedScores[category] = (categoryScores[category] / maxScore) * 10;
    });
    console.log('standardizedScores', standardizedScores);

    // 가장 높은 점수를 가진 카테고리 찾기
    const preferredCategory = Object.keys(standardizedScores).reduce((a, b) =>
      standardizedScores[a] > standardizedScores[b] ? a : b,
    );

    return { preferredCategory, standardizedScores };
  }

  async getBookshelf(page: number) {
    // const bookshelves = await this.bookshelfRepository.find({
    //   where: {
    //     status: Not('deleted'),
    //   },
    //   relations: ['user'],
    // });

    // return bookshelves;

    // const userBookshelves = await this.userRepository.find({
    //   relations: ['bookshelf'],
    //   where: {
    //     bookshelf: { status: Not('deleted') },
    //   },
    // });
    // console.log(userBookshelves);
    // return userBookshelves;

    const take = 5;
    const skip = (page - 1) * take;
    const userBookshelves = await this.userRepository.find({
      relations: ['bookshelf'],
      where: {
        bookshelf: { status: Not('deleted') },
      },
      take,
      skip,
    });
    console.log(userBookshelves);
    return userBookshelves;
  }
}
