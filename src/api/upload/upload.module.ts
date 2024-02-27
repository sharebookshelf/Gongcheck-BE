import { Module } from '@nestjs/common';
import { UploadService } from './service/upload.service';
import { UploadController } from './controller/upload.controller';
import { UploadRepository } from './repository/upload.repository';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
})
export class UploadModule {}
