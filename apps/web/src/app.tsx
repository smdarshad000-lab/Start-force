import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Discover } from './pages/Discover';
import { Research } from './pages/Research';
import { Build } from './pages/Build';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { IdeaDetails } from './pages/IdeaDetails';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/research" element={<Research />} />
        <Route path="/build" element={<Build />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/idea/:id" element={<IdeaDetails />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}