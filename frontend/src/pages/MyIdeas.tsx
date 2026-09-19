import {
  gql,
  useMutation,
  useQuery,
} from '@apollo/client';

import {
  Link,
} from 'react-router-dom';

import { PageContainer } from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

const MY_IDEAS_QUERY = gql`
  query MyIdeas {
    myIdeas {
      id
      status
      currentStep
      title
      description
      category
      stage
      updatedAt
    }
  }
`;

const ARCHIVE_IDEA_MUTATION = gql`
  mutation ArchiveIdea($id: ID!) {
    archiveIdea(id: $id)
  }
`;

const RESTORE_IDEA_MUTATION = gql`
  mutation RestoreIdea($id: ID!) {
    restoreIdea(id: $id)
  }
`;

type Idea = {
  id: string;

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

  updatedAt: string;
};

function getProgress(
  currentStep: number,
): number {
  const safeStep =
    Math.min(
      5,
      Math.max(
        1,
        currentStep,
      ),
    );

  return Math.round(
    (
      safeStep /
      5
    ) * 100,
  );
}

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

export function MyIdeas() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<{
    myIdeas: Idea[];
  }>(
    MY_IDEAS_QUERY,
    {
      skip:
        authLoading ||
        !user,

      fetchPolicy:
        'network-only',
    },
  );

  const [
    archiveIdea,
    {
      loading:
        archiveLoading,
    },
  ] = useMutation<{
    archiveIdea: boolean;
  }>(
    ARCHIVE_IDEA_MUTATION,
  );

  const [
    restoreIdea,
    {
      loading:
        restoreLoading,
    },
  ] = useMutation<{
    restoreIdea: boolean;
  }>(
    RESTORE_IDEA_MUTATION,
  );

  async function handleArchive(
    idea: Idea,
  ) {
    const confirmed =
      window.confirm(
        `Archive "${idea.title || 'Untitled idea'}"?\n\nYou can restore it later from the Archived section.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await archiveIdea({
        variables: {
          id: idea.id,
        },
      });

      await refetch();
    } catch (archiveError) {
      console.error(
        'Failed to archive idea',
        archiveError,
      );

      window.alert(
        archiveError instanceof Error
          ? archiveError.message
          : 'Unable to archive this idea.',
      );
    }
  }

  async function handleRestore(
    idea: Idea,
  ) {
    const confirmed =
      window.confirm(
        `Restore "${idea.title || 'Untitled idea'}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await restoreIdea({
        variables: {
          id: idea.id,
        },
      });

      await refetch();
    } catch (restoreError) {
      console.error(
        'Failed to restore idea',
        restoreError,
      );

      window.alert(
        restoreError instanceof Error
          ? restoreError.message
          : 'Unable to restore this idea.',
      );
    }
  }

  if (
    authLoading ||
    loading
  ) {
    return (
      <PageContainer>
        <section className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading your ideas...
            </p>

          </div>
        </section>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <section className="py-16 text-center">

          <h1 className="text-3xl font-bold text-slate-950">
            Sign in to view your ideas
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
            Your saved ideas are available
            from your Start-Force account.
          </p>

          <Link
            to="/sign-in"
            className="mt-8 inline-flex rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign in
          </Link>

        </section>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <section className="py-16">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">

            <h1 className="text-lg font-bold">
              Unable to load your ideas
            </h1>

            <p className="mt-2 text-sm leading-6">
              {error.message}
            </p>

          </div>

        </section>
      </PageContainer>
    );
  }

  const allIdeas =
    data?.myIdeas ?? [];

  const activeIdeas =
    allIdeas.filter(
      (idea) =>
        idea.status !==
        'ARCHIVED',
    );

  const archivedIdeas =
    allIdeas.filter(
      (idea) =>
        idea.status ===
        'ARCHIVED',
    );

  function renderIdeaCard(
    idea: Idea,
    archived: boolean,
  ) {
    const progress =
      getProgress(
        idea.currentStep,
      );

    const buildUrl =
      `/build?ideaId=${encodeURIComponent(
        idea.id,
      )}`;

    return (
      <article
        key={idea.id}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
      >

        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <span
                className={[
                  'rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',

                  archived
                    ? 'bg-slate-100 text-slate-600'
                    : idea.status ===
                        'PUBLISHED'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700',
                ].join(' ')}
              >
                {archived
                  ? 'Archived'
                  : idea.status ===
                      'PUBLISHED'
                    ? 'Published'
                    : 'Draft'}
              </span>

              {idea.category && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {idea.category}
                </span>
              )}

            </div>

            <h3 className="mt-4 wrap-break-words text-2xl font-bold text-slate-950">
              {idea.title ||
                'Untitled idea'}
            </h3>

            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              {idea.description ||
                'No description added yet.'}
            </p>

          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row xl:flex-col">

            {!archived ? (
              <>
                <Link
                  to={
                    buildUrl
                  }
                  className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Continue building →
                </Link>

                <Link
                  to={`/idea/${encodeURIComponent(
                    idea.id,
                  )}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                >
                  View idea
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    void handleArchive(
                      idea,
                    )
                  }
                  disabled={
                    archiveLoading
                  }
                  className="inline-flex items-center justify-center rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {archiveLoading
                    ? 'Archiving...'
                    : 'Archive'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() =>
                  void handleRestore(
                    idea,
                  )
                }
                disabled={
                  restoreLoading
                }
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {restoreLoading
                  ? 'Restoring...'
                  : 'Restore'}
              </button>
            )}

          </div>

        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">

          <div className="grid gap-6 sm:grid-cols-3">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Current step
              </p>

              <p className="mt-2 text-lg font-bold text-slate-950">
                Step{' '}
                {idea.currentStep}{' '}
                of 5
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Stage
              </p>

              <p className="mt-2 text-lg font-bold text-slate-950">
                {idea.stage}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Last saved
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-950">
                {formatDate(
                  idea.updatedAt,
                )}
              </p>
            </div>

          </div>

        </div>

        <div className="mt-7">

          <div className="flex items-center justify-between text-sm">

            <span className="font-semibold text-slate-700">
              Progress
            </span>

            <span className="font-medium text-slate-500">
              {progress}%
            </span>

          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </article>
    );
  }

  return (
    <PageContainer>
      <section className="py-12">

        {/* Header */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              My Ideas
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Your ideas, all in one place.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Keep track of ideas in progress,
              continue unfinished work, and revisit
              everything you have saved.
            </p>

          </div>

          <Link
            to="/build"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + New idea
          </Link>

        </div>

        {/* Active ideas */}

        <section className="mt-12">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Active ideas
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {activeIdeas.length}{' '}
                {activeIdeas.length === 1
                  ? 'idea'
                  : 'ideas'}
              </p>
            </div>

          </div>

          {activeIdeas.length ===
          0 ? (
            <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm sm:p-14">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600">
                +
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-950">
                No active ideas yet
              </h3>

              <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
                Start building your first idea
                and it will appear here once
                it is saved.
              </p>

              <Link
                to="/build"
                className="mt-7 inline-flex rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Start building →
              </Link>

            </section>
          ) : (
            <div className="mt-6 space-y-6">
              {activeIdeas.map(
                (idea) =>
                  renderIdeaCard(
                    idea,
                    false,
                  ),
              )}
            </div>
          )}

        </section>

        {/* Archived ideas */}

        <section className="mt-16">

          <div>

            <h2 className="text-2xl font-bold text-slate-950">
              Archived ideas
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {archivedIdeas.length}{' '}
              {archivedIdeas.length ===
              1
                ? 'archived idea'
                : 'archived ideas'}
            </p>

          </div>

          {archivedIdeas.length ===
          0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">

              <p className="text-sm text-slate-500">
                No archived ideas.
              </p>

            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {archivedIdeas.map(
                (idea) =>
                  renderIdeaCard(
                    idea,
                    true,
                  ),
              )}
            </div>
          )}

        </section>

      </section>
    </PageContainer>
  );
}