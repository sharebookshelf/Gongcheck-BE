import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, concatMap, finalize } from 'rxjs';
import { DataSource } from 'typeorm';

export const ENTITY_MANAGER_KEY = 'ENTITY_MANAGER';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    // request 객체를 가져옵니다.
    const req = context.switchToHttp().getRequest<Request>();
    // transaction 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // attach query manager with transaction to the request
    req[ENTITY_MANAGER_KEY] = queryRunner.manager;

    return next.handle().pipe(
      // 라우트 핸들러가 성공적으로 완료될 때 concatMap이 호출됩니다.
      concatMap(async (data) => {
        await queryRunner.commitTransaction();
        return data;
      }),
      // 라우트 핸들러가 예외를 던질 떄 catchError가 호출됩니다.
      catchError(async (e) => {
        await queryRunner.rollbackTransaction();
        throw e;
      }),
      // 항상 마지막에 실행되는 부분으로 이곳에서 release가 이루어져야 어떠한
      // 상황에서도 release가 보장됩니다.
      finalize(async () => {
        await queryRunner.release();
      }),
    );
  }
}
