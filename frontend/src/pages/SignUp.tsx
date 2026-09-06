import {
  FormEvent,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const navigate = useNavigate();

  const {
    signUp,
  } = useAuth();

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
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

    if (
      password !==
      confirmPassword
    ) {
      setError(
        'Passwords do not match.',
      );

      return;
    }

    if (password.length < 8) {
      setError(
        'Password must contain at least 8 characters.',
      );

      return;
    }

    setSubmitting(true);

    try {
      await signUp(
        name,
        email,
        password,
      );

      navigate('/', {
        replace: true,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to create your account.',
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
              Get started
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Create your Start-force account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Build ideas, collaborate with
              people, and keep your work
              connected to your account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-900"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value,
                  )
                }
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

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
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-900"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-900"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value,
                  )
                }
                placeholder="Re-enter your password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-slate-300 accent-emerald-600"
              />

              <span className="leading-6">
                I agree to the Start-force terms
                and understand that my profile
                and published ideas may be visible
                according to their privacy settings.
              </span>
            </label>

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
                ? 'Creating account...'
                : 'Create account'}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}

              <Link
                to="/sign-in"
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}