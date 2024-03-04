/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Logger,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from '../service/upload.service';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadDto } from '../dto/upload.dto';
import { TransactionInterceptor } from 'src/common/transaction.interceptor';
import { Response } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  private readonly logger = new Logger(UploadController.name);
  @Post()
  @UseInterceptors(TransactionInterceptor)
  @FormDataRequest()
  async fetchAiData(
    @Body() uploadDto: UploadDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { files, ...userInfo } = uploadDto;
    this.logger.debug(`userInfo: `, JSON.stringify(userInfo));
    const userId = await this.uploadService.sendFile(uploadDto);
    response.cookie('userId', userId);
    return { message: 'success' };
  }
}
