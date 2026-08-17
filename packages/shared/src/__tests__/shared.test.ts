import { describe, it, expect } from 'vitest';
import type { IdeaStage, Visibility, IdeaMetricSnapshot } from '../index';

describe('shared types', () => {
  it('should have IdeaStage as a string union type', () => {
    const stage: IdeaStage = 'IDEA';
    expect(['IDEA', 'RESEARCH', 'PROTOTYPE', 'MVP', 'TRACTION', 'GROWTH']).toContain(stage);
  });

  it('should have Visibility as a string union type', () => {
    const vis: Visibility = 'PUBLIC';
    expect(['PUBLIC', 'VERIFIED', 'TRUSTED', 'CONFIDENTIAL']).toContain(vis);
  });

  it('should define IdeaMetricSnapshot interface shape', () => {
    const snapshot: IdeaMetricSnapshot = {
      innovationScore: 85,
      validationScore: 72,
      researchStrength: 60,
      teamStrength: 90,
      marketPotential: 78,
      evidenceConfidence: 65,
    };
    expect(typeof snapshot.innovationScore).toBe('number');
    expect(typeof snapshot.validationScore).toBe('number');
    expect(typeof snapshot.researchStrength).toBe('number');
    expect(typeof snapshot.teamStrength).toBe('number');
    expect(typeof snapshot.marketPotential).toBe('number');
    expect(typeof snapshot.evidenceConfidence).toBe('number');
  });
});
