import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn({ comment: '좋아요 PK' })
  likeId: number;

  @Column()
  userId: string; // 명시적으로 컬럼 추가

  @Column()
  postId: number; // 명시적으로 컬럼 추가

  @Column({ type: 'boolean', default: false, comment: '좋아요 여부' })
  liked: boolean;

  @CreateDateColumn({ comment: '생성 시간' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정 시간' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post, (post) => post.likes)
  @JoinColumn({ name: 'postId' })
  post: Post;
}
