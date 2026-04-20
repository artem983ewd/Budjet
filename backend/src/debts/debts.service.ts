import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debt } from './entities/debt.entity';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';

@Injectable()
export class DebtsService {
  constructor(
    @InjectRepository(Debt)
    private debtRepository: Repository<Debt>,
  ) {}

  async create(userId: string, createDebtDto: CreateDebtDto): Promise<Debt> {
    const debt = this.debtRepository.create({
      ...createDebtDto,
      user: { id: userId } as any,
    });
    return this.debtRepository.save(debt);
  }

  async findAll(userId: string): Promise<Debt[]> {
    return this.debtRepository.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' },
    });
  }

  async findOne(userId: string, id: number): Promise<Debt> {
    const debt = await this.debtRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!debt) {
      throw new NotFoundException(`Debt with ID ${id} not found`);
    }
    return debt;
  }

  async update(
    userId: string,
    id: number,
    updateDebtDto: UpdateDebtDto,
  ): Promise<Debt> {
    const debt = await this.findOne(userId, id);
    Object.assign(debt, updateDebtDto);
    return this.debtRepository.save(debt);
  }

  async remove(userId: string, id: number): Promise<void> {
    const debt = await this.findOne(userId, id);
    await this.debtRepository.remove(debt);
  }
}
