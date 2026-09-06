import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute() {
  const {
    user,
    loading,
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Restoring your session...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/sign-in"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}