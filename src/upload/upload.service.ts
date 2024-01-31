import { data } from './data';
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import { UploadDto } from './dto/upload.dto';

@Injectable()
export class UploadService {
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
      // const response: AxiosResponse = await axios.post(endpoint, formData, {
      //   headers: {
      //     // FormData 인스턴스의 getHeaders 메서드를 사용하여 적절한 Content-Type 설정
      //     ...formData.getHeaders(),
      //   },
      // });
      // response.data.forEach((file) => {
      //   console.log(file);
      // });
      // data[0] -> 응답 하나
      data.forEach((file) => {
        const result = file.result;

        // bookshelf 하나 저장
        result.forEach((res) => {
          const { title, author, publisher, img_url } = res;
        });
      });
      return data;
      // TODO: Repository에 저장
    } catch (error) {
      // 에러 처리
      // console.error('Error sending files:', error);
      throw error;
    }
  }
}
