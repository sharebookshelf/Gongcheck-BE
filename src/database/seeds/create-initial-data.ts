import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    await userRepository.insert([
      {
        nickname: 'admin',
        gender: 'M',
        birth: '1990-01-01',
        readingType: 'Type A',
        isAgree: 'Y',
        feedback: 'Great platform!',
        status: '1',
      },
    ]);
  }
}
