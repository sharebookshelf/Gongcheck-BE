import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Bookshelf } from 'src/entities/bookshelf.entity';
import { Post } from 'src/entities/post.entity';
import { Like } from 'src/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Bookshelf, Post, Like])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
