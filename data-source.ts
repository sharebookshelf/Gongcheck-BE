// data-source.ts
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Book } from './src/entities/book.entity';
import { Bookshelf } from './src/entities/bookshelf.entity';
import { User } from './src/entities/user.entity';
import { UserBook } from './src/entities/userBook.entity';

ConfigModule.forRoot(); // 환경 변수를 로드합니다.

const configService = new ConfigService(); // ConfigService 인스턴스를 생성합니다.

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  synchronize: true,
  logging: true,
  entities: [Book, Bookshelf, User, UserBook],
  migrations: [__dirname + '/src/database/migrations/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
