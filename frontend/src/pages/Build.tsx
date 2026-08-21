import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ResearchEvidence } from '../components/build/ResearchEvidence';

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

const technologyReadinessLevels = [
  'Concept only',
  'Early research',
  'Proof of concept',
  'Working prototype',
  'Tested prototype',
  'Production ready',
];

export function Build() {
  const [currentStage, setCurrentStage] = useState(1);

  // ============================================================
  // STAGE 1 — IDEA
  // ============================================================

  // Basic information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [ideaStage, setIdeaStage] = useState('');

  // Problem
  const [problemStatement, setProblemStatement] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [currentSolution, setCurrentSolution] = useState('');
  const [problemEvidence, setProblemEvidence] = useState('');

  // Solution
  const [solutionDescription, setSolutionDescription] = useState('');
  const [howItWorks, setHowItWorks] = useState('');
  const [uniqueValue, setUniqueValue] = useState('');

  // ============================================================
  // STAGE 2 — EVIDENCE
  // ============================================================

  // Technology
  const [technologyApproach, setTechnologyApproach] = useState('');
  const [technologyDomain, setTechnologyDomain] = useState('');
  const [technologyReadiness, setTechnologyReadiness] = useState('');
  const [requiredTechnology, setRequiredTechnology] = useState('');
  const [existingImplementation, setExistingImplementation] = useState('');

  const totalStages = stages.length;
  
  <ResearchEvidence />

  // ============================================================
  // VALIDATION
  // ============================================================

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

  const isTechnologyComplete =
    technologyApproach.trim().length >= 30 &&
    technologyDomain.trim().length >= 5 &&
    technologyReadiness !== '' &&
    requiredTechnology.trim().length >= 20 &&
    existingImplementation.trim().length >= 20;

  // ============================================================
  // NAVIGATION
  // ============================================================

  function goToNextStage() {
    if (currentStage === 1) {
      if (!isIdeaComplete) {
        return;
      }

      setCurrentStage(2);
      return;
    }

    if (currentStage === 2) {
      if (!isTechnologyComplete) {
        return;
      }

      setCurrentStage(3);
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
        {/* ========================================================
            HEADER
        ======================================================== */}

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

        {/* ========================================================
            STAGE PROGRESS
        ======================================================== */}

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

          {/* Progress bar */}
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${(currentStage / totalStages) * 100}%`,
              }}
            />
          </div>

          {/* Stage indicators */}
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

        {/* ========================================================
            STAGE 1 — IDEA
        ======================================================== */}

        {currentStage === 1 && (
          <div className="mt-8 space-y-8">
            {/* ----------------------------------------------------
                BASIC INFORMATION
            ---------------------------------------------------- */}

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
                    Explain what your idea does and who it helps.
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

            {/* ----------------------------------------------------
                PROBLEM
            ---------------------------------------------------- */}

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
                {/* Problem statement */}
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

                {/* Target users */}
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

                {/* Current solution */}
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

                {/* Evidence */}
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

            {/* ----------------------------------------------------
                SOLUTION
            ---------------------------------------------------- */}

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
                {/* Proposed solution */}
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

                {/* How it works */}
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

                {/* Unique value */}
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

            {/* Stage 1 navigation */}
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

        {/* ========================================================
            STAGE 2 — EVIDENCE
        ======================================================== */}

        {currentStage === 2 && (
          <div className="mt-8 space-y-8">
            {/* Stage heading */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Stage 2 · Evidence
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  Show how your idea works
                </h2>

                <p className="mt-4 leading-7 text-slate-600">
                  Help people understand the technical or scientific
                  foundation of your idea, what you have already built, and
                  what you still need.
                </p>
              </div>
            </section>

            {/* Technology */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Technology
                </p>

                <h2 className="mt-3 text-2xl font-bold text-slate-950">
                  Technical or scientific approach
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  This section should work for software, engineering,
                  biotechnology, climate research, materials science, and
                  other technical projects.
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
                    Explain the core technical, scientific, or engineering
                    approach.
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

                {/* Technology domain */}
                <div>
                  <label
                    htmlFor="technology-domain"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    Technology or scientific domain
                  </label>

                  <p className="mt-1 text-sm text-slate-500">
                    Identify the main technical or scientific field.
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

                {/* Technology readiness */}
                <div>
                  <label
                    htmlFor="technology-readiness"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    Current technology readiness
                  </label>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose the option that best represents the current state.
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
                    Describe any prototype, proof of concept, experiment,
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
              </div>
            </section>

            {/* Stage 2 navigation */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={goToPreviousStage}
                className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                ← Back to Idea
              </button>

              <button
                type="button"
                onClick={goToNextStage}
                disabled={!isTechnologyComplete}
                className={[
                  'rounded-xl px-6 py-3.5 text-sm font-semibold transition',
                  isTechnologyComplete
                    ? 'bg-slate-950 text-white hover:bg-slate-800'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400',
                ].join(' ')}
              >
                Continue to Collaboration →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STAGE 3 — COLLABORATION
        ======================================================== */}

        {currentStage === 3 && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Stage 3
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Collaboration
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Team requirements, skills, roles, and collaboration needs will
              be built here next.
            </p>

            <button
              type="button"
              onClick={goToPreviousStage}
              className="mt-8 rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
            >
              ← Back to Evidence
            </button>
          </section>
        )}

        {/* ========================================================
            STAGE 4 — FUNDING
        ======================================================== */}

        {currentStage === 4 && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Stage 4
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Funding & Resources
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Funding requirements and other resources will be built here
              next.
            </p>

            <button
              type="button"
              onClick={goToPreviousStage}
              className="mt-8 rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
            >
              ← Back to Collaboration
            </button>
          </section>
        )}

        {/* ========================================================
            STAGE 5 — REVIEW
        ======================================================== */}

        {currentStage === 5 && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Stage 5
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-950">
              Review & Publish
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Privacy settings, preview, and publishing will be built here
              next.
            </p>

            <button
              type="button"
              onClick={goToPreviousStage}
              className="mt-8 rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
            >
              ← Back to Funding
            </button>
          </section>
        )}
      </section>
    </PageContainer>
  );
}