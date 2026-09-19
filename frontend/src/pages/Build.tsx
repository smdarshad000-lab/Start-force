import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

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
  type CollaborationNeed,
  type CollaborationType,
  type EvidenceType,
  type FundingData,
  type FundingPurpose,
  type FundingType,
  type ResearchItem,
  type ResourceNeed,
  type ResourceType,
} from '../types/build';

import { useAuth } from '../context/AuthContext';

/* =========================================================
   GraphQL
   ========================================================= */

const MY_IDEAS_QUERY = gql`
  query MyIdeas {
    myIdeas {
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

const PUBLISH_IDEA_MUTATION = gql`
  mutation PublishIdea($id: ID!) {
    publishIdea(id: $id)
  }
`;

/* =========================================================
   Constants
   ========================================================= */

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

/* =========================================================
   Server response types
   ========================================================= */

type DraftResponse = {
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

  research: Array<{
    id: string;
    type: string;
    title: string;
    url: string | null;
    source: string | null;
    year: number | null;
    relevance: string;
  }>;

  collaborationNeeds: Array<{
    id: string;
    role: string;
    responsibilities: string;
    skills: string;
    openings: string;
    collaborationType: string;
  }>;

  funding: {
    needsFunding: string;
    amount: string;
    type: string;
    purpose: string;

    resources: Array<{
      id: string;
      type: string;
      description: string;
    }>;
  };

  createdAt: string;
  updatedAt: string;
};

/* =========================================================
   Restore helpers
   ========================================================= */

function isValidStep(
  step: number,
): boolean {
  return (
    Number.isInteger(step) &&
    step >= 1 &&
    step <= 5
  );
}

function restoreDraft(
  saved: DraftResponse,
): BuildDraft {
  const research: ResearchItem[] =
    saved.research.map(
      (
        item,
      ): ResearchItem => ({
        id:
          item.id,

        type:
          item.type as EvidenceType,

        title:
          item.title,

        url:
          item.url ?? '',

        source:
          item.source ?? '',

        year:
          item.year === null ||
          item.year === undefined
            ? ''
            : String(item.year),

        relevance:
          item.relevance,
      }),
    );

  const collaborationNeeds:
    CollaborationNeed[] =
    saved.collaborationNeeds.map(
      (
        item,
      ): CollaborationNeed => ({
        id:
          item.id,

        role:
          item.role,

        responsibilities:
          item.responsibilities,

        skills:
          item.skills,

        openings:
          item.openings,

        collaborationType:
          item.collaborationType as CollaborationType,
      }),
    );

  const resources:
    ResourceNeed[] =
    saved.funding.resources.map(
      (
        resource,
      ): ResourceNeed => ({
        id:
          resource.id,

        type:
          resource.type as ResourceType,

        description:
          resource.description,
      }),
    );

  const funding:
    FundingData = {
    needsFunding:
      saved.funding.needsFunding,

    amount:
      saved.funding.amount,

    type:
      saved.funding.type as
        | ''
        | FundingType,

    purpose:
      saved.funding.purpose as
        | ''
        | FundingPurpose,

    resources,
  };

  return {
    ...initialBuildDraft,

    title:
      saved.title,

    description:
      saved.description,

    category:
      saved.category,

    ideaStage:
      saved.stage,

    problemStatement:
      saved.problemStatement,

    targetUsers:
      saved.targetUsers,

    currentSolution:
      saved.currentSolution,

    problemEvidence:
      saved.problemEvidence,

    solutionDescription:
      saved.solutionDescription,

    howItWorks:
      saved.howItWorks,

    uniqueValue:
      saved.uniqueValue,

    technologyApproach:
      saved.technologyApproach,

    technologyDomain:
      saved.technologyDomain,

    technologyReadiness:
      saved.technologyReadiness,

    requiredTechnology:
      saved.requiredTechnology,

    existingImplementation:
      saved.existingImplementation,

    validationMethod:
      saved.validationMethod,

    validationAudience:
      saved.validationAudience,

    validationSampleSize:
      saved.validationSampleSize,

    validationFindings:
      saved.validationFindings,

    validationEvidence:
      saved.validationEvidence,

    research,

    collaborationNeeds,

    funding,
  };
}

/* =========================================================
   Component
   ========================================================= */

export function Build() {
  const {
    user,
    loading: authLoading,
  } = useAuth();


  const navigate =
    useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const selectedIdeaId =
    searchParams.get('ideaId');

  const ideaIdRef =
    useRef<string | null>(
      selectedIdeaId,
    );

  const latestDraftRef =
    useRef<BuildDraft>(
      initialBuildDraft,
    );

  const latestStageRef =
    useRef(1);

  const lastRouteIdeaIdRef =
    useRef<string | null | undefined>(
      undefined,
    );

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
    savedIdeaId,
    setSavedIdeaId,
  ] = useState<
    string | null
  >(null);

  const [
    saveStatus,
    setSaveStatus,
  ] = useState<
    | 'idle'
    | 'saving'
    | 'saved'
    | 'error'
  >('idle');

  /*
   * Used to debounce autosave.
   */
  const autoSaveTimer =
    useRef<
      ReturnType<typeof setTimeout> | null
    >(null);

  /*
   * Prevent duplicate overlapping saves.
   */
  const saveInFlight =
    useRef(false);

  /*
   * If a change occurs while a save is in
   * progress, remember that we need another save.
   */
  const saveQueued =
    useRef(false);

  /*
   * Tracks whether the current draft has
   * actually been changed by the user.
   */
  const draftHasChanged =
    useRef(false);

  /* =======================================================
     Load draft
     ======================================================= */

  const {
    data: draftData,
    loading: draftLoading,
    error: draftLoadError,
  } = useQuery<{
    myIdeas: DraftResponse[];
  }>(
    MY_IDEAS_QUERY,
    {
      skip:
        authLoading ||
        !user ||
        !selectedIdeaId,

      fetchPolicy:
        'network-only',
    },
  );


  const [
    saveDraftMutation,
    {
      loading: saving,
    },
  ] = useMutation<{
    saveDraft:
      DraftResponse;
  }>(
    SAVE_DRAFT_MUTATION,
  );

  const [
    publishIdea,
    {
      loading: publishing,
    },
  ] = useMutation<{
    publishIdea: boolean;
  }>(
    PUBLISH_IDEA_MUTATION,
  );

  /* =======================================================
     Switch between a new idea and an existing idea
     ======================================================= */

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    if (
      lastRouteIdeaIdRef.current ===
      selectedIdeaId
    ) {
      return;
    }

    lastRouteIdeaIdRef.current =
      selectedIdeaId;

    ideaIdRef.current =
      selectedIdeaId;

    latestDraftRef.current =
      initialBuildDraft;

    latestStageRef.current =
      1;

    draftHasChanged.current =
      false;

    saveQueued.current =
      false;

    if (
      autoSaveTimer.current
    ) {
      clearTimeout(
        autoSaveTimer.current,
      );
    }

    setDraft(
      initialBuildDraft,
    );

    setCurrentStage(1);

    setSaveError('');

    setSaveStatus('idle');

    setSavedIdeaId(
      selectedIdeaId,
    );

    setHasRestoredDraft(
      !selectedIdeaId,
    );
  }, [
    authLoading,
    user,
    selectedIdeaId,
  ]);

  /* =======================================================
     Restore the selected existing idea
     ======================================================= */

  useEffect(() => {
    if (
      authLoading ||
      !user ||
      !selectedIdeaId ||
      draftLoading ||
      hasRestoredDraft
    ) {
      return;
    }

    if (draftLoadError) {
      setSaveError(
        'Unable to load this idea.',
      );

      setSaveStatus('error');

      setHasRestoredDraft(
        true,
      );

      return;
    }

    const saved =
      draftData?.myIdeas.find(
        (idea) =>
          idea.id ===
          selectedIdeaId,
      ) ?? null;

    if (!saved) {
      setSaveError(
        'This idea could not be found in your account.',
      );

      setSaveStatus('error');

      setHasRestoredDraft(
        true,
      );

      return;
    }

    ideaIdRef.current =
      saved.id;

    latestDraftRef.current =
      restoreDraft(saved);

    latestStageRef.current =
      isValidStep(
        saved.currentStep,
      )
        ? saved.currentStep
        : 1;

    setDraft(
      latestDraftRef.current,
    );

    setCurrentStage(
      latestStageRef.current,
    );

    setSavedIdeaId(
      saved.id,
    );

    setHasRestoredDraft(
      true,
    );

    setSaveStatus(
      'saved',
    );

    setSaveError('');

    draftHasChanged.current =
      false;
  }, [
    authLoading,
    user,
    selectedIdeaId,
    draftLoading,
    draftData,
    draftLoadError,
    hasRestoredDraft,
  ]);

  /* =======================================================
     Validation / completion
     ======================================================= */

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

  useEffect(() => {
    latestDraftRef.current =
      draft;
  }, [draft]);

  useEffect(() => {
    latestStageRef.current =
      currentStage;
  }, [currentStage]);

  /* =======================================================
     Draft updater
     ======================================================= */

  function updateDraft<
    K extends keyof BuildDraft
  >(
    field: K,
    value: BuildDraft[K],
  ) {
    draftHasChanged.current =
      true;

    setDraft(
      (currentDraft) => ({
        ...currentDraft,
        [field]: value,
      }),
    );

    setSaveError('');

    setSaveStatus(
      'idle',
    );
  }

  /* =======================================================
     Save payload
     ======================================================= */

  const saveCurrentDraft =
    useCallback(
      async (
        draftToSave: BuildDraft,
        stageToSave: number,
      ) => {
        if (!user) {
          return;
        }

        if (
          saveInFlight.current
        ) {
          saveQueued.current =
            true;

          return;
        }

        saveInFlight.current =
          true;

        saveQueued.current =
          false;

        setSaveStatus(
          'saving',
        );

        setSaveError('');

        try {
          const result =
            await saveDraftMutation({
              variables: {
                input: {
                  ideaId:
                    ideaIdRef.current,

                  title:
                    draftToSave.title.trim(),

                  description:
                    draftToSave.description.trim(),

                  category:
                    draftToSave.category.trim(),

                  stage:
                    draftToSave.ideaStage as
                      | 'Research'
                      | 'Prototype'
                      | 'MVP'
                      | 'Startup',

                  problemStatement:
                    draftToSave.problemStatement.trim(),

                  targetUsers:
                    draftToSave.targetUsers.trim(),

                  currentSolution:
                    draftToSave.currentSolution.trim(),

                  problemEvidence:
                    draftToSave.problemEvidence.trim(),

                  solutionDescription:
                    draftToSave.solutionDescription.trim(),

                  howItWorks:
                    draftToSave.howItWorks.trim(),

                  uniqueValue:
                    draftToSave.uniqueValue.trim(),

                  technologyApproach:
                    draftToSave.technologyApproach.trim(),

                  technologyDomain:
                    draftToSave.technologyDomain.trim(),

                  technologyReadiness:
                    draftToSave.technologyReadiness.trim(),

                  requiredTechnology:
                    draftToSave.requiredTechnology.trim(),

                  existingImplementation:
                    draftToSave.existingImplementation.trim(),

                  validationMethod:
                    draftToSave.validationMethod.trim(),

                  validationAudience:
                    draftToSave.validationAudience.trim(),

                  validationSampleSize:
                    draftToSave.validationSampleSize.trim(),

                  validationFindings:
                    draftToSave.validationFindings.trim(),

                  validationEvidence:
                    draftToSave.validationEvidence.trim(),

                  research:
                    draftToSave.research.map(
                      (item) => ({
                        type:
                          item.type,

                        title:
                          item.title,

                        url:
                          item.url || null,

                        source:
                          item.source || null,

                        year:
                          item.year
                            ? Number(
                                item.year,
                              )
                            : null,

                        relevance:
                          item.relevance,
                      }),
                    ),

                  collaborationNeeds:
                    draftToSave.collaborationNeeds.map(
                      (item) => ({
                        id:
                          item.id,

                        role:
                          item.role,

                        responsibilities:
                          item.responsibilities,

                        skills:
                          item.skills,

                        openings:
                          item.openings,

                        collaborationType:
                          item.collaborationType,
                      }),
                    ),

                  funding: {
                    needsFunding:
                      draftToSave.funding.needsFunding,

                    amount:
                      draftToSave.funding.amount,

                    type:
                      draftToSave.funding.type,

                    purpose:
                      draftToSave.funding.purpose,

                    resources:
                      draftToSave.funding.resources.map(
                        (resource) => ({
                          id:
                            resource.id,

                          type:
                            resource.type,

                          description:
                            resource.description,
                        }),
                      ),
                  },

                  currentStep:
                    stageToSave,
                },
              },
            });

          const saved =
            result.data?.saveDraft;

          if (!saved) {
            throw new Error(
              'The server did not return the saved draft.',
            );
          }

          ideaIdRef.current =
            saved.id;

          setSavedIdeaId(
            saved.id,
          );

          if (
            !selectedIdeaId
          ) {
            setSearchParams(
              {
                ideaId: saved.id,
              },
              {
                replace: true,
              },
            );
          }

          setSaveStatus(
            'saved',
          );

          draftHasChanged.current =
            false;

          /*
           * Important:
           * Do not replace the current React draft
           * with the server response here.
           *
           * That prevents autosave from triggering
           * itself over and over again.
           */
        } catch (error) {
          console.error(
            'Failed to save draft:',
            error,
          );

          setSaveStatus(
            'error',
          );

          setSaveError(
            error instanceof Error
              ? error.message
              : 'Unable to save your draft.',
          );
        } finally {
          saveInFlight.current =
            false;

          /*
           * A user may have typed more while the
           * previous request was running.
           *
           * In that case queue one more save using
           * the latest React state.
           */
          if (
            saveQueued.current
          ) {
            saveQueued.current =
              false;

            window.setTimeout(
              () => {
                void saveCurrentDraft(
                  latestDraftRef.current,
                  latestStageRef.current,
                );
              },
              100,
            );
          }
        }
      },
      [
        user,
        saveDraftMutation,
        draft,
        currentStage,
      ],
    );

  /* =======================================================
     Autosave
     ======================================================= */

  useEffect(() => {
    if (
      !user ||
      !hasRestoredDraft ||
      !draftHasChanged.current
    ) {
      return;
    }

    if (
      autoSaveTimer.current
    ) {
      clearTimeout(
        autoSaveTimer.current,
      );
    }

    autoSaveTimer.current =
      setTimeout(
        () => {
          void saveCurrentDraft(
            draft,
            currentStage,
          );
        },
        1500,
      );

    return () => {
      if (
        autoSaveTimer.current
      ) {
        clearTimeout(
          autoSaveTimer.current,
        );
      }
    };
  }, [
    draft,
    currentStage,
    user,
    hasRestoredDraft,
    saveCurrentDraft,
  ]);

  /* =======================================================
     Save immediately when changing stage
     ======================================================= */

  async function saveBeforeChangingStage(
    nextStage: number,
  ) {
    if (
      !user ||
      !hasRestoredDraft
    ) {
      return;
    }

    /*
     * Cancel the debounce timer because we're
     * explicitly saving now.
     */
    if (
      autoSaveTimer.current
    ) {
      clearTimeout(
        autoSaveTimer.current,
      );
    }

    await saveCurrentDraft(
      draft,
      nextStage,
    );
  }

  /* =======================================================
     Navigation
     ======================================================= */

  async function goToNextStage() {
    setSaveError('');

    if (
      currentStage === 1
    ) {
      if (!isIdeaComplete) {
        return;
      }
    }

    if (
      currentStage === 2
    ) {
      if (!isEvidenceComplete) {
        return;
      }
    }

    if (
      currentStage >=
      totalStages
    ) {
      return;
    }

    const nextStage =
      currentStage + 1;

    setCurrentStage(
      nextStage,
    );

    await saveBeforeChangingStage(
      nextStage,
    );
  }

  async function goToPreviousStage() {
    setSaveError('');

    if (
      currentStage <= 1
    ) {
      return;
    }

    const previousStage =
      currentStage - 1;

    setCurrentStage(
      previousStage,
    );

    await saveBeforeChangingStage(
      previousStage,
    );
  }

  /* =======================================================
     Manual save
     ======================================================= */

  async function handleSaveDraft() {
    if (!user) {
      setSaveError(
        'You must be signed in to save an idea.',
      );

      setSaveStatus(
        'error',
      );

      return;
    }

    if (
      autoSaveTimer.current
    ) {
      clearTimeout(
        autoSaveTimer.current,
      );
    }

    await saveCurrentDraft(
      draft,
      currentStage,
    );
  }

  /* =======================================================
     Publish
     ======================================================= */

  async function handlePublish(
    _visibility:
      | 'Public'
      | 'Limited'
      | 'Private',
  ) {
    setSaveError('');
    setSaveStatus('idle');

    if (!user) {
      setSaveError(
        'You must be signed in to publish an idea.',
      );
      setSaveStatus('error');
      return;
    }

    try {
      if (!ideaIdRef.current) {
        await saveCurrentDraft(
          latestDraftRef.current,
          latestStageRef.current,
        );
      }

      const ideaId =
        ideaIdRef.current;

      if (!ideaId) {
        throw new Error(
          'Save your idea before publishing it.',
        );
      }

      await publishIdea({
        variables: {
          id: ideaId,
        },
      });

      setSaveStatus('saved');
      setSaveError('');
      setSaveSuccess(
        'Your idea has been published successfully.',
      );

      window.setTimeout(() => {
        navigate('/my-ideas', {
          replace: true,
        });
      }, 800);
    } catch (error) {
      console.error(
        'Failed to publish idea:',
        error,
      );

      setSaveStatus('error');
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Unable to publish your idea.',
      );
    }
  }

  /* =======================================================
     Loading
     ======================================================= */

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
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading your Build workspace...
            </p>

          </div>
        </div>
      </PageContainer>
    );
  }

  /* =======================================================
     UI
     ======================================================= */

  return (
    <PageContainer>
      <div className="py-10">

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

        {/* Save status */}

        <div className="mt-5 flex items-center gap-3">

          {saveStatus === 'saving' && (
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-slate-500" />
              Saving...
            </div>
          )}

          {publishing && (
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-slate-500" />
              Publishing...
            </div>
          )}

          {saveStatus === 'saved' && (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <span className="text-sm">
                ✓
              </span>
              Saved just now
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700">
              Could not save
            </div>
          )}

        </div>

        {saveError && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {saveError}
          </div>
        )}

        {savedIdeaId && (
          <p className="mt-3 text-xs text-slate-400">
            Draft ID: {savedIdeaId}
          </p>
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
                (
                  currentStage /
                  totalStages
                ) * 100,
              )}
              %
            </p>

          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${
                  (
                    currentStage /
                    totalStages
                  ) * 100
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

        {/* =================================================
            STAGE 1
            ================================================= */}

        {currentStage === 1 && (
          <div className="mt-8 space-y-8">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

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

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

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

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

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
                    value={
                      draft.solutionDescription
                    }
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
                    value={
                      draft.howItWorks
                    }
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
                    value={
                      draft.uniqueValue
                    }
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

            </div>

            <div className="flex justify-end border-t border-slate-200 pt-6">

              <button
                type="button"
                onClick={() => {
                  void goToNextStage();
                }}
                disabled={
                  !isIdeaComplete
                }
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

        {/* =================================================
            STAGE 2
            ================================================= */}

        {currentStage === 2 && (
          <div className="mt-8 space-y-8">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

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

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

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
                    value={
                      draft.technologyApproach
                    }
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
                    value={
                      draft.technologyDomain
                    }
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

            </div>

            <ResearchEvidence
              items={
                draft.research
              }
              onChange={(
                research,
              ) =>
                updateDraft(
                  'research',
                  research,
                )
              }
            />

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

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
                    That&apos;s okay. You can publish
                    an early idea without validation and
                    add validation evidence later.
                  </div>
                )}

              </div>

            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">

              <button
                type="button"
                onClick={() => {
                  void goToPreviousStage();
                }}
                className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                ← Back to Idea
              </button>

              <button
                type="button"
                onClick={() => {
                  void goToNextStage();
                }}
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

        {/* =================================================
            STAGE 3
            ================================================= */}

        {currentStage === 3 && (
          <div className="mt-8 space-y-8">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

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

            </div>

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

            <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">

              <button
                type="button"
                onClick={() => {
                  void goToPreviousStage();
                }}
                className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                ← Back to Evidence
              </button>

              <button
                type="button"
                onClick={() => {
                  void goToNextStage();
                }}
                className="rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Continue to Funding →
              </button>

            </div>

          </div>
        )}

        {/* =================================================
            STAGE 4
            ================================================= */}

        {currentStage === 4 && (
          <div className="mt-8 space-y-8">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Funding
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                Get the resources your idea needs
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                Funding is only one part of building something
                new. Tell the community what support could help
                your idea progress.
              </p>

            </div>

            <FundingNeeds
              funding={
                draft.funding
              }
              onChange={(
                funding,
              ) =>
                updateDraft(
                  'funding',
                  funding,
                )
              }
            />

            <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">

              <button
                type="button"
                onClick={() => {
                  void goToPreviousStage();
                }}
                className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                ← Back to Collaboration
              </button>

              <button
                type="button"
                onClick={() => {
                  void goToNextStage();
                }}
                className="rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Review Idea →
              </button>

            </div>

          </div>
        )}

        {/* =================================================
            STAGE 5
            ================================================= */}

        {currentStage === 5 && (
          <div className="mt-8">

            <ReviewStage
              draft={
                draft
              }
              saving={
                saving ||
                saveStatus ===
                  'saving'
              }
              onSaveDraft={() => {
                void handleSaveDraft();
              }}
              onPublish={
                handlePublish
              }
            />

            <div className="mt-6 border-t border-slate-200 pt-6">

              <button
                type="button"
                onClick={() => {
                  void goToPreviousStage();
                }}
                className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                ← Back to Funding
              </button>

            </div>

          </div>
        )}

      </div>
    </PageContainer>
  );
}