import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { UserIdNotFoundException } from 'src/exceptions/userIdNotFound.exception';

@Catch(UserIdNotFoundException)
export class UserIdNotFoundFilter implements ExceptionFilter {
  catch(exception: UserIdNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: 'UserIdNotFound',
    });
  }
}
