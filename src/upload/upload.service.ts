// import { data } from './data';
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import { UploadDto } from './dto/upload.dto';
import { UploadRepository } from './upload.repository';
import { CreateBook } from './interface/creatBook';
import { create } from 'domain';

@Injectable()
export class UploadService {
  constructor(private readonly uploadRepository: UploadRepository) {}
  async sendFile(uploadDto: UploadDto): Promise<any> {
    // console.log(uploadDto.files);
    // 파일들을 FormData에 추가
    const formData = new FormData();
    const files = uploadDto.files;

    files.forEach((file) => {
      formData.append('files', file.buffer, file.originalName);
    });

    // TODO: API URL .env로 설정
    // Axios POST 요청
    const endpoint = 'http://gongcheck.p-e.kr:8000/process_multi';

    try {
      const response: AxiosResponse = await axios.post(endpoint, formData, {
        headers: {
          // FormData 인스턴스의 getHeaders 메서드를 사용하여 적절한 Content-Type 설정
          ...formData.getHeaders(),
        },
      });
      // response.data.forEach((file) => {
      //   console.log(file);
      // });

      const data = response.data;

      const userId: number = 1;

      let books: Array<CreateBook> = [];
      let bookIds: Array<number> = [];

      for (const file of data) {
        const result = file.result;
        const url = file.file_url;
        books = [];
        bookIds = [];

        // bookshelf 하나 저장
        const createdBookshelf = await this.uploadRepository.createBookshelf(
          url,
          userId,
        );
        console.log(`${createdBookshelf} 성공`);

        for (const res of result) {
          const { title, author, publisher, img_url } = res;
          const book: CreateBook = {
            title,
            author,
            publisher,
            titleUrl: img_url,
          };
          books.push(book);
        }
      }
      const createdBook = await this.uploadRepository.createBook(books);
      createdBook.forEach((res) => {
        bookIds.push(res.bookId);
      });
      console.log(createdBook);

      const createdUserBook = await this.uploadRepository.createUserBook(
        userId,
        bookIds,
      );
      console.log(createdUserBook);

      return { createdUserBook };
    } catch (error) {
      // 에러 처리
      throw error;
    }
  }
}
