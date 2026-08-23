import { useState } from 'react';

type CollaborationType =
  | 'Co-founder'
  | 'Team member'
  | 'Researcher'
  | 'Advisor'
  | 'Volunteer';

type TeamNeed = {
  id: string;
  role: string;
  responsibilities: string;
  skills: string;
  openings: string;
  collaborationType: CollaborationType;
};

const collaborationTypes: CollaborationType[] = [
  'Co-founder',
  'Team member',
  'Researcher',
  'Advisor',
  'Volunteer',
];

export function CollaborationNeeds() {
  const [teamNeeds, setTeamNeeds] = useState<TeamNeed[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const [role, setRole] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [skills, setSkills] = useState('');
  const [openings, setOpenings] = useState('1');
  const [collaborationType, setCollaborationType] =
    useState<CollaborationType>('Team member');

  function resetForm() {
    setRole('');
    setResponsibilities('');
    setSkills('');
    setOpenings('1');
    setCollaborationType('Team member');
    setIsAdding(false);
  }

  function addTeamNeed() {
    const newNeed: TeamNeed = {
      id: crypto.randomUUID(),
      role: role.trim(),
      responsibilities: responsibilities.trim(),
      skills: skills.trim(),
      openings,
      collaborationType,
    };

    setTeamNeeds((currentNeeds) => [...currentNeeds, newNeed]);

    resetForm();
  }

  function removeTeamNeed(id: string) {
    setTeamNeeds((currentNeeds) =>
      currentNeeds.filter((item) => item.id !== id),
    );
  }

  const isFormValid =
    role.trim().length >= 3 &&
    responsibilities.trim().length >= 15 &&
    skills.trim().length >= 3 &&
    Number(openings) >= 1;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Collaboration
          </p>

          <h2 className="mt-3 text-2xl font-bold text-slate-950">
            Find the people you need
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Tell people what roles, skills, and expertise you need to move
            this idea forward.
          </p>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="shrink-0 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Add team need
          </button>
        )}
      </div>

      {/* Optional state */}
      {teamNeeds.length === 0 && !isAdding && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <h3 className="text-lg font-semibold text-slate-950">
            No collaboration needs added
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            You can publish an idea without looking for collaborators right
            now. Add roles only when you need people to help build it.
          </p>

          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add your first team need
          </button>
        </div>
      )}

      {/* Add form */}
      {isAdding && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                Add a team requirement
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Describe the person you need and what they would work on.
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
            {/* Role */}
            <div>
              <label
                htmlFor="team-role"
                className="block text-sm font-semibold text-slate-950"
              >
                Role
              </label>

              <input
                id="team-role"
                type="text"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="e.g. ML Engineer"
                maxLength={100}
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label
                htmlFor="team-responsibilities"
                className="block text-sm font-semibold text-slate-950"
              >
                What will they work on?
              </label>

              <textarea
                id="team-responsibilities"
                value={responsibilities}
                onChange={(event) =>
                  setResponsibilities(event.target.value)
                }
                placeholder="Describe the main responsibilities..."
                maxLength={750}
                rows={5}
                className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />

              <div className="mt-2 text-right text-xs text-slate-400">
                {responsibilities.length}/750
              </div>
            </div>

            {/* Skills */}
            <div>
              <label
                htmlFor="team-skills"
                className="block text-sm font-semibold text-slate-950"
              >
                Skills or expertise
              </label>

              <p className="mt-1 text-sm text-slate-500">
                Separate multiple skills with commas.
              </p>

              <input
                id="team-skills"
                type="text"
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="e.g. Python, PyTorch, Computer Vision"
                maxLength={300}
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* Openings + collaboration type */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="team-openings"
                  className="block text-sm font-semibold text-slate-950"
                >
                  Number of people needed
                </label>

                <input
                  id="team-openings"
                  type="number"
                  min="1"
                  max="100"
                  value={openings}
                  onChange={(event) => setOpenings(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="collaboration-type"
                  className="block text-sm font-semibold text-slate-950"
                >
                  Collaboration type
                </label>

                <select
                  id="collaboration-type"
                  value={collaborationType}
                  onChange={(event) =>
                    setCollaborationType(
                      event.target.value as CollaborationType,
                    )
                  }
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  {collaborationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add */}
            <div className="flex justify-end border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={addTeamNeed}
                disabled={!isFormValid}
                className={[
                  'rounded-xl px-6 py-3.5 text-sm font-semibold transition',
                  isFormValid
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'cursor-not-allowed bg-slate-200 text-slate-400',
                ].join(' ')}
              >
                Add team need
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Added needs */}
      {teamNeeds.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-950">
              Team requirements
            </h3>

            <p className="text-sm text-slate-500">
              {teamNeeds.length}{' '}
              {teamNeeds.length === 1 ? 'role' : 'roles'}
            </p>
          </div>

          {teamNeeds.map((need) => (
            <article
              key={need.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {need.collaborationType}
                    </span>

                    <span className="text-xs font-medium text-slate-400">
                      {need.openings}{' '}
                      {Number(need.openings) === 1
                        ? 'position'
                        : 'positions'}
                    </span>
                  </div>

                  <h4 className="mt-3 text-xl font-semibold text-slate-950">
                    {need.role}
                  </h4>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {need.responsibilities}
                  </p>

                  <p className="mt-4 text-sm text-slate-500">
                    <span className="font-medium text-slate-700">
                      Skills:
                    </span>{' '}
                    {need.skills}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeTeamNeed(need.id)}
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