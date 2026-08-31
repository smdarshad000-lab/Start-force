import {
  createDatabase,
  ideas,
  users,
} from '@stat-force/database';

type Database = ReturnType<typeof createDatabase>['db'];

type GraphQLContext = {
  db: Database;
};

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

  input CreateUserInput {
    name: String!
    email: String!
  }

  input CreateIdeaInput {
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
  }

  type Query {
    health: HealthStatus!
    databaseStatus: DatabaseStatus!
    users: [User!]!
    ideas: [Idea!]!
    idea(id: ID!): Idea
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
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
      const usersResult = await context.db.execute(
        'SELECT COUNT(*)::int AS count FROM users',
      );

      const ideasResult = await context.db.execute(
        'SELECT COUNT(*)::int AS count FROM ideas',
      );

      return {
        connected: true,
        usersCount: Number(usersResult.rows[0].count),
        ideasCount: Number(ideasResult.rows[0].count),
      };
    },

    users: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      return context.db.select().from(users);
    },

    ideas: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      return context.db.select().from(ideas);
    },

    idea: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      const result = await context.db.execute(
        'SELECT * FROM ideas WHERE id = $1 LIMIT 1',
        [args.id],
      );

      return result.rows[0] ?? null;
    },
  },

  Mutation: {
    createUser: async (
      _parent: unknown,
      args: {
        input: {
          name: string;
          email: string;
        };
      },
      context: GraphQLContext,
    ) => {
      const name = args.input.name.trim();
      const email = args.input.email.trim().toLowerCase();

      if (name.length < 2) {
        throw new Error(
          'Name must contain at least 2 characters.',
        );
      }

      if (!email.includes('@')) {
        throw new Error(
          'A valid email address is required.',
        );
      }

      const existingUser = await context.db.execute(
        'SELECT id FROM users WHERE email = $1 LIMIT 1',
        [email],
      );

      if (existingUser.rows.length > 0) {
        throw new Error(
          'A user with this email already exists.',
        );
      }

      const result = await context.db.execute(
        `
          INSERT INTO users (name, email)
          VALUES ($1, $2)
          RETURNING id, name, email, created_at AS "createdAt"
        `,
        [name, email],
      );

      return result.rows[0];
    },

    createIdea: async (
      _parent: unknown,
      args: {
        input: {
          ownerId: string;
          title: string;
          description: string;
          category: string;
          stage:
            | 'IDEA'
            | 'RESEARCH'
            | 'PROTOTYPE'
            | 'MVP'
            | 'TRACTION'
            | 'GROWTH';
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
      const input = args.input;

      const fields = {
        title: input.title,
        description: input.description,
        category: input.category,
        problemStatement: input.problemStatement,
        targetUsers: input.targetUsers,
        currentSolution: input.currentSolution,
        problemEvidence: input.problemEvidence,
        solutionDescription: input.solutionDescription,
        howItWorks: input.howItWorks,
        uniqueValue: input.uniqueValue,
      };

      for (const [field, value] of Object.entries(fields)) {
        if (value.trim() === '') {
          throw new Error(`${field} is required.`);
        }
      }

      const owner = await context.db.execute(
        'SELECT id FROM users WHERE id = $1 LIMIT 1',
        [input.ownerId],
      );

      if (owner.rows.length === 0) {
        throw new Error(
          'The specified owner does not exist.',
        );
      }

      const result = await context.db.execute(
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
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12
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
          input.ownerId,
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
    createdAt: (user: { createdAt: Date }) =>
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
  },

  Idea: {
    createdAt: (idea: { createdAt: Date }) =>
      idea.createdAt instanceof Date
        ? idea.createdAt.toISOString()
        : idea.createdAt,

    updatedAt: (idea: { updatedAt: Date }) =>
      idea.updatedAt instanceof Date
        ? idea.updatedAt.toISOString()
        : idea.updatedAt,
  },
};