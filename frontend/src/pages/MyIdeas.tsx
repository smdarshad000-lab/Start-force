import {
  gql,
  useQuery,
} from '@apollo/client';

import {
  Link,
} from 'react-router-dom';

import { PageContainer } from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

const MY_DRAFT_QUERY = gql`
  query MyDraft {
    myDraft {
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

type MyDraft = {
  id: string;
  status: 'DRAFT' | 'PUBLISHED';
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

export function MyIdeas() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const {
    data,
    loading,
    error,
  } = useQuery<{
    myDraft: MyDraft | null;
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

          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Your saved ideas and drafts are available
            from your Start-Force account.
          </p>

          <Link
            to="/sign-in"
            className="mt-8 inline-flex rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800"
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

            <p className="mt-2 text-sm">
              {error.message}
            </p>

          </div>

        </section>
      </PageContainer>
    );
  }

  const draft =
    data?.myDraft ?? null;

  return (
    <PageContainer>
      <section className="py-12">

        <div className="max-w-3xl">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            My Ideas
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Your ideas, all in one place.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Continue building your ideas or start
            something completely new.
          </p>

        </div>

        {!draft ? (
          <section className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
              +
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-950">
              No ideas yet
            </h2>

            <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
              Start building your first idea and it
              will automatically appear here once saved.
            </p>

            <Link
              to="/build"
              className="mt-7 inline-flex rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Start building →
            </Link>

          </section>
        ) : (
          <section className="mt-10">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
                      Draft
                    </span>

                    {draft.category && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {draft.category}
                      </span>
                    )}

                  </div>

                  <h2 className="mt-4 break-words text-2xl font-bold text-slate-950">
                    {draft.title ||
                      'Untitled idea'}
                  </h2>

                  <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                    {draft.description ||
                      'Continue building this idea to add more detail.'}
                  </p>

                </div>

                <Link
                  to="/build"
                  className="shrink-0 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Continue building →
                </Link>

              </div>

              <div className="mt-8 border-t border-slate-200 pt-6">

                <div className="grid gap-6 sm:grid-cols-3">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Current step
                    </p>

                    <p className="mt-2 text-lg font-bold text-slate-950">
                      Step {draft.currentStep} of 5
                    </p>

                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Stage
                    </p>

                    <p className="mt-2 text-lg font-bold text-slate-950">
                      {draft.stage}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Last saved
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-950">
                      {new Date(
                        draft.updatedAt,
                      ).toLocaleString()}
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
                    {Math.round(
                      (
                        draft.currentStep /
                        5
                      ) *
                        100,
                    )}
                    %
                  </span>

                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${
                        (
                          draft.currentStep /
                          5
                        ) *
                        100
                      }%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </section>
        )}

      </section>
    </PageContainer>
  );
}