import { useState } from 'react';

import { CollaborationNeeds } from '../components/build/CollaborationNeeds';
import { FundingNeeds } from '../components/build/FundingNeeds';
import { ResearchEvidence } from '../components/build/ResearchEvidence';
import { PageContainer } from '../components/layout/PageContainer';

import {
  initialBuildDraft,
  type BuildDraft,
} from '../types/build';

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

const validationMethods = [
  'Not validated yet',
  'User interviews',
  'Survey',
  'Prototype testing',
  'Pilot',
  'Experiment',
  'Market research',
  'Other',
];

export function Build() {
  const [currentStage, setCurrentStage] = useState(1);

  // The entire Build form is stored in one draft.
  const [draft, setDraft] = useState<BuildDraft>(initialBuildDraft);

  const totalStages = stages.length;

  // Stage 1 validation
  const isIdeaComplete =
    draft.title.trim().length >= 5 &&
    draft.description.trim().length >= 20 &&
    draft.category !== '' &&
    draft.ideaStage !== '' &&
    draft.problemStatement.trim().length >= 30 &&
    draft.targetUsers.trim().length >= 10 &&
    draft.currentSolution.trim().length >= 20 &&
    draft.problemEvidence.trim().length >= 20 &&
    draft.solutionDescription.trim().length >= 30 &&
    draft.howItWorks.trim().length >= 30 &&
    draft.uniqueValue.trim().length >= 20;

  // Technology validation
  const isTechnologyComplete =
    draft.technologyApproach.trim().length >= 30 &&
    draft.technologyDomain.trim().length >= 5 &&
    draft.technologyReadiness !== '' &&
    draft.requiredTechnology.trim().length >= 20 &&
    draft.existingImplementation.trim().length >= 20;

  // Validation section
  const isValidationComplete =
    draft.validationMethod === 'Not validated yet' ||
    (draft.validationMethod !== '' &&
      draft.validationAudience.trim().length >= 5 &&
      draft.validationSampleSize.trim().length >= 1 &&
      draft.validationFindings.trim().length >= 20 &&
      draft.validationEvidence.trim().length >= 20);

  const isEvidenceComplete =
    isTechnologyComplete && isValidationComplete;

  function updateDraft<K extends keyof BuildDraft>(
    field: K,
    value: BuildDraft[K],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  function goToNextStage() {
    if (currentStage === 1) {
      if (!isIdeaComplete) {
        return;
      }

      setCurrentStage(2);
      return;
    }

    if (currentStage === 2) {
      if (!isEvidenceComplete) {
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

        {/* Stage 1: Idea */}
        {currentStage === 1 && (
          <div className="mt-8 space-y-8">
            {/* Basic information */}
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

                  <p className="mt-1 text-lg text-slate-500">
                    Give your idea a clear and memorable name.
                  </p>

                  <input
                    id="idea-title"
                    type="text"
                    value={draft.title}
                    onChange={(event) =>
                      updateDraft('title', event.target.value)
                    }
                    placeholder="e.g. AI Crop Disease Detection"
                    maxLength={100}
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <div className="mt-2 text-right text-xs text-slate-400">
                    {draft.title.length}/100
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
                    value={draft.description}
                    onChange={(event) =>
                      updateDraft('description', event.target.value)
                    }
                    placeholder="Describe what your idea does and who it helps..."
                    maxLength={500}
                    rows={5}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <div className="mt-2 text-right text-xs text-slate-400">
                    {draft.description.length}/500
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
                      value={draft.category}
                      onChange={(event) =>
                        updateDraft('category', event.target.value)
                      }
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
                      value={draft.ideaStage}
                      onChange={(event) =>
                        updateDraft('ideaStage', event.target.value)
                      }
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
                    value={draft.problemStatement}
                    onChange={(event) =>
                      updateDraft('problemStatement', event.target.value)
                    }
                    placeholder="Describe the problem clearly and specifically..."
                    maxLength={1000}
                    rows={6}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <div className="mt-2 text-right text-xs text-slate-400">
                    {draft.problemStatement.length}/1000
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
                    value={draft.targetUsers}
                    onChange={(event) =>
                      updateDraft('targetUsers', event.target.value)
                    }
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
                    value={draft.currentSolution}
                    onChange={(event) =>
                      updateDraft('currentSolution', event.target.value)
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
                    value={draft.problemEvidence}
                    onChange={(event) =>
                      updateDraft('problemEvidence', event.target.value)
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
                    value={draft.solutionDescription}
                    onChange={(event) =>
                      updateDraft('solutionDescription', event.target.value)
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
                    value={draft.howItWorks}
                    onChange={(event) =>
                      updateDraft('howItWorks', event.target.value)
                    }
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
                    value={draft.uniqueValue}
                    onChange={(event) =>
                      updateDraft('uniqueValue', event.target.value)
                    }
                    placeholder="Explain your key advantage or differentiator..."
                    maxLength={800}
                    rows={5}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>
            </section>

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

        {/* Stage 2: Evidence */}
        {currentStage === 2 && (
          <div className="mt-8 space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Evidence
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Show how strong your idea is
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                Add the technical foundation, research, and real-world
                validation that help other people understand and evaluate your
                idea.
              </p>
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
                  This works for software, engineering, biotechnology,
                  climate research, materials science, and other technical
                  projects.
                </p>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="technology-approach"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    What technology or approach are you using?
                  </label>

                  <textarea
                    id="technology-approach"
                    value={draft.technologyApproach}
                    onChange={(event) =>
                      updateDraft('technologyApproach', event.target.value)
                    }
                    placeholder="Example: A computer-vision model trained on crop disease images..."
                    maxLength={1200}
                    rows={7}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <div className="mt-2 text-right text-xs text-slate-400">
                    {draft.technologyApproach.length}/1200
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="technology-domain"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    Technology or scientific domain
                  </label>

                  <input
                    id="technology-domain"
                    type="text"
                    value={draft.technologyDomain}
                    onChange={(event) =>
                      updateDraft('technologyDomain', event.target.value)
                    }
                    placeholder="e.g. Computer Vision, Biotechnology, Materials Science"
                    maxLength={150}
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <div className="mt-2 text-right text-xs text-slate-400">
                    {draft.technologyDomain.length}/150
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="technology-readiness"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    Current technology readiness
                  </label>

                  <select
                    id="technology-readiness"
                    value={draft.technologyReadiness}
                    onChange={(event) =>
                      updateDraft('technologyReadiness', event.target.value)
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

                <div>
                  <label
                    htmlFor="required-technology"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    What technology or resources are still required?
                  </label>

                  <textarea
                    id="required-technology"
                    value={draft.requiredTechnology}
                    onChange={(event) =>
                      updateDraft('requiredTechnology', event.target.value)
                    }
                    placeholder="Example: GPU compute, ML engineer, agricultural dataset, field testing equipment..."
                    maxLength={1000}
                    rows={6}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <div className="mt-2 text-right text-xs text-slate-400">
                    {draft.requiredTechnology.length}/1000
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="existing-implementation"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    What have you already built or tested?
                  </label>

                  <textarea
                    id="existing-implementation"
                    value={draft.existingImplementation}
                    onChange={(event) =>
                      updateDraft(
                        'existingImplementation',
                        event.target.value,
                      )
                    }
                    placeholder="Example: We built an initial prototype and tested it on 500 images..."
                    maxLength={1000}
                    rows={6}
                    className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <div className="mt-2 text-right text-xs text-slate-400">
                    {draft.existingImplementation.length}/1000
                  </div>
                </div>
              </div>
            </section>

            {/* Research */}
            <ResearchEvidence
              items={draft.research}
              onChange={(research) =>
                updateDraft('research', research)
              }
            />

            {/* Validation */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Validation
                </p>

                <h2 className="mt-3 text-2xl font-bold text-slate-950">
                  Show what you have learned so far
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Validation helps people understand whether the problem and
                  solution have been tested with real users, experiments, or
                  other evidence.
                </p>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <label
                    htmlFor="validation-method"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    How have you validated the idea?
                  </label>

                  <select
                    id="validation-method"
                    value={draft.validationMethod}
                    onChange={(event) =>
                      updateDraft('validationMethod', event.target.value)
                    }
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="">Select validation method</option>

                    {validationMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                {draft.validationMethod !== '' &&
                  draft.validationMethod !== 'Not validated yet' && (
                    <>
                      <div>
                        <label
                          htmlFor="validation-audience"
                          className="block text-sm font-semibold text-slate-950"
                        >
                          Who did you test with?
                        </label>

                        <input
                          id="validation-audience"
                          type="text"
                          value={draft.validationAudience}
                          onChange={(event) =>
                            updateDraft(
                              'validationAudience',
                              event.target.value,
                            )
                          }
                          placeholder="e.g. 25 farmers in Maharashtra"
                          className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="validation-sample-size"
                          className="block text-sm font-semibold text-slate-950"
                        >
                          How many people or tests were involved?
                        </label>

                        <input
                          id="validation-sample-size"
                          type="number"
                          min="1"
                          value={draft.validationSampleSize}
                          onChange={(event) =>
                            updateDraft(
                              'validationSampleSize',
                              event.target.value,
                            )
                          }
                          placeholder="e.g. 25"
                          className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="validation-findings"
                          className="block text-sm font-semibold text-slate-950"
                        >
                          What did you learn?
                        </label>

                        <textarea
                          id="validation-findings"
                          value={draft.validationFindings}
                          onChange={(event) =>
                            updateDraft(
                              'validationFindings',
                              event.target.value,
                            )
                          }
                          placeholder="Describe the main findings from your validation..."
                          maxLength={1200}
                          rows={6}
                          className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />

                        <div className="mt-2 text-right text-xs text-slate-400">
                          {draft.validationFindings.length}/1200
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="validation-evidence"
                          className="block text-lg font-semibold text-slate-950"
                        >
                          What evidence supports the result?
                        </label>

                        <textarea
                          id="validation-evidence"
                          value={draft.validationEvidence}
                          onChange={(event) =>
                            updateDraft(
                              'validationEvidence',
                              event.target.value,
                            )
                          }
                          placeholder="Add measurable results, observations, links, or other supporting evidence..."
                          maxLength={1200}
                          rows={6}
                          className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />

                        <div className="mt-2 text-right text-xs text-slate-400">
                          {draft.validationEvidence.length}/1200
                        </div>
                      </div>
                    </>
                  )}

                {draft.validationMethod === 'Not validated yet' && (
                  <div className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                    That&apos;s okay. You can publish an early idea without
                    validation and add validation evidence later.
                  </div>
                )}
              </div>
            </section>

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
                disabled={!isEvidenceComplete}
                className={[
                  'rounded-xl px-6 py-3.5 text-sm font-semibold transition',
                  isEvidenceComplete
                    ? 'bg-slate-950 text-white hover:bg-slate-800'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400',
                ].join(' ')}
              >
                Continue to Collaboration →
              </button>
            </div>
          </div>
        )}

        {/* Stage 3: Collaboration */}
        {currentStage === 3 && (
          <div className="mt-8 space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Collaboration
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                Find the people and expertise you need
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Tell the community which roles, skills, and collaborators would
                help you move this idea forward.
              </p>
            </section>

            <CollaborationNeeds />

            <div className="border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={goToPreviousStage}
                className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                ← Back to Evidence
              </button>
            </div>
          </div>
        )}

        {/* Stage 4: Funding */}
        {currentStage === 4 && (
          <div className="mt-8 space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Funding
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                Get the resources your idea needs
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                Funding is only one part of building something new. Tell people
                what financial support and other resources could help your idea
                progress.
              </p>
            </section>

            <FundingNeeds />

            <div className="border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={goToPreviousStage}
                className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                ← Back to Collaboration
              </button>
            </div>
          </div>
        )}

        {/* Stage 5: Review */}
        {currentStage === 5 && (
          <div className="mt-8 space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Review
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                Review & publish
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                Privacy settings, preview, and publishing will be built here
                next.
              </p>
            </section>

            <div className="border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={goToPreviousStage}
                className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              >
                ← Back to Funding
              </button>
            </div>
          </div>
        )}
      </section>
    </PageContainer>
  );
}                   