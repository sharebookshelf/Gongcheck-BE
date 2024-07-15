import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookshelf } from 'src/entities/bookshelf.entity';
import { Like } from 'src/entities/like.entity';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Bookshelf)
    private bookshelfRepository: Repository<Bookshelf>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}
  async updateFeedback(isAgree: string, userId: string, feedback: string) {
    // Check if the userId already exists
    const existingUser = await this.userRepository.findOne({
      where: { userId, isAgree: 'y' || 'n' },
    });

    if (existingUser) {
      throw new ConflictException(`이미 피드백을 전송하셨습니다.`);
    }

    await this.userRepository.update(userId, {
      isAgree,
      feedback,
    });
  }

  async findUserBookshelves(userId: string) {
    const userBookshelves = await this.bookshelfRepository.find({
      where: { user: { userId } },
      relations: ['user'],
    });
    const nickname =
      userBookshelves.length > 0 ? userBookshelves[0].user.nickname : null;
    const readingType =
      userBookshelves.length > 0 ? userBookshelves[0].user.readingType : null;

    return {
      nickname,
      readingType,
      bookshelves: userBookshelves,
    };
  }

  async findLikes(userId: string) {
    const likes = await this.likeRepository.find({
      relations: ['user', 'post'],
      where: { userId },
    });

    // 좋아요를 누른 postId의 리스트를 반환합니다.
    const postIds = likes.map((like) => like.post.postId);

    return postIds;
  }

  async updateBookshelfPassword(userId: string, password: string) {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const bookshelves = await this.bookshelfRepository.find({
      where: { user: { userId } },
    });

    if (bookshelves.length === 0) {
      throw new Error('No bookshelves found for this user');
    }

    // 새로운 Post 생성
    const newPost = this.postRepository.create({
      user: user,
      bookshelves: bookshelves,
      password,
    });

    const savedPost = await this.postRepository.save(newPost);

    return savedPost;
  }

  async like(userId: string, likeStatus: boolean, postId: number) {
    const user = await this.userRepository.findOne({ where: { userId } });
    const post = await this.postRepository.findOne({ where: { postId } });

    if (!user || !post) {
      throw new Error('User or Post not found');
    }

    let like = await this.likeRepository.findOne({ where: { userId, postId } });

    if (like) {
      // 기존이랑 다르면
      if (like.liked !== likeStatus) {
        like.liked = likeStatus;
        await this.likeRepository.save(like);

        if (likeStatus) {
          post.likeCount += 1;
        } else {
          post.likeCount -= 1;
        }
      }
    } else {
      like = this.likeRepository.create({ userId, postId, liked: likeStatus });
      await this.likeRepository.save(like);

      if (likeStatus) {
        post.likeCount += 1;
      }
    }

    await this.likeRepository.save(like);
    await this.postRepository.save(post);

    return { success: true };
  }
}
