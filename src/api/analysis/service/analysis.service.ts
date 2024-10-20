import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserType } from 'src/entities/userType.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserType)
    private userTypeRepository: Repository<UserType>,
  ) {}

  async getAnalysisResult(userId: string) {
    const [user] = await this.userRepository.find({
      where: { userId },
    });
    const readingType = user.readingType;
    const categoryCounts = JSON.parse(user.categoryCounts);

    return { readingType, categoryCounts };
  }

  async getAnalysisType(userId: string) {
    const userType = await this.userTypeRepository.findOne({
      where: { user: { userId } },
    });

    if (!userType) {
      throw new Error('User Type not found');
    }

    const standardizedScores = [
      Math.round(userType.type0 * 10),
      Math.round(userType.type1 * 10),
      Math.round(userType.type2 * 10),
      Math.round(userType.type3 * 10),
      Math.round(userType.type4 * 10),
      Math.round(userType.type5 * 10),
      Math.round(userType.type6 * 10),
      Math.round(userType.type7 * 10),
      Math.round(userType.type8 * 10),
      Math.round(userType.type9 * 10),
    ];

    return standardizedScores;
  }
}
