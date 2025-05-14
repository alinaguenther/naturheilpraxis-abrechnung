import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'd1-http',
  dialect: 'sqlite', // Added the required dialect property
  dbCredentials: {
    accountId: process.env.ACCOUNT_ID || '',
    databaseId: process.env.DATABASE_ID || '',
    token: process.env.TOKEN || ''
  }
} satisfies Config;