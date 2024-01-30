import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('bookshelf')
export class Bookshelf {
  @PrimaryColumn({ length: 255, comment: '이미지 경로' })
  bookShelfImage: string;

  @Column()
  userID: number;

  @CreateDateColumn({ comment: '생성 시간' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정 시간' })
  updatedAt: Date;

  @Column({ length: 1, nullable: true, comment: '상태' })
  status?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userID' })
  user: User;
}
