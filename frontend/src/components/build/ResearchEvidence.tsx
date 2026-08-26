import { useState } from 'react';

import type {
  EvidenceType,
  ResearchItem,
} from '../../types/build';

type ResearchEvidenceProps = {
  items: ResearchItem[];
  onChange: (items: ResearchItem[]) => void;
};

const evidenceTypes: EvidenceType[] = [
  'Research Paper',
  'Patent',
  'Dataset',
  'Experiment',
  'Survey',
  'Report',
  'Website',
  'Other',
];

export function ResearchEvidence({
  items,
  onChange,
}: ResearchEvidenceProps) {
  const [isAdding, setIsAdding] = useState(false);

  const [type, setType] = useState<EvidenceType>('Research Paper');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [year, setYear] = useState('');
  const [relevance, setRelevance] = useState('');

  function resetForm() {
    setType('Research Paper');
    setTitle('');
    setUrl('');
    setSource('');
    setYear('');
    setRelevance('');
    setIsAdding(false);
  }

  function addEvidence() {
    if (!isFormValid) {
      return;
    }

    const newItem: ResearchItem = {
      id: crypto.randomUUID(),
      type,
      title: title.trim(),
      url: url.trim(),
      source: source.trim(),
      year: year.trim(),
      relevance: relevance.trim(),
    };

    onChange([...items, newItem]);

    resetForm();
  }

  function removeEvidence(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  const isFormValid =
    title.trim().length >= 3 &&
    relevance.trim().length >= 10;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Research & Evidence
          </p>

          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            Support your idea with evidence
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Add research papers, patents, datasets, experiments, surveys,
            reports, or other sources that help people understand and evaluate
            your idea.
          </p>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="shrink-0 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Add evidence
          </button>
        )}
      </div>

      {/* Add form */}
      {isAdding && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                Add research or evidence
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add information that can help others verify or understand your
                idea.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-medium text-slate-400 transition hover:text-slate-950"
            >
              Cancel
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {/* Type */}
            <div>
              <label
                htmlFor="evidence-type"
                className="block text-sm font-semibold text-slate-950"
              >
                Evidence type
              </label>

              <select
                id="evidence-type"
                value={type}
                onChange={(event) =>
                  setType(event.target.value as EvidenceType)
                }
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                {evidenceTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="evidence-title"
                className="block text-sm font-semibold text-slate-950"
              >
                Title
              </label>

              <input
                id="evidence-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Deep learning based plant disease detection"
                maxLength={200}
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* URL */}
            <div>
              <label
                htmlFor="evidence-url"
                className="block text-sm font-semibold text-slate-950"
              >
                URL
                <span className="ml-2 text-xs font-normal text-slate-400">
                  Optional
                </span>
              </label>

              <input
                id="evidence-url"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://..."
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* Source + Year */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="evidence-source"
                  className="block text-sm font-semibold text-slate-950"
                >
                  Author / Source
                </label>

                <input
                  id="evidence-source"
                  type="text"
                  value={source}
                  onChange={(event) => setSource(event.target.value)}
                  placeholder="e.g. IEEE, WHO, Researcher name"
                  maxLength={200}
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="evidence-year"
                  className="block text-sm font-semibold text-slate-950"
                >
                  Year
                </label>

                <input
                  id="evidence-year"
                  type="number"
                  min="1900"
                  max="2100"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  placeholder="2026"
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            {/* Relevance */}
            <div>
              <label
                htmlFor="evidence-relevance"
                className="block text-sm font-semibold text-slate-950"
              >
                Why is this relevant?
              </label>

              <p className="mt-1 text-sm text-slate-500">
                Explain how this source supports, validates, or informs your
                idea.
              </p>

              <textarea
                id="evidence-relevance"
                value={relevance}
                onChange={(event) => setRelevance(event.target.value)}
                placeholder="Explain why this evidence is relevant to your idea..."
                maxLength={750}
                rows={5}
                className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />

              <div className="mt-2 flex justify-between text-xs">
                <span
                  className={
                    relevance.trim().length >= 10
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }
                >
                  Minimum 10 characters
                </span>

                <span className="text-slate-400">
                  {relevance.length}/750
                </span>
              </div>
            </div>

            {/* Add */}
            <div className="flex justify-end border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={addEvidence}
                disabled={!isFormValid}
                className={[
                  'rounded-xl px-6 py-3.5 text-sm font-semibold transition',
                  isFormValid
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'cursor-not-allowed bg-slate-200 text-slate-400',
                ].join(' ')}
              >
                Add evidence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && !isAdding && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-semibold text-slate-950">
              No evidence added yet
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add research papers, datasets, patents, experiments, or other
              evidence that supports your idea.
            </p>

            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add your first evidence
            </button>
          </div>
        </div>
      )}

      {/* Added evidence */}
      {items.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-950">
              Added evidence
            </h3>

            <p className="text-sm text-slate-500">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {item.type}
                    </span>

                    {item.year && (
                      <span className="text-xs font-medium text-slate-400">
                        {item.year}
                      </span>
                    )}
                  </div>

                  <h4 className="mt-3 text-lg font-semibold text-slate-950">
                    {item.title}
                  </h4>

                  {item.source && (
                    <p className="mt-2 text-sm text-slate-500">
                      {item.source}
                    </p>
                  )}

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block break-all text-sm text-emerald-700 hover:text-emerald-800"
                    >
                      {item.url}
                    </a>
                  )}

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {item.relevance}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeEvidence(item.id)}
                  className="shrink-0 text-sm font-medium text-slate-400 transition hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}