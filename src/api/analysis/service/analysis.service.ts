import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAnalysisResult(userId: number) {
    const [user] = await this.userRepository.find({
      where: { userId },
    });
    const readingType = user.readingType;

    return { readingType };
  }
}
