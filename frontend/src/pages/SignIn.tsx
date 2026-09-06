import {
  FormEvent,
  useState,
} from 'react';

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    signIn,
  } = useAuth();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const [submitting, setSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setSubmitting(true);

    try {
      await signIn(
        email,
        password,
      );

      const from =
        (
          location.state as
            | { from?: string }
            | null
            | undefined
        )?.from ?? '/';

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to sign in. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Welcome back
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Sign in to Start-force
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Continue building ideas,
              discovering research, and
              connecting with people.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-900"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-900"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  onClick={() =>
                    setError(
                      'Password reset will be added next.',
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? 'Signing in...'
                : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}

              <Link
                to="/sign-up"
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}