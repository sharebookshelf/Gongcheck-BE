import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Book } from 'src/entities/book.entity';
import { Bookshelf } from 'src/entities/bookshelf.entity';
import { User } from 'src/entities/user.entity';
import { DataSource } from 'typeorm';
dotenv.config(); // very very important!!

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  synchronize: false,
  logging: true,
  entities: [Book, Bookshelf, User],
  migrations: [__dirname + 'src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  charset: 'utf8m4_general_ci',
  // 한국 표준 시
  timezone: '+09.00',
});
