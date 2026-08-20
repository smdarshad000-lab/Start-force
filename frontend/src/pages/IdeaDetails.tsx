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
          <ScoreCard
            label="Innovation"
            value={idea.innovation}
          />

          <ScoreCard
            label="Market potential"
            value={idea.marketPotential}
          />

          <ScoreCard
            label="Validation"
            value={idea.validation}
          />

          <ScoreCard
            label="Team strength"
            value={idea.teamStrength}
          />
        </div>

        {/* Main content */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Left column */}
          <div className="space-y-8">
            {/* Problem */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                The Problem
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                What problem is this idea solving?
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Farmers often need to identify crop diseases quickly, but
                access to agricultural experts can be limited. Delayed
                identification can lead to crop loss, unnecessary treatment,
                and lower productivity.
              </p>
            </section>

            {/* Solution */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                The Solution
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                How the idea approaches the problem
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                The platform uses computer vision to analyze crop images and
                identify potential diseases. The goal is to give farmers an
                early indication and help them decide when expert support is
                required.
              </p>
            </section>

            {/* Technology */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Technology
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Technology and approach
              </h2>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                  Computer Vision
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                  Machine Learning
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                  Mobile Applications
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                  Image Classification
                </span>
              </div>
            </section>

            {/* Roadmap */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Roadmap
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Current development stage
              </h2>

              <div className="mt-6 space-y-5">
                <RoadmapStep
                  number="01"
                  title="Research"
                  description="Collect datasets, research disease patterns, and validate the problem."
                  completed
                />

                <RoadmapStep
                  number="02"
                  title="Prototype"
                  description="Build and test an initial computer-vision model."
                  completed={idea.stage !== 'Research'}
                />

                <RoadmapStep
                  number="03"
                  title="MVP"
                  description="Develop a usable application for real-world users."
                  completed={idea.stage === 'MVP'}
                />

                <RoadmapStep
                  number="04"
                  title="Scale"
                  description="Expand crop coverage, improve accuracy, and grow adoption."
                  completed={false}
                />
              </div>
            </section>

            {/* Research */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Research
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Research connected to this idea
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Research papers, publications, patents, datasets and evidence
                connected to this idea will appear here.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  value={idea.researchers}
                  label="Researchers connected"
                />

                <InfoCard
                  value="12"
                  label="Relevant research papers"
                />
              </div>

              <button
                type="button"
                className="mt-6 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                Explore research
              </button>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-6">
            {/* Funding */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Funding needed
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {idea.funding}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Funding requirements will eventually be connected to the
                project&apos;s current stage, milestones, and verified funding
                information.
              </p>

              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                I&apos;m interested
              </button>
            </section>

            {/* Community */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                Community
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {idea.contributors} contributors are currently connected with
                this idea.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <InfoCard
                  value={idea.contributors}
                  label="Contributors"
                />

                <InfoCard
                  value={idea.researchers}
                  label="Researchers"
                />
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                Join the project
              </button>
            </section>

            {/* Team requirements */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Team
              </p>

              <h2 className="mt-3 text-xl font-bold text-slate-950">
                People needed
              </h2>

              <div className="mt-5 space-y-3">
                <TeamRole role="ML Engineer" />
                <TeamRole role="Agriculture Expert" />
                <TeamRole role="Product Designer" />
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                View team needs
              </button>
            </section>

            {/* Actions */}
            <section className="rounded-2xl bg-slate-950 p-6 text-white">
              <h2 className="text-xl font-bold">
                Want to help build this?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Connect with the team, offer your skills, or start a
                conversation about the idea.
              </p>

              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Connect with team
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
      <div className="flex items-end justify-between gap-4">
        <p className="text-3xl font-bold text-slate-950">
          {value}
        </p>

        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

type InfoCardProps = {
  value: string | number;
  label: string;
};

function InfoCard({ value, label }: InfoCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-2xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
        {label}
      </p>
    </div>
  );
}

type RoadmapStepProps = {
  number: string;
  title: string;
  description: string;
  completed: boolean;
};

function RoadmapStep({
  number,
  title,
  description,
  completed,
}: RoadmapStepProps) {
  return (
    <div className="flex gap-4">
      <div
        className={[
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
          completed
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-slate-100 text-slate-500',
        ].join(' ')}
      >
        {number}
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-950">
            {title}
          </h3>

          {completed && (
            <span className="text-xs font-medium text-emerald-600">
              Completed
            </span>
          )}
        </div>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

type TeamRoleProps = {
  role: string;
};

function TeamRole({ role }: TeamRoleProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">
        {role}
      </span>

      <span className="text-xs font-semibold text-emerald-600">
        Needed
      </span>
    </div>
  );
}