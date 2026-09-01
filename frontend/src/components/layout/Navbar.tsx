import { NavLink } from 'react-router-dom';

const navigation = [
  { name: 'Home', path: '/' },
  { name: 'Discover', path: '/discover' },
  { name: 'Research', path: '/research' },
  { name: 'Build', path: '/build' },
  { name: 'Messages', path: '/messages' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <NavLink
          to="/"
          className="shrink-0 text-xl font-bold tracking-tight text-slate-950"
        >
          START<span className="text-emerald-600">-FORCE</span>
        </NavLink>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  [
                    'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-950 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                  ].join(' ')
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="ml-2 hidden items-center gap-2 lg:flex">
            <NavLink
              to="/sign-in"
              className={({ isActive }) =>
                [
                  'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-slate-100 text-slate-950'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                ].join(' ')
              }
            >
              Sign in
            </NavLink>

            <NavLink
              to="/sign-up"
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create account
            </NavLink>

            <NavLink
              to="/profile"
              aria-label="Profile"
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              SF
            </NavLink>
          </div>

          <div className="flex lg:hidden">
            <NavLink
              to="/sign-in"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Sign in
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}