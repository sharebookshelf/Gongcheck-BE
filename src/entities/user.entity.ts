import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserBook } from './userBook.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  userID: number;

  @Column({ length: 20, comment: '이용자 닉네임' })
  nickname: string;

  @Column({ length: 1, comment: '성별' })
  gender: string;

  @Column({ type: 'date', comment: '출생년도' })
  birth: string;

  @Column({ length: 20, nullable: true, comment: '책장 타입 결과' })
  readingType?: string;

  @Column({ length: 1, nullable: true, comment: '공감여부' })
  isAgree?: string;

  @Column({ type: 'text', nullable: true, comment: '피드백' })
  feedback?: string;

  @CreateDateColumn({ comment: '생성 시간' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정 시간' })
  updatedAt: Date;

  @Column({ length: 1, nullable: true, comment: '상태' })
  status?: string;

  @OneToMany(() => UserBook, (userBook) => userBook.book)
  userBooks: UserBook[];
}
