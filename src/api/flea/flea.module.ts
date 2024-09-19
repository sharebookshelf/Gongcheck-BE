import { Module } from '@nestjs/common';
import { FleaService } from './flea.service';
import { FleaController } from './flea.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { UserBook } from 'src/entities/userBook.entity';
import { User } from 'src/entities/user.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Book, UserBook, User]), HttpModule],
  controllers: [FleaController],
  providers: [FleaService],
})
export class FleaModule {}
