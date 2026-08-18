import { Link } from 'react-router-dom';

const ideas = [
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

export function Discover() {
  return (
    <div className="page">
      <section className="page-header">
        <p className="eyebrow">DISCOVER</p>

        <h2>India's emerging ideas</h2>

        <p>
          Find promising ideas, research, projects and opportunities.
        </p>
      </section>

      <div className="search-bar">
        <input placeholder="Search ideas..." />

        <button className="primary">
          Search
        </button>
      </div>

      <div className="filters">
        <button>All</button>
        <button>AI</button>
        <button>Agritech</button>
        <button>Health</button>
        <button>Climate</button>
        <button>Deep Tech</button>
      </div>

      <section className="idea-grid">
        {ideas.map((idea) => (
          <article className="idea-card" key={idea.id}>
            <div className="idea-card-top">
              <span>{idea.category}</span>
              <span>{idea.stage}</span>
            </div>

            <h3>{idea.title}</h3>

            <div className="stats-grid">
              <div>
                <strong>{idea.innovation}</strong>
                <span>Innovation</span>
              </div>

              <div>
                <strong>{idea.marketPotential}</strong>
                <span>Market</span>
              </div>

              <div>
                <strong>{idea.validation}</strong>
                <span>Validation</span>
              </div>

              <div>
                <strong>{idea.teamStrength}</strong>
                <span>Team</span>
              </div>
            </div>

            <div className="idea-meta">
              {idea.researchers} researchers · {idea.contributors} contributors
              <br />
              {idea.funding} funding needed
            </div>

            <Link
              to={`/idea/${idea.id}`}
              className="idea-button"
            >
              View idea
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}