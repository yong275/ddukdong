import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpenText,
  Sun,
  Moon,
  UserCircle,
  Question,
  X,
  SignOut,
} from '@phosphor-icons/react';
import GuidePage from '../../pages/GuidePage';
import { NAV } from '../../utils/constants';
import useAuthStore from '../../store/authStore';
import useGuideStore from '../../store/guideStore';
import { supabase } from '../../api/axios';

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const guideOpen = useGuideStore(s => s.open);
  const setGuideOpen = useGuideStore(s => s.setOpen);
  const clearUser = useAuthStore(s => s.clearUser);

  async function handleLogout() {
    setDropdownOpen(false);
    await supabase.auth.signOut();
    clearUser();
    navigate('/');
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handler = () => setTheme(getTheme());
    window.addEventListener('tt-theme-change', handler);
    return () => window.removeEventListener('tt-theme-change', handler);
  }, []);

  // 페이지 이동 시 가이드 닫기
  useEffect(() => { setGuideOpen(false); }, [pathname]);

  const isDark = theme === 'dark';

  return (
  <>
    <header className="sticky top-0 z-40 w-full bg-[--surface]/90 backdrop-blur border-b border-[--border]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center relative">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-extrabold text-[--primary] text-lg tracking-tight cursor-pointer"
          aria-label="홈으로"
        >
          <BookOpenText size={26} weight="fill" />
          뚝딱동화
        </button>

        {/* Nav pills - centered (PC/태블릿만) */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-1">
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
          {/* Guide toggle */}
          <button
            onClick={() => setGuideOpen(o => !o)}
            title="이용안내"
            className={[
              'p-2 rounded-full transition-colors cursor-pointer',
              guideOpen
                ? 'bg-[--primary] text-[--text-on-primary]'
                : 'text-[--text-muted] hover:text-[--text] hover:bg-[--surface-sunk]',
            ].join(' ')}
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
          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                title={user.nickname ?? '마이페이지'}
                className={[
                  'p-2 rounded-full transition-colors cursor-pointer',
                  dropdownOpen
                    ? 'bg-[--surface-sunk] text-[--text]'
                    : 'text-[--text-muted] hover:text-[--text] hover:bg-[--surface-sunk]',
                ].join(' ')}
              >
                <UserCircle size={22} weight="fill" />
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'var(--surface)', border: '1.5px solid var(--border)',
                  borderRadius: 12, boxShadow: 'var(--shadow-pop)',
                  minWidth: 140, zIndex: 100, overflow: 'hidden',
                }}>
                  <button
                    onClick={() => { setDropdownOpen(false); navigate('/mypage'); }}
                    style={{
                      width: '100%', padding: '12px 16px', textAlign: 'left',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      fontSize: 14, fontWeight: 600, color: 'var(--text)',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-sunk)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <UserCircle size={17} weight="fill" />
                    마이페이지
                  </button>
                  <div style={{ height: 1, background: 'var(--border)', margin: '0 12px' }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%', padding: '12px 16px', textAlign: 'left',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      fontSize: 14, fontWeight: 600, color: '#e55',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-sunk)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <SignOut size={17} />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-1.5 rounded-full text-sm font-semibold bg-[--primary] text-[--text] hover:opacity-90 transition-opacity cursor-pointer"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>

    {/* 이용안내 오버레이 */}
    {guideOpen && (
      <div style={{
        position: 'fixed', top: 56, left: 0, right: 0, bottom: 0, zIndex: 90,
        background: 'var(--bg)', overflowY: 'auto',
      }}>
        {/* X 닫기 버튼 */}
        <button
          onClick={() => setGuideOpen(false)}
          style={{
            position: 'fixed', top: 68, right: 16, zIndex: 91,
            width: 40, height: 40, borderRadius: '50%',
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text)',
          }}
          title="닫기"
        >
          <X size={20} />
        </button>
        <GuidePage />
      </div>
    )}
  </>
  );
}
