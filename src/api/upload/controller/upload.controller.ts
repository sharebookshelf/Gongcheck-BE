/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Logger,
  Patch,
  Post,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from '../service/upload.service';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadDto } from '../dto/upload.dto';
import { TransactionInterceptor } from 'src/common/transaction.interceptor';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UploadBookshelfPasswordDto } from '../dto/upload-bookshelf-password.dto';
import { FileUploadInterceptor } from '../interceptor/fileUploadInterceptor';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { v4 } from 'uuid';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  // private readonly logger = new Logger(UploadController.name);

  @Post()
  @UseInterceptors(FilesInterceptor('bookshelfImages'), TransactionInterceptor)
  async fetchAiData(
    @Body() uploadDto: UploadDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Session() session: Record<string, any>,
    @Req() req: Request,
  ) {
    const filepaths = [];
    console.log(files);

    const publicDir = path.join(process.cwd(), 'public', 'asset');

    // let savefilepaths = [];
    files.forEach((file) => {
      const uuid = v4().substring(0, 6);
      const extArray = file.mimetype.split('/');
      const filename = `profile-${uuid}.${extArray[extArray.length - 1]}`;

      const absoluteFilePath = path.join(publicDir, filename); // 파일을 저장시킬 절대 경로
      const savefilepath = path.join(`/asset/${filename}`); // DB에 저장할 경로

      console.log(file, absoluteFilePath, publicDir);
      fs.writeFileSync(absoluteFilePath, file.buffer);

      filepaths.push(savefilepath);
    });

    req['filepath'] = filepaths;
    console.log(filepaths);

    const userId = uuidv4();
    session.userId = userId;
    console.log('userid', userId);
    await this.uploadService.sendFile(uploadDto, userId, files, filepaths);

    return { message: 'success upload bookshelf' };
  }

  @Patch('/bookshelf/password')
  async updateBookshelfPassword(
    @Body() uploadBookshelfPasswordDto: UploadBookshelfPasswordDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId;
    if (!userId) {
      throw new UnauthorizedException('세션이 만료되었습니다.');
    }

    await this.uploadService.updateBookshelfPassword(
      userId,
      uploadBookshelfPasswordDto.password,
    );

    return { message: '책장 및 비밀번호를 성공적으로 등록했습니다.' };
  }
}
