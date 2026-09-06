import { randomBytes } from 'node:crypto';

import type { pool } from '../database.js';

type DatabasePool = typeof pool;

const SESSION_DURATION_SECONDS =
  60 * 60 * 24 * 30;

export const SESSION_COOKIE_NAME =
  'start_force_session';

export function createSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function getSessionExpiry(): Date {
  return new Date(
    Date.now() +
      SESSION_DURATION_SECONDS * 1000,
  );
}

export async function createSession(
  database: DatabasePool,
  userId: string,
) {
  const token = createSessionToken();
  const expiresAt = getSessionExpiry();

  const result = await database.query(
    `
      INSERT INTO sessions (
        user_id,
        token,
        expires_at
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        user_id AS "userId",
        token,
        expires_at AS "expiresAt",
        created_at AS "createdAt"
    `,
    [
      userId,
      token,
      expiresAt,
    ],
  );

  return result.rows[0];
}

export async function getUserIdFromSession(
  database: DatabasePool,
  token: string | undefined,
): Promise<string | null> {
  if (!token) {
    return null;
  }

  const result = await database.query(
    `
      SELECT user_id AS "userId"
      FROM sessions
      WHERE token = $1
        AND expires_at > NOW()
      LIMIT 1
    `,
    [token],
  );

  const userId =
    result.rows[0]?.userId;

  return typeof userId === 'string'
    ? userId
    : null;
}

export async function deleteSession(
  database: DatabasePool,
  token: string | undefined,
): Promise<void> {
  if (!token) {
    return;
  }

  await database.query(
    `
      DELETE FROM sessions
      WHERE token = $1
    `,
    [token],
  );
}

export async function deleteExpiredSessions(
  database: DatabasePool,
): Promise<void> {
  await database.query(
    `
      DELETE FROM sessions
      WHERE expires_at <= NOW()
    `,
  );
}