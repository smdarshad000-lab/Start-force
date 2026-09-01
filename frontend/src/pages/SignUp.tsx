import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      alert('Password must contain at least 8 characters.');
      return;
    }

    // Temporary frontend-only action.
    // Real registration will be connected next.
    console.log('Sign up attempt', {
      name,
      email,
      password,
    });

    navigate('/sign-in');
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
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
              Create an account to build ideas, collaborate, and keep your
              work connected to you.
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
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-900"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Re-enter your password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-slate-300 accent-emerald-600"
              />

              <span className="leading-6">
                I agree to the Start-force terms and understand that my
                profile and published ideas may be visible according to my
                privacy settings.
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create account
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