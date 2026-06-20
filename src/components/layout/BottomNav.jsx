import { useNavigate, useLocation } from 'react-router-dom';
import { House, Sparkle, Books } from '@phosphor-icons/react';

const NAV_ITEMS = [
  { key: 'home',    label: '홈',        path: '/',        Icon: House   },
  { key: 'create',  label: '동화 만들기', path: '/create',  Icon: Sparkle },
  { key: 'library', label: '내 책장',    path: '/library', Icon: Books   },
];

const HIDDEN_PATHS = ['/story-check', '/loading'];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (HIDDEN_PATHS.some(p => pathname.startsWith(p))) return null;

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
      background: 'var(--surface)', borderTop: '1.5px solid var(--border)',
    }} className="sm:hidden flex">
      {NAV_ITEMS.map(({ key, label, path, Icon }) => {
        const active = path === '/' ? pathname === '/' : pathname.startsWith(path);
        return (
          <button
            key={key}
            onClick={() => navigate(path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3,
              padding: '10px 0 12px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: active ? 'var(--text)' : 'var(--text-muted)',
              fontFamily: 'inherit',
            }}
          >
            <Icon size={22} weight={active ? 'fill' : 'regular'}
              color={active ? 'var(--primary)' : 'var(--text-muted)'} />
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
