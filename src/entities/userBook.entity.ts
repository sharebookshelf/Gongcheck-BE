import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity()
export class UserBook {
  @PrimaryGeneratedColumn()
  userBookId: number;

  @Column()
  userId: string; // 명시적으로 컬럼 추가

  @Column()
  bookId: number; // 명시적으로 컬럼 추가

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  rank: number;

  // @ManyToOne(() => User, (user) => user.userId)
  // @JoinColumn({ name: 'userId' })
  // userId: number;

  // @ManyToOne(() => Book, (book) => book.bookId)
  // @JoinColumn({ name: 'bookId' })
  // bookId: number;

  @ManyToOne(() => User, (user) => user.userBook)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Book, (book) => book.userBook)
  @JoinColumn({ name: 'bookId' })
  book: Book;
}
