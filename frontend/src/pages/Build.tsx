import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';

const steps = [
  'Basic information',
  'Problem',
  'Solution',
  'Technology',
  'Research',
  'Team',
  'Funding',
  'Privacy',
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

const stages = [
  'Research',
  'Prototype',
  'MVP',
  'Startup',
];

export function Build() {
  const currentStep = 1;
  const totalSteps = steps.length;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stage, setStage] = useState('');

  const isStepComplete =
    title.trim().length >= 5 &&
    description.trim().length >= 20 &&
    category !== '' &&
    stage !== '';

  return (
    <PageContainer>
      <section className="py-10">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            Build
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Turn your idea into something real.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Tell the community what you are building, what problem you are
            solving, and what you need to move forward.
          </p>
        </div>

        {/* Progress */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Step {currentStep} of {totalSteps}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {steps[currentStep - 1]}
              </p>
            </div>

            <p className="text-sm font-medium text-slate-500">
              {Math.round((currentStep / totalSteps) * 100)}%
            </p>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${(currentStep / totalSteps) * 100}%`,
              }}
            />
          </div>

          <div className="mt-6 hidden gap-2 lg:grid lg:grid-cols-9">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCurrent = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;

              return (
                <div key={step} className="text-center">
                  <div
                    className={[
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                      isCurrent
                        ? 'bg-slate-950 text-white'
                        : isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-400',
                    ].join(' ')}
                  >
                    {stepNumber}
                  </div>

                  <p
                    className={[
                      'mt-2 text-xs leading-4',
                      isCurrent
                        ? 'font-semibold text-slate-950'
                        : 'text-slate-400',
                    ].join(' ')}
                  >
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1 */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Step 1
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              Basic information
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Start by giving your idea a clear identity. This information
              will help people understand what your idea is about.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="idea-title"
                className="block text-sm font-semibold text-slate-950"
              >
                Idea title
              </label>

              <p className="mt-1 text-sm text-slate-500">
                Give your idea a clear and memorable name.
              </p>

              <input
                id="idea-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. AI Crop Disease Detection"
                maxLength={100}
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />

              <div className="mt-2 text-right text-xs text-slate-400">
                {title.length}/100
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="idea-description"
                className="block text-sm font-semibold text-slate-950"
              >
                Short description
              </label>

              <p className="mt-1 text-sm text-slate-500">
                Explain your idea in a way someone can understand quickly.
              </p>

              <textarea
                id="idea-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what your idea does and who it helps..."
                maxLength={500}
                rows={5}
                className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />

              <div className="mt-2 text-right text-xs text-slate-400">
                {description.length}/500
              </div>
            </div>

            {/* Category + Stage */}
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
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option value="">Select a category</option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
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
                  value={stage}
                  onChange={(event) => setStage(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option value="">Select current stage</option>

                  {stages.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Continue */}
            <div className="flex justify-end border-t border-slate-100 pt-6">
              <button
                type="button"
                disabled={!isStepComplete}
                className={[
                  'rounded-xl px-6 py-3.5 text-sm font-semibold transition',
                  isStepComplete
                    ? 'bg-slate-950 text-white hover:bg-slate-800'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400',
                ].join(' ')}
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}