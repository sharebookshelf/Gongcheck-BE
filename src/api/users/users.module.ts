import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserBook } from 'src/entities/userBook.entity';
import { Bookshelf } from 'src/entities/bookshelf.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserBook, Bookshelf])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
