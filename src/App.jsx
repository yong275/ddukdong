import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GeneratePage from './pages/GeneratePage';
import StoryCheckPage from './pages/StoryCheckPage';
import LoadingPage from './pages/LoadingPage';
import LibraryPage from './pages/LibraryPage';
import ViewerPage from './pages/ViewerPage';
import MyPage from './pages/MyPage';
import GuidePage from './pages/GuidePage';
import { ToastProvider } from './components/common/Toast';
import ScrollToTop from './components/common/ScrollToTop';
import { supabase } from './api/axios';
import useOptionsStore from './store/optionsStore';

function ProtectedRoute({ children }) {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
      setChecked(true);
    });
  }, []);

  if (!checked) return null;
  return authed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const fetchOptions = useOptionsStore(s => s.fetch);
  useEffect(() => { fetchOptions(); }, []);

  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <main className="sm:pb-0 pb-16">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/create" element={<GeneratePage />} />
            <Route path="/story-check" element={<StoryCheckPage />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/viewer/:story_id" element={<ViewerPage />} />
            <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
          </Routes>
        </main>
        <BottomNav />
      </BrowserRouter>
    </ToastProvider>
  );
}
