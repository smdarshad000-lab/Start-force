export const schema = {
  status: text('status')
    .notNull()
    .default('DRAFT'),

  visibility: text('visibility')
    .notNull()
    .default('Private'),

  currentStep: integer('current_step')
    .notNull()
    .default(1),
};