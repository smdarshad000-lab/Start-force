import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import {
  ApolloServer,
} from '@apollo/server';
import {
  expressMiddleware,
} from '@as-integrations/express5';

import { env } from './config/env.js';
import {
  db,
  pool,
} from './database.js';

import {
  SESSION_COOKIE_NAME,
} from './auth/session.js';

import {
  typeDefs,
  resolvers,
} from './graphql/schema.js';

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

const apollo =
  new ApolloServer({
    typeDefs,
    resolvers,
  });

await apollo.start();

logger.info(
  'Apollo Server started',
);

app.use(
  helmet(),
);

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);

app.get(
  '/health',
  (
    _req,
    res,
  ) => {
    res.json({
      status: 'ok',
      service: 'start-force-api',
      timestamp:
        new Date().toISOString(),
    });
  },
);

app.use(
  '/graphql',
  express.json(),

  expressMiddleware(
    apollo,
    {
      context: async ({
        req,
        res,
      }) => {
        const sessionToken =
          req.headers.cookie
            ?.split(';')
            .map(
              (value) =>
                value.trim(),
            )
            .find(
              (value) =>
                value.startsWith(
                  `${SESSION_COOKIE_NAME}=`,
                ),
            )
            ?.split('=')
            .slice(1)
            .join('=') ??
          undefined;

        return {
          db,
          pool,
          sessionToken,

          setSessionCookie: (
            token: string,
          ) => {
            res.cookie(
              SESSION_COOKIE_NAME,
              token,
              {
                httpOnly: true,
                sameSite: 'lax',
                secure:
                  env.nodeEnv ===
                  'production',
                path: '/',
                maxAge:
                  1000 *
                  60 *
                  60 *
                  24 *
                  30,
              },
            );
          },

          clearSessionCookie: () => {
            res.clearCookie(
              SESSION_COOKIE_NAME,
              {
                httpOnly: true,
                sameSite: 'lax',
                secure:
                  env.nodeEnv ===
                  'production',
                path: '/',
              },
            );
          },
        };
      },
    },
  ),
);

app.listen(
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