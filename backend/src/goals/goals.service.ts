import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
  ) {}

  async create(userId: string, createGoalDto: CreateGoalDto): Promise<Goal> {
    const goal = this.goalRepository.create({
      ...createGoalDto,
      user: { id: userId } as any,
    });
    return this.goalRepository.save(goal);
  }

  async findAll(userId: string): Promise<Goal[]> {
    return this.goalRepository.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' },
    });
  }

  async findOne(userId: string, id: number): Promise<Goal> {
    const goal = await this.goalRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }
    return goal;
  }

  async update(
    userId: string,
    id: number,
    updateGoalDto: UpdateGoalDto,
  ): Promise<Goal> {
    const goal = await this.findOne(userId, id);
    Object.assign(goal, updateGoalDto);
    return this.goalRepository.save(goal);
  }

  async remove(userId: string, id: number): Promise<void> {
    const goal = await this.findOne(userId, id);
    await this.goalRepository.remove(goal);
  }
}
