import { Link, useParams } from 'react-router-dom';

export function IdeaDetails() {
  const { id } = useParams();

  return (
    <main className="page">
      <nav className="nav">
        <Link to="/" className="brand">
          STAT<span>-FORCE</span>
        </Link>

        <div className="nav-actions">
          <Link to="/discover">Back to Discover</Link>
        </div>
      </nav>

      <section className="page-header">
        <p className="eyebrow">IDEA INTELLIGENCE</p>
        <h2>Idea {id}</h2>
        <p>
          This will become the complete intelligence page for the selected idea.
        </p>
      </section>
    </main>
  );
}