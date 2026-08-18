import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';

export function Home() {
  return (
    <PageContainer>
      <section className="flex min-h-[calc(100vh-4rem)] items-center">
        <div className="mx-auto w-full max-w-5xl text-center">
          
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
              className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Explore ideas
            </Link>

            <Link
              to="/build"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-100"
            >
              Submit an idea
            </Link>

          </div>
        </div>
      </section>
    </PageContainer>
  );
}