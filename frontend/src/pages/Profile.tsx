
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
          <h1 className="text-4xl font-bold text-slate-950">
            Sign in to view your profile
          </h1>

          <p className="mt-4 text-slate-600">
            Your startup ideas and activity will appear here.
          </p>

          <Link
            to="/sign-in"
            className="mt-8 inline-flex rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
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

  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <PageContainer>
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-5xl">
          {/* PROFILE HEADER */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-32 bg-slate-950 sm:h-40" />

            <div className="px-6 pb-8 sm:px-8">
              <div className="-mt-12 flex flex-col gap-6 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-emerald-600 text-2xl font-bold text-white shadow-md sm:h-28 sm:w-28 sm:text-3xl">
                    {initials || 'SF'}
                  </div>

                  <div className="pb-1">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                      Innovation Profile
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                      {user.name}
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  to="/build"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Build an idea
                </Link>
              </div>

              {/* DYNAMIC IDEA COUNTS */}
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total ideas
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-950">
                    {ideasLoading ? '...' : ideasError ? '—' : ideas.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Published ideas
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-600">
                    {ideasLoading ? '...' : ideasError ? '—' : publishedIdeas}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Draft ideas
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-950">
                    {ideasLoading ? '...' : ideasError ? '—' : draftIdeas}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MY STARTUP IDEAS */}
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  My Startup Ideas
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  Ideas you've created
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Your ideas are retrieved directly from PostgreSQL.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => void refetch()}
                  disabled={ideasLoading}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Refresh
                </button>

                <Link
                  to="/build"
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Create idea
                </Link>
              </div>
            </div>

            {ideasLoading ? (
              <div className="py-12 text-center text-slate-500">
                Loading your startup ideas...
              </div>
            ) : ideasError ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="font-semibold text-red-700">
                  Unable to load your ideas.
                </p>

                <p className="mt-2 text-sm text-red-600">
                  {ideasError.message}
                </p>
              </div>
            ) : ideas.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  No startup ideas yet
                </p>

                <p className="mt-2 text-slate-600">
                  Create your first idea to see it here.
                </p>

                <Link
                  to="/build"
                  className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
                >
                  Build your first idea
                </Link>
              </div>
            ) : (
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {ideas.map((idea) => (
                  <article
                    key={idea.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-300 hover:shadow-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                        {idea.status}
                      </span>

                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                        {idea.visibility}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-slate-950">
                      {idea.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {idea.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                      <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                        {idea.category}
                      </span>

                      <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                        {idea.stage}
                      </span>
                    </div>

                    <Link
                      to={`/ideas/${idea.id}`}
                      className="mt-5 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                    >
                      View idea →
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* PROFILE INFORMATION */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                About you
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Your innovation profile
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Your startup ideas, research interests, experience,
                and collaboration activity are part of your
                innovation journey.
              </p>

              <button
                type="button"
                className="mt-6 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                onClick={() => {
                  alert('Profile editing will be added next.');
                }}
              >
                Edit profile
              </button>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Your activity
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Your innovation footprint
              </h2>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
                  <span className="text-sm font-medium text-slate-600">
                    Total ideas
                  </span>

                  <span className="text-lg font-bold text-slate-950">
                    {ideasLoading ? '...' : ideasError ? '—' : ideas.length}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
                  <span className="text-sm font-medium text-slate-600">
                    Published ideas
                  </span>

                  <span className="text-lg font-bold text-slate-950">
                    {ideasLoading ? '...' : ideasError ? '—' : publishedIdeas}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
                  <span className="text-sm font-medium text-slate-600">
                    Draft ideas
                  </span>

                  <span className="text-lg font-bold text-slate-950">
                    {ideasLoading ? '...' : ideasError ? '—' : draftIdeas}
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
