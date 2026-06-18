import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
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

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/create" element={<GeneratePage />} />
            <Route path="/story-check" element={<StoryCheckPage />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/viewer/:story_id" element={<ViewerPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/guide" element={<GuidePage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ToastProvider>
  );
}
