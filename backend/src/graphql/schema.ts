import type { pool } from '../database.js';

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../auth/service.js';

type DatabasePool = typeof pool;

type DatabaseQueryClient = Pick<
  DatabasePool,
  'query'
>;

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

type ResearchInput = {
  type: string;
  title: string;
  url?: string | null;
  source?: string | null;
  year?: number | null;
  relevance: string;
};

type CollaborationNeedInput = {
  id?: string;
  role: string;
  responsibilities: string;
  skills: string;
  openings: string;
  collaborationType: string;
};

type ResourceNeedInput = {
  id?: string;
  type: string;
  description: string;
};

type FundingInput = {
  needsFunding: string;
  amount: string;
  type: string;
  purpose: string;
  resources: ResourceNeedInput[];
};

type SaveDraftInput = {
  ideaId?: string | null;
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

  technologyApproach: string;
  technologyDomain: string;
  technologyReadiness: string;
  requiredTechnology: string;
  existingImplementation: string;

  validationMethod: string;
  validationAudience: string;
  validationSampleSize: string;
  validationFindings: string;
  validationEvidence: string;

  research: ResearchInput[];

  collaborationNeeds: CollaborationNeedInput[];

  funding: FundingInput;

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

function normaliseFunding(
  funding: FundingInput | null | undefined,
) {
  return {
    needsFunding:
      funding?.needsFunding ?? '',

    amount:
      funding?.amount ?? '',

    type:
      funding?.type ?? '',

    purpose:
      funding?.purpose ?? '',

    resources:
      Array.isArray(
        funding?.resources,
      )
        ? funding!.resources.map(
            (resource) => ({
              id:
                resource.id ??
                crypto.randomUUID(),
              type:
                resource.type ?? '',
              description:
                resource.description ??
                '',
            }),
          )
        : [],
  };
}

async function getIdeaById(
  database: DatabaseQueryClient,
  ideaId: string,
) {
  const result = await database.query(
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

        technology_approach AS "technologyApproach",
        technology_domain AS "technologyDomain",
        technology_readiness AS "technologyReadiness",
        required_technology AS "requiredTechnology",
        existing_implementation AS "existingImplementation",

        validation_method AS "validationMethod",
        validation_audience AS "validationAudience",
        validation_sample_size AS "validationSampleSize",
        validation_findings AS "validationFindings",
        validation_evidence AS "validationEvidence",

        collaboration_needs AS "collaborationNeeds",
        funding,

        created_at AS "createdAt",
        updated_at AS "updatedAt"

      FROM ideas
      WHERE id = $1
      LIMIT 1
    `,
    [ideaId],
  );

  return result.rows[0] ?? null;
}

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
    ARCHIVED
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

  type ResearchItem {
    id: ID!
    type: String!
    title: String!
    url: String
    source: String
    year: Int
    relevance: String!
  }

  type ResourceNeed {
    id: ID!
    type: String!
    description: String!
  }

  type FundingData {
    needsFunding: String!
    amount: String!
    type: String!
    purpose: String!
    resources: [ResourceNeed!]!
  }

  type CollaborationNeed {
    id: ID!
    role: String!
    responsibilities: String!
    skills: String!
    openings: String!
    collaborationType: String!
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

    technologyApproach: String!
    technologyDomain: String!
    technologyReadiness: String!
    requiredTechnology: String!
    existingImplementation: String!

    validationMethod: String!
    validationAudience: String!
    validationSampleSize: String!
    validationFindings: String!
    validationEvidence: String!

    research: [ResearchItem!]!
    collaborationNeeds: [CollaborationNeed!]!
    funding: FundingData!

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

  input ResearchItemInput {
    type: String!
    title: String!
    url: String
    source: String
    year: Int
    relevance: String!
  }

  input CollaborationNeedInput {
    id: ID
    role: String!
    responsibilities: String!
    skills: String!
    openings: String!
    collaborationType: String!
  }

  input ResourceNeedInput {
    id: ID
    type: String!
    description: String!
  }

  input FundingInput {
    needsFunding: String!
    amount: String!
    type: String!
    purpose: String!
    resources: [ResourceNeedInput!]!
  }

  input SaveDraftInput {
    ideaId: ID

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

    technologyApproach: String!
    technologyDomain: String!
    technologyReadiness: String!
    requiredTechnology: String!
    existingImplementation: String!

    validationMethod: String!
    validationAudience: String!
    validationSampleSize: String!
    validationFindings: String!
    validationEvidence: String!

    research: [ResearchItemInput!]!

    collaborationNeeds: [CollaborationNeedInput!]!

    funding: FundingInput!

    currentStep: Int!
  }

  type Query {
    health: HealthStatus!
    databaseStatus: DatabaseStatus!
    currentUser: User
    myDraft: Idea
    myIdeas: [Idea!]!
    archivedIdeas: [Idea!]!
    users: [User!]!
    ideas: [Idea!]!
    idea(id: ID!): Idea
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    logout: Boolean!
    saveDraft(input: SaveDraftInput!): Idea!
    archiveIdea(id: ID!): Boolean!
    restoreIdea(id: ID!): Boolean!
  }
`;

export const resolvers = {
  Query: {
    health: () => ({
      status: 'ok',
      service: 'start-force-api',
      timestamp:
        new Date().toISOString(),
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

              technology_approach AS "technologyApproach",
              technology_domain AS "technologyDomain",
              technology_readiness AS "technologyReadiness",
              required_technology AS "requiredTechnology",
              existing_implementation AS "existingImplementation",

              validation_method AS "validationMethod",
              validation_audience AS "validationAudience",
              validation_sample_size AS "validationSampleSize",
              validation_findings AS "validationFindings",
              validation_evidence AS "validationEvidence",

              collaboration_needs AS "collaborationNeeds",
              funding,

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

    myIdeas: async (
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
        return [];
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

              technology_approach AS "technologyApproach",
              technology_domain AS "technologyDomain",
              technology_readiness AS "technologyReadiness",
              required_technology AS "requiredTechnology",
              existing_implementation AS "existingImplementation",

              validation_method AS "validationMethod",
              validation_audience AS "validationAudience",
              validation_sample_size AS "validationSampleSize",
              validation_findings AS "validationFindings",
              validation_evidence AS "validationEvidence",

              collaboration_needs AS "collaborationNeeds",
              funding,

              created_at AS "createdAt",
              updated_at AS "updatedAt"

            FROM ideas
            WHERE owner_id = $1
            ORDER BY updated_at DESC
          `,
          [currentUser.id],
        );

      return result.rows;
    },

    archivedIdeas: async (
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
        return [];
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

              technology_approach AS "technologyApproach",
              technology_domain AS "technologyDomain",
              technology_readiness AS "technologyReadiness",
              required_technology AS "requiredTechnology",
              existing_implementation AS "existingImplementation",

              validation_method AS "validationMethod",
              validation_audience AS "validationAudience",
              validation_sample_size AS "validationSampleSize",
              validation_findings AS "validationFindings",
              validation_evidence AS "validationEvidence",

              collaboration_needs AS "collaborationNeeds",
              funding,

              created_at AS "createdAt",
              updated_at AS "updatedAt"

            FROM ideas
            WHERE owner_id = $1
              AND status = 'ARCHIVED'
            ORDER BY updated_at DESC
          `,
          [currentUser.id],
        );

      return result.rows;
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

              technology_approach AS "technologyApproach",
              technology_domain AS "technologyDomain",
              technology_readiness AS "technologyReadiness",
              required_technology AS "requiredTechnology",
              existing_implementation AS "existingImplementation",

              validation_method AS "validationMethod",
              validation_audience AS "validationAudience",
              validation_sample_size AS "validationSampleSize",
              validation_findings AS "validationFindings",
              validation_evidence AS "validationEvidence",

              collaboration_needs AS "collaborationNeeds",
              funding,

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

              technology_approach AS "technologyApproach",
              technology_domain AS "technologyDomain",
              technology_readiness AS "technologyReadiness",
              required_technology AS "requiredTechnology",
              existing_implementation AS "existingImplementation",

              validation_method AS "validationMethod",
              validation_audience AS "validationAudience",
              validation_sample_size AS "validationSampleSize",
              validation_findings AS "validationFindings",
              validation_evidence AS "validationEvidence",

              collaboration_needs AS "collaborationNeeds",
              funding,

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

    archiveIdea: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      const currentUser =
        await getCurrentUser(
          context.pool,
          context.sessionToken,
        );

      if (!currentUser) {
        throw new Error(
          'You must be signed in to archive an idea.',
        );
      }

      const result =
        await context.pool.query(
          `
            UPDATE ideas
            SET
              status = 'ARCHIVED',
              updated_at = NOW()
            WHERE id = $1
              AND owner_id = $2
              AND status <> 'ARCHIVED'
          `,
          [args.id, currentUser.id],
        );

      if (!result.rowCount) {
        throw new Error(
          'Idea not found or it has already been archived.',
        );
      }

      return true;
    },

    restoreIdea: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      const currentUser =
        await getCurrentUser(
          context.pool,
          context.sessionToken,
        );

      if (!currentUser) {
        throw new Error(
          'You must be signed in to restore an idea.',
        );
      }

      const result =
        await context.pool.query(
          `
            UPDATE ideas
            SET
              status = 'DRAFT',
              updated_at = NOW()
            WHERE id = $1
              AND owner_id = $2
              AND status = 'ARCHIVED'
          `,
          [args.id, currentUser.id],
        );

      if (!result.rowCount) {
        throw new Error(
          'Archived idea not found or it is already active.',
        );
      }

      return true;
    },

    saveDraft: async (
      _parent: unknown,
      args: {
        input: SaveDraftInput;
      },
      context: GraphQLContext,
    ) => {
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

      const funding =
        normaliseFunding(
          input.funding,
        );

      /*
       * We use one database connection so
       * the idea and research records are
       * saved together.
       */
      const client =
        await context.pool.connect();

      try {
        await client.query(
          'BEGIN',
        );

        let ideaId: string;

        if (input.ideaId) {
          const ownership =
            await client.query(
              `
                SELECT id
                FROM ideas
                WHERE id = $1
                  AND owner_id = $2
                LIMIT 1
              `,
              [
                input.ideaId,
                currentUser.id,
              ],
            );

          if (!ownership.rows[0]?.id) {
            throw new Error(
              'This idea does not exist or does not belong to your account.',
            );
          }

          const archivedCheck =
            await client.query(
              `
                SELECT status
                FROM ideas
                WHERE id = $1
                  AND owner_id = $2
                LIMIT 1
              `,
              [input.ideaId, currentUser.id],
            );

          if (
            archivedCheck.rows[0]?.status ===
            'ARCHIVED'
          ) {
            throw new Error(
              'This idea is archived and cannot be edited.',
            );
          }

          ideaId = String(
            ownership.rows[0].id,
          );

          const updateResult =
            await client.query(
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

                  technology_approach = $13,
                  technology_domain = $14,
                  technology_readiness = $15,
                  required_technology = $16,
                  existing_implementation = $17,

                  validation_method = $18,
                  validation_audience = $19,
                  validation_sample_size = $20,
                  validation_findings = $21,
                  validation_evidence = $22,

                  collaboration_needs = $23,
                  funding = $24,

                  updated_at = NOW()

                WHERE id = $25
                  AND owner_id = $26
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

                input.technologyApproach.trim(),
                input.technologyDomain.trim(),
                input.technologyReadiness.trim(),
                input.requiredTechnology.trim(),
                input.existingImplementation.trim(),

                input.validationMethod.trim(),
                input.validationAudience.trim(),
                input.validationSampleSize.trim(),
                input.validationFindings.trim(),
                input.validationEvidence.trim(),

                input.collaborationNeeds,
                funding,

                ideaId,
                currentUser.id,
              ],
            );

          if (!updateResult.rowCount) {
            throw new Error(
              'Unable to update your idea.',
            );
          }
        } else {
          const insertResult =
            await client.query(
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
                  unique_value,

                  technology_approach,
                  technology_domain,
                  technology_readiness,
                  required_technology,
                  existing_implementation,

                  validation_method,
                  validation_audience,
                  validation_sample_size,
                  validation_findings,
                  validation_evidence,

                  collaboration_needs,
                  funding
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
                  $13,

                  $14,
                  $15,
                  $16,
                  $17,
                  $18,

                  $19,
                  $20,
                  $21,
                  $22,
                  $23,

                  $24,
                  $25
                )

                RETURNING id
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

                input.technologyApproach.trim(),
                input.technologyDomain.trim(),
                input.technologyReadiness.trim(),
                input.requiredTechnology.trim(),
                input.existingImplementation.trim(),

                input.validationMethod.trim(),
                input.validationAudience.trim(),
                input.validationSampleSize.trim(),
                input.validationFindings.trim(),
                input.validationEvidence.trim(),

                input.collaborationNeeds,
                funding,
              ],
            );

          if (!insertResult.rows[0]?.id) {
            throw new Error(
              'Unable to create your idea.',
            );
          }

          ideaId = String(
            insertResult.rows[0].id,
          );
        }

        /*
         * Replace this idea's research rows
         * with the latest version.
         */
        await client.query(
          `
            DELETE FROM research_items
            WHERE idea_id = $1
          `,
          [ideaId],
        );

        for (
          const item of input.research
        ) {
          await client.query(
            `
              INSERT INTO research_items (
                idea_id,
                type,
                title,
                url,
                source,
                year,
                relevance
              )
              VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7
              )
            `,
            [
              ideaId,
              item.type.trim(),
              item.title.trim(),
              item.url?.trim() || null,
              item.source?.trim() || null,
              item.year ?? null,
              item.relevance.trim(),
            ],
          );
        }

        const savedIdea =
          await getIdeaById(
            client,
            ideaId,
          );

        if (!savedIdea) {
          throw new Error(
            'The idea was saved, but could not be loaded again.',
          );
        }

        await client.query(
          'COMMIT',
        );

        return savedIdea;
      } catch (error) {
        await client.query(
          'ROLLBACK',
        );

        throw error;
      } finally {
        client.release();
      }
    },
  },

  Idea: {
    createdAt: (
      idea: {
        createdAt: unknown;
      },
    ) =>
      formatDate(
        idea.createdAt,
      ),

    updatedAt: (
      idea: {
        updatedAt: unknown;
      },
    ) =>
      formatDate(
        idea.updatedAt,
      ),

    research: async (
      idea: {
        id: string;
      },
      _args: unknown,
      context: GraphQLContext,
    ) => {
      const result =
        await context.pool.query(
          `
            SELECT
              id,
              type,
              title,
              url,
              source,
              year,
              relevance
            FROM research_items
            WHERE idea_id = $1
            ORDER BY created_at ASC
          `,
          [idea.id],
        );

      return result.rows;
    },

    collaborationNeeds: (
      idea: {
        collaborationNeeds:
          | unknown
          | null;
      },
    ) =>
      Array.isArray(
        idea.collaborationNeeds,
      )
        ? idea.collaborationNeeds
        : [],

    funding: (
      idea: {
        funding:
          | unknown
          | null;
      },
    ) =>
      idea.funding ?? {
        needsFunding: '',
        amount: '',
        type: '',
        purpose: '',
        resources: [],
      },
  },

  User: {
    createdAt: (
      user: {
        createdAt: unknown;
      },
    ) =>
      formatDate(
        user.createdAt,
      ),

    updatedAt: (
      user: {
        updatedAt: unknown;
      },
    ) =>
      formatDate(
        user.updatedAt,
      ),
  },
};