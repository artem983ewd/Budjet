import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Account } from '../accounts/entities/account.entity';
import { Goal } from '../goals/entities/goal.entity';
import { Debt } from '../debts/entities/debt.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  // Truncate all tables and restart identity
  await dataSource.query(`
    TRUNCATE TABLE transactions, categories, accounts, goals, debts, users 
    RESTART IDENTITY CASCADE;
  `);

  const userRepo = dataSource.getRepository(User);
  const categoryRepo = dataSource.getRepository(Category);
  const accountRepo = dataSource.getRepository(Account);
  const goalRepo = dataSource.getRepository(Goal);
  const debtRepo = dataSource.getRepository(Debt);
  const transactionRepo = dataSource.getRepository(Transaction);

  // Insert user with fixed UUID
  const user = userRepo.create({
    id: '11111111-1111-1111-1111-111111111111',
    username: 'Alex',
    email: 'alex@example.com',
    password: 'dummy',
  });
  await userRepo.save(user);

  // Insert categories
  const categoryExpense = categoryRepo.create({
    user,
    name: 'Погашение кредита',
    type: 'expense',
  });
  const categoryIncome = categoryRepo.create({
    user,
    name: 'Подарок',
    type: 'income',
  });
  await categoryRepo.save([categoryExpense, categoryIncome]);

  // Insert account
  const account = accountRepo.create({
    user,
    name: 'Карта Tinkoff',
    balance: 50000.0,
  });
  await accountRepo.save(account);

  // Insert goal
  const goal = goalRepo.create({
    user,
    name: 'На машину',
    current_amount: 15000.0,
    target_amount: 500000.0,
  });
  await goalRepo.save(goal);

  // Insert debt
  const debt = debtRepo.create({
    user,
    name: 'Кредит за телефон',
    total_debt: 60000.0,
    remaining_debt: 45000.0,
  });
  await debtRepo.save(debt);

  // Insert transactions
  const transaction1 = transactionRepo.create({
    user,
    category: categoryIncome,
    goal,
    amount: 15000.0,
    description: 'Отложил на машину',
    transactionDate: new Date(),
  });
  const transaction2 = transactionRepo.create({
    user,
    category: categoryExpense,
    debt,
    amount: 15000.0,
    description: 'Взнос за телефон',
    transactionDate: new Date(),
  });
  await transactionRepo.save([transaction1, transaction2]);

  await app.close();
}

bootstrap().catch((error) => {
  console.error('Seeder failed:', error);
  process.exit(1);
});
