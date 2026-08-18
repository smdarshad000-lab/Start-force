import { Link } from 'react-router-dom';

export function Profile() {
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
        <p className="eyebrow">PROFILE</p>
        <h2>Your innovation profile</h2>
        <p>
          Skills, research, experience, interests and projects.
        </p>
      </section>
    </main>
  );
}