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

  type Query {
    health: HealthStatus!
  }
`;

export const resolvers = {
  Query: {
    health: () => ({
      status: 'ok',
      service: 'stat-force-api',
      timestamp: new Date().toISOString(),
    }),
  },
};
