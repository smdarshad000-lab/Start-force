import { createDatabase } from '@stat-force/database';
import { env } from './config/env.js';

export const { db, pool } = createDatabase(
  env.databaseUrl,
);