import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Goal } from '../../goals/entities/goal.entity';
import { Debt } from '../../debts/entities/debt.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Account, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'account_id' })
  account?: Account;

  @ManyToOne(() => Goal, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'goal_id' })
  goal?: Goal;

  @ManyToOne(() => Debt, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'debt_id' })
  debt?: Debt;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'transaction_date', type: 'timestamp' })
  transactionDate: Date;
}
