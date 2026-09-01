import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Discover } from './pages/Discover';
import { Research } from './pages/Research';
import { Build } from './pages/Build';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { IdeaDetails } from './pages/IdeaDetails';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main application */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/research" element={<Research />} />
          <Route path="/build" element={<Build />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/idea/:id" element={<IdeaDetails />} />
        </Route>

        {/* Authentication */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}