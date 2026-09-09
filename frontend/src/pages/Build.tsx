import {
  useEffect,
  useState,
} from 'react';

import {
  gql,
  useMutation,
  useQuery,
} from '@apollo/client';

import { CollaborationNeeds } from '../components/build/CollaborationNeeds';
import { FundingNeeds } from '../components/build/FundingNeeds';
import { ResearchEvidence } from '../components/build/ResearchEvidence';
import { ReviewStage } from '../components/build/ReviewStage';
import { PageContainer } from '../components/layout/PageContainer';

import {
  initialBuildDraft,
  type BuildDraft,
} from '../types/build';

import { useAuth } from '../context/AuthContext';

const MY_DRAFT_QUERY = gql`
  query MyDraft {
    myDraft {
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
      createdAt
      updatedAt
    }
  }
`;

const SAVE_DRAFT_MUTATION = gql`
  mutation SaveDraft($input: SaveDraftInput!) {
    saveDraft(input: $input) {
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
      createdAt
      updatedAt
    }
  }
`;

const stages = [
  'Idea',
  'Evidence',
  'Collaboration',
  'Funding',
  'Review',
];

const categories = [
  'AI',
  'Agritech',
  'Climate Tech',
  'Health',
  'FinTech',
  'Deep Tech',
  'Education',
  'Energy',
  'Mobility',
  'Other',
];

const ideaStages = [
  'Research',
  'Prototype',
  'MVP',
  'Startup',
];

const technologyReadinessLevels = [
  'Concept only',
  'Early research',
  'Proof of concept',
  'Working prototype',
  'Tested prototype',
  'Production ready',
];

const validationMethods = [
  'Not validated yet',
  'User interviews',
  'Survey',
  'Prototype testing',
  'Pilot',
  'Experiment',
  'Market research',
  'Other',
];

type DraftResponse = {
  id: string;
  ownerId: string;
  status: 'DRAFT' | 'PUBLISHED';
  currentStep: number;
  title: string;
  description: string;
  category: string;
  stage: 'Research' | 'Prototype' | 'MVP' | 'Startup';
  problemStatement: string;
  targetUsers: string;
  currentSolution: string;
  problemEvidence: string;
  solutionDescription: string;
  howItWorks: string;
  uniqueValue: string;
  createdAt: string;
  updatedAt: string;
};

function isValidStep(
  step: number,
): boolean {
  return (
    Number.isInteger(step) &&
    step >= 1 &&
    step <= 5
  );
}

function draftFromDatabase(
  savedDraft: DraftResponse,
): BuildDraft {
  return {
    ...initialBuildDraft,

    title: savedDraft.title,
    description:
      savedDraft.description,
    category: savedDraft.category,
    ideaStage:
      savedDraft.stage,

    problemStatement:
      savedDraft.problemStatement,

    targetUsers:
      savedDraft.targetUsers,

    currentSolution:
      savedDraft.currentSolution,

    problemEvidence:
      savedDraft.problemEvidence,

    solutionDescription:
      savedDraft.solutionDescription,

    howItWorks:
      savedDraft.howItWorks,

    uniqueValue:
      savedDraft.uniqueValue,
  };
}

export function Build() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [
    currentStage,
    setCurrentStage,
  ] = useState(1);

  const [
    draft,
    setDraft,
  ] = useState<BuildDraft>(
    initialBuildDraft,
  );

  const [
    hasRestoredDraft,
    setHasRestoredDraft,
  ] = useState(false);

  const [
    saveError,
    setSaveError,
  ] = useState('');

  const [
    saveSuccess,
    setSaveSuccess,
  ] = useState('');

  const [
    savedIdeaId,
    setSavedIdeaId,
  ] = useState<
    string | null
  >(null);

  const {
    data: draftData,
    loading: draftLoading,
    error: draftLoadError,
  } = useQuery<{
    myDraft:
      | DraftResponse
      | null;
  }>(
    MY_DRAFT_QUERY,
    {
      skip:
        authLoading ||
        !user,
      fetchPolicy:
        'network-only',
    },
  );

  const [
    saveDraft,
    {
      loading: saving,
    },
  ] = useMutation<{
    saveDraft:
      DraftResponse;
  }>(
    SAVE_DRAFT_MUTATION,
  );

  /*
   * Restore the saved draft once the
   * authentication state and query are ready.
   */
  useEffect(() => {
    if (
      authLoading ||
      draftLoading ||
      hasRestoredDraft
    ) {
      return;
    }

    if (
      !user ||
      draftLoadError
    ) {
      setHasRestoredDraft(true);
      return;
    }

    const savedDraft =
      draftData?.myDraft;

    if (!savedDraft) {
      setHasRestoredDraft(true);
      return;
    }

    setDraft(
      draftFromDatabase(
        savedDraft,
      ),
    );

    if (
      isValidStep(
        savedDraft.currentStep,
      )
    ) {
      setCurrentStage(
        savedDraft.currentStep,
      );
    }

    setSavedIdeaId(
      savedDraft.id,
    );

    setHasRestoredDraft(true);

    setSaveSuccess(
      'Your saved draft has been restored.',
    );
  }, [
    authLoading,
    draftLoading,
    draftData,
    draftLoadError,
    hasRestoredDraft,
    user,
  ]);

  const totalStages =
    stages.length;

  const isIdeaComplete =
    draft.title.trim().length >= 5 &&
    draft.description.trim().length >= 20 &&
    draft.category !== '' &&
    draft.ideaStage !== '' &&
    draft.problemStatement.trim().length >= 30 &&
    draft.targetUsers.trim().length >= 10 &&
    draft.currentSolution.trim().length >= 20 &&
    draft.problemEvidence.trim().length >= 20 &&
    draft.solutionDescription.trim().length >= 30 &&
    draft.howItWorks.trim().length >= 30 &&
    draft.uniqueValue.trim().length >= 20;

  const isTechnologyComplete =
    draft.technologyApproach.trim().length >= 30 &&
    draft.technologyDomain.trim().length >= 5 &&
    draft.technologyReadiness !== '' &&
    draft.requiredTechnology.trim().length >= 20 &&
    draft.existingImplementation.trim().length >= 20;

  const isValidationComplete =
    draft.validationMethod ===
      'Not validated yet' ||
    (
      draft.validationMethod !== '' &&
      draft.validationAudience.trim().length >= 5 &&
      draft.validationSampleSize.trim().length >= 1 &&
      draft.validationFindings.trim().length >= 20 &&
      draft.validationEvidence.trim().length >= 20
    );

  const isEvidenceComplete =
    isTechnologyComplete &&
    isValidationComplete;

  function updateDraft<
    K extends keyof BuildDraft
  >(
    field: K,
    value: BuildDraft[K],
  ) {
    setDraft(
      (currentDraft) => ({
        ...currentDraft,
        [field]: value,
      }),
    );

    setSaveError('');
    setSaveSuccess('');
  }

  function goToNextStage() {
    setSaveError('');
    setSaveSuccess('');

    if (
      currentStage === 1
    ) {
      if (!isIdeaComplete) {
        return;
      }

      setCurrentStage(2);
      return;
    }

    if (
      currentStage === 2
    ) {
      if (!isEvidenceComplete) {
        return;
      }

      setCurrentStage(3);
      return;
    }

    if (
      currentStage <
      totalStages
    ) {
      setCurrentStage(
        (stage) =>
          stage + 1,
      );
    }
  }

  function goToPreviousStage() {
    setSaveError('');
    setSaveSuccess('');

    if (
      currentStage > 1
    ) {
      setCurrentStage(
        (stage) =>
          stage - 1,
      );
    }
  }

  async function handleSaveDraft() {
    setSaveError('');
    setSaveSuccess('');

    if (!user) {
      setSaveError(
        'You must be signed in to save an idea.',
      );

      return;
    }

    if (saving) {
      return;
    }

    try {
      const result =
        await saveDraft({
          variables: {
            input: {
              title:
                draft.title.trim(),

              description:
                draft.description.trim(),

              category:
                draft.category.trim(),

              stage:
                draft.ideaStage as
                  | 'Research'
                  | 'Prototype'
                  | 'MVP'
                  | 'Startup',

              problemStatement:
                draft.problemStatement.trim(),

              targetUsers:
                draft.targetUsers.trim(),

              currentSolution:
                draft.currentSolution.trim(),

              problemEvidence:
                draft.problemEvidence.trim(),

              solutionDescription:
                draft.solutionDescription.trim(),

              howItWorks:
                draft.howItWorks.trim(),

              uniqueValue:
                draft.uniqueValue.trim(),

              currentStep:
                currentStage,
            },
          },
        });

      const savedDraft =
        result.data?.saveDraft;

      if (!savedDraft) {
        throw new Error(
          'The server did not return the saved draft.',
        );
      }

      setSavedIdeaId(
        savedDraft.id,
      );

      setSaveSuccess(
        'Your idea has been saved successfully.',
      );
    } catch (error) {
      console.error(
        'Failed to save draft:',
        error,
      );

      setSaveError(
        error instanceof Error
          ? error.message
          : 'Unable to save your draft.',
      );
    }
  }

  function handlePublish(
    visibility:
      | 'Public'
      | 'Limited'
      | 'Private',
  ) {
    console.log(
      'Publish requested:',
      {
        visibility,
        draft,
        userId:
          user?.id,
      },
    );
  }

  /*
   * Wait until authentication and draft
   * restoration have completed.
   */
  if (
    authLoading ||
    (
      user &&
      draftLoading &&
      !hasRestoredDraft
    )
  ) {
    return (
      <PageContainer>
        <section className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading your Build workspace...
            </p>
          </div>
        </section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <section className="py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            Build
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Turn your idea into something real.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Tell the community what you are
            building, what problem you are solving,
            and what you need to move forward.
          </p>
        </div>

        {saveSuccess && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <div className="font-semibold">
              {saveSuccess}
            </div>

            {savedIdeaId && (
              <div className="mt-1 text-xs text-emerald-600">
                Draft ID: {savedIdeaId}
              </div>
            )}
          </div>
        )}

        {saveError && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {saveError}
          </div>
        )}

        {/* Progress */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Stage {currentStage} of{' '}
                {totalStages}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {stages[currentStage - 1]}
              </p>
            </div>

            <p className="text-sm font-medium text-slate-500">
              {Math.round(
                (currentStage /
                  totalStages) *
                  100,
              )}
              %
            </p>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${
                  (currentStage /
                    totalStages) *
                  100
                }%`,
              }}
            />
          </div>

          <div className="mt-6 grid grid-cols-5 gap-2">
            {stages.map(
              (
                stage,
                index,
              ) => {
                const stageNumber =
                  index + 1;

                const isCurrent =
                  stageNumber ===
                  currentStage;

                const isCompleted =
                  stageNumber <
                  currentStage;

                return (
                  <div
                    key={stage}
                    className="text-center"
                  >
                    <div
                      className={[
                        'mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold',
                        isCurrent
                          ? 'bg-slate-950 text-white'
                          : isCompleted
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-400',
                      ].join(' ')}
                    >
                      {isCompleted
                        ? '✓'
                        : stageNumber}
                    </div>

                    <p
                      className={[
                        'mt-2 text-xs font-medium',
                        isCurrent
                          ? 'text-slate-950'
                          : isCompleted
                            ? 'text-emerald-700'
                            : 'text-slate-400',
                      ].join(' ')}
                    >
                      {stage}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* ========================= */}
        {/* STAGE 1 */}
        {/* ========================= */}

        {currentStage === 1 && (
          <div className="mt-8 space-y-8">

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Part 1
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Basic information
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Start by giving your idea a clear identity.
              </p>

              <div className="mt-8 space-y-6">

                <div>
                  <label
                    htmlFor="idea-title"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    Idea title
                  </label>

                  <input
                    id="idea-title"
                    type="text"
                    value={draft.title}
                    onChange={(event) =>
                      updateDraft(
                        'title',
                        event.target.value,
                      )
                    }
                    placeholder="e.g. AI Crop Disease Detection"
                    maxLength={100}
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <div className="mt-2 text-right text-xs text-slate-400">
                    {draft.title.length}/100
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="idea-description"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    Short description
                  </label>

                  <textarea
                    id="idea-description"
                    value={draft.description}
                    onChange={(event) =>
                      updateDraft(
                        'description',
                        event.target.value,
                      )
                    }
                    placeholder="Describe what your idea does and who it helps..."
                    maxLength={500}
                    rows={5}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <div className="mt-2 text-right text-xs text-slate-400">
                    {draft.description.length}/500
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">

                  <div>
                    <label
                      htmlFor="idea-category"
                      className="block text-sm font-semibold text-slate-950"
                    >
                      Category
                    </label>

                    <select
                      id="idea-category"
                      value={draft.category}
                      onChange={(event) =>
                        updateDraft(
                          'category',
                          event.target.value,
                        )
                      }
                      className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    >
                      <option value="">
                        Select a category
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="idea-stage"
                      className="block text-sm font-semibold text-slate-950"
                    >
                      Current stage
                    </label>

                    <select
                      id="idea-stage"
                      value={draft.ideaStage}
                      onChange={(event) =>
                        updateDraft(
                          'ideaStage',
                          event.target.value,
                        )
                      }
                      className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    >
                      <option value="">
                        Select current stage
                      </option>

                      {ideaStages.map(
                        (stage) => (
                          <option
                            key={stage}
                            value={stage}
                          >
                            {stage}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Part 2
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Define the problem
              </h2>

              <div className="mt-8 space-y-6">

                <div>
                  <label
                    htmlFor="problem-statement"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    What problem are you solving?
                  </label>

                  <textarea
                    id="problem-statement"
                    value={draft.problemStatement}
                    onChange={(event) =>
                      updateDraft(
                        'problemStatement',
                        event.target.value,
                      )
                    }
                    maxLength={1000}
                    rows={6}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="target-users"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    Who experiences this problem?
                  </label>

                  <textarea
                    id="target-users"
                    value={draft.targetUsers}
                    onChange={(event) =>
                      updateDraft(
                        'targetUsers',
                        event.target.value,
                      )
                    }
                    maxLength={500}
                    rows={4}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="current-solution"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    How is it handled today?
                  </label>

                  <textarea
                    id="current-solution"
                    value={draft.currentSolution}
                    onChange={(event) =>
                      updateDraft(
                        'currentSolution',
                        event.target.value,
                      )
                    }
                    maxLength={750}
                    rows={5}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="problem-evidence"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    What evidence do you have?
                  </label>

                  <textarea
                    id="problem-evidence"
                    value={draft.problemEvidence}
                    onChange={(event) =>
                      updateDraft(
                        'problemEvidence',
                        event.target.value,
                      )
                    }
                    maxLength={1000}
                    rows={6}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Part 3
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Describe the solution
              </h2>

              <div className="mt-8 space-y-6">

                <div>
                  <label
                    htmlFor="solution-description"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    What is your proposed solution?
                  </label>

                  <textarea
                    id="solution-description"
                    value={draft.solutionDescription}
                    onChange={(event) =>
                      updateDraft(
                        'solutionDescription',
                        event.target.value,
                      )
                    }
                    maxLength={1200}
                    rows={7}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="how-it-works"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    How does it work?
                  </label>

                  <textarea
                    id="how-it-works"
                    value={draft.howItWorks}
                    onChange={(event) =>
                      updateDraft(
                        'howItWorks',
                        event.target.value,
                      )
                    }
                    maxLength={1200}
                    rows={7}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="unique-value"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    What makes your solution different?
                  </label>

                  <textarea
                    id="unique-value"
                    value={draft.uniqueValue}
                    onChange={(event) =>
                      updateDraft(
                        'uniqueValue',
                        event.target.value,
                      )
                    }
                    maxLength={800}
                    rows={5}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

              </div>
            </section>

            <div className="flex justify-end border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={goToNextStage}
                disabled={!isIdeaComplete}
                className={[
                  'rounded-xl px-6 py-3.5 text-sm font-semibold transition',
                  isIdeaComplete
                    ? 'bg-slate-950 text-white hover:bg-slate-800'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400',
                ].join(' ')}
              >
                Continue to Evidence →
              </button>
            </div>
          </div>
        )}

        {/* ========================= */}
        {/* STAGE 2 */}
        {/* ========================= */}

        {currentStage === 2 && (
          <div className="mt-8 space-y-8">

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Evidence
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Show how strong your idea is
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                Add the technical foundation, research,
                and real-world validation that help other
                people understand and evaluate your idea.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Technology
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Technical or scientific approach
              </h2>

              <div className="mt-8 space-y-6">

                <div>
                  <label
                    htmlFor="technology-approach"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    What technology or approach are you using?
                  </label>

                  <textarea
                    id="technology-approach"
                    value={draft.technologyApproach}
                    onChange={(event) =>
                      updateDraft(
                        'technologyApproach',
                        event.target.value,
                      )
                    }
                    maxLength={1200}
                    rows={7}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="technology-domain"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    Technology or scientific domain
                  </label>

                  <input
                    id="technology-domain"
                    value={draft.technologyDomain}
                    onChange={(event) =>
                      updateDraft(
                        'technologyDomain',
                        event.target.value,
                      )
                    }
                    maxLength={150}
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="technology-readiness"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    Current technology readiness
                  </label>

                  <select
                    id="technology-readiness"
                    value={
                      draft.technologyReadiness
                    }
                    onChange={(event) =>
                      updateDraft(
                        'technologyReadiness',
                        event.target.value,
                      )
                    }
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="">
                      Select current technology readiness
                    </option>

                    {technologyReadinessLevels.map(
                      (level) => (
                        <option
                          key={level}
                          value={level}
                        >
                          {level}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="required-technology"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    What technology or resources are still required?
                  </label>

                  <textarea
                    id="required-technology"
                    value={
                      draft.requiredTechnology
                    }
                    onChange={(event) =>
                      updateDraft(
                        'requiredTechnology',
                        event.target.value,
                      )
                    }
                    maxLength={1000}
                    rows={6}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="existing-implementation"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    What have you already built or tested?
                  </label>

                  <textarea
                    id="existing-implementation"
                    value={
                      draft.existingImplementation
                    }
                    onChange={(event) =>
                      updateDraft(
                        'existingImplementation',
                        event.target.value,
                      )
                    }
                    maxLength={1000}
                    rows={6}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

              </div>
            </section>

            <ResearchEvidence
              items={draft.research}
              onChange={(research) =>
                updateDraft(
                  'research',
                  research,
                )
              }
            />

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Validation
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Show what you have learned so far
              </h2>

              <div className="mt-8 space-y-6">

                <div>
                  <label
                    htmlFor="validation-method"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    How have you validated the idea?
                  </label>

                  <select
                    id="validation-method"
                    value={
                      draft.validationMethod
                    }
                    onChange={(event) =>
                      updateDraft(
                        'validationMethod',
                        event.target.value,
                      )
                    }
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="">
                      Select validation method
                    </option>

                    {validationMethods.map(
                      (method) => (
                        <option
                          key={method}
                          value={method}
                        >
                          {method}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {draft.validationMethod !==
                  '' &&
                  draft.validationMethod !==
                    'Not validated yet' && (
                    <>
                      <div>
                        <label
                          htmlFor="validation-audience"
                          className="block text-sm font-semibold text-slate-950"
                        >
                          Who did you test with?
                        </label>

                        <input
                          id="validation-audience"
                          value={
                            draft.validationAudience
                          }
                          onChange={(event) =>
                            updateDraft(
                              'validationAudience',
                              event.target.value,
                            )
                          }
                          className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="validation-sample-size"
                          className="block text-sm font-semibold text-slate-950"
                        >
                          How many people or tests were involved?
                        </label>

                        <input
                          id="validation-sample-size"
                          type="number"
                          min="1"
                          value={
                            draft.validationSampleSize
                          }
                          onChange={(event) =>
                            updateDraft(
                              'validationSampleSize',
                              event.target.value,
                            )
                          }
                          className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="validation-findings"
                          className="block text-sm font-semibold text-slate-950"
                        >
                          What did you learn?
                        </label>

                        <textarea
                          id="validation-findings"
                          value={
                            draft.validationFindings
                          }
                          onChange={(event) =>
                            updateDraft(
                              'validationFindings',
                              event.target.value,
                            )
                          }
                          maxLength={1200}
                          rows={6}
                          className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="validation-evidence"
                          className="block text-sm font-semibold text-slate-950"
                        >
                          What evidence supports the result?
                        </label>

                        <textarea
                          id="validation-evidence"
                          value={
                            draft.validationEvidence
                          }
                          onChange={(event) =>
                            updateDraft(
                              'validationEvidence',
                              event.target.value,
                            )
                          }
                          maxLength={1200}
                          rows={6}
                          className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                      </div>
                    </>
                  )}

                {draft.validationMethod ===
                  'Not validated yet' && (
                  <div className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                    That&apos;s okay. You can
                    publish an early idea without
                    validation and add validation
                    evidence later.
                  </div>
                )}
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">

              <button
                type="button"
                onClick={
                  goToPreviousStage
                }
                className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                ← Back to Idea
              </button>

              <button
                type="button"
                onClick={goToNextStage}
                disabled={
                  !isEvidenceComplete
                }
                className={[
                  'rounded-xl px-6 py-3.5 text-sm font-semibold transition',
                  isEvidenceComplete
                    ? 'bg-slate-950 text-white hover:bg-slate-800'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400',
                ].join(' ')}
              >
                Continue to Collaboration →
              </button>
            </div>
          </div>
        )}

        {/* ========================= */}
        {/* STAGE 3 */}
        {/* ========================= */}

        {currentStage === 3 && (
          <div className="mt-8 space-y-8">

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Collaboration
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                Find the people and expertise you need
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Tell the community which roles, skills,
                and collaborators would help you move
                this idea forward.
              </p>
            </section>

            <CollaborationNeeds
              items={
                draft.collaborationNeeds
              }
              onChange={(
                collaborationNeeds,
              ) =>
                updateDraft(
                  'collaborationNeeds',
                  collaborationNeeds,
                )
              }
            />

            <div className="border-t border-slate-200 pt-6">

              <button
                type="button"
                onClick={
                  goToPreviousStage
                }
                className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                ← Back to Evidence
              </button>

              <button
                type="button"
                onClick={goToNextStage}
                className="ml-3 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Continue to Funding →
              </button>

            </div>
          </div>
        )}

        {/* ========================= */}
        {/* STAGE 4 */}
        {/* ========================= */}

        {currentStage === 4 && (
          <div className="mt-8 space-y-8">

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Funding
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                Get the resources your idea needs
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                Funding is only one part of building
                something new. Tell the community what
                support could help your idea progress.
              </p>
            </section>

            <FundingNeeds
              funding={draft.funding}
              onChange={(funding) =>
                updateDraft(
                  'funding',
                  funding,
                )
              }
            />

            <div className="border-t border-slate-200 pt-6">

              <button
                type="button"
                onClick={
                  goToPreviousStage
                }
                className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                ← Back to Collaboration
              </button>

              <button
                type="button"
                onClick={goToNextStage}
                className="ml-3 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Review Idea →
              </button>

            </div>
          </div>
        )}

        {/* ========================= */}
        {/* STAGE 5 */}
        {/* ========================= */}

        {currentStage === 5 && (
          <div className="mt-8">

            <ReviewStage
              draft={draft}
              saving={saving}
              onSaveDraft={() => {
                void handleSaveDraft();
              }}
              onPublish={handlePublish}
            />

            <div className="mt-6 border-t border-slate-200 pt-6">

              <button
                type="button"
                onClick={
                  goToPreviousStage
                }
                className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                ← Back to Funding
              </button>

            </div>
          </div>
        )}
      </section>
    </PageContainer>
  );
}
