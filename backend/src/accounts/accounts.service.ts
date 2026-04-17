import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(userId: string, createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create({
      ...createAccountDto,
      user: { id: userId } as any,
    });
    return this.accountRepository.save(account);
  }

  async findAllByUser(userId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { user: { id: userId } },
      order: { id: 'ASC' },
    });
  }

  async findOne(userId: string, id: number): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!account) {
      throw new NotFoundException(`Счет с ID ${id} не найден`);
    }
    return account;
  }

  async update(userId: string, id: number, updateAccountDto: UpdateAccountDto): Promise<Account> {
    const account = await this.findOne(userId, id);
    Object.assign(account, updateAccountDto);
    return this.accountRepository.save(account);
  }

  async remove(userId: string, id: number): Promise<void> {
    const account = await this.findOne(userId, id);
    await this.accountRepository.remove(account);
  }
}