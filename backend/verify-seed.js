const { DataSource } = require('typeorm');
const { User } = require('./dist/users/entities/user.entity');
const { Category } = require('./dist/categories/entities/category.entity');
const { Account } = require('./dist/accounts/entities/account.entity');
const { Goal } = require('./dist/goals/entities/goal.entity');
const { Debt } = require('./dist/debts/entities/debt.entity');
const { Transaction } = require('./dist/transactions/entities/transaction.entity');

async function verify() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'finance_db',
    entities: [User, Category, Account, Goal, Debt, Transaction],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Connected to database\n');

  const userCount = await dataSource.getRepository(User).count();
  console.log(`Users: ${userCount}`);

  const categoryCount = await dataSource.getRepository(Category).count();
  console.log(`Categories: ${categoryCount}`);

  const accountCount = await dataSource.getRepository(Account).count();
  console.log(`Accounts: ${accountCount}`);

  const goalCount = await dataSource.getRepository(Goal).count();
  console.log(`Goals: ${goalCount}`);

  const debtCount = await dataSource.getRepository(Debt).count();
  console.log(`Debts: ${debtCount}`);

  const transactionCount = await dataSource.getRepository(Transaction).count();
  console.log(`Transactions: ${transactionCount}`);

  const users = await dataSource.getRepository(User).find();
  console.log('\nUsers:', JSON.stringify(users, null, 2));

  await dataSource.destroy();
}

verify().catch(console.error);
