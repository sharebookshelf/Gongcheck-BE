import { Module } from '@nestjs/common';
import { BookshelvesService } from './service/bookshelves.service';
import { BookshelvesController } from './controller/bookshelves.controller';
import { BookshelvesRepository } from './repository/bookshelves.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Bookshelf } from 'src/entities/bookshelf.entity';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { Like } from 'src/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookshelf, User, Post, Like]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [BookshelvesController],
  providers: [BookshelvesService, BookshelvesRepository],
})
export class BookshelvesModule {}
