import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { Bookshelf } from '../entities/bookshelf.entity';
import { User } from '../entities/user.entity';
import { UserBook } from '../entities/userBook.entity';
import { Survey } from 'src/entities/survey.entity';
import { Post } from 'src/entities/post.entity';
import { Like } from 'src/entities/like.entity';
import { UserType } from 'src/entities/userType';

export const TypeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    synchronize: true,
    logging: false,
    entities: [Book, Bookshelf, User, UserBook, Survey, Post, Like, UserType],
    migrations: [__dirname + '/src/database/migrations/*.ts'],
    cli: {
      migrationsDir: 'src/database/migrations', // migration 파일을 생성할 디렉토리
    },
  }),
};
