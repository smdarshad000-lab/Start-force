import { describe, it, expect } from 'vitest';
import { typeDefs, resolvers } from '../graphql/schema.js';

describe('GraphQL schema', () => {
  it('should have a health query in typeDefs', () => {
    expect(typeDefs).toContain('health: HealthStatus!');
  });

  it('should return a valid health status from resolver', () => {
    const result = resolvers.Query.health();
    expect(result).toMatchObject({
      status: 'ok',
      service: 'stat-force-api',
    });
    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp).getTime()).not.toBeNaN();
  });

  it('should include IdeaStage enum in schema', () => {
    expect(typeDefs).toContain('enum IdeaStage');
    expect(typeDefs).toContain('IDEA');
    expect(typeDefs).toContain('GROWTH');
  });

  it('should include Visibility enum in schema', () => {
    expect(typeDefs).toContain('enum Visibility');
    expect(typeDefs).toContain('PUBLIC');
    expect(typeDefs).toContain('CONFIDENTIAL');
  });

  it('should include IdeaMetricSnapshot type in schema', () => {
    expect(typeDefs).toContain('type IdeaMetricSnapshot');
    expect(typeDefs).toContain('innovationScore: Float!');
  });
});
