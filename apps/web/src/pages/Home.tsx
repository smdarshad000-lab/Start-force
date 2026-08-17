import { Link } from 'react-router-dom';

export function Home() {
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
          <Link to="/messages">Messages</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>

      <section className="hero">
        <p className="eyebrow">INDIA'S INNOVATION NETWORK</p>

        <h1>
          Discover ideas.
          <br />
          <em>Build what matters.</em>
        </h1>

        <p className="hero-copy">
          Discover emerging ideas, research, people and resources —
          then turn the right connections into real projects.
        </p>

        <div className="hero-actions">
          <Link to="/discover" className="primary">
            Explore ideas
          </Link>

          <Link to="/build" className="secondary">
            Submit an idea
          </Link>
        </div>
      </section>
    </main>
  );
}