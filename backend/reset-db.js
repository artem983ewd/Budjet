const { Client } = require('pg');

async function resetDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres', // connect to default db first
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Terminate existing connections to finance_db
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'finance_db' AND pid <> pg_backend_pid();
    `);
    console.log('Terminated existing connections to finance_db');

    // Drop database if exists
    await client.query('DROP DATABASE IF EXISTS finance_db');
    console.log('Dropped database finance_db');

    // Create fresh database
    await client.query('CREATE DATABASE finance_db');
    console.log('Created database finance_db');

    await client.end();
    console.log('Database reset complete');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    await client.end();
    process.exit(1);
  }
}

resetDatabase();
