import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const { method, url } = request;
    const params = JSON.stringify(request.params);
    const query = JSON.stringify(request.query);
    const body = JSON.stringify(request.body);

    const reqLog = ` Request: ${method} ${url}, Params: ${params}, Query: ${query}, Body: ${body}`;
    Logger.log(reqLog, 'Request');

    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        const after = Date.now() - now;
        Logger.log(
          `Response: ${method} ${url}, Response: ${JSON.stringify(data)}, Duration: +${after}ms`,
          'Response',
        );
      }),
    );
  }
}
