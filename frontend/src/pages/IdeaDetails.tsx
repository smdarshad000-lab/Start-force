import {
  gql,
  useQuery,
} from '@apollo/client';

import {
  Link,
  useParams,
} from 'react-router-dom';

import { PageContainer } from '../components/layout/PageContainer';

const IDEA_QUERY = gql`
  query IdeaDetails($id: ID!) {
    idea(id: $id) {
      id
      ownerId
      status
      currentStep

      title
      description
      category
      stage

      problemStatement
      targetUsers
      currentSolution
      problemEvidence

      solutionDescription
      howItWorks
      uniqueValue

      technologyApproach
      technologyDomain
      technologyReadiness
      requiredTechnology
      existingImplementation

      validationMethod
      validationAudience
      validationSampleSize
      validationFindings
      validationEvidence

      research {
        id
        type
        title
        url
        source
        year
        relevance
      }

      collaborationNeeds {
        id
        role
        responsibilities
        skills
        openings
        collaborationType
      }

      funding {
        needsFunding
        amount
        type
        purpose

        resources {
          id
          type
          description
        }
      }

      createdAt
      updatedAt
    }
  }
`;

type ResearchItem = {
  id: string;
  type: string;
  title: string;
  url: string | null;
  source: string | null;
  year: number | null;
  relevance: string;
};

type CollaborationNeed = {
  id: string;
  role: string;
  responsibilities: string;
  skills: string;
  openings: string;
  collaborationType: string;
};

type ResourceNeed = {
  id: string;
  type: string;
  description: string;
};

type FundingData = {
  needsFunding: string;
  amount: string;
  type: string;
  purpose: string;
  resources: ResourceNeed[];
};

type Idea = {
  id: string;
  ownerId: string;

  status:
    | 'DRAFT'
    | 'PUBLISHED'
    | 'ARCHIVED';

  currentStep: number;

  title: string;
  description: string;
  category: string;
  stage:
    | 'Research'
    | 'Prototype'
    | 'MVP'
    | 'Startup';

  problemStatement: string;
  targetUsers: string;
  currentSolution: string;
  problemEvidence: string;

  solutionDescription: string;
  howItWorks: string;
  uniqueValue: string;

  technologyApproach: string;
  technologyDomain: string;
  technologyReadiness: string;
  requiredTechnology: string;
  existingImplementation: string;

  validationMethod: string;
  validationAudience: string;
  validationSampleSize: string;
  validationFindings: string;
  validationEvidence: string;

  research: ResearchItem[];

  collaborationNeeds: CollaborationNeed[];

  funding: FundingData;

  createdAt: string;
  updatedAt: string;
};

function formatDate(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return 'Unknown';
  }

  return date.toLocaleString();
}

function getStatusLabel(
  status: Idea['status'],
): string {
  if (
    status === 'PUBLISHED'
  ) {
    return 'Published';
  }

  if (
    status === 'ARCHIVED'
  ) {
    return 'Archived';
  }

  return 'Draft';
}

function getStatusClasses(
  status: Idea['status'],
): string {
  if (
    status === 'PUBLISHED'
  ) {
    return 'bg-emerald-50 text-emerald-700';
  }

  if (
    status === 'ARCHIVED'
  ) {
    return 'bg-slate-100 text-slate-600';
  }

  return 'bg-amber-50 text-amber-700';
}

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
        {value || 'Not provided'}
      </p>
    </div>
  );
}

function DetailCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-950">
        {title}
      </h2>

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}

export function IdeaDetails() {
  const {
    id,
  } = useParams<{
    id: string;
  }>();

  const {
    data,
    loading,
    error,
  } = useQuery<{
    idea: Idea | null;
  }>(
    IDEA_QUERY,
    {
      variables: {
        id: id ?? '',
      },

      skip: !id,

      fetchPolicy:
        'network-only',
    },
  );

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-[60vh] items-center justify-center py-12">
          <div className="text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading idea details...
            </p>

          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="py-12">

          <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
              Idea Details
            </p>

            <h1 className="mt-3 text-2xl font-bold text-red-900">
              Unable to load this idea
            </h1>

            <p className="mt-3 text-sm leading-7 text-red-700">
              {error.message}
            </p>

            <Link
              to="/my-ideas"
              className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to My Ideas
            </Link>

          </div>

        </div>
      </PageContainer>
    );
  }

  const idea =
    data?.idea ?? null;

  if (!idea) {
    return (
      <PageContainer>
        <div className="flex min-h-[60vh] items-center justify-center py-12">
          <div className="max-w-xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Idea Details
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
              Idea not found
            </h1>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              The idea may have been removed or the
              link may no longer be valid.
            </p>

            <Link
              to="/my-ideas"
              className="mt-8 inline-flex rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to My Ideas
            </Link>

          </div>
        </div>
      </PageContainer>
    );
  }

  const progress = Math.round(
    (
      Math.min(
        5,
        Math.max(
          1,
          idea.currentStep,
        ),
      ) / 5
    ) * 100,
  );

  return (
    <PageContainer>
      <div className="py-10">

        {/* Top navigation */}

        <div className="flex flex-wrap items-center justify-between gap-4">

          <Link
            to="/my-ideas"
            className="inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-slate-950"
          >
            ← Back to My Ideas
          </Link>

          {idea.status !==
            'ARCHIVED' && (
            <Link
              to={`/build?ideaId=${encodeURIComponent(
                idea.id,
              )}`}
              className="inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Continue building →
            </Link>
          )}

        </div>

        {/* Idea overview */}

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div className="min-w-0 max-w-4xl">

              <div className="flex flex-wrap items-center gap-2">

                <span
                  className={[
                    'rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
                    getStatusClasses(
                      idea.status,
                    ),
                  ].join(' ')}
                >
                  {getStatusLabel(
                    idea.status,
                  )}
                </span>

                {idea.category && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {idea.category}
                  </span>
                )}

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {idea.stage}
                </span>

              </div>

              <h1 className="mt-5 break-words text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                {idea.title ||
                  'Untitled idea'}
              </h1>

              <p className="mt-5 max-w-3xl whitespace-pre-wrap text-lg leading-8 text-slate-600">
                {idea.description ||
                  'No description provided.'}
              </p>

            </div>

            <div className="shrink-0 rounded-2xl bg-slate-50 p-5">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Build progress
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {progress}%
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Step {idea.currentStep} of 5
              </p>

            </div>

          </div>

          <div className="mt-8 grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-3">

            <InfoBlock
              label="Created"
              value={formatDate(
                idea.createdAt,
              )}
            />

            <InfoBlock
              label="Last updated"
              value={formatDate(
                idea.updatedAt,
              )}
            />

            <InfoBlock
              label="Current stage"
              value={idea.stage}
            />

          </div>

        </div>

        {/* Problem */}

        <div className="mt-8">
          <DetailCard
            eyebrow="Problem"
            title="What problem are you solving?"
          >
            <div className="grid gap-8 lg:grid-cols-2">

              <InfoBlock
                label="Problem statement"
                value={
                  idea.problemStatement
                }
              />

              <InfoBlock
                label="Target users"
                value={
                  idea.targetUsers
                }
              />

              <InfoBlock
                label="Current solution"
                value={
                  idea.currentSolution
                }
              />

              <InfoBlock
                label="Problem evidence"
                value={
                  idea.problemEvidence
                }
              />

            </div>
          </DetailCard>
        </div>

        {/* Solution */}

        <div className="mt-8">
          <DetailCard
            eyebrow="Solution"
            title="How the idea solves the problem"
          >
            <div className="grid gap-8">

              <InfoBlock
                label="Solution description"
                value={
                  idea.solutionDescription
                }
              />

              <InfoBlock
                label="How it works"
                value={
                  idea.howItWorks
                }
              />

              <InfoBlock
                label="Unique value"
                value={
                  idea.uniqueValue
                }
              />

            </div>
          </DetailCard>
        </div>

        {/* Technology */}

        <div className="mt-8">
          <DetailCard
            eyebrow="Technology"
            title="Technology and implementation"
          >
            <div className="grid gap-8 lg:grid-cols-2">

              <InfoBlock
                label="Technology approach"
                value={
                  idea.technologyApproach
                }
              />

              <InfoBlock
                label="Technology domain"
                value={
                  idea.technologyDomain
                }
              />

              <InfoBlock
                label="Technology readiness"
                value={
                  idea.technologyReadiness
                }
              />

              <InfoBlock
                label="Required technology"
                value={
                  idea.requiredTechnology
                }
              />

              <InfoBlock
                label="Existing implementation"
                value={
                  idea.existingImplementation
                }
              />

            </div>
          </DetailCard>
        </div>

        {/* Validation */}

        <div className="mt-8">
          <DetailCard
            eyebrow="Validation"
            title="Evidence and validation"
          >
            <div className="grid gap-8 lg:grid-cols-2">

              <InfoBlock
                label="Validation method"
                value={
                  idea.validationMethod
                }
              />

              <InfoBlock
                label="Validation audience"
                value={
                  idea.validationAudience
                }
              />

              <InfoBlock
                label="Sample size"
                value={
                  idea.validationSampleSize
                }
              />

              <InfoBlock
                label="Validation findings"
                value={
                  idea.validationFindings
                }
              />

              <div className="lg:col-span-2">
                <InfoBlock
                  label="Validation evidence"
                  value={
                    idea.validationEvidence
                  }
                />
              </div>

            </div>
          </DetailCard>
        </div>

        {/* Research */}

        <div className="mt-8">
          <DetailCard
            eyebrow="Research"
            title="Research evidence"
          >
            {idea.research.length ===
            0 ? (
              <div className="rounded-xl bg-slate-50 p-5">

                <p className="text-sm text-slate-500">
                  No research items have been added
                  yet.
                </p>

              </div>
            ) : (
              <div className="space-y-5">

                {idea.research.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 p-5"
                    >

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {item.type}
                        </span>

                        {item.year !==
                          null && (
                          <span className="text-xs font-medium text-slate-400">
                            {item.year}
                          </span>
                        )}

                      </div>

                      <h3 className="mt-3 text-lg font-bold text-slate-950">
                        {item.title}
                      </h3>

                      {item.source && (
                        <p className="mt-2 text-sm text-slate-500">
                          Source: {item.source}
                        </p>
                      )}

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-block break-all text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                        >
                          {item.url}
                        </a>
                      )}

                      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {item.relevance ||
                          'No relevance notes provided.'}
                      </p>

                    </div>
                  ),
                )}

              </div>
            )}
          </DetailCard>
        </div>

        {/* Collaboration */}

        <div className="mt-8">
          <DetailCard
            eyebrow="Collaboration"
            title="People and collaboration needs"
          >
            {idea.collaborationNeeds.length ===
            0 ? (
              <div className="rounded-xl bg-slate-50 p-5">

                <p className="text-sm text-slate-500">
                  No collaboration needs have been
                  added yet.
                </p>

              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">

                {idea.collaborationNeeds.map(
                  (need) => (
                    <div
                      key={need.id}
                      className="rounded-2xl border border-slate-200 p-5"
                    >

                      <div className="flex flex-wrap items-center justify-between gap-3">

                        <h3 className="text-lg font-bold text-slate-950">
                          {need.role}
                        </h3>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {need.collaborationType}
                        </span>

                      </div>

                      <div className="mt-5 space-y-4">

                        <InfoBlock
                          label="Responsibilities"
                          value={
                            need.responsibilities
                          }
                        />

                        <InfoBlock
                          label="Skills"
                          value={
                            need.skills
                          }
                        />

                        <InfoBlock
                          label="Openings"
                          value={
                            need.openings
                          }
                        />

                      </div>

                    </div>
                  ),
                )}

              </div>
            )}
          </DetailCard>
        </div>

        {/* Funding */}

        <div className="mt-8">
          <DetailCard
            eyebrow="Funding"
            title="Funding and resources"
          >
            <div className="grid gap-8 lg:grid-cols-2">

              <InfoBlock
                label="Needs funding"
                value={
                  idea.funding.needsFunding
                }
              />

              <InfoBlock
                label="Amount"
                value={
                  idea.funding.amount
                }
              />

              <InfoBlock
                label="Funding type"
                value={
                  idea.funding.type
                }
              />

              <InfoBlock
                label="Purpose"
                value={
                  idea.funding.purpose
                }
              />

            </div>

            <div className="mt-8">

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Resource needs
              </p>

              {idea.funding.resources.length ===
              0 ? (
                <div className="mt-3 rounded-xl bg-slate-50 p-5">

                  <p className="text-sm text-slate-500">
                    No additional resources listed.
                  </p>

                </div>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  {idea.funding.resources.map(
                    (resource) => (
                      <div
                        key={
                          resource.id
                        }
                        className="rounded-2xl border border-slate-200 p-5"
                      >

                        <p className="text-sm font-bold text-slate-950">
                          {resource.type}
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                          {
                            resource.description
                          }
                        </p>

                      </div>
                    ),
                  )}

                </div>
              )}

            </div>

          </DetailCard>
        </div>

        {/* Bottom actions */}

        <div className="mt-10 flex flex-wrap gap-3">

          <Link
            to="/my-ideas"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
          >
            Back to My Ideas
          </Link>

          {idea.status !==
            'ARCHIVED' && (
            <Link
              to={`/build?ideaId=${encodeURIComponent(
                idea.id,
              )}`}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Edit idea →
            </Link>
          )}

        </div>

      </div>
    </PageContainer>
  );
}