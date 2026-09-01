import { drizzle } from 'drizzle-orm/node-postgres';
import * as pg from 'pg';

const { Pool } = pg;

export function createDatabase(databaseUrl: string) {
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  const db = drizzle(pool);

  return {
    db,
    pool,
  };
}