const { Client } = require('pg');

async function verify() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'finance_db',
  });

  await client.connect();
  console.log('Connected to finance_db\n');

  const tables = ['users', 'categories', 'accounts', 'goals', 'debts', 'transactions'];
  
  for (const table of tables) {
    const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
    console.log(`${table}: ${res.rows[0].count}`);
  }

  console.log('\nSample user:');
  const userRes = await client.query('SELECT * FROM users');
  console.log(userRes.rows[0]);

  await client.end();
}

verify().catch(console.error);
