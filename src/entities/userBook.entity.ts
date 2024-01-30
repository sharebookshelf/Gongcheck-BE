import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity()
export class UserBook {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  bookId: number;

  @ManyToOne(() => User, (user) => user.userBooks)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Book, (book) => book.userBooks)
  @JoinColumn({ name: 'bookId' })
  book: Book;
}
