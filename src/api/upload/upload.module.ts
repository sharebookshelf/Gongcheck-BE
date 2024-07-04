import { Module } from '@nestjs/common';
import { UploadService } from './service/upload.service';
import { UploadController } from './controller/upload.controller';
import { UploadRepository } from './repository/upload.repository';
import { Bookshelf } from 'src/entities/bookshelf.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
// import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookshelf]),
    MulterModule.register({
      storage: memoryStorage(),
      // storage: diskStorage({
      //   destination: (req, file, cb) => {
      //     cb(null, `/app/public/asset`);
      //   },
      //   filename: (req, file, cb) => {
      //     const uniqueSuffix =
      //       Date.now() + '-' + Math.round(Math.random() * 1e9);
      //     const ext = extname(file.originalname);
      //     cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      //   },
      // }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
})
export class UploadModule {}
