import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('book')
@Index('book_index', ['title', 'author', 'publisher'], { fulltext: true })
export class Book {
  @PrimaryGeneratedColumn({ comment: '책 ID' })
  bookID: number;

  @Column({ length: 255, comment: '책 제목' })
  title: string;

  @Column({ length: 255, comment: '책 저자' })
  author: string;

  @Column({ length: 255, comment: '출판사' })
  publisher: string;

  @Column({ length: 255, comment: '표지 이미지 url' })
  titleUrl: string;

  @Column({ length: 255, comment: 'ISBN 부가기호' })
  eaAddCode: string;

  @Column({ length: 20, comment: 'ISBN' })
  eaIsbn: string;

  @Column({ length: 20, comment: '세트 ISBN' })
  setIsbn: string;

  @Column({ length: 255, comment: '세트 부가기호' })
  setAddCode: string;

  @Column({ length: 10, comment: '예정 가격' })
  prePrice: string;

  @Column({ length: 8, comment: '등록 날짜' })
  inputDate: string;

  @CreateDateColumn({ nullable: true, comment: '생성 시간' })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, comment: '수정 시간' })
  updatedAt: Date;

  @Column({ length: 1, nullable: true, comment: '상태' })
  status?: string;

  @ManyToMany(() => User)
  users: User[];
}
