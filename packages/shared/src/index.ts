export type IdeaStage = 'IDEA' | 'RESEARCH' | 'PROTOTYPE' | 'MVP' | 'TRACTION' | 'GROWTH';
export type Visibility = 'PUBLIC' | 'VERIFIED' | 'TRUSTED' | 'CONFIDENTIAL';

export interface IdeaMetricSnapshot {
  innovationScore: number;
  validationScore: number;
  researchStrength: number;
  teamStrength: number;
  marketPotential: number;
  evidenceConfidence: number;
}
