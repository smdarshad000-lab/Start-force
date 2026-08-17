import 'dotenv/config';

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: requireEnv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/statforce'),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
};

if (isNaN(env.port) || env.port < 1 || env.port > 65535) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}
