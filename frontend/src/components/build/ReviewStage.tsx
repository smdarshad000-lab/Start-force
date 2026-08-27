import { useMemo, useState } from 'react';

import type { BuildDraft } from '../../types/build';

type Visibility = 'Public' | 'Limited' | 'Private';

type ReviewStageProps = {
  draft: BuildDraft;
  onSaveDraft: () => void;
  onPublish: (visibility: Visibility) => void;
};

export function ReviewStage({
  draft,
  onSaveDraft,
  onPublish,
}: ReviewStageProps) {
  const [visibility, setVisibility] =
    useState<Visibility>('Public');

  const [allowCollaborationRequests, setAllowCollaborationRequests] =
    useState(true);

  const [allowInvestorContact, setAllowInvestorContact] =
    useState(true);

  const [showProfile, setShowProfile] = useState(true);

  const completeness = useMemo(() => {
    const checks = [
      {
        label: 'Basic information',
        complete:
          draft.title.trim().length >= 5 &&
          draft.description.trim().length >= 20 &&
          draft.category !== '' &&
          draft.ideaStage !== '',
      },
      {
        label: 'Problem',
        complete:
          draft.problemStatement.trim().length >= 30 &&
          draft.targetUsers.trim().length >= 10 &&
          draft.currentSolution.trim().length >= 20 &&
          draft.problemEvidence.trim().length >= 20,
      },
      {
        label: 'Solution',
        complete:
          draft.solutionDescription.trim().length >= 30 &&
          draft.howItWorks.trim().length >= 30 &&
          draft.uniqueValue.trim().length >= 20,
      },
      {
        label: 'Technology',
        complete:
          draft.technologyApproach.trim().length >= 30 &&
          draft.technologyDomain.trim().length >= 5 &&
          draft.technologyReadiness !== '' &&
          draft.requiredTechnology.trim().length >= 20 &&
          draft.existingImplementation.trim().length >= 20,
      },
      {
        label: 'Validation',
        complete:
          draft.validationMethod === 'Not validated yet' ||
          (draft.validationMethod !== '' &&
            draft.validationAudience.trim().length >= 5 &&
            draft.validationSampleSize.trim().length >= 1 &&
            draft.validationFindings.trim().length >= 20 &&
            draft.validationEvidence.trim().length >= 20),
      },
      {
        label: 'Research',
        complete: draft.research.length > 0,
      },
      {
        label: 'Collaboration',
        complete: true,
      },
      {
        label: 'Funding',
        complete:
          draft.funding.needsFunding === '' ||
          draft.funding.needsFunding === 'No' ||
          (draft.funding.needsFunding === 'Yes' &&
            draft.funding.amount.trim() !== '' &&
            Number(draft.funding.amount) > 0 &&
            draft.funding.type !== '' &&
            draft.funding.purpose !== ''),
      },
    ];

    const completed = checks.filter(
      (item) => item.complete,
    ).length;

    return {
      checks,
      completed,
      total: checks.length,
      percentage: Math.round(
        (completed / checks.length) * 100,
      ),
    };
  }, [draft]);

  const canPublish =
    completeness.percentage === 100;

  function handlePublish() {
    if (!canPublish) {
      return;
    }

    onPublish(visibility);
  }

  return (
    <div className="mt-8 space-y-8">
      {/* Introduction */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Review
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          Review your idea before publishing
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          Check the information you've provided, choose who can see your
          idea, and decide how people can interact with it.
        </p>
      </section>

      {/* Completeness */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-950">
              Completeness
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {completeness.completed} of {completeness.total} sections
              are ready.
            </p>
          </div>

          <p className="text-2xl font-bold text-slate-950">
            {completeness.percentage}%
          </p>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{
              width: `${completeness.percentage}%`,
            }}
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {completeness.checks.map((check) => (
            <div
              key={check.label}
              className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
            >
              <div
                className={[
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  check.complete
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700',
                ].join(' ')}
              >
                {check.complete ? '✓' : '!'}
              </div>

              <span className="text-sm font-medium text-slate-700">
                {check.label}
              </span>
            </div>
          ))}
        </div>

        {!canPublish && (
          <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            Complete the required sections before publishing your idea.
            You can still save your progress as a draft.
          </div>
        )}
      </section>

      {/* Idea summary */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Your idea
            </p>

            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {draft.title || 'Untitled idea'}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {draft.category && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {draft.category}
              </span>
            )}

            {draft.ideaStage && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {draft.ideaStage}
              </span>
            )}
          </div>
        </div>

        <p className="mt-6 max-w-3xl leading-7 text-slate-600">
          {draft.description || 'No description added yet.'}
        </p>
      </section>

      {/* Problem + solution */}
      <section className="grid gap-8 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Problem
          </p>

          <h3 className="mt-3 text-xl font-bold text-slate-950">
            What problem are you solving?
          </h3>

          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
            {draft.problemStatement ||
              'No problem statement added yet.'}
          </p>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-sm font-semibold text-slate-950">
              Target users
            </p>

            <p className="mt-2 leading-6 text-slate-600">
              {draft.targetUsers ||
                'No target users added yet.'}
            </p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Solution
          </p>

          <h3 className="mt-3 text-xl font-bold text-slate-950">
            Proposed solution
          </h3>

          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">
            {draft.solutionDescription ||
              'No solution description added yet.'}
          </p>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-sm font-semibold text-slate-950">
              What makes it different?
            </p>

            <p className="mt-2 whitespace-pre-wrap leading-6 text-slate-600">
              {draft.uniqueValue ||
                'No differentiator added yet.'}
            </p>
          </div>
        </article>
      </section>

      {/* Evidence */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Evidence
            </p>

            <h3 className="mt-3 text-xl font-bold text-slate-950">
              Research and validation
            </h3>
          </div>

          <p className="text-sm text-slate-500">
            {draft.research.length}{' '}
            {draft.research.length === 1
              ? 'research item'
              : 'research items'}
          </p>
        </div>

        {draft.research.length > 0 ? (
          <div className="mt-6 space-y-3">
            {draft.research.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                    {item.type}
                  </span>

                  {item.year && (
                    <span className="text-xs text-slate-400">
                      {item.year}
                    </span>
                  )}
                </div>

                <p className="mt-3 font-semibold text-slate-950">
                  {item.title}
                </p>

                {item.source && (
                  <p className="mt-1 text-sm text-slate-500">
                    {item.source}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            No research evidence has been added yet.
          </p>
        )}

        <div className="mt-6 border-t border-slate-100 pt-6">
          <p className="text-sm font-semibold text-slate-950">
            Validation
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {draft.validationMethod || 'Not specified'}
          </p>

          {draft.validationMethod &&
            draft.validationMethod !== 'Not validated yet' && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Audience
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {draft.validationAudience}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Sample size
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {draft.validationSampleSize}
                  </p>
                </div>
              </div>
            )}
        </div>
      </section>

      {/* Collaboration */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Collaboration
            </p>

            <h3 className="mt-3 text-xl font-bold text-slate-950">
              People you are looking for
            </h3>
          </div>

          <p className="text-sm text-slate-500">
            {draft.collaborationNeeds.length}{' '}
            {draft.collaborationNeeds.length === 1
              ? 'role'
              : 'roles'}
          </p>
        </div>

        {draft.collaborationNeeds.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {draft.collaborationNeeds.map((need) => (
              <article
                key={need.id}
                className="rounded-xl bg-slate-50 p-5"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                    {need.collaborationType}
                  </span>

                  <span className="text-xs text-slate-400">
                    {need.openings}{' '}
                    {Number(need.openings) === 1
                      ? 'position'
                      : 'positions'}
                  </span>
                </div>

                <h4 className="mt-3 font-semibold text-slate-950">
                  {need.role}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {need.responsibilities}
                </p>

                <p className="mt-3 text-sm text-slate-500">
                  <span className="font-medium text-slate-700">
                    Skills:
                  </span>{' '}
                  {need.skills}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            No specific collaboration requirements added.
          </p>
        )}
      </section>

      {/* Funding */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Funding & Resources
        </p>

        <h3 className="mt-3 text-xl font-bold text-slate-950">
          What support does this idea need?
        </h3>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-xs font-medium text-slate-400">
              Funding
            </p>

            <p className="mt-2 text-lg font-bold text-slate-950">
              {draft.funding.needsFunding === 'Yes'
                ? 'Funding required'
                : draft.funding.needsFunding === 'No'
                  ? 'Not required'
                  : 'Not specified'}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-xs font-medium text-slate-400">
              Amount
            </p>

            <p className="mt-2 text-lg font-bold text-slate-950">
              {draft.funding.amount
                ? `₹${Number(
                    draft.funding.amount,
                  ).toLocaleString('en-IN')}`
                : '—'}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-xs font-medium text-slate-400">
              Resources
            </p>

            <p className="mt-2 text-lg font-bold text-slate-950">
              {draft.funding.resources.length}{' '}
              {draft.funding.resources.length === 1
                ? 'item'
                : 'items'}
            </p>
          </div>
        </div>
      </section>

      {/* Visibility */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Visibility & privacy
          </p>

          <h3 className="mt-3 text-2xl font-bold text-slate-950">
            Decide who can see your idea
          </h3>

          <p className="mt-3 leading-7 text-slate-600">
            Choose the visibility level before publishing.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              value: 'Public' as Visibility,
              title: 'Public',
              description:
                'Anyone on Start-force can discover this idea.',
            },
            {
              value: 'Limited' as Visibility,
              title: 'Limited',
              description:
                'Only people you approve can access the idea.',
            },
            {
              value: 'Private' as Visibility,
              title: 'Private',
              description:
                'Only you can access the idea.',
            },
          ].map((option) => {
            const isSelected =
              visibility === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setVisibility(option.value)
                }
                className={[
                  'rounded-2xl border p-5 text-left transition',
                  isSelected
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-950 hover:border-slate-400',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">
                    {option.title}
                  </span>

                  <span
                    className={[
                      'flex h-5 w-5 items-center justify-center rounded-full border text-xs',
                      isSelected
                        ? 'border-white'
                        : 'border-slate-300',
                    ].join(' ')}
                  >
                    {isSelected ? '✓' : ''}
                  </span>
                </div>

                <p
                  className={[
                    'mt-3 text-sm leading-6',
                    isSelected
                      ? 'text-slate-300'
                      : 'text-slate-500',
                  ].join(' ')}
                >
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Interaction permissions */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <h4 className="text-lg font-semibold text-slate-950">
            Interaction settings
          </h4>

          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={allowCollaborationRequests}
                onChange={(event) =>
                  setAllowCollaborationRequests(
                    event.target.checked,
                  )
                }
                className="mt-1 h-4 w-4 accent-emerald-600"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-950">
                  Allow collaboration requests
                </span>

                <span className="mt-1 block text-sm leading-6 text-slate-500">
                  Let people request to collaborate on this idea.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={allowInvestorContact}
                onChange={(event) =>
                  setAllowInvestorContact(
                    event.target.checked,
                  )
                }
                className="mt-1 h-4 w-4 accent-emerald-600"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-950">
                  Allow funding-related contact
                </span>

                <span className="mt-1 block text-sm leading-6 text-slate-500">
                  Allow interested funding participants to contact
                  you.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={showProfile}
                onChange={(event) =>
                  setShowProfile(event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-emerald-600"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-950">
                  Show your profile with this idea
                </span>

                <span className="mt-1 block text-sm leading-6 text-slate-500">
                  Allow viewers to see your public profile alongside the
                  idea.
                </span>
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-950">
              Ready to continue?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Save your work as a draft or publish it using the visibility
              settings above.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onSaveDraft}
              className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
            >
              Save draft
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={!canPublish}
              className={[
                'rounded-xl px-6 py-3.5 text-sm font-semibold transition',
                canPublish
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'cursor-not-allowed bg-slate-100 text-slate-400',
              ].join(' ')}
            >
              Publish idea
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}