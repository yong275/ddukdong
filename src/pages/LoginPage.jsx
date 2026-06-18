import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, loginWithGoogle } from '../api/auth.js';
import useAuthStore from '../store/authStore.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore(s => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await login({ email, password });
      setUser({ ...user, token });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || '로그인에 실패했어요.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      await loginWithGoogle();
    } catch {
      setError('구글 로그인에 실패했어요.');
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main
        className="fade"
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '48px 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* 마스코트 + 타이틀 */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <img
              src={`${import.meta.env.BASE_URL}assets/mascot-light.png`}
              alt="뚝딱 마스코트"
              style={{ width: 96, height: 'auto', marginBottom: 12 }}
            />
            <h1 style={{
              fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-black)',
              color: 'var(--text)', margin: 0,
            }}>
              뚝딱동화
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 'var(--fs-sm)' }}>
              로그인하고 우리 아이만의 동화를 만들어보세요
            </p>
          </div>

          {/* 로그인 폼 */}
          <form
            onSubmit={handleLogin}
            style={{
              background: 'var(--surface)', borderRadius: 'var(--radius-card)',
              border: 'var(--bw) solid var(--border)', padding: '32px 28px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {/* 이메일 */}
            <div className="field" style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text)', marginBottom: 6 }}>
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'var(--bg)', border: 'var(--bw) solid var(--border)',
                  borderRadius: 'var(--radius-input)', fontSize: 'var(--fs-body)',
                  color: 'var(--text)', transition: 'border-color var(--dur-base)',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--border-strong)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* 비밀번호 */}
            <div className="field" style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text)', marginBottom: 6 }}>
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'var(--bg)', border: 'var(--bw) solid var(--border)',
                  borderRadius: 'var(--radius-input)', fontSize: 'var(--fs-body)',
                  color: 'var(--text)', transition: 'border-color var(--dur-base)',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--border-strong)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <p style={{ color: '#e55', fontSize: 'var(--fs-sm)', marginBottom: 12, textAlign: 'center' }}>
                {error}
              </p>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: 'var(--primary)', color: 'var(--text-on-primary)',
                border: 'none', borderRadius: 'var(--radius-pill)',
                fontSize: 16, fontWeight: 'var(--fw-bold)', cursor: 'pointer',
                transition: 'background var(--dur-base)',
                boxShadow: '0 4px 14px rgba(255,219,77,0.4)',
                marginBottom: 12,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
            >
              로그인
            </button>

            {/* 회원가입 버튼 */}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              style={{
                width: '100%', padding: '14px',
                background: 'transparent', color: 'var(--text)',
                border: 'var(--bw) solid var(--border)', borderRadius: 'var(--radius-pill)',
                fontSize: 16, fontWeight: 'var(--fw-medium)', cursor: 'pointer',
                transition: 'border-color var(--dur-base)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              회원가입
            </button>

            {/* 구분선 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>또는</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {/* 구글 간편 로그인 */}
            <button
              type="button"
              onClick={handleGoogle}
              style={{
                width: '100%', padding: '13px',
                background: '#fff', color: '#3c4043',
                border: '1.5px solid #dadce0', borderRadius: 'var(--radius-pill)',
                fontSize: 15, fontWeight: 'var(--fw-medium)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'box-shadow var(--dur-base)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              구글 간편 로그인
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
