import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';

import { UserBook } from './userBook.entity';

@Entity()
@Index('book_index', ['title', 'author', 'publisher'], { fulltext: true })
export class Book {
  @PrimaryGeneratedColumn({ comment: '책 ID' })
  bookId: number;

  @Column({ length: 255, comment: '책 제목' })
  title: string;

  @Column({ length: 255, comment: '책 저자' })
  author: string;

  @Column({ length: 255, comment: '출판사' })
  publisher: string;

  @Column({ nullable: true, length: 255, comment: '표지 이미지 url' })
  titleUrl: string;

  @Column({ nullable: true, length: 255, comment: 'ISBN 부가기호' })
  eaAddCode: string;

  @Column({ nullable: true, length: 20, comment: 'ISBN' })
  eaIsbn: string;

  @Column({ nullable: true, length: 20, comment: 'ISBN' })
  dfdfdf: string;

  @Column({ nullable: true, length: 20, comment: '세트 ISBN' })
  setIsbn: string;

  @Column({ nullable: true, length: 255, comment: '세트 부가기호' })
  setAddCode: string;

  @Column({ nullable: true, length: 10, comment: '예정 가격' })
  prePrice: string;

  @Column({ nullable: true, length: 8, comment: '등록 날짜' })
  inputDate: string;

  @CreateDateColumn({ comment: '생성 시간' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정 시간' })
  updatedAt: Date;

  @Column({ length: 1, nullable: true, comment: '상태' })
  status?: string;

  @OneToMany(() => UserBook, (userBook) => userBook.bookId)
  userBook: UserBook[];
}
