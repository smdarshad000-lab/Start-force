import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { Home } from './pages/Home';
import { Discover } from './pages/Discover';
import { Research } from './pages/Research';
import { Build } from './pages/Build';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { IdeaDetails } from './pages/IdeaDetails';
import { MyIdeas } from './pages/MyIdeas';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/discover"
            element={<Discover />}
          />

          <Route
            path="/research"
            element={<Research />}
          />

          <Route
            path="/idea/:id"
            element={<IdeaDetails />}
          />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/build"
              element={<Build />}
            />

            <Route
              path="/my-ideas"
              element={<MyIdeas />}
            />

            <Route
              path="/messages"
              element={<Messages />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>
        </Route>

        {/* Authentication */}
        <Route
          path="/sign-in"
          element={<SignIn />}
        />

        <Route
          path="/sign-up"
          element={<SignUp />}
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}