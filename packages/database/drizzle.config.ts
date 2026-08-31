import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({
  path: '../../.env',
});

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is required to run Drizzle commands.',
  );
}

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});