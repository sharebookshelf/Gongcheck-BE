import { data } from '../data';
import { Injectable } from '@nestjs/common';
// import axios, { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import { UploadDto } from '../dto/upload.dto';
import { UploadRepository } from '../repository/upload.repository';
import { CreateBook, UserInfo } from '../interface/createBook';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookshelf } from 'src/entities/bookshelf.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UploadService {
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly configService: ConfigService,
    @InjectRepository(Bookshelf)
    private bookshelfRepository: Repository<Bookshelf>,
  ) {}

  async sendFile(
    uploadDto: UploadDto,
    userId: string,
    files: Array<Express.Multer.File>,
    filepaths: string[],
  ): Promise<any> {
    // 파일들을 FormData에 추가
    const formData = new FormData();
    files.forEach((file) => {
      console.log(file.buffer);
      formData.append('files', file.buffer, file.originalname);
    });

    // const apiUrl = this.configService.get('API_HOST');
    const userInfo: UserInfo = {
      nickname: uploadDto.nickname,
      birth: uploadDto.birth,
      gender: uploadDto.gender,
      userId,
    };
    console.log(userInfo);
    files.forEach((file) => {
      formData.append('files', file.buffer, file.originalname);
    });

    try {
      // Axios POST 요청
      // const response: AxiosResponse = await axios.post(apiUrl, formData, {
      //   headers: {
      //     // FormData 인스턴스의 getHeaders 메서드를 사용하여 적절한 Content-Type 설정
      //     ...formData.getHeaders(),
      //   },
      // });
      // const data = response.data;

      await this.uploadRepository.createUser(userInfo);

      // const userId: number = insertUserInfo.generatedMaps[0].userId;

      let books: Array<CreateBook> = [];
      let bookIds: Array<number> = [];

      let i = 0;
      for (const file of data) {
        const result = file.result;
        // const url = file.file_url;
        const url = filepaths[i];
        // console.log(url);
        books = [];
        bookIds = [];

        console.log('-------', url);
        // 하나의 bookshelf 저장
        await this.uploadRepository.createBookshelf(url, userId);

        for (const res of result) {
          const { title, author, publisher, img_url } = res;
          const book: CreateBook = {
            title,
            author,
            publisher,
            titleUrl: img_url,
            // TODO: AI 서버 수정 이후 추가할 데이터
            // eaAddCode,
            // setAddCode,
            // eaIsbn: '',
            // setIsbn: '',
          };
          books.push(book);
        }
        i += 1;
      }

      const { createdBook, existingBookIds } =
        await this.uploadRepository.createBook(books);
      createdBook.forEach((res) => {
        bookIds.push(res.bookId);
      });
      existingBookIds.forEach((res) => {
        bookIds.push(res);
      });

      await this.uploadRepository.createUserBook(userId, bookIds);

      return userId;
    } catch (error) {
      throw error;
    }
  }

  async updateBookshelfPassword(userId: string, password: string) {
    console.log(userId, password);
    // userId에 해당하는 데이터 찾기
    const bookshelves = await this.bookshelfRepository.find({
      where: { user: { userId } },
      // relations: ['user'],
    });
    // console.log(bookshelves);

    // 일치하는 데이터에 대해 password 검증 후 status 업데이트
    for (const bookshelf of bookshelves) {
      bookshelf.password = password;
      await this.bookshelfRepository.save(bookshelf); // 업데이트된 데이터 저장
    }
  }
}
