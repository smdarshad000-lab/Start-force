import {
  NavLink,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const navigation = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Discover',
    path: '/discover',
  },
  {
    name: 'Research',
    path: '/research',
  },
  {
    name: 'Build',
    path: '/build',
  },
  {
    name: 'My Ideas',
    path: '/my-ideas',
  },
  {
    name: 'Messages',
    path: '/messages',
  },
];

export function Navbar() {
  const navigate =
    useNavigate();

  const {
    user,
    signOut,
    loading,
  } = useAuth();

  async function handleSignOut() {
    try {
      await signOut();

      navigate('/', {
        replace: true,
      });
    } catch (error) {
      console.error(
        'Failed to sign out',
        error,
      );
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <NavLink
          to="/"
          className="shrink-0 text-xl font-bold tracking-tight text-slate-950"
        >
          START
          <span className="text-emerald-600">
            -FORCE
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex">

          {navigation.map(
            (item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={
                  item.path === '/'
                }
                className={({
                  isActive,
                }) =>
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
            ),
          )}

        </nav>

        <div className="flex items-center gap-2">

          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-100" />
          ) : user ? (
            <>

              <NavLink
                to="/profile"
                className="hidden items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-100 sm:flex"
              >

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {user.name
                    .slice(
                      0,
                      2,
                    )
                    .toUpperCase()}
                </span>

                <span className="max-w-32 truncate text-sm font-semibold text-slate-900">
                  {user.name}
                </span>

              </NavLink>

              <button
                type="button"
                onClick={
                  handleSignOut
                }
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Logout
              </button>

            </>
          ) : (
            <>

              <NavLink
                to="/sign-in"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Sign in
              </NavLink>

              <NavLink
                to="/sign-up"
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create account
              </NavLink>

            </>
          )}

        </div>

      </div>
    </header>
  );
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 