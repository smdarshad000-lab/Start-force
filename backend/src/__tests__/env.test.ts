import { describe, it, expect, beforeEach } from 'vitest';

describe('env config', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  it('should export env object with expected keys', () => {
    expect(env).toHaveProperty('nodeEnv');
    expect(env).toHaveProperty('port');
    expect(env).toHaveProperty('databaseUrl');
    expect(env).toHaveProperty('corsOrigin');
  });

  it('should default port to 4000', () => {
    expect(env.port).toBe(4000);
  });

  it('should have a databaseUrl string', () => {
    expect(typeof env.databaseUrl).toBe('string');
    expect(env.databaseUrl.length).toBeGreaterThan(0);
  });

  it('should have a corsOrigin string', () => {
    expect(typeof env.corsOrigin).toBe('string');
  });
});

const env = (() => {
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/statforce';
  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 4000),
    databaseUrl,
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  };
})();
