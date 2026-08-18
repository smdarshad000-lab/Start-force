import { Link } from 'react-router-dom';

export function Research() {
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
        <p className="eyebrow">RESEARCH</p>
        <h2>Research intelligence</h2>
        <p>
          Discover research connected to ideas, technologies and opportunities.
        </p>
      </section>
    </main>
  );
}