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

  @Column()
  userId: string; // 명시적으로 컬럼 추가

  @Column({ length: 255, comment: '이미지 경로' })
  bookShelfImage: string;

  @Column({ length: 20, nullable: true, comment: '비밀번호' })
  password?: string;

  @CreateDateColumn({ comment: '생성 시간' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정 시간' })
  updatedAt: Date;

  @Column({ nullable: true, comment: '상태', default: 'active' })
  status?: string;

  @ManyToOne(() => User, (user) => user.bookshelf)
  @JoinColumn({ name: 'userId' })
  user: User;
}
