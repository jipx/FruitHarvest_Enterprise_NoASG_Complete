require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { getPool } = require('../services/db');

async function runSqlFile(pool, file) {
  const sql = fs.readFileSync(file, 'utf8');
  const statements = sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(statement);
  }
}

async function main() {
  const pool = await getPool();
  const migration = path.join(__dirname, '..', 'database', 'migrations', '001_schema.sql');
  const seed = path.join(__dirname, '..', 'database', 'seeds', '001_seed_data.sql');

  console.log('Running schema migration...');
  await runSqlFile(pool, migration);

  console.log('Running seed data...');
  await runSqlFile(pool, seed);

  console.log('Database initialized successfully.');
  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
