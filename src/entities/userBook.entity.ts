import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity()
export class UserBook {
  @PrimaryColumn()
  userBookId: number;

  @ManyToOne(() => User, (user) => user.userBook)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Book, (book) => book.userBook)
  @JoinColumn({ name: 'bookId' })
  book: Book;
}
