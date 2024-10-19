import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FileSaveInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const files = request.files as Express.Multer.File[];
    const filepaths = [];
    const filenames = [];
    const publicDir = path.join(process.cwd(), 'public', 'asset');

    console.log(files);

    files.forEach((file) => {
      const uuid = uuidv4().substring(0, 6);
      const extArray = file.mimetype.split('/');
      const filename = `profile-${uuid}.${extArray[extArray.length - 1]}`;
      const absoluteFilePath = path.join(publicDir, filename); // 파일을 저장시킬 절대 경로
      const savefilepath = path.join(`/asset/${filename}`); // DB에 저장할 경로
      fs.writeFileSync(absoluteFilePath, file.buffer);
      console.log(file.originalname);
      filepaths.push(savefilepath);
      filenames.push(file.originalname);
    });

    request.filenames = filenames;
    request.filepaths = filepaths;

    return next.handle();
  }
}
