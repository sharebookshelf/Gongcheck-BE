import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn({ comment: '설문PK' })
  id: number;

  @Column({ comment: '유저 아이디' })
  userId: string;

  @Column({ type: 'int', comment: '1번 문항 답변' })
  question1: number;

  @Column({ type: 'int', comment: '2번 문항 답변' })
  question2: number;

  @Column({ type: 'int', comment: '3번 문항 답변' })
  question3: number;

  @Column({
    type: 'varchar',
    length: 1,
    default: 'A',
    comment: 'A:활성화/D:비활성화',
  })
  status: string;

  @CreateDateColumn({ nullable: true, comment: 'Record creation time' })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true, comment: 'Record last update time' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.survey)
  @JoinColumn({ name: 'userId' })
  user: User;
}
