import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookshelf } from 'src/entities/bookshelf.entity';
import { User } from 'src/entities/user.entity';
import { UserBook } from 'src/entities/userBook.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserBook)
    private userBookRepository: Repository<UserBook>,
    @InjectRepository(Bookshelf)
    private bookshelfRepository: Repository<Bookshelf>,
  ) {}
  async updateFeedback(isAgree: string, userId: string, feedback: string) {
    // Check if the userId already exists
    const existingUser = await this.userRepository.findOne({
      where: { userId, isAgree: 'y' || 'n' },
    });
    // console.log(existingUser);

    if (existingUser) {
      // Throw an exception if the userId already exists
      throw new ConflictException(`이미 피드백을 전송하셨습니다.`);
    }

    await this.userRepository.update(userId, {
      isAgree,
      feedback,
    });
  }

  updateUserBookStatus(bookIds: number[], userId: string) {
    return this.userBookRepository.update(
      {
        userId,
        bookId: In(bookIds),
      },
      {
        status: 'y',
      },
    );
  }

  async findUserBookshelves(userId: string) {
    const userBookshelves = await this.bookshelfRepository.find({
      where: { user: { userId } },
      // relations: ['book'],
    });
    return userBookshelves;
  }
}
