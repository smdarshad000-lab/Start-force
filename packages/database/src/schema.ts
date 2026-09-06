import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: text('name').notNull(),

  email: text('email').notNull().unique(),

  passwordHash: text('password_hash').notNull(),

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
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  token: text('token').notNull().unique(),

  expiresAt: timestamp('expires_at', {
    withTimezone: true,
  }).notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const ideas = pgTable('ideas', {
  id: uuid('id').defaultRandom().primaryKey(),

  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  title: text('title').notNull(),

  description: text('description').notNull(),

  category: text('category').notNull(),

  stage: text('stage').notNull(),

  problemStatement: text('problem_statement').notNull(),

  targetUsers: text('target_users').notNull(),

  currentSolution: text('current_solution').notNull(),

  problemEvidence: text('problem_evidence').notNull(),

  solutionDescription: text('solution_description').notNull(),

  howItWorks: text('how_it_works').notNull(),

  uniqueValue: text('unique_value').notNull(),

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

export const researchItems = pgTable('research_items', {
  id: uuid('id').defaultRandom().primaryKey(),

  ideaId: uuid('idea_id')
    .notNull()
    .references(() => ideas.id, {
      onDelete: 'cascade',
    }),

  type: text('type').notNull(),

  title: text('title').notNull(),

  url: text('url'),

  source: text('source'),

  year: integer('year'),

  relevance: text('relevance').notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});