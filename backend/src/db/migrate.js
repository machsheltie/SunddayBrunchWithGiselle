import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log('🚀 Running database migration...');

    const schemaSQL = fs.readFileSync(join(__dirname, 'schema.sql'), 'utf-8');

    await client.query(schemaSQL);

    console.log('✅ Database migration completed successfully!');
    console.log('📊 Tables created: recipes, episodes, tools, related_content');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
