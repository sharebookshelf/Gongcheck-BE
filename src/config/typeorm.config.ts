import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { Bookshelf } from '../entities/bookshelf.entity';
import { User } from '../entities/user.entity';
import { UserBook } from '../entities/userBook.entity';

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
    synchronize: false,
    logging: true,
    entities: [Book, Bookshelf, User, UserBook],
    migrations: [__dirname + '/src/database/migrations/*.ts'],
  }),
};
