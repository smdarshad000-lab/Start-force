import { Link } from 'react-router-dom';

export function Messages() {
  return (
    <main className="page">
      <nav className="nav">
        <Link to="/" className="brand">
          STAT<span>-FORCE</span>
        </Link>

        <div className="nav-actions">
          <Link to="/discover">Discover</Link>
          <Link to="/messages">Messages</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>

      <section className="page-header">
        <p className="eyebrow">MESSAGES</p>
        <h2>Communication</h2>
        <p>
          Connect directly with founders, researchers, contributors and experts.
        </p>
      </section>
    </main>
  );
}