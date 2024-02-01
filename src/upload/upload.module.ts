import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UploadRepository } from './upload.repository';

@Module({
  imports: [NestjsFormDataModule],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
})
export class UploadModule {}
