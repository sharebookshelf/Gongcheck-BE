/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from '../service/upload.service';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadDto } from '../dto/upload.dto';
import { TransactionInterceptor } from 'src/common/transaction.interceptor';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  private readonly logger = new Logger(UploadController.name);
  @Post()
  @UseInterceptors(TransactionInterceptor)
  @FormDataRequest()
  fetchAiData(@Body() uploadDto: UploadDto) {
    const { files, ...userInfo } = uploadDto;
    this.logger.debug(`userInfo: `, JSON.stringify(userInfo));
    return this.uploadService.sendFile(uploadDto);
  }
}
