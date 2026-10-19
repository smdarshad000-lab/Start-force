import { sql } from 'drizzle-orm';

import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  unique,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('sessions_user_id_idx').on(table.userId),
]);

export type CollaborationNeed = {
  id: string;
  role: string;
  responsibilities: string;
  skills: string;
  openings: string;
  collaborationType: string;
};

export type ResourceNeed = {
  id: string;
  type: string;
  description: string;
};

export type Funding = {
  needsFunding: string;
  amount: string;
  type: string;
  purpose: string;
  resources: ResourceNeed[];
};

export const ideas = pgTable('ideas', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('DRAFT'),
  visibility: text('visibility').notNull().default('Private'),
  currentStep: integer('current_step').notNull().default(1),
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
  technologyApproach: text('technology_approach').notNull().default(''),
  technologyDomain: text('technology_domain').notNull().default(''),
  technologyReadiness: text('technology_readiness').notNull().default(''),
  requiredTechnology: text('required_technology').notNull().default(''),
  existingImplementation: text('existing_implementation').notNull().default(''),
  validationMethod: text('validation_method').notNull().default(''),
  validationAudience: text('validation_audience').notNull().default(''),
  validationSampleSize: text('validation_sample_size').notNull().default(''),
  validationFindings: text('validation_findings').notNull().default(''),
  validationEvidence: text('validation_evidence').notNull().default(''),
  collaborationNeeds: jsonb('collaboration_needs').$type<CollaborationNeed[]>().notNull().default([]),
  funding: jsonb('funding').$type<Funding>().notNull().default({
    needsFunding: '', amount: '', type: '', purpose: '', resources: [],
  }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('ideas_owner_updated_idx').on(table.ownerId, table.updatedAt),
  index('ideas_status_visibility_created_idx').on(table.status, table.visibility, table.createdAt),
  check('ideas_status_valid', sql`${table.status} IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')`),
  check('ideas_visibility_valid', sql`${table.visibility} IN ('Public', 'Private', 'Limited')`),
  check('ideas_stage_valid', sql`${table.stage} IN ('Research', 'Prototype', 'MVP', 'Startup')`),
  check('ideas_current_step_valid', sql`${table.currentStep} BETWEEN 1 AND 5`),
]);

export const researchItems = pgTable('research_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  ideaId: uuid('idea_id').notNull().references(() => ideas.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  url: text('url'),
  source: text('source'),
  year: integer('year'),
  relevance: text('relevance').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('research_items_idea_id_idx').on(table.ideaId),
]);

export const ideaAccess = pgTable('idea_access', {
  id: uuid('id').defaultRandom().primaryKey(),
  ideaId: uuid('idea_id').notNull().references(() => ideas.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('PENDING'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  unique('idea_access_idea_user_unique').on(table.ideaId, table.userId),
  index('idea_access_user_status_idx').on(table.userId, table.status),
  check('idea_access_status_valid', sql`${table.status} IN ('PENDING', 'APPROVED', 'REJECTED')`),
]);