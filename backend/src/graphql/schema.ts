import {
  createDatabase,
  ideas,
  users,
} from '@stat-force/database';

import type { pool } from '../database.js';

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../auth/service.js';

type Database = ReturnType<
  typeof createDatabase
>['db'];

type DatabasePool = typeof pool;

type GraphQLContext = {
  db: Database;
  pool: DatabasePool;
  sessionToken?: string;
  setSessionCookie?: (token: string) => void;
  clearSessionCookie?: () => void;
};

type IdeaStage =
  | 'IDEA'
  | 'RESEARCH'
  | 'PROTOTYPE'
  | 'MVP'
  | 'TRACTION'
  | 'GROWTH';

export const typeDefs = `
  enum IdeaStage {
    IDEA
    RESEARCH
    PROTOTYPE
    MVP
    TRACTION
    GROWTH
  }

  enum Visibility {
    PUBLIC
    VERIFIED
    TRUSTED
    CONFIDENTIAL
  }

  type IdeaMetricSnapshot {
    innovationScore: Float!
    validationScore: Float!
    researchStrength: Float!
    teamStrength: Float!
    marketPotential: Float!
    evidenceConfidence: Float!
  }

  type HealthStatus {
    status: String!
    service: String!
    timestamp: String!
  }

  type DatabaseStatus {
    connected: Boolean!
    usersCount: Int!
    ideasCount: Int!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    user: User!
  }

  type Idea {
    id: ID!
    ownerId: ID!
    title: String!
    description: String!
    category: String!
    stage: IdeaStage!
    problemStatement: String!
    targetUsers: String!
    currentSolution: String!
    problemEvidence: String!
    solutionDescription: String!
    howItWorks: String!
    uniqueValue: String!
    createdAt: String!
    updatedAt: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateIdeaInput {
    title: String!
    description: String!
    category: String!
    stage: IdeaStage!
    problemStatement: String!
    targetUsers: String!
    currentSolution: String!
    problemEvidence: String!
    solutionDescription: String!
    howItWorks: String!
    uniqueValue: String!
  }

  type Query {
    health: HealthStatus!

    databaseStatus: DatabaseStatus!

    currentUser: User

    users: [User!]!

    ideas: [Idea!]!

    idea(id: ID!): Idea
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!

    login(input: LoginInput!): AuthPayload!

    logout: Boolean!

    createIdea(input: CreateIdeaInput!): Idea!
  }
`;

export const resolvers = {
  Query: {
    health: () => ({
      status: 'ok',
      service: 'start-force-api',
      timestamp: new Date().toISOString(),
    }),

    databaseStatus: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      const usersResult =
        await context.pool.query(
          'SELECT COUNT(*)::int AS count FROM users',
        );

      const ideasResult =
        await context.pool.query(
          'SELECT COUNT(*)::int AS count FROM ideas',
        );

      return {
        connected: true,
        usersCount: Number(
          usersResult.rows[0]?.count ?? 0,
        ),
        ideasCount: Number(
          ideasResult.rows[0]?.count ?? 0,
        ),
      };
    },

    currentUser: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      return getCurrentUser(
        context.pool,
        context.sessionToken,
      );
    },

    users: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      return context.db
        .select()
        .from(users);
    },

    ideas: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      return context.db
        .select()
        .from(ideas);
    },

    idea: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      const result =
        await context.pool.query(
          `
            SELECT
              id,
              owner_id AS "ownerId",
              title,
              description,
              category,
              stage,
              problem_statement AS "problemStatement",
              target_users AS "targetUsers",
              current_solution AS "currentSolution",
              problem_evidence AS "problemEvidence",
              solution_description AS "solutionDescription",
              how_it_works AS "howItWorks",
              unique_value AS "uniqueValue",
              created_at AS "createdAt",
              updated_at AS "updatedAt"
            FROM ideas
            WHERE id = $1
            LIMIT 1
          `,
          [args.id],
        );

      return result.rows[0] ?? null;
    },
  },

  Mutation: {
    register: async (
      _parent: unknown,
      args: {
        input: {
          name: string;
          email: string;
          password: string;
        };
      },
      context: GraphQLContext,
    ) => {
      const result =
        await registerUser(
          context.pool,
          args.input,
        );

      context.setSessionCookie?.(
        result.session.token,
      );

      return {
        user: result.user,
      };
    },

    login: async (
      _parent: unknown,
      args: {
        input: {
          email: string;
          password: string;
        };
      },
      context: GraphQLContext,
    ) => {
      const result =
        await loginUser(
          context.pool,
          args.input,
        );

      context.setSessionCookie?.(
        result.session.token,
      );

      return {
        user: result.user,
      };
    },

    logout: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      await logoutUser(
        context.pool,
        context.sessionToken,
      );

      context.clearSessionCookie?.();

      return true;
    },

    createIdea: async (
      _parent: unknown,
      args: {
        input: {
          title: string;
          description: string;
          category: string;
          stage: IdeaStage;
          problemStatement: string;
          targetUsers: string;
          currentSolution: string;
          problemEvidence: string;
          solutionDescription: string;
          howItWorks: string;
          uniqueValue: string;
        };
      },
      context: GraphQLContext,
    ) => {
      /*
       * The owner is determined by the authenticated
       * session. The client does NOT provide ownerId.
       */
      const currentUser =
        await getCurrentUser(
          context.pool,
          context.sessionToken,
        );

      if (!currentUser) {
        throw new Error(
          'You must be signed in to create an idea.',
        );
      }

      const input = args.input;

      const fields = {
        title: input.title,
        description: input.description,
        category: input.category,
        problemStatement:
          input.problemStatement,
        targetUsers:
          input.targetUsers,
        currentSolution:
          input.currentSolution,
        problemEvidence:
          input.problemEvidence,
        solutionDescription:
          input.solutionDescription,
        howItWorks:
          input.howItWorks,
        uniqueValue:
          input.uniqueValue,
      };

      for (const [field, value] of Object.entries(
        fields,
      )) {
        if (value.trim() === '') {
          throw new Error(
            `${field} is required.`,
          );
        }
      }

      const result =
        await context.pool.query(
          `
            INSERT INTO ideas (
              owner_id,
              title,
              description,
              category,
              stage,
              problem_statement,
              target_users,
              current_solution,
              problem_evidence,
              solution_description,
              how_it_works,
              unique_value
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              $7,
              $8,
              $9,
              $10,
              $11,
              $12
            )
            RETURNING
              id,
              owner_id AS "ownerId",
              title,
              description,
              category,
              stage,
              problem_statement AS "problemStatement",
              target_users AS "targetUsers",
              current_solution AS "currentSolution",
              problem_evidence AS "problemEvidence",
              solution_description AS "solutionDescription",
              how_it_works AS "howItWorks",
              unique_value AS "uniqueValue",
              created_at AS "createdAt",
              updated_at AS "updatedAt"
          `,
          [
            currentUser.id,
            input.title.trim(),
            input.description.trim(),
            input.category.trim(),
            input.stage,
            input.problemStatement.trim(),
            input.targetUsers.trim(),
            input.currentSolution.trim(),
            input.problemEvidence.trim(),
            input.solutionDescription.trim(),
            input.howItWorks.trim(),
            input.uniqueValue.trim(),
          ],
        );

      return result.rows[0];
    },
  },

  User: {
    createdAt: (
      user: {
        createdAt: Date | string;
      },
    ) =>
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,

    updatedAt: (
      user: {
        updatedAt: Date | string;
      },
    ) =>
      user.updatedAt instanceof Date
        ? user.updatedAt.toISOString()
        : user.updatedAt,
  },

  Idea: {
    createdAt: (
      idea: {
        createdAt: Date | string;
      },
    ) =>
      idea.createdAt instanceof Date
        ? idea.createdAt.toISOString()
        : idea.createdAt,

    updatedAt: (
      idea: {
        updatedAt: Date | string;
      },
    ) =>
      idea.updatedAt instanceof Date
        ? idea.updatedAt.toISOString()
        : idea.updatedAt,
  },
};