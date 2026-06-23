import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      user: { id: userId } as any,
      category: { id: createTransactionDto.categoryId } as any,
      account: createTransactionDto.accountId
        ? ({ id: createTransactionDto.accountId } as any)
        : undefined,
    });
    return this.transactionRepository.save(transaction);
  }

  async findAll(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { user: { id: userId } },
      relations: ['category'],
      order: { transactionDate: 'DESC' },
    });
  }

  async findByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<Transaction[]> {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return this.transactionRepository.find({
      where: {
        user: { id: userId },
        transactionDate: Between(start, end),
      },
      relations: ['category'],
      order: { transactionDate: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Transaction[]> {
    return this.findAll(userId);
  }

  async findOne(userId: string, id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['category'],
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async update(
    userId: string,
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.findOne(userId, id);
    Object.assign(transaction, updateTransactionDto);
    if (updateTransactionDto.categoryId) {
      transaction.category = { id: updateTransactionDto.categoryId } as any;
    }
    return this.transactionRepository.save(transaction);
  }

  async remove(userId: string, id: number): Promise<void> {
    const transaction = await this.findOne(userId, id);
    await this.transactionRepository.remove(transaction);
  }
}
