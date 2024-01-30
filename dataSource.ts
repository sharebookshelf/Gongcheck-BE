import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Book } from './src/entities/book.entity';
import { Bookshelf } from './src/entities/bookshelf.entity';
import { User } from './src/entities/user.entity';

config();

const configService = new ConfigService();

const dataSource = new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  synchronize: false,
  logging: true,
  entities: [Book, Bookshelf, User],
  migrations: [__dirname + '/src/database/migrations/*.ts'],
});

export default dataSource;
