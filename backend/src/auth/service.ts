import type { pool } from '../database.js';

import {
  hashPassword,
  verifyPassword,
} from './password.js';

import {
  createSession,
  deleteSession,
  getUserIdFromSession,
} from './session.js';

type DatabasePool = typeof pool;

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function registerUser(
  database: DatabasePool,
  input: RegisterInput,
) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (name.length < 2) {
    throw new Error(
      'Name must contain at least 2 characters.',
    );
  }

  if (!isValidEmail(email)) {
    throw new Error(
      'Please enter a valid email address.',
    );
  }

  if (password.length < 8) {
    throw new Error(
      'Password must contain at least 8 characters.',
    );
  }

  const existing = await database.query(
    `
      SELECT id
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email],
  );

  if (existing.rows.length > 0) {
    throw new Error(
      'An account with this email already exists.',
    );
  }

  const passwordHash =
    await hashPassword(password);

  const result = await database.query(
    `
      INSERT INTO users (
        name,
        email,
        password_hash
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        name,
        email,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [
      name,
      email,
      passwordHash,
    ],
  );

  const user = result.rows[0];

  if (!user || typeof user.id !== 'string') {
    throw new Error(
      'Failed to create the user account.',
    );
  }

  const session = await createSession(
    database,
    user.id,
  );

  return {
    user,
    session,
  };
}

export async function loginUser(
  database: DatabasePool,
  input: LoginInput,
) {
  const email = input.email
    .trim()
    .toLowerCase();

  const password = input.password;

  if (!isValidEmail(email)) {
    throw new Error(
      'Please enter a valid email address.',
    );
  }

  if (!password) {
    throw new Error('Password is required.');
  }

  const result = await database.query(
    `
      SELECT
        id,
        name,
        email,
        password_hash AS "passwordHash",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email],
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error(
      'Invalid email or password.',
    );
  }

  if (
    typeof user.id !== 'string' ||
    typeof user.passwordHash !== 'string'
  ) {
    throw new Error(
      'Invalid account configuration.',
    );
  }

  const passwordMatches =
    await verifyPassword(
      password,
      user.passwordHash,
    );

  if (!passwordMatches) {
    throw new Error(
      'Invalid email or password.',
    );
  }

  const session = await createSession(
    database,
    user.id,
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    session,
  };
}

export async function getCurrentUser(
  database: DatabasePool,
  sessionToken: string | undefined,
) {
  const userId =
    await getUserIdFromSession(
      database,
      sessionToken,
    );

  if (!userId) {
    return null;
  }

  const result = await database.query(
    `
      SELECT
        id,
        name,
        email,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [userId],
  );

  return result.rows[0] ?? null;
}

export async function logoutUser(
  database: DatabasePool,
  sessionToken: string | undefined,
) {
  await deleteSession(
    database,
    sessionToken,
  );
}