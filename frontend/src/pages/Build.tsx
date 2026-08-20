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

export function Build() {
  const currentStep = 1;
  const totalSteps = steps.length;

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

          {/* Progress bar */}
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${(currentStep / totalSteps) * 100}%`,
              }}
            />
          </div>

          {/* Step labels */}
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

        {/* First-step introduction */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Step 1
          </p>

          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            Start with the basics
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Begin by giving your idea a clear identity. We&apos;ll use this
            information throughout Stat-force to help people discover,
            understand, and connect with your idea.
          </p>
        </div>
      </section>
    </PageContainer>
  );
}