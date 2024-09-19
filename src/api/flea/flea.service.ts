import { InjectRepository } from '@nestjs/typeorm';
import { UploadInfoDto } from './dto/upload-info.dto';
import { Injectable } from '@nestjs/common';
import { Book } from 'src/entities/book.entity';
import { Repository } from 'typeorm';
import { UserBook } from 'src/entities/userBook.entity';
import { User } from 'src/entities/user.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FleaService {
  private readonly apiUrl = 'https://www.nl.go.kr/seoji/SearchApi.do';

  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(UserBook)
    private userBookRepository: Repository<UserBook>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly httpService: HttpService,
  ) {}

  async upload(uploadInfoDto: UploadInfoDto, userId: string) {
    const { birth, gender, nickname, books } = uploadInfoDto;

    /** 유저 정보 저장 */
    const createUser = this.userRepository.create({
      nickname,
      gender,
      birth,
      userId,
    });
    await this.userRepository.insert(createUser);

    /** 책 정보 등록 */
    const bookIds = [];

    for (const bookData of books) {
      // 책의 isbn을 통해 이미 존재하는 책인지 확인
      const existingBook = await this.bookRepository.findOne({
        where: { eaIsbn: bookData.isbn },
      });

      let bookId;
      if (existingBook) {
        // 이미 존재하는 책이라면 그 책의 ID를 추가
        bookId = existingBook.bookId;
      } else {
        // 존재하지 않는 책이라면 새로 생성
        const apiResponse = await this.fetchBookInfoFromApi(bookData.isbn);
        const eaAddCode = apiResponse.EA_ADD_CODE || apiResponse.SET_ADD_CODE;

        const newBook = this.bookRepository.create({
          title: bookData.title,
          author: bookData.author,
          publisher: bookData.publisher,
          titleUrl: bookData.image,
          eaIsbn: bookData.isbn,
          eaAddCode: apiResponse.EA_ADD_CODE ? eaAddCode : null,
          setAddCode: !apiResponse.EA_ADD_CODE ? eaAddCode : null,
        });
        // console.log(newBook);
        const savedBook = await this.bookRepository.save(newBook);
        bookId = savedBook.bookId;
      }

      bookIds.push(bookId);

      /** 3. UserBook에 userId와 bookId 저장 (유저와 책의 관계 저장) */
      const existingUserBook = await this.userBookRepository.findOne({
        where: { userId, bookId },
      });

      if (!existingUserBook) {
        const userBook = this.userBookRepository.create({
          userId,
          bookId,
        });
        await this.userBookRepository.save(userBook);
      }
    }

    return bookIds;
  }

  private async fetchBookInfoFromApi(isbn: string): Promise<any> {
    const url = `${this.apiUrl}?cert_key=${process.env.BOOK_API_KEY}&page_no=1&page_size=1&result_style=json&ebook_yn=N&isbn=${isbn}`;

    try {
      const response = await this.httpService.axiosRef.get(url);
      const data = response.data;

      // docs 배열이 있는지 확인하고 첫 번째 요소의 EA_ADD_CODE와 SET_ADD_CODE를 반환
      if (data && data.docs && data.docs.length > 0) {
        const doc = data.docs[0];
        return {
          EA_ADD_CODE: doc.EA_ADD_CODE || '',
          SET_ADD_CODE: doc.SET_ADD_CODE || '',
        };
      }
      return { EA_ADD_CODE: '', SET_ADD_CODE: '' };
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      return { EA_ADD_CODE: '', SET_ADD_CODE: '' }; // 오류 시 빈 문자열 반환
    }
  }
}
