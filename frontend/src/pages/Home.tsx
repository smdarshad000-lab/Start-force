import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';

export function Home() {
  return (
    <PageContainer>
      <section className="flex min-h-[calc(100vh-4rem)] items-center">
        <div className="mx-auto w-full max-w-5xl px-4 text-center sm:px-6">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            India's Innovation Network
          </p>

          <h1 className="text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl md:text-7xl lg:text-8xl">
            Discover ideas.
            <br />

            <span className="text-emerald-600">
              Build what matters.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            Discover emerging ideas, research, people and resources — then turn
            the right connections into real projects.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/discover"
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
            >
              Explore ideas
            </Link>

            <Link
              to="/build"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-100 sm:w-auto"
            >
              Submit an idea
            </Link>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-4">
            <span className="text-slate-500">
              Already have an account?
            </span>

            <Link
              to="/sign-in"
              className="font-semibold text-emerald-700 transition hover:text-emerald-800"
            >
              Sign in
            </Link>

            <span className="hidden text-slate-300 sm:inline">
              |
            </span>

            <Link
              to="/sign-up"
              className="font-semibold text-slate-900 transition hover:text-slate-700"
            >
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}