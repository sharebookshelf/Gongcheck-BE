import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UploadService } from '../service/upload.service';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadDto } from '../dto/upload.dto';
import { TransactionInterceptor } from 'src/common/transaction.interceptor';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @FormDataRequest()
  fetchAiData(
    // @Headers('user-id') userId: string,
    @Body() uploadDto: UploadDto,
  ) {
    return this.uploadService.sendFile(uploadDto);
  }
}