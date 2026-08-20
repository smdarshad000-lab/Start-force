export type Idea = {
  id: string;
  title: string;
  category: string;
  stage: string;
  description: string;
  innovation: number;
  marketPotential: number;
  validation: number;
  teamStrength: number;
  researchers: number;
  contributors: number;
  funding: string;
};

export const ideas: Idea[] = [
  {
    id: '1',
    title: 'AI Crop Disease Detection',
    category: 'Agritech',
    stage: 'Prototype',
    description:
      'A computer-vision platform that helps farmers identify crop diseases early using smartphone images.',
    innovation: 82,
    marketPotential: 76,
    validation: 67,
    teamStrength: 54,
    researchers: 12,
    contributors: 4,
    funding: '₹15L',
  },
  {
    id: '2',
    title: 'Low-Cost Water Quality Monitoring',
    category: 'Climate Tech',
    stage: 'Research',
    description:
      'An affordable monitoring system designed to detect changes in local water quality using low-cost sensors.',
    innovation: 88,
    marketPotential: 81,
    validation: 59,
    teamStrength: 72,
    researchers: 8,
    contributors: 6,
    funding: '₹10L',
  },
  {
    id: '3',
    title: 'AI Legal Assistant for MSMEs',
    category: 'AI',
    stage: 'MVP',
    description:
      'An AI assistant that helps Indian MSMEs understand common legal and compliance requirements.',
    innovation: 79,
    marketPotential: 91,
    validation: 74,
    teamStrength: 68,
    researchers: 16,
    contributors: 9,
    funding: '₹40L',
  },
];