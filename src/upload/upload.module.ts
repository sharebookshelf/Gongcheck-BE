import { Module } from '@nestjs/common';
import { UploadService } from './service/upload.service';
import { UploadController } from './controller/upload.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { UploadRepository } from './repository/upload.repository';

@Module({
  imports: [NestjsFormDataModule],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
})
export class UploadModule {}
