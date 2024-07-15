import { HttpException, HttpStatus } from '@nestjs/common';

export class UserIdNotFoundException extends HttpException {
  constructor() {
    super(
      '세션이 없거나 만료되었습니다. 책장을 다시 등록해주세요',
      // HttpStatus.BAD_REQUEST,
      HttpStatus.UNAUTHORIZED,
    );
  }
}
