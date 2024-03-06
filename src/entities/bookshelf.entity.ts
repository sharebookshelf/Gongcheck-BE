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

@Entity()
export class Bookshelf {
  @PrimaryGeneratedColumn({ comment: '책장 이미지PK ' })
  id: number;

  @Column({ length: 255, comment: '이미지 경로' })
  bookShelfImage: string;

  @CreateDateColumn({ comment: '생성 시간' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정 시간' })
  updatedAt: Date;

  @Column({ length: 1, nullable: true, comment: '상태' })
  status?: string;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'userId' })
  userId: number;
}
