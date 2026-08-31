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

const logger = pino({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
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
    // Start Apollo GraphQL server
    await apollo.start();

    logger.info('Apollo Server started');

    // Security middleware
    app.use(helmet());

    // CORS configuration
    app.use(
      cors({
        origin: env.corsOrigin,
        credentials: true,
      }),
    );

    // Health endpoint
    app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'ok',
        service: 'start-force-api',
        timestamp: new Date().toISOString(),
      });
    });

    // GraphQL endpoint
    app.use(
      '/graphql',
      express.json(),
      expressMiddleware(apollo, {
        context: async () => ({
          db,
        }),
      }),
    );

    // Start HTTP server
    const server = app.listen(env.port, () => {
      logger.info(
        `Start-force API running on http://localhost:${env.port}`,
      );

      logger.info(
        `GraphQL endpoint: http://localhost:${env.port}/graphql`,
      );
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down...`);

      server.close(async () => {
        try {
          await apollo.stop();
          await pool.end();

          logger.info('Start-force API shut down cleanly');
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

    process.on('SIGINT', () => {
      void shutdown('SIGINT');
    });

    process.on('SIGTERM', () => {
      void shutdown('SIGTERM');
    });
  } catch (error) {
    logger.fatal(
      error,
      'Failed to start Start-force API',
    );

    try {
      await apollo.stop();
      await pool.end();
    } catch {
      // Ignore cleanup errors during failed startup.
    }

    process.exit(1);
  }
}

void startServer();