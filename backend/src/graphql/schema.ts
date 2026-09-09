import type { pool } from '../database.js';

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../auth/service.js';

type DatabasePool = typeof pool;

type GraphQLContext = {
  pool: DatabasePool;
  sessionToken?: string;
  setSessionCookie?: (token: string) => void;
  clearSessionCookie?: () => void;
};

type IdeaStage =
  | 'Research'
  | 'Prototype'
  | 'MVP'
  | 'Startup';

type SaveDraftInput = {
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
  currentStep: number;
};

function formatDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function validateStep(value: number): number {
  if (
    !Number.isInteger(value) ||
    value < 1 ||
    value > 5
  ) {
    return 1;
  }

  return value;
}

/*
 * IMPORTANT:
 * These are explicitly exported because both
 * server.ts and schema.test.ts import them.
 */
export const typeDefs = `

  enum IdeaStage {
    Research
    Prototype
    MVP
    Startup
  }

  enum IdeaStatus {
    DRAFT
    PUBLISHED
  }

  enum Visibility {
    Public
    Limited
    Private
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
    status: IdeaStatus!
    currentStep: Int!

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

  input SaveDraftInput {
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

    currentStep: Int!
  }

  type Query {
    health: HealthStatus!

    databaseStatus: DatabaseStatus!

    currentUser: User

    myDraft: Idea

    users: [User!]!

    ideas: [Idea!]!

    idea(id: ID!): Idea
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!

    login(input: LoginInput!): AuthPayload!

    logout: Boolean!

    saveDraft(input: SaveDraftInput!): Idea!
  }
`;

/*
 * GraphQL resolvers.
 *
 * This object is also explicitly exported because
 * server.ts and schema.test.ts import it.
 */
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

    myDraft: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      const currentUser =
        await getCurrentUser(
          context.pool,
          context.sessionToken,
        );

      if (!currentUser) {
        return null;
      }

      const result =
        await context.pool.query(
          `
            SELECT
              id,
              owner_id AS "ownerId",
              status,
              current_step AS "currentStep",

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

            WHERE owner_id = $1
              AND status = 'DRAFT'

            ORDER BY updated_at DESC

            LIMIT 1
          `,
          [currentUser.id],
        );

      return result.rows[0] ?? null;
    },

    users: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      const result =
        await context.pool.query(
          `
            SELECT
              id,
              name,
              email,
              created_at AS "createdAt",
              updated_at AS "updatedAt"
            FROM users
            ORDER BY created_at ASC
          `,
        );

      return result.rows;
    },

    ideas: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      const result =
        await context.pool.query(
          `
            SELECT
              id,
              owner_id AS "ownerId",
              status,
              current_step AS "currentStep",

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

            ORDER BY created_at DESC
          `,
        );

      return result.rows;
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
              status,
              current_step AS "currentStep",

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

    saveDraft: async (
      _parent: unknown,
      args: {
        input: SaveDraftInput;
      },
      context: GraphQLContext,
    ) => {
      /*
       * Never trust ownerId from the frontend.
       *
       * The owner always comes from the
       * authenticated session.
       */
      const currentUser =
        await getCurrentUser(
          context.pool,
          context.sessionToken,
        );

      if (!currentUser) {
        throw new Error(
          'You must be signed in to save a draft.',
        );
      }

      const input = args.input;

      const currentStep =
        validateStep(
          input.currentStep,
        );

      /*
       * Check whether this user already
       * has a draft.
       */
      const existing =
        await context.pool.query(
          `
            SELECT id

            FROM ideas

            WHERE owner_id = $1
              AND status = 'DRAFT'

            ORDER BY updated_at DESC

            LIMIT 1
          `,
          [currentUser.id],
        );

      /*
       * Existing draft:
       * update the same row.
       */
      if (existing.rows[0]?.id) {
        const result =
          await context.pool.query(
            `
              UPDATE ideas

              SET
                current_step = $1,

                title = $2,
                description = $3,
                category = $4,
                stage = $5,

                problem_statement = $6,
                target_users = $7,
                current_solution = $8,
                problem_evidence = $9,

                solution_description = $10,
                how_it_works = $11,
                unique_value = $12,

                updated_at = NOW()

              WHERE id = $13
                AND owner_id = $14
                AND status = 'DRAFT'

              RETURNING
                id,
                owner_id AS "ownerId",
                status,
                current_step AS "currentStep",

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
              currentStep,

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

              existing.rows[0].id,
              currentUser.id,
            ],
          );

        if (!result.rows[0]) {
          throw new Error(
            'Unable to update your draft.',
          );
        }

        return result.rows[0];
      }

      /*
       * No existing draft:
       * create one.
       */
      const result =
        await context.pool.query(
          `
            INSERT INTO ideas (
              owner_id,
              status,
              current_step,

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
              'DRAFT',
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
              $12,
              $13
            )

            RETURNING
              id,
              owner_id AS "ownerId",
              status,
              current_step AS "currentStep",

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
            currentStep,

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

      if (!result.rows[0]) {
        throw new Error(
          'Unable to create your draft.',
        );
      }

      return result.rows[0];
    },
  },

  User: {
    createdAt: (
      user: {
        createdAt: unknown;
      },
    ) => formatDate(user.createdAt),

    updatedAt: (
      user: {
        updatedAt: unknown;
      },
    ) => formatDate(user.updatedAt),
  },

  Idea: {
    createdAt: (
      idea: {
        createdAt: unknown;
      },
    ) => formatDate(idea.createdAt),

    updatedAt: (
      idea: {
        updatedAt: unknown;
      },
    ) => formatDate(idea.updatedAt),
  },
};