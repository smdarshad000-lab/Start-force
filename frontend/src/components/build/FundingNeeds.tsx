import { useState } from 'react';

type FundingType =
  | 'Grant'
  | 'Investment'
  | 'Loan'
  | 'Bootstrapped'
  | 'Crowdfunding'
  | 'Other';

type FundingPurpose =
  | 'Research'
  | 'Prototype'
  | 'Equipment'
  | 'Team'
  | 'Operations'
  | 'Marketing'
  | 'Testing'
  | 'Other';

type ResourceType =
  | 'Lab access'
  | 'GPU / Compute'
  | 'Equipment'
  | 'Dataset'
  | 'Field access'
  | 'Mentorship'
  | 'Other';

type ResourceNeed = {
  id: string;
  type: ResourceType;
  description: string;
};

const fundingTypes: FundingType[] = [
  'Grant',
  'Investment',
  'Loan',
  'Bootstrapped',
  'Crowdfunding',
  'Other',
];

const fundingPurposes: FundingPurpose[] = [
  'Research',
  'Prototype',
  'Equipment',
  'Team',
  'Operations',
  'Marketing',
  'Testing',
  'Other',
];

const resourceTypes: ResourceType[] = [
  'Lab access',
  'GPU / Compute',
  'Equipment',
  'Dataset',
  'Field access',
  'Mentorship',
  'Other',
];

export function FundingNeeds() {
  const [needsFunding, setNeedsFunding] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [fundingType, setFundingType] = useState<FundingType | ''>('');
  const [fundingPurpose, setFundingPurpose] = useState<FundingPurpose | ''>(
    '',
  );

  const [resourceNeeds, setResourceNeeds] = useState<ResourceNeed[]>([]);
  const [isAddingResource, setIsAddingResource] = useState(false);

  const [resourceType, setResourceType] = useState<ResourceType>(
    'Lab access',
  );
  const [resourceDescription, setResourceDescription] = useState('');

  function addResource() {
    if (resourceDescription.trim().length < 5) {
      return;
    }

    const newResource: ResourceNeed = {
      id: crypto.randomUUID(),
      type: resourceType,
      description: resourceDescription.trim(),
    };

    setResourceNeeds((currentResources) => [
      ...currentResources,
      newResource,
    ]);

    setResourceDescription('');
    setIsAddingResource(false);
  }

  function removeResource(id: string) {
    setResourceNeeds((currentResources) =>
      currentResources.filter((resource) => resource.id !== id),
    );
  }

  const fundingComplete =
    needsFunding === 'No' ||
    (needsFunding === 'Yes' &&
      fundingAmount.trim() !== '' &&
      Number(fundingAmount) > 0 &&
      fundingType !== '' &&
      fundingPurpose !== '');

  return (
    <div className="space-y-8">
      {/* Funding */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Funding
          </p>

          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            What resources will help you move forward?
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Tell potential supporters what financial resources you need and
            what they would be used for.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Need funding */}
          <div>
            <p className="text-sm font-semibold text-slate-950">
              Do you need funding right now?
            </p>

            <div className="mt-3 flex flex-wrap gap-3">
              {['Yes', 'No'].map((option) => {
                const isActive = needsFunding === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setNeedsFunding(option)}
                    className={[
                      'rounded-xl px-5 py-3 text-sm font-semibold transition',
                      isActive
                        ? 'bg-slate-950 text-white'
                        : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Funding fields */}
          {needsFunding === 'Yes' && (
            <>
              <div>
                <label
                  htmlFor="funding-amount"
                  className="block text-sm font-semibold text-slate-950"
                >
                  Amount needed
                </label>

                <div className="mt-3 flex rounded-xl border border-slate-300 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
                  <span className="flex items-center border-r border-slate-200 px-4 text-slate-500">
                    ₹
                  </span>

                  <input
                    id="funding-amount"
                    type="number"
                    min="1"
                    value={fundingAmount}
                    onChange={(event) =>
                      setFundingAmount(event.target.value)
                    }
                    placeholder="e.g. 1500000"
                    className="min-w-0 flex-1 rounded-r-xl px-4 py-3.5 text-slate-950 outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="funding-type"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    Funding type
                  </label>

                  <select
                    id="funding-type"
                    value={fundingType}
                    onChange={(event) =>
                      setFundingType(
                        event.target.value as FundingType,
                      )
                    }
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="">Select funding type</option>

                    {fundingTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="funding-purpose"
                    className="block text-sm font-semibold text-slate-950"
                  >
                    Main purpose
                  </label>

                  <select
                    id="funding-purpose"
                    value={fundingPurpose}
                    onChange={(event) =>
                      setFundingPurpose(
                        event.target.value as FundingPurpose,
                      )
                    }
                    className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="">Select purpose</option>

                    {fundingPurposes.map((purpose) => (
                      <option key={purpose} value={purpose}>
                        {purpose}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {needsFunding === 'No' && (
            <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              That&apos;s completely fine. You can still list the non-financial
              resources that would help your idea progress.
            </div>
          )}

          {needsFunding !== '' && (
            <div
              className={[
                'rounded-xl p-4 text-sm',
                fundingComplete
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-amber-50 text-amber-800',
              ].join(' ')}
            >
              {fundingComplete
                ? 'Funding information is complete.'
                : 'Complete the funding fields to continue.'}
            </div>
          )}
        </div>
      </section>

      {/* Other resources */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Other resources
            </p>

            <h2 className="mt-3 text-2xl font-bold text-slate-950">
              What else do you need?
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Money is not the only resource an idea may need. Add things like
              lab access, compute, equipment, datasets, field access, or
              mentorship.
            </p>
          </div>

          {!isAddingResource && (
            <button
              type="button"
              onClick={() => setIsAddingResource(true)}
              className="shrink-0 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              + Add resource
            </button>
          )}
        </div>

        {/* Resource form */}
        {isAddingResource && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="resource-type"
                  className="block text-sm font-semibold text-slate-950"
                >
                  Resource type
                </label>

                <select
                  id="resource-type"
                  value={resourceType}
                  onChange={(event) =>
                    setResourceType(event.target.value as ResourceType)
                  }
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  {resourceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="resource-description"
                  className="block text-sm font-semibold text-slate-950"
                >
                  What do you need?
                </label>

                <textarea
                  id="resource-description"
                  value={resourceDescription}
                  onChange={(event) =>
                    setResourceDescription(event.target.value)
                  }
                  placeholder="e.g. Access to a GPU cluster for model training..."
                  maxLength={500}
                  rows={4}
                  className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <div className="mt-2 text-right text-xs text-slate-400">
                  {resourceDescription.length}/500
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setResourceDescription('');
                    setIsAddingResource(false);
                  }}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={addResource}
                  disabled={resourceDescription.trim().length < 5}
                  className={[
                    'rounded-xl px-5 py-3 text-sm font-semibold transition',
                    resourceDescription.trim().length >= 5
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'cursor-not-allowed bg-slate-200 text-slate-400',
                  ].join(' ')}
                >
                  Add resource
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resource list */}
        {resourceNeeds.length === 0 && !isAddingResource && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <h3 className="text-lg font-semibold text-slate-950">
              No additional resources listed
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add non-financial resources if they would help your project move
              forward.
            </p>
          </div>
        )}

        {resourceNeeds.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-950">
                Resource requirements
              </h3>

              <p className="text-sm text-slate-500">
                {resourceNeeds.length}{' '}
                {resourceNeeds.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            {resourceNeeds.map((resource) => (
              <article
                key={resource.id}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {resource.type}
                    </span>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {resource.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeResource(resource.id)}
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
    </div>
  );
}