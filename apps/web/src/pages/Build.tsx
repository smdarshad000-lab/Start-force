import { Link } from 'react-router-dom';

export function Build() {
  return (
    <main className="page">
      <nav className="nav">
        <Link to="/" className="brand">
          STAT<span>-FORCE</span>
        </Link>

        <div className="nav-actions">
          <Link to="/discover">Discover</Link>
          <Link to="/research">Research</Link>
          <Link to="/build">Build</Link>
        </div>
      </nav>

      <section className="page-header">
        <p className="eyebrow">BUILD</p>
        <h2>Turn an idea into a project</h2>
        <p>
          Submit an idea, define what you need and find the right people.
        </p>
      </section>
    </main>
  );
}