import { Link, useParams } from 'react-router-dom';

import { PageContainer } from '../components/layout/PageContainer';
import { ideas } from '../data/ideas';

export function IdeaDetails() {
  const { id } = useParams();

  const idea = ideas.find((item) => item.id === id);

  if (!idea) {
    return (
      <PageContainer>
        <section className="flex min-h-[60vh] items-center justify-center py-12">
          <div className="max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Idea not found
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
              We couldn&apos;t find that idea.
            </h1>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              The idea may have been removed, or the URL may be incorrect.
            </p>

            <Link
              to="/discover"
              className="mt-8 inline-flex rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to Discover
            </Link>
          </div>
        </section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <section className="py-10">
        {/* Back */}
        <Link
          to="/discover"
          className="inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          ← Back to Discover
        </Link>

        {/* Hero */}
        <div className="mt-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {idea.category}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {idea.stage}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            {idea.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            {idea.description}
          </p>
        </div>

        {/* Scores */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard label="Innovation" value={idea.innovation} />
          <ScoreCard
            label="Market potential"
            value={idea.marketPotential}
          />
          <ScoreCard label="Validation" value={idea.validation} />
          <ScoreCard label="Team strength" value={idea.teamStrength} />
        </div>

        {/* Main content */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-950">
                About this idea
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                This section will eventually contain the complete problem,
                solution, technology, validation evidence and roadmap for the
                idea.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-950">
                Research
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Research papers, publications and evidence connected to this
                idea will appear here.
              </p>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-2xl font-bold text-slate-950">
                  {idea.researchers}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  researchers currently connected
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-medium text-slate-500">
                Funding needed
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {idea.funding}
              </p>

              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                I&apos;m interested
              </button>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-slate-950">
                Community
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {idea.contributors} contributors are currently connected with
                this idea.
              </p>

              <button
                type="button"
                className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                Join the project
              </button>
            </section>
          </aside>
        </div>
      </section>
    </PageContainer>
  );
}

type ScoreCardProps = {
  label: string;
  value: number;
};

function ScoreCard({ label, value }: ScoreCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-3xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-sm font-medium text-slate-500">
        {label}
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}