import { Module, Controller } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debt } from './entities/debt.entity';
import { DebtsService } from './debts.service';
import { DebtsController } from './debts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Debt])],
  controllers: [DebtsController],
  providers: [DebtsService],
  exports: [DebtsService],
})
export class DebtsModule {}
