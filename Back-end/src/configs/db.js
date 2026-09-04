import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from '../Models/schema.js';
import dotenv from 'dotenv';

dotenv.config();

// Prefer the environment variable; fall back to a local dev connection string.
const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:Ahmed1234@localhost:5432/StoreDB';

const client = new Client({ connectionString });

async function connectDb() {
  try {
    await client.connect();
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    // Fail fast so the app doesn't run in a broken, DB-less state.
    process.exit(1);
  }
}

export const db = drizzle(client, { schema });

export async function isDbConnected() {
  try {
    await client.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

export default connectDb;