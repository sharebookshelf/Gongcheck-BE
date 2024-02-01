import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity()
export class UserBook {
  @PrimaryGeneratedColumn()
  userBookId: number;

  @ManyToOne(() => User, (user) => user.userBook)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => Book, (book) => book.userBook)
  @JoinColumn({ name: 'bookId' })
  bookId: number;
}
