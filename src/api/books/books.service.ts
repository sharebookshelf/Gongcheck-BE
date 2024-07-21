import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { UserBook } from 'src/entities/userBook.entity';
import { In, Repository } from 'typeorm';
import { CategorizeBookDto } from './dto/categorizeBook.dto';
import { User } from 'src/entities/user.entity';
// import { IAnalysisResult } from './interfaces/type';
import { UserType } from 'src/entities/userType.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(UserBook)
    private userBookRepository: Repository<UserBook>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserType)
    private userTypeRepository: Repository<UserType>,
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
    const userBooks = await this.userBookRepository.find({ where: { userId } });

    for (const userBook of userBooks) {
      const updateBooks = categorizeBookDtos.find(
        (categorizeBookDtos) => categorizeBookDtos.bookId === userBook.bookId,
      );
      if (updateBooks) {
        userBook.status = 'y';
        userBook.rank = updateBooks.rank;
      } else {
        userBook.status = 'n';
      }
    }

    await this.userBookRepository.save(userBooks);

    const {
      preferredCategory: userReadingType,
      standardizedScores,
      categoryCounts,
    } = await this.anlaysisCategory(userId);

    const stringifyCount = JSON.stringify(categoryCounts);

    await this.userRepository.update(
      { userId },
      { readingType: userReadingType, categoryCounts: stringifyCount },
    );

    return { userReadingType, standardizedScores };
  }

  async anlaysisCategory(userId: string): Promise<any> {
    // TODO: eaAddCode 추가되면 주석 해제하기
    const books = await this.userBookRepository.find({
      relations: ['book'],
      where: { userId },
    });

    // console.log(userId);

    const refinedBooks = books.map(
      ({ status, rank, book: { eaAddCode, setAddCode } }) => ({
        status,
        rank,
        eaAddCode: eaAddCode || setAddCode,
      }),
    );
    console.log({ refinedBooks });

    const READ_BOOK_SCORE = 10;
    const NOT_READ_BOOK_SCORE = 1;

    // const refinedBooks = [
    //   { status: 'y', rank: 1, eaAddCode: '03890' },
    //   { status: 'n', rank: 0, eaAddCode: '93300' },
    //   { status: 'y', rank: 2, eaAddCode: '93550' },
    //   { status: 'y', rank: 4, eaAddCode: '93690' },
    //   { status: 'n', rank: 0, eaAddCode: '93330' },
    //   { status: 'y', rank: 3, eaAddCode: '17670' },
    //   { status: 'n', rank: 0, eaAddCode: '13710' },
    //   { status: 'n', rank: 0, eaAddCode: '03620' },
    //   { status: 'n', rank: 0, eaAddCode: '53410' },
    //   { status: 'n', rank: 0, eaAddCode: '68740' },
    //   { status: 'n', rank: 0, eaAddCode: '53410' },
    //   { status: 'n', rank: 0, eaAddCode: '94320' },
    // ];

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

    // 카테고리별 갯수 계산
    const categoryCounts = refinedBooks.reduce((acc, item) => {
      const category = item.eaAddCode[2]; // 3번째 자리 추출

      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += 1;

      return acc;
    }, {});

    console.log('categoryCounts', categoryCounts);

    // 표준화를 위해 가장 큰 점수 찾기
    const scores = Object.values(categoryScores) as number[];
    const maxScore = Math.max(...scores);

    // 카테고리별 점수를 표준화
    const standardizedScores = {};
    Object.keys(categoryScores).forEach((category) => {
      standardizedScores[category] = (categoryScores[category] / maxScore) * 10;
    });
    console.log('standardizedScores', standardizedScores);

    // 결과 배열 초기화 및 채우기
    const finalScores = new Array(10).fill(0);
    const finalCounts = new Array(10).fill(0);

    for (let i = 0; i <= 9; i++) {
      finalScores[i] = (standardizedScores[i] ?? 0).toFixed(1);
      finalCounts[i] = categoryCounts[i] ?? 0;
    }

    // 가장 높은 점수를 가진 카테고리 찾기
    const preferredCategory = Object.keys(standardizedScores).reduce((a, b) =>
      standardizedScores[a] > standardizedScores[b] ? a : b,
    );

    // 사용자 성향 저장
    const userPreference = {
      user: await this.userRepository.findOne({ where: { userId } }),
      type0: finalScores[0],
      type1: finalScores[1],
      type2: finalScores[2],
      type3: finalScores[3],
      type4: finalScores[4],
      type5: finalScores[5],
      type6: finalScores[6],
      type7: finalScores[7],
      type8: finalScores[8],
      type9: finalScores[9],
    };

    this.userTypeRepository.create(userPreference);
    await this.userTypeRepository.save(userPreference);

    console.log(preferredCategory, standardizedScores, finalCounts);

    return {
      preferredCategory,
      standardizedScores,
      categoryCounts: finalCounts,
    };
  }
}
