import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Bookshelf } from './bookshelf.entity';
import { Like } from './like.entity';
import { User } from './user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn({ comment: '게시물 PK' })
  postId: number;

  @Column({ length: 20, nullable: true, comment: '비밀번호' })
  password?: string;

  @Column({ nullable: false, comment: '좋아요 수', default: 0 })
  likeCount: number;

  @Column({ nullable: false, comment: '상태', default: 'active' })
  status: string;

  @CreateDateColumn({ comment: '생성 시간' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정 시간' })
  updatedAt: Date;

  @OneToMany(() => Bookshelf, (bookshelf) => bookshelf.post)
  bookshelves: Bookshelf[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToOne(() => User, (user) => user.post)
  @JoinColumn({ name: 'userId' })
  user: User;
}
