export type EvidenceType =
  | 'Research Paper'
  | 'Patent'
  | 'Dataset'
  | 'Experiment'
  | 'Survey'
  | 'Report'
  | 'Website'
  | 'Other';

export type CollaborationType =
  | 'Co-founder'
  | 'Team member'
  | 'Researcher'
  | 'Advisor'
  | 'Volunteer';

export type FundingType =
  | 'Grant'
  | 'Investment'
  | 'Loan'
  | 'Bootstrapped'
  | 'Crowdfunding'
  | 'Other';

export type FundingPurpose =
  | 'Research'
  | 'Prototype'
  | 'Equipment'
  | 'Team'
  | 'Operations'
  | 'Marketing'
  | 'Testing'
  | 'Other';

export type ResourceType =
  | 'Lab access'
  | 'GPU / Compute'
  | 'Equipment'
  | 'Dataset'
  | 'Field access'
  | 'Mentorship'
  | 'Other';

export type ResearchItem = {
  id: string;
  type: EvidenceType;
  title: string;
  url: string;
  source: string;
  year: string;
  relevance: string;
};

export type CollaborationNeed = {
  id: string;
  role: string;
  responsibilities: string;
  skills: string;
  openings: string;
  collaborationType: CollaborationType;
};

export type ResourceNeed = {
  id: string;
  type: ResourceType;
  description: string;
};

export type FundingData = {
  needsFunding: string;
  amount: string;
  type: FundingType | '';
  purpose: FundingPurpose | '';
  resources: ResourceNeed[];
};

export type BuildDraft = {
  // Idea
  title: string;
  description: string;
  category: string;
  ideaStage: string;

  // Problem
  problemStatement: string;
  targetUsers: string;
  currentSolution: string;
  problemEvidence: string;

  // Solution
  solutionDescription: string;
  howItWorks: string;
  uniqueValue: string;

  // Technology
  technologyApproach: string;
  technologyDomain: string;
  technologyReadiness: string;
  requiredTechnology: string;
  existingImplementation: string;

  // Validation
  validationMethod: string;
  validationAudience: string;
  validationSampleSize: string;
  validationFindings: string;
  validationEvidence: string;

  // Research
  research: ResearchItem[];

  // Collaboration
  collaborationNeeds: CollaborationNeed[];

  // Funding
  funding: FundingData;
};

export const initialBuildDraft: BuildDraft = {
  title: '',
  description: '',
  category: '',
  ideaStage: '',

  problemStatement: '',
  targetUsers: '',
  currentSolution: '',
  problemEvidence: '',

  solutionDescription: '',
  howItWorks: '',
  uniqueValue: '',

  technologyApproach: '',
  technologyDomain: '',
  technologyReadiness: '',
  requiredTechnology: '',
  existingImplementation: '',

  validationMethod: '',
  validationAudience: '',
  validationSampleSize: '',
  validationFindings: '',
  validationEvidence: '',

  research: [],

  collaborationNeeds: [],

  funding: {
    needsFunding: '',
    amount: '',
    type: '',
    purpose: '',
    resources: [],
  },
};