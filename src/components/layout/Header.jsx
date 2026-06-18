import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpenText,
  Sun,
  Moon,
  UserCircle,
  Question,
} from '@phosphor-icons/react';
import { NAV } from '../../utils/constants';
import useAuthStore from '../../store/authStore';

function getTheme() {
  return localStorage.getItem('tt-theme') || 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('tt-theme', theme);
}

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);

  const currentTheme = getTheme();

  function toggleTheme() {
    const next = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    // force re-render
    window.dispatchEvent(new Event('tt-theme-change'));
  }

  const [theme, setTheme] = useState(currentTheme);

  useEffect(() => {
    const handler = () => setTheme(getTheme());
    window.addEventListener('tt-theme-change', handler);
    return () => window.removeEventListener('tt-theme-change', handler);
  }, []);

  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 w-full bg-[--surface]/90 backdrop-blur border-b border-[--border]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-extrabold text-[--primary] text-lg tracking-tight cursor-pointer"
          aria-label="홈으로"
        >
          <BookOpenText size={26} weight="fill" />
          뚝딱동화
        </button>

        {/* Nav pills */}
        <nav className="flex items-center gap-1 ml-2">
          {NAV.map((item) => {
            const active =
              item.path === '/'
                ? pathname === '/'
                : pathname.startsWith(item.path);
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={[
                  'px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer',
                  active
                    ? 'bg-[--primary] text-[--text-on-primary]'
                    : 'text-[--text-muted] hover:text-[--text] hover:bg-[--surface-sunk]',
                ].join(' ')}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Guide */}
          <button
            onClick={() => navigate('/guide')}
            title="이용안내"
            className="p-2 rounded-full text-[--text-muted] hover:text-[--text] hover:bg-[--surface-sunk] transition-colors cursor-pointer"
          >
            <Question size={20} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? '라이트 모드' : '다크 모드'}
            className="p-2 rounded-full text-[--text-muted] hover:text-[--text] hover:bg-[--surface-sunk] transition-colors cursor-pointer"
          >
            {isDark ? <Sun size={20} weight="fill" /> : <Moon size={20} />}
          </button>

          {/* User */}
          <button
            onClick={() => navigate(user ? '/mypage' : '/login')}
            title={user ? user.name ?? '마이페이지' : '로그인'}
            className="p-2 rounded-full text-[--text-muted] hover:text-[--text] hover:bg-[--surface-sunk] transition-colors cursor-pointer"
          >
            <UserCircle size={22} weight={user ? 'fill' : 'regular'} />
          </button>
        </div>
      </div>
    </header>
  );
}
