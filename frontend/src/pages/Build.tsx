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

const technologyReadinessLevels = [
  'Concept only',
  'Early research',
  'Proof of concept',
  'Working prototype',
  'Tested prototype',
  'Production ready',
];

export function Build() {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stage, setStage] = useState('');

  // Step 2
  const [problemStatement, setProblemStatement] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [currentSolution, setCurrentSolution] = useState('');
  const [problemEvidence, setProblemEvidence] = useState('');

  // Step 3
  const [solutionDescription, setSolutionDescription] = useState('');
  const [howItWorks, setHowItWorks] = useState('');
  const [uniqueValue, setUniqueValue] = useState('');

  // Step 4
  const [technologyApproach, setTechnologyApproach] = useState('');
  const [technologyDomain, setTechnologyDomain] = useState('');
  const [technologyReadiness, setTechnologyReadiness] = useState('');
  const [requiredTechnology, setRequiredTechnology] = useState('');
  const [existingImplementation, setExistingImplementation] = useState('');

  const totalSteps = steps.length;

  const isStepOneComplete =
    title.trim().length >= 5 &&
    description.trim().length >= 20 &&
    category !== '' &&
    stage !== '';

  const isStepTwoComplete =
    problemStatement.trim().length >= 30 &&
    targetUsers.trim().length >= 10 &&
    currentSolution.trim().length >= 20 &&
    problemEvidence.trim().length >= 20;

  const isStepThreeComplete =
    solutionDescription.trim().length >= 30 &&
    howItWorks.trim().length >= 30 &&
    uniqueValue.trim().length >= 20;

  const isStepFourComplete =
    technologyApproach.trim().length >= 30 &&
    technologyDomain.trim().length >= 5 &&
    technologyReadiness !== '' &&
    requiredTechnology.trim().length >= 20 &&
    existingImplementation.trim().length >= 20;

  function goToNextStep() {
    if (currentStep === 1 && isStepOneComplete) {
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2 && isStepTwoComplete) {
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3 && isStepThreeComplete) {
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4 && isStepFourComplete) {
      setCurrentStep(5);
    }
  }

  function goToPreviousStep() {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
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
                    {isCompleted ? '✓' : stepNumber}
                  </div>

                  <p
                    className={[
                      'mt-2 text-xs leading-4',
                      isCurrent
                        ? 'font-semibold text-slate-950'
                        : isCompleted
                          ? 'text-emerald-700'
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

        {/* STEP 1 */}
        {currentStep === 1 && (
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

              <div className="flex justify-end border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!isStepOneComplete}
                  className={[
                    'rounded-xl px-6 py-3.5 text-sm font-semibold transition',
                    isStepOneComplete
                      ? 'bg-slate-950 text-white hover:bg-slate-800'
                      : 'cursor-not-allowed bg-slate-100 text-slate-400',
                  ].join(' ')}
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Step 2
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Define the problem
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                A strong idea starts with a clearly understood problem. Help
                people understand what is wrong today and why it matters.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="problem-statement"
                  className="block text-sm font-semibold text-slate-950"
                >
                  What problem are you solving?
                </label>

                <p className="mt-1 text-sm text-slate-500">
                  Describe the problem clearly and specifically.
                </p>

                <textarea
                  id="problem-statement"
                  value={problemStatement}
                  onChange={(event) =>
                    setProblemStatement(event.target.value)
                  }
                  placeholder="Example: Farmers often cannot identify crop diseases early enough..."
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

                <p className="mt-1 text-sm text-slate-500">
                  Identify the people, organisations, or communities affected.
                </p>

                <textarea
                  id="target-users"
                  value={targetUsers}
                  onChange={(event) => setTargetUsers(event.target.value)}
                  placeholder="Example: Small and medium-sized farmers across India..."
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

                <p className="mt-1 text-sm text-slate-500">
                  Explain the existing alternatives or processes.
                </p>

                <textarea
                  id="current-solution"
                  value={currentSolution}
                  onChange={(event) =>
                    setCurrentSolution(event.target.value)
                  }
                  placeholder="Describe what people currently do to solve or manage the problem..."
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

                <p className="mt-1 text-sm text-slate-500">
                  Share interviews, observations, research, surveys, statistics,
                  or other evidence.
                </p>

                <textarea
                  id="problem-evidence"
                  value={problemEvidence}
                  onChange={(event) =>
                    setProblemEvidence(event.target.value)
                  }
                  placeholder="Example: We interviewed 35 farmers and 24 reported..."
                  maxLength={1000}
                  rows={6}
                  className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!isStepTwoComplete}
                  className={[
                    'rounded-xl px-6 py-3.5 text-sm font-semibold transition',
                    isStepTwoComplete
                      ? 'bg-slate-950 text-white hover:bg-slate-800'
                      : 'cursor-not-allowed bg-slate-100 text-slate-400',
                  ].join(' ')}
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Step 3
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Describe the solution
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Explain what you are proposing, how it solves the problem,
                and what makes your approach different.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="solution-description"
                  className="block text-sm font-semibold text-slate-950"
                >
                  What is your proposed solution?
                </label>

                <p className="mt-1 text-sm text-slate-500">
                  Describe the product, service, system, or approach you are
                  building.
                </p>

                <textarea
                  id="solution-description"
                  value={solutionDescription}
                  onChange={(event) =>
                    setSolutionDescription(event.target.value)
                  }
                  placeholder="Explain your proposed solution..."
                  maxLength={1200}
                  rows={7}
                  className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <div className="mt-2 text-right text-xs text-slate-400">
                  {solutionDescription.length}/1200
                </div>
              </div>

              <div>
                <label
                  htmlFor="how-it-works"
                  className="block text-sm font-semibold text-slate-950"
                >
                  How does it work?
                </label>

                <p className="mt-1 text-sm text-slate-500">
                  Describe the main workflow or mechanism behind your
                  solution.
                </p>

                <textarea
                  id="how-it-works"
                  value={howItWorks}
                  onChange={(event) =>
                    setHowItWorks(event.target.value)
                  }
                  placeholder="Describe how a user would interact with your solution..."
                  maxLength={1200}
                  rows={7}
                  className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <div className="mt-2 text-right text-xs text-slate-400">
                  {howItWorks.length}/1200
                </div>
              </div>

              <div>
                <label
                  htmlFor="unique-value"
                  className="block text-sm font-semibold text-slate-950"
                >
                  What makes your solution different?
                </label>

                <p className="mt-1 text-sm text-slate-500">
                  Explain your key advantage, unique insight, technology,
                  process, or other differentiator.
                </p>

                <textarea
                  id="unique-value"
                  value={uniqueValue}
                  onChange={(event) =>
                    setUniqueValue(event.target.value)
                  }
                  placeholder="What makes this solution different from existing alternatives?"
                  maxLength={800}
                  rows={5}
                  className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <div className="mt-2 text-right text-xs text-slate-400">
                  {uniqueValue.length}/800
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!isStepThreeComplete}
                  className={[
                    'rounded-xl px-6 py-3.5 text-sm font-semibold transition',
                    isStepThreeComplete
                      ? 'bg-slate-950 text-white hover:bg-slate-800'
                      : 'cursor-not-allowed bg-slate-100 text-slate-400',
                  ].join(' ')}
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Step 4
              </p>

              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                Technology and approach
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Tell people what technology, scientific methods, or technical
                approach your idea depends on. This section is designed to
                support both software ideas and research-heavy projects.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {/* Technology approach */}
              <div>
                <label
                  htmlFor="technology-approach"
                  className="block text-sm font-semibold text-slate-950"
                >
                  What technology or approach are you using?
                </label>

                <p className="mt-1 text-sm text-slate-500">
                  Explain the core technical or scientific approach behind
                  your solution.
                </p>

                <textarea
                  id="technology-approach"
                  value={technologyApproach}
                  onChange={(event) =>
                    setTechnologyApproach(event.target.value)
                  }
                  placeholder="Example: A computer-vision model trained on crop disease images..."
                  maxLength={1200}
                  rows={7}
                  className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <div className="mt-2 text-right text-xs text-slate-400">
                  {technologyApproach.length}/1200
                </div>
              </div>

              {/* Domain */}
              <div>
                <label
                  htmlFor="technology-domain"
                  className="block text-sm font-semibold text-slate-950"
                >
                  Technology or scientific domain
                </label>

                <p className="mt-1 text-sm text-slate-500">
                  What field does the technical work belong to?
                </p>

                <input
                  id="technology-domain"
                  type="text"
                  value={technologyDomain}
                  onChange={(event) =>
                    setTechnologyDomain(event.target.value)
                  }
                  placeholder="e.g. Computer Vision, Biotechnology, Materials Science"
                  maxLength={150}
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <div className="mt-2 text-right text-xs text-slate-400">
                  {technologyDomain.length}/150
                </div>
              </div>

              {/* Readiness */}
              <div>
                <label
                  htmlFor="technology-readiness"
                  className="block text-sm font-semibold text-slate-950"
                >
                  Current technology readiness
                </label>

                <p className="mt-1 text-sm text-slate-500">
                  Choose the option that best describes the current technical
                  state of the idea.
                </p>

                <select
                  id="technology-readiness"
                  value={technologyReadiness}
                  onChange={(event) =>
                    setTechnologyReadiness(event.target.value)
                  }
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option value="">
                    Select current technology readiness
                  </option>

                  {technologyReadinessLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Required technology */}
              <div>
                <label
                  htmlFor="required-technology"
                  className="block text-sm font-semibold text-slate-950"
                >
                  What technology or resources are still required?
                </label>

                <p className="mt-1 text-sm text-slate-500">
                  Tell potential collaborators what technical capabilities,
                  equipment, infrastructure, or expertise you still need.
                </p>

                <textarea
                  id="required-technology"
                  value={requiredTechnology}
                  onChange={(event) =>
                    setRequiredTechnology(event.target.value)
                  }
                  placeholder="Example: GPU compute, ML engineer, agricultural dataset, field testing equipment..."
                  maxLength={1000}
                  rows={6}
                  className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <div className="mt-2 text-right text-xs text-slate-400">
                  {requiredTechnology.length}/1000
                </div>
              </div>

              {/* Existing implementation */}
              <div>
                <label
                  htmlFor="existing-implementation"
                  className="block text-sm font-semibold text-slate-950"
                >
                  What have you already built or tested?
                </label>

                <p className="mt-1 text-sm text-slate-500">
                  Describe any prototype, experiment, proof of concept,
                  technical test, or implementation already completed.
                </p>

                <textarea
                  id="existing-implementation"
                  value={existingImplementation}
                  onChange={(event) =>
                    setExistingImplementation(event.target.value)
                  }
                  placeholder="Example: We built an initial prototype and tested it on 500 images..."
                  maxLength={1000}
                  rows={6}
                  className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <div className="mt-2 text-right text-xs text-slate-400">
                  {existingImplementation.length}/1000
                </div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!isStepFourComplete}
                  className={[
                    'rounded-xl px-6 py-3.5 text-sm font-semibold transition',
                    isStepFourComplete
                      ? 'bg-slate-950 text-white hover:bg-slate-800'
                      : 'cursor-not-allowed bg-slate-100 text-slate-400',
                  ].join(' ')}
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </PageContainer>
  );
}