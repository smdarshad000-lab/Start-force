import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { env } from './config/env.js';
import { typeDefs, resolvers } from './graphql/schema.js';

const logger = pino({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  transport: env.nodeEnv !== 'production' ? { target: 'pino-pretty' } : undefined,
});

const app = express();
const apollo = new ApolloServer({ typeDefs, resolvers });

try {
  await apollo.start();
  logger.info('Apollo Server started');
} catch (err) {
  logger.fatal(err, 'Failed to start Apollo Server');
  process.exit(1);
}

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'stat-force-api', timestamp: new Date().toISOString() });
});

app.use('/graphql', express.json(), expressMiddleware(apollo));

app.listen(env.port, () => {
  logger.info(`Stat-force API running on http://localhost:${env.port}`);
  logger.info(`GraphQL endpoint: http://localhost:${env.port}/graphql`);
});
