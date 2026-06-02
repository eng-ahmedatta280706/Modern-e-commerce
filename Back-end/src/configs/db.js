import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from '../Models/schema.js';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || '';
const parsedUrl = connectionString ? new URL(connectionString) : null;

// const client = new Client({
//   host: parsedUrl?.hostname,
//   port: parsedUrl?.port ? Number(parsedUrl.port) : undefined,
//   user: parsedUrl?.username || undefined,
//   password: parsedUrl?.password ? decodeURIComponent(parsedUrl.password) : '',
//   database: parsedUrl?.pathname ? parsedUrl.pathname.replace(/^\//, '') : undefined,
// });

const client = new Client({
  // connectionString: process.env.DATABASE_URL,
  connectionString: "postgresql://postgres:Ahmed1234@localhost:5432/StoreDB",
});

async function connectDb() {
  try {
    await client.connect();
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
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