import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Temporary frontend-only action.
    // Real authentication will be connected next.
    console.log('Sign in attempt', {
      email,
      password,
    });

    navigate('/');
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
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
              Continue building ideas, finding people, and exploring
              opportunities.
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
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-900"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  onClick={() => {
                    console.log('Forgot password clicked');
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Sign in
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