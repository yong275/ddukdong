import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/axios';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    guardianName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    agreed: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않아요.');
      return;
    }
    if (!form.agreed) {
      setError('이용약관에 동의해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { nickname: form.guardianName } },
      });
      if (error) throw error;
      navigate('/login');
    } catch (err) {
      setError(err.message || '회원가입에 실패했어요.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'var(--bg)', border: 'var(--bw) solid var(--border)',
    borderRadius: 'var(--radius-input)', fontSize: 'var(--fs-body)',
    color: 'var(--text)', transition: 'border-color var(--dur-base)',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: 'var(--fs-sm)',
    fontWeight: 'var(--fw-medium)', color: 'var(--text)', marginBottom: 6,
  };

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
          {/* 마스코트 */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <img
              src={`${import.meta.env.BASE_URL}assets/mascot-light.png`}
              alt="뚝딱 마스코트"
              style={{ width: 80, height: 'auto', marginBottom: 8 }}
            />
            <h1 style={{
              fontSize: 'var(--fs-h2)', fontWeight: 'var(--fw-black)',
              color: 'var(--text)', margin: 0,
            }}>
              회원가입
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 'var(--fs-sm)' }}>
              뚝딱동화와 함께 특별한 동화를 만들어보세요
            </p>
          </div>

          {/* 가입 폼 */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'var(--surface)', borderRadius: 'var(--radius-card)',
              border: 'var(--bw) solid var(--border)', padding: '32px 28px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {/* 보호자 이름 */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>보호자 이름</label>
              <input
                type="text"
                name="guardianName"
                value={form.guardianName}
                onChange={handleChange}
                placeholder="홍길동"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--border-strong)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* 이메일 */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>이메일</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--border-strong)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* 비밀번호 */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>비밀번호</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="8자 이상"
                minLength={8}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--border-strong)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* 비밀번호 확인 */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>비밀번호 확인</label>
              <input
                type="password"
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력해주세요"
                required
                style={{
                  ...inputStyle,
                  borderColor: form.passwordConfirm && form.password !== form.passwordConfirm
                    ? '#e55' : 'var(--border)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--border-strong)'}
                onBlur={e => {
                  e.target.style.borderColor = form.passwordConfirm && form.password !== form.passwordConfirm
                    ? '#e55' : 'var(--border)';
                }}
              />
              {form.passwordConfirm && form.password !== form.passwordConfirm && (
                <p style={{ color: '#e55', fontSize: 'var(--fs-xs)', margin: '4px 0 0' }}>
                  비밀번호가 일치하지 않아요.
                </p>
              )}
            </div>

            {/* 이용약관 체크박스 */}
            <label
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                cursor: 'pointer', marginBottom: 24,
              }}
            >
              <input
                type="checkbox"
                name="agreed"
                checked={form.agreed}
                onChange={handleChange}
                style={{
                  width: 18, height: 18, flexShrink: 0, marginTop: 2,
                  accentColor: 'var(--primary)', cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text)', lineHeight: 1.6 }}>
                <span style={{ fontWeight: 'var(--fw-medium)' }}>이용약관</span> 및{' '}
                <span style={{ fontWeight: 'var(--fw-medium)' }}>개인정보 처리방침</span>에 동의합니다. (필수)
              </span>
            </label>

            {/* 에러 메시지 */}
            {error && (
              <p style={{ color: '#e55', fontSize: 'var(--fs-sm)', marginBottom: 12, textAlign: 'center' }}>
                {error}
              </p>
            )}

            {/* 가입 버튼 */}
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
                opacity: form.agreed ? 1 : 0.65,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
            >
              가입하고 시작하기
            </button>

            {/* 로그인으로 이동 */}
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                width: '100%', padding: '13px',
                background: 'transparent', color: 'var(--text-muted)',
                border: 'none', borderRadius: 'var(--radius-pill)',
                fontSize: 15, fontWeight: 'var(--fw-regular)', cursor: 'pointer',
              }}
            >
              이미 계정이 있어요
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
