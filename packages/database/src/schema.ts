import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id')
    .defaultRandom()
    .primaryKey(),

  name: text('name')
    .notNull(),

  email: text('email')
    .notNull()
    .unique(),

  passwordHash: text('password_hash')
    .notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id')
    .defaultRandom()
    .primaryKey(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  token: text('token')
    .notNull()
    .unique(),

  expiresAt: timestamp('expires_at', {
    withTimezone: true,
  })
    .notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const ideas = pgTable('ideas', {
  id: uuid('id')
    .defaultRandom()
    .primaryKey(),

  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  status: text('status')
    .notNull()
    .default('DRAFT'),

  currentStep: integer('current_step')
    .notNull()
    .default(1),

  /*
   * Core idea
   */
  title: text('title')
    .notNull(),

  description: text('description')
    .notNull(),

  category: text('category')
    .notNull(),

  stage: text('stage')
    .notNull(),

  /*
   * Problem
   */
  problemStatement: text('problem_statement')
    .notNull(),

  targetUsers: text('target_users')
    .notNull(),

  currentSolution: text('current_solution')
    .notNull(),

  problemEvidence: text('problem_evidence')
    .notNull(),

  /*
   * Solution
   */
  solutionDescription: text('solution_description')
    .notNull(),

  howItWorks: text('how_it_works')
    .notNull(),

  uniqueValue: text('unique_value')
    .notNull(),

  /*
   * Technology
   */
  technologyApproach: text('technology_approach')
    .notNull()
    .default(''),

  technologyDomain: text('technology_domain')
    .notNull()
    .default(''),

  technologyReadiness: text('technology_readiness')
    .notNull()
    .default(''),

  requiredTechnology: text('required_technology')
    .notNull()
    .default(''),

  existingImplementation: text('existing_implementation')
    .notNull()
    .default(''),

  /*
   * Validation
   */
  validationMethod: text('validation_method')
    .notNull()
    .default(''),

  validationAudience: text('validation_audience')
    .notNull()
    .default(''),

  validationSampleSize: text('validation_sample_size')
    .notNull()
    .default(''),

  validationFindings: text('validation_findings')
    .notNull()
    .default(''),

  validationEvidence: text('validation_evidence')
    .notNull()
    .default(''),

  /*
   * Collaboration
   *
   * Stored as JSON because a draft can have
   * multiple collaboration needs.
   */
  collaborationNeeds: jsonb('collaboration_needs')
    .$type<
      Array<{
        id: string;
        role: string;
        responsibilities: string;
        skills: string;
        openings: string;
        collaborationType: string;
      }>
    >()
    .notNull()
    .default([]),

  /*
   * Funding and non-financial resources.
   *
   * Stored as JSON because FundingData contains
   * a variable-length resources array.
   */
  funding: jsonb('funding')
    .$type<{
      needsFunding: string;
      amount: string;
      type: string;
      purpose: string;
      resources: Array<{
        id: string;
        type: string;
        description: string;
      }>;
    }>()
    .notNull()
    .default({
      needsFunding: '',
      amount: '',
      type: '',
      purpose: '',
      resources: [],
    }),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const researchItems = pgTable(
  'research_items',
  {
    id: uuid('id')
      .defaultRandom()
      .primaryKey(),

    ideaId: uuid('idea_id')
      .notNull()
      .references(() => ideas.id, {
        onDelete: 'cascade',
      }),

    type: text('type')
      .notNull(),

    title: text('title')
      .notNull(),

    url: text('url'),

    source: text('source'),

    year: integer('year'),

    relevance: text('relevance')
      .notNull(),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
);