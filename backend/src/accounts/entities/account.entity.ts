import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @Column()
  name: string;

  @Column('decimal', { precision: 12, scale: 2 })
  balance: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon: string | null;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  target_amount: number | null;
}
