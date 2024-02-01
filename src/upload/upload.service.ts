import { data } from './data';
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import { UploadDto } from './dto/upload.dto';
import { UploadRepository } from './upload.repository';
import { CreateBook } from './interface/createBook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly configService: ConfigService,
  ) {}
  async sendFile(userId: number, uploadDto: UploadDto): Promise<any> {
    // console.log(uploadDto.files);
    // 파일들을 FormData에 추가
    const formData = new FormData();
    const files = uploadDto.files;

    files.forEach((file) => {
      formData.append('files', file.buffer, file.originalName);
    });

    // Axios POST 요청
    const apiUrl = this.configService.get('API_HOST');

    try {
      // const response: AxiosResponse = await axios.post(apiUrl, formData, {
      //   headers: {
      //     // FormData 인스턴스의 getHeaders 메서드를 사용하여 적절한 Content-Type 설정
      //     ...formData.getHeaders(),
      //   },
      // });
      // const data = response.data;

      // const userId: number = 1;

      let books: Array<CreateBook> = [];
      let bookIds: Array<number> = [];

      for (const file of data) {
        const result = file.result;
        const url = file.file_url;
        books = [];
        bookIds = [];

        // bookshelf 하나 저장
        await this.uploadRepository.createBookshelf(url, userId);
        // console.log(`${createdBookshelf} 성공`);

        for (const res of result) {
          const { title, author, publisher, img_url } = res;
          const book: CreateBook = {
            title,
            author,
            publisher,
            titleUrl: img_url,
            // TODO: AI 서버 수정 이후 추가할 데이터
            // eaIsbn: '',
            // setIsbn: '',
          };
          books.push(book);
        }
      }
      const createdBook = await this.uploadRepository.createBook(books);
      createdBook.forEach((res) => {
        bookIds.push(res.bookId);
      });

      const createdUserBook = await this.uploadRepository.createUserBook(
        userId,
        bookIds,
      );

      return { createdUserBook };
    } catch (error) {
      throw error;
    }
  }
}
