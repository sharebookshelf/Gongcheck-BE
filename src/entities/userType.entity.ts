import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', default: 0 })
  type0: number;

  @Column({ type: 'float', default: 0 })
  type1: number;

  @Column({ type: 'float', default: 0 })
  type2: number;

  @Column({ type: 'float', default: 0 })
  type3: number;

  @Column({ type: 'float', default: 0 })
  type4: number;

  @Column({ type: 'float', default: 0 })
  type5: number;

  @Column({ type: 'float', default: 0 })
  type6: number;

  @Column({ type: 'float', default: 0 })
  type7: number;

  @Column({ type: 'float', default: 0 })
  type8: number;

  @Column({ type: 'float', default: 0 })
  type9: number;

  @OneToOne(() => User, (user) => user.type, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
