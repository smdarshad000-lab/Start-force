import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';

const stages = [
  'Idea',
  'Evidence',
  'Collaboration',
  'Funding',
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

const ideaStages = [
  'Research',
  'Prototype',
  'MVP',
  'Startup',
];

export function Build() {
  const [currentStage, setCurrentStage] = useState(1);

  // IDEA STAGE
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [ideaStage, setIdeaStage] = useState('');

  const [problemStatement, setProblemStatement] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [currentSolution, setCurrentSolution] = useState('');
  const [problemEvidence, setProblemEvidence] = useState('');

  const [solutionDescription, setSolutionDescription] = useState('');
  const [howItWorks, setHowItWorks] = useState('');
  const [uniqueValue, setUniqueValue] = useState('');

  // EVIDENCE STAGE
  // We'll add these sections later.
  
  const totalStages = stages.length;

  const isIdeaComplete =
    title.trim().length >= 5 &&
    description.trim().length >= 20 &&
    category !== '' &&
    ideaStage !== '' &&
    problemStatement.trim().length >= 30 &&
    targetUsers.trim().length >= 10 &&
    currentSolution.trim().length >= 20 &&
    problemEvidence.trim().length >= 20 &&
    solutionDescription.trim().length >= 30 &&
    howItWorks.trim().length >= 30 &&
    uniqueValue.trim().length >= 20;

  function goToNextStage() {
    if (currentStage === 1 && isIdeaComplete) {
      setCurrentStage(2);
      return;
    }

    if (currentStage < totalStages) {
      setCurrentStage((stage) => stage + 1);
    }
  }

  function goToPreviousStage() {
    if (currentStage > 1) {
      setCurrentStage((stage) => stage - 1);
    }
  }

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

        {/* Stage progress */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Stage {currentStage} of {totalStages}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {stages[currentStage - 1]}
              </p>
            </div>

            <p className="text-sm font-medium text-slate-500">
              {Math.round((currentStage / totalStages) * 100)}%
            </p>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${(currentStage / totalStages) * 100}%`,
              }}
            />
          </div>

          <div className="mt-6 grid grid-cols-5 gap-2">
            {stages.map((stage, index) => {
              const stageNumber = index + 1;
              const isCurrent = stageNumber === currentStage;
              const isCompleted = stageNumber < currentStage;

              return (
                <div key={stage} className="text-center">
                  <div
                    className={[
                      'mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold',
                      isCurrent
                        ? 'bg-slate-950 text-white'
                        : isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-400',
                    ].join(' ')}
                  >
                    {isCompleted ? '✓' : stageNumber}
                  </div>

                  <p
                    className={[
                      'mt-2 text-xs font-medium',
                      isCurrent
                        ? 'text-slate-950'
                        : isCompleted
                          ? 'text-emerald-700'
                          : 'text-slate-400',
                    ].join(' ')}
                  >
                    {stage}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* STAGE 1 */}
        {currentStage === 1 && (
          <div className="mt-8 space-y-8">
            {/* Basic Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Part 1
                </p>

                <h2 className="mt-3 text-2xl font-bold text-slate-950">
                  Basic information
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Start by giving your idea a clear identity.
                </p>
              </div>

              <div className="mt-8 space-y-6">
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

                <div>
                  <label
                    htmlFor="idea-description"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    Short description
                  </label>

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
                      value={ideaStage}
                      onChange={(event) => setIdeaStage(event.target.value)}
                      className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    >
                      <option value="">Select current stage</option>

                      {ideaStages.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Problem */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Part 2
                </p>

                <h2 className="mt-3 text-2xl font-bold text-slate-950">
                  Define the problem
                </h2>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="problem-statement"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    What problem are you solving?
                  </label>

                  <textarea
                    id="problem-statement"
                    value={problemStatement}
                    onChange={(event) =>
                      setProblemStatement(event.target.value)
                    }
                    placeholder="Describe the problem clearly and specifically..."
                    maxLength={1000}
                    rows={6}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <div className="mt-2 text-right text-xs text-slate-400">
                    {problemStatement.length}/1000
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="target-users"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    Who experiences this problem?
                  </label>

                  <textarea
                    id="target-users"
                    value={targetUsers}
                    onChange={(event) => setTargetUsers(event.target.value)}
                    placeholder="Identify the people, organizations, or communities affected..."
                    maxLength={500}
                    rows={4}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="current-solution"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    How is it handled today?
                  </label>

                  <textarea
                    id="current-solution"
                    value={currentSolution}
                    onChange={(event) =>
                      setCurrentSolution(event.target.value)
                    }
                    placeholder="Explain existing alternatives or processes..."
                    maxLength={750}
                    rows={5}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="problem-evidence"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    What evidence do you have?
                  </label>

                  <textarea
                    id="problem-evidence"
                    value={problemEvidence}
                    onChange={(event) =>
                      setProblemEvidence(event.target.value)
                    }
                    placeholder="Share interviews, observations, research, surveys, statistics..."
                    maxLength={1000}
                    rows={6}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>
            </section>

            {/* Solution */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Part 3
                </p>

                <h2 className="mt-3 text-2xl font-bold text-slate-950">
                  Describe the solution
                </h2>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="solution-description"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    What is your proposed solution?
                  </label>

                  <textarea
                    id="solution-description"
                    value={solutionDescription}
                    onChange={(event) =>
                      setSolutionDescription(event.target.value)
                    }
                    placeholder="Describe the product, service, system, or approach..."
                    maxLength={1200}
                    rows={7}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="how-it-works"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    How does it work?
                  </label>

                  <textarea
                    id="how-it-works"
                    value={howItWorks}
                    onChange={(event) => setHowItWorks(event.target.value)}
                    placeholder="Describe the main workflow or mechanism..."
                    maxLength={1200}
                    rows={7}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="unique-value"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    What makes your solution different?
                  </label>

                  <textarea
                    id="unique-value"
                    value={uniqueValue}
                    onChange={(event) => setUniqueValue(event.target.value)}
                    placeholder="Explain your key advantage or differentiator..."
                    maxLength={800}
                    rows={5}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>
            </section>

            {/* Stage navigation */}
            <div className="flex justify-end border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={goToNextStage}
                disabled={!isIdeaComplete}
                className={[
                  'rounded-xl px-6 py-3.5 text-sm font-semibold transition',
                  isIdeaComplete
                    ? 'bg-slate-950 text-white hover:bg-slate-800'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400',
                ].join(' ')}
              >
                Continue to Evidence →
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2 PLACEHOLDER */}
        {currentStage === 2 && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Stage 2
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Evidence
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Technology, research, and validation will be added here next.
            </p>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={goToPreviousStage}
                className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                ← Back to Idea
              </button>

              <button
                type="button"
                className="cursor-not-allowed rounded-xl bg-slate-100 px-6 py-3.5 text-sm font-semibold text-slate-400"
                disabled
              >
                Evidence coming next
              </button>
            </div>
          </section>
        )}
      </section>
    </PageContainer>
  );
}