import { Link } from 'react-router-dom';

import { PageContainer } from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

export function Profile() {
  const {
    user,
    loading,
  } = useAuth();

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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Profile
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Sign in to view your profile
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Your profile, ideas, research, and collaboration activity
            will appear here.
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
                  className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Build an idea
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Profile
                  </p>

                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {user.name}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-slate-950">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Member since
                  </p>

                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {new Date(
                      user.createdAt,
                    ).toLocaleDateString(
                      'en-IN',
                      {
                        month: 'short',
                        year: 'numeric',
                      },
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                About you
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Your innovation profile
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Skills, research interests, experience, projects,
                and areas where you want to collaborate will live
                here.
              </p>

              <button
                type="button"
                className="mt-6 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                onClick={() => {
                  alert(
                    'Profile editing will be added next.',
                  );
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
                Start building your footprint
              </h2>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
                  <span className="text-sm font-medium text-slate-600">
                    Ideas
                  </span>

                  <span className="text-lg font-bold text-slate-950">
                    0
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
                  <span className="text-sm font-medium text-slate-600">
                    Collaborations
                  </span>

                  <span className="text-lg font-bold text-slate-950">
                    0
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
                  <span className="text-sm font-medium text-slate-600">
                    Research contributions
                  </span>

                  <span className="text-lg font-bold text-slate-950">
                    0
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