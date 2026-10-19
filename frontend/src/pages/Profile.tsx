
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Link } from 'react-router-dom';

import { PageContainer } from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

type ProfileIdea = {
  id: string;
  title: string;
  description: string;
  category: string;
  stage: string;
  status: string;
  visibility: string;
};

type MyIdeasData = {
  myIdeas: ProfileIdea[];
};

const MY_PROFILE_IDEAS = gql`
  query ProfileMyIdeas {
    myIdeas {
      id
      title
      description
      category
      stage
      status
      visibility
    }
  }
`;

export function Profile() {
  const { user, loading } = useAuth();

  const {
    data,
    loading: ideasLoading,
    error: ideasError,
    refetch,
  } = useQuery<MyIdeasData>(MY_PROFILE_IDEAS, {
    skip: !user,
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <PageContainer>
        <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading your profile...
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
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Sign in to view your profile
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Your startup ideas and innovation activity
            will appear here.
          </p>

          <Link
            to="/sign-in"
            className="mt-8 inline-flex rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign in
          </Link>
        </section>
      </PageContainer>
    );
  }

  const ideas = data?.myIdeas ?? [];

  const publishedIdeas = ideas.filter(
    (idea) => idea.status === 'PUBLISHED',
  ).length;

  const draftIdeas = ideas.filter(
    (idea) => idea.status === 'DRAFT',
  ).length;

  const archivedIdeas = ideas.filter(
    (idea) => idea.status === 'ARCHIVED',
  ).length;

  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const ideaCount =
    ideasLoading || ideasError ? null : ideas.length;

  return (
    <PageContainer>
      <section className="min-w-0 py-10 sm:py-14">
        <div className="mx-auto w-full min-w-0 max-w-5xl">

          {/* PROFILE HEADER */}
          <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-32 bg-slate-950 sm:h-40" />

            <div className="px-6 pb-8 sm:px-8">
              <div className="-mt-12 flex min-w-0 flex-col gap-6 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">

                <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-end">

                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-emerald-600 text-2xl font-bold text-white shadow-md sm:h-28 sm:w-28 sm:text-3xl">
                    {initials || 'SF'}
                  </div>

                  <div className="min-w-0 pb-1">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                      Innovation Profile
                    </p>

                    <h1 className="mt-1 break-words [overflow-wrap:anywhere] text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                      {user.name}
                    </h1>

                    <p className="mt-2 break-all text-sm text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  to="/build"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Build an idea
                </Link>
              </div>

              {/* DYNAMIC STATISTICS */}
              <div className="mt-10 grid min-w-0 gap-4 sm:grid-cols-3">

                <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total Ideas
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-950">
                    {ideaCount ?? '—'}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Published Ideas
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-600">
                    {ideaCount === null ? '—' : publishedIdeas}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Draft Ideas
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-950">
                    {ideaCount === null ? '—' : draftIdeas}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MY STARTUP IDEAS */}
          <section className="mt-8 min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">

              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  My Startup Ideas
                </p>

                <h2 className="mt-2 break-words text-2xl font-bold text-slate-950">
                  Ideas you've created
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Your startup ideas are retrieved from
                  your account's database records.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={() => {
                    void refetch();
                  }}
                  disabled={ideasLoading}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Refresh
                </button>

                <Link
                  to="/build"
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Create Idea
                </Link>
              </div>
            </div>

            {/* LOADING */}
            {ideasLoading ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading your startup ideas...
                </p>
              </div>

            ) : ideasError ? (

              /* ERROR */
              <div className="mt-6 min-w-0 rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="font-semibold text-red-700">
                  Unable to load your ideas
                </p>

                <p className="mt-2 break-words [overflow-wrap:anywhere] text-sm text-red-600">
                  {ideasError.message}
                </p>
              </div>

            ) : ideas.length === 0 ? (

              /* EMPTY STATE */
              <div className="py-12 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  No startup ideas yet
                </p>

                <p className="mt-2 text-slate-600">
                  Create your first startup idea to see it here.
                </p>

                <Link
                  to="/build"
                  className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Build your first idea
                </Link>
              </div>

            ) : (

              /* DYNAMIC IDEA CARDS */
              <div className="mt-8 grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">

                {ideas.map((idea) => (

                  <article
                    key={idea.id}
                    className="flex min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-300 hover:shadow-sm"
                  >

                    {/* STATUS BADGES */}
                    <div className="flex min-w-0 flex-wrap items-center gap-2">

                      <span
                        className={`max-w-full break-words rounded-full px-3 py-1 text-xs font-semibold ${
                          idea.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : idea.status === 'DRAFT'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {idea.status}
                      </span>

                      <span className="max-w-full break-words rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                        {idea.visibility}
                      </span>
                    </div>

                    {/* TITLE - OVERFLOW FIX */}
                    <h3 className="mt-4 min-w-0 max-w-full whitespace-normal break-words [overflow-wrap:anywhere] text-xl font-bold leading-7 text-slate-950">
                      {idea.title}
                    </h3>

                    {/* DESCRIPTION - OVERFLOW FIX */}
                    <p className="mt-3 min-w-0 max-w-full whitespace-normal break-words [overflow-wrap:anywhere] text-sm leading-6 text-slate-600">
                      {idea.description}
                    </p>

                    {/* CATEGORY AND STAGE */}
                    <div className="mt-5 flex min-w-0 flex-wrap gap-2">

                      <span className="max-w-full break-words [overflow-wrap:anywhere] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                        {idea.category}
                      </span>

                      <span className="max-w-full break-words [overflow-wrap:anywhere] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                        {idea.stage}
                      </span>
                    </div>

                    {/* VIEW IDEA - CORRECTED ROUTE */}
                    <div className="mt-auto pt-6">
                      <Link
                        to={`/idea/${idea.id}`}
                        className="inline-flex max-w-full items-center break-words text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
                      >
                        View Idea
                        <span className="ml-2" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* ABOUT AND ACTIVITY */}
          <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-2">

            <section className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                About You
              </p>

              <h2 className="mt-3 break-words text-2xl font-bold text-slate-950">
                Your innovation profile
              </h2>

              <p className="mt-3 break-words leading-7 text-slate-600">
                Your startup ideas, research interests,
                experience, and collaboration activity
                are part of your innovation journey.
              </p>

              <button
                type="button"
                className="mt-6 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                onClick={() => {
                  alert('Profile editing will be added next.');
                }}
              >
                Edit Profile
              </button>
            </section>

            <section className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Your Activity
              </p>

              <h2 className="mt-3 break-words text-2xl font-bold text-slate-950">
                Your innovation footprint
              </h2>

              <div className="mt-6 space-y-3">

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-4">
                  <span className="min-w-0 break-words text-sm font-medium text-slate-600">
                    Total Ideas
                  </span>

                  <span className="shrink-0 text-lg font-bold text-slate-950">
                    {ideaCount ?? '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-4">
                  <span className="min-w-0 break-words text-sm font-medium text-slate-600">
                    Published Ideas
                  </span>

                  <span className="shrink-0 text-lg font-bold text-slate-950">
                    {ideaCount === null ? '—' : publishedIdeas}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-4">
                  <span className="min-w-0 break-words text-sm font-medium text-slate-600">
                    Draft Ideas
                  </span>

                  <span className="shrink-0 text-lg font-bold text-slate-950">
                    {ideaCount === null ? '—' : draftIdeas}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-4">
                  <span className="min-w-0 break-words text-sm font-medium text-slate-600">
                    Archived Ideas
                  </span>

                  <span className="shrink-0 text-lg font-bold text-slate-950">
                    {ideaCount === null ? '—' : archivedIdeas}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
