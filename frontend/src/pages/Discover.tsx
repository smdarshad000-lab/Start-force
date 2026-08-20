import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { PageContainer } from '../components/layout/PageContainer';

type Idea = {
  id: string;
  title: string;
  category: string;
  stage: string;
  innovation: number;
  marketPotential: number;
  validation: number;
  teamStrength: number;
  researchers: number;
  contributors: number;
  funding: string;
};

type IdeaStatProps = {
  label: string;
  value: number;
};

type SortOption = 'newest' | 'innovation' | 'market' | 'validation' | 'team';

const ideas: Idea[] = [
  {
    id: '1',
    title: 'AI Crop Disease Detection',
    category: 'Agritech',
    stage: 'Prototype',
    innovation: 82,
    marketPotential: 76,
    validation: 67,
    teamStrength: 54,
    researchers: 12,
    contributors: 4,
    funding: '₹15L',
  },
  {
    id: '2',
    title: 'Low-Cost Water Quality Monitoring',
    category: 'Climate Tech',
    stage: 'Research',
    innovation: 88,
    marketPotential: 81,
    validation: 59,
    teamStrength: 72,
    researchers: 8,
    contributors: 6,
    funding: '₹10L',
  },
  {
    id: '3',
    title: 'AI Legal Assistant for MSMEs',
    category: 'AI',
    stage: 'MVP',
    innovation: 79,
    marketPotential: 91,
    validation: 74,
    teamStrength: 68,
    researchers: 16,
    contributors: 9,
    funding: '₹40L',
  },
];

const RECENT_SEARCHES_KEY = 'stat-force-recent-searches';

const categories = ['All', 'AI', 'Agritech', 'Climate Tech'];

const stages = ['All', 'Research', 'Prototype', 'MVP'];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'innovation', label: 'Innovation score' },
  { value: 'market', label: 'Market potential' },
  { value: 'validation', label: 'Validation' },
  { value: 'team', label: 'Team strength' },
];

export function Discover() {
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);

    if (!storedSearches) {
      return;
    }

    try {
      const parsedSearches: unknown = JSON.parse(storedSearches);

      if (Array.isArray(parsedSearches)) {
        const validSearches = parsedSearches.filter(
          (item): item is string => typeof item === 'string',
        );

        setRecentSearches(validSearches.slice(0, 6));
      }
    } catch {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  }, []);

  function saveRecentSearch(searchTerm: string) {
    const cleanedSearch = searchTerm.trim();

    if (!cleanedSearch) {
      return;
    }

    const updatedSearches = [
      cleanedSearch,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== cleanedSearch.toLowerCase(),
      ),
    ].slice(0, 6);

    setRecentSearches(updatedSearches);

    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(updatedSearches),
    );
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedSearch = search.trim();

    setActiveSearch(cleanedSearch);
    saveRecentSearch(cleanedSearch);
  }

  function handleRecentSearch(searchTerm: string) {
    setSearch(searchTerm);
    setActiveSearch(searchTerm);
    saveRecentSearch(searchTerm);
  }

  function clearRecentSearches() {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }

  function clearFilters() {
    setSearch('');
    setActiveSearch('');
    setSelectedCategory('All');
    setSelectedStage('All');
    setSortBy('newest');
  }

  const filteredIdeas = ideas.filter((idea) => {
    const query = activeSearch.toLowerCase();

    const matchesSearch =
      !activeSearch ||
      idea.title.toLowerCase().includes(query) ||
      idea.category.toLowerCase().includes(query) ||
      idea.stage.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === 'All' ||
      idea.category === selectedCategory;

    const matchesStage =
      selectedStage === 'All' ||
      idea.stage === selectedStage;

    return matchesSearch && matchesCategory && matchesStage;
  });

  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    switch (sortBy) {
      case 'innovation':
        return b.innovation - a.innovation;

      case 'market':
        return b.marketPotential - a.marketPotential;

      case 'validation':
        return b.validation - a.validation;

      case 'team':
        return b.teamStrength - a.teamStrength;

      case 'newest':
      default:
        return Number(b.id) - Number(a.id);
    }
  });

  const hasActiveFilters =
    Boolean(activeSearch) ||
    selectedCategory !== 'All' ||
    selectedStage !== 'All' ||
    sortBy !== 'newest';

  return (
    <PageContainer>
      <section className="py-10">
        {/* Page heading */}
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            Discover
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Discover India&apos;s emerging ideas
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Find ideas, research, projects and people building solutions for
            India&apos;s future.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="mt-10 flex w-full max-w-3xl gap-3"
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search ideas, technologies, sectors..."
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />

          <button
            type="submit"
            className="rounded-xl bg-slate-950 px-6 py-3.5 font-semibold text-white transition hover:bg-slate-800"
          >
            Search
          </button>
        </form>

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="mt-5 max-w-3xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Recent searches
              </p>

              <button
                type="button"
                onClick={clearRecentSearches}
                className="text-sm font-medium text-slate-400 transition hover:text-slate-950"
              >
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recentSearches.map((searchTerm) => (
                <button
                  key={searchTerm}
                  type="button"
                  onClick={() => handleRecentSearch(searchTerm)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {searchTerm}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mt-8 space-y-6">
          {/* Category */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Category
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={[
                      'rounded-full px-4 py-2 text-sm font-medium transition',
                      isActive
                        ? 'bg-slate-950 text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700',
                    ].join(' ')}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage */}
          <div>
            <p className="mb-3 text-sm font-medium text-slate-500">
              Stage
            </p>

            <div className="flex flex-wrap gap-2">
              {stages.map((stage) => {
                const isActive = selectedStage === stage;

                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setSelectedStage(stage)}
                    className={[
                      'rounded-full px-4 py-2 text-sm font-medium transition',
                      isActive
                        ? 'bg-slate-950 text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700',
                    ].join(' ')}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-500">
              Sort by
            </p>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 sm:w-auto"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results header */}
        <div className="mt-12 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              {activeSearch
                ? `Results for "${activeSearch}"`
                : selectedCategory !== 'All'
                  ? `${selectedCategory} ideas`
                  : selectedStage !== 'All'
                    ? `${selectedStage} ideas`
                    : 'Explore ideas'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {sortedIdeas.length}{' '}
              {sortedIdeas.length === 1 ? 'idea' : 'ideas'} found
            </p>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="w-fit text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Show all ideas
            </button>
          )}
        </div>

        {/* Results */}
        {sortedIdeas.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sortedIdeas.map((idea) => (
              <article
                key={idea.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Card metadata */}
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {idea.category}
                  </span>

                  <span className="text-xs font-medium text-slate-500">
                    {idea.stage}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-950">
                  {idea.title}
                </h3>

                {/* Statistics */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <IdeaStat
                    label="Innovation"
                    value={idea.innovation}
                  />

                  <IdeaStat
                    label="Market"
                    value={idea.marketPotential}
                  />

                  <IdeaStat
                    label="Validation"
                    value={idea.validation}
                  />

                  <IdeaStat
                    label="Team"
                    value={idea.teamStrength}
                  />
                </div>

                {/* Metadata */}
                <div className="mt-6 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-500">
                  <p>
                    {idea.researchers} researchers · {idea.contributors}{' '}
                    contributors
                  </p>

                  <p>{idea.funding} funding needed</p>
                </div>

                {/* Action */}
                <Link
                  to={`/idea/${idea.id}`}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  View idea
                </Link>
              </article>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-slate-950">
              No ideas found
            </h3>

            <p className="mt-2 text-slate-500">
              Try searching for another idea, selecting a different category,
              or choosing another stage.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </PageContainer>
  );
}

function IdeaStat({ label, value }: IdeaStatProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-2xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}