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

@Entity('debts')
export class Debt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.debt)
  transactions: Transaction[];

  @Column()
  name: string;

  @Column('decimal', { precision: 12, scale: 2 })
  total_debt: number;

  @Column('decimal', { precision: 12, scale: 2 })
  remaining_debt: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon: string | null;
}
