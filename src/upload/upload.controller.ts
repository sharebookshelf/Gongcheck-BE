import { Body, Controller, Post } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadDto } from './dto/upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @FormDataRequest()
  fetchAiData(@Body() uploadDto: UploadDto) {
    return this.uploadService.sendFile(uploadDto);
  }
}
