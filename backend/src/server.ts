import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import { env } from './config/env.js';
import { db, pool } from './database.js';

import {
  typeDefs,
  resolvers,
} from './graphql/schema.js';

import {
  SESSION_COOKIE_NAME,
} from './auth/session.js';

function getSessionToken(
  cookieHeader: string | undefined,
): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  const cookies =
    cookieHeader.split(';');

  for (const cookie of cookies) {
    const separatorIndex =
      cookie.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const name = cookie
      .slice(0, separatorIndex)
      .trim();

    const value = cookie
      .slice(separatorIndex + 1)
      .trim();

    if (name === SESSION_COOKIE_NAME) {
      return decodeURIComponent(value);
    }
  }

  return undefined;
}

function createSessionCookie(
  token: string,
): string {
  const maxAge =
    60 * 60 * 24 * 30;

  const secure =
    env.nodeEnv === 'production'
      ? '; Secure'
      : '';

  return [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
    secure.replace('; ', ''),
  ]
    .filter(Boolean)
    .join('; ');
}

function createExpiredSessionCookie(): string {
  const secure =
    env.nodeEnv === 'production'
      ? '; Secure'
      : '';

  return [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    secure.replace('; ', ''),
  ]
    .filter(Boolean)
    .join('; ');
}

const logger = pino({
  level:
    env.nodeEnv === 'production'
      ? 'info'
      : 'debug',

  transport:
    env.nodeEnv !== 'production'
      ? {
          target: 'pino-pretty',
        }
      : undefined,
});

const app = express();

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  try {
    await apollo.start();

    logger.info(
      'Apollo Server started',
    );

    app.use(helmet());

    app.use(
      cors({
        origin: env.corsOrigin,
        credentials: true,
      }),
    );

    app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'ok',
        service: 'start-force-api',
        timestamp:
          new Date().toISOString(),
      });
    });

    app.use(
      '/graphql',
      express.json(),
      expressMiddleware(apollo, {
        context: async ({
          req,
          res,
        }) => {
          const sessionToken =
            getSessionToken(
              req.headers.cookie,
            );

          const setSessionCookie = (
            token: string,
          ) => {
            res.setHeader(
              'Set-Cookie',
              createSessionCookie(
                token,
              ),
            );
          };

          const clearSessionCookie =
            () => {
              res.setHeader(
                'Set-Cookie',
                createExpiredSessionCookie(),
              );
            };

          return {
            db,
            pool,
            sessionToken,
            setSessionCookie,
            clearSessionCookie,
          };
        },
      }),
    );

    const server = app.listen(
      env.port,
      () => {
        logger.info(
          `Start-force API running on http://localhost:${env.port}`,
        );

        logger.info(
          `GraphQL endpoint: http://localhost:${env.port}/graphql`,
        );
      },
    );

    const shutdown = async (
      signal: string,
    ) => {
      logger.info(
        `${signal} received. Shutting down...`,
      );

      server.close(async () => {
        try {
          await apollo.stop();
          await pool.end();

          logger.info(
            'Start-force API shut down cleanly',
          );

          process.exit(0);
        } catch (error) {
          logger.error(
            error,
            'Error during graceful shutdown',
          );

          process.exit(1);
        }
      });
    };

    process.on(
      'SIGINT',
      () => {
        void shutdown('SIGINT');
      },
    );

    process.on(
      'SIGTERM',
      () => {
        void shutdown('SIGTERM');
      },
    );
  } catch (error) {
    logger.fatal(
      error,
      'Failed to start Start-force API',
    );

    try {
      await apollo.stop();
      await pool.end();
    } catch {
      // Ignore cleanup errors.
    }

    process.exit(1);
  }
}

void startServer();