import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, SignOut, TrashSimple } from '@phosphor-icons/react';
import Footer from '../components/layout/Footer';

export default function MyPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    guardianName: '',
    email: '',
    childName: '',
    childAge: '',
  });
  const [saved, setSaved] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  }

  function handleSave(e) {
    e.preventDefault();
    // TODO: PUT /users/me 연결
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleLogout() {
    if (window.confirm('로그아웃 하시겠어요?')) {
      // TODO: Supabase 로그아웃 연결
      navigate('/');
    }
  }

  function handleDelete() {
    if (window.confirm('정말 탈퇴하시겠어요? 모든 동화가 삭제됩니다.')) {
      // TODO: DELETE /users/me 연결
      alert('회원 탈퇴 기능은 추후 연결 예정입니다.');
    }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: 'var(--bg)', border: 'var(--bw) solid var(--border)',
    borderRadius: 'var(--radius-input)', fontSize: 'var(--fs-body)',
    color: 'var(--text)', transition: 'border-color var(--dur-base)',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: 'var(--fs-sm)',
    fontWeight: 'var(--fw-medium)', color: 'var(--text)', marginBottom: 6,
  };

  const sectionStyle = {
    background: 'var(--surface)', borderRadius: 'var(--radius-card)',
    border: 'var(--bw) solid var(--border)', padding: '28px 24px',
    boxShadow: 'var(--shadow-card)', marginBottom: 24,
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main className="wrap fade" style={{ flex: 1, paddingTop: 52, paddingBottom: 72, maxWidth: 680 }}>
        <h1 style={{
          fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-black)',
          color: 'var(--text)', margin: '0 0 32px',
        }}>
          마이페이지
        </h1>

        {/* ── 프로필 폼 ── */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text)', margin: '0 0 22px' }}>
            내 정보
          </h2>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', marginBottom: 24 }}>
              {/* 보호자 이름 */}
              <div>
                <label style={labelStyle}>보호자 이름</label>
                <input
                  type="text"
                  name="guardianName"
                  value={profile.guardianName}
                  onChange={handleChange}
                  placeholder="홍길동"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--border-strong)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              {/* 이메일 */}
              <div>
                <label style={labelStyle}>이메일</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  style={{ ...inputStyle, opacity: 0.7 }}
                  readOnly
                />
              </div>
              {/* 아이 이름 */}
              <div>
                <label style={labelStyle}>아이 이름</label>
                <input
                  type="text"
                  name="childName"
                  value={profile.childName}
                  onChange={handleChange}
                  placeholder="민준"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--border-strong)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              {/* 아이 나이 */}
              <div>
                <label style={labelStyle}>아이 나이</label>
                <select
                  name="childAge"
                  value={profile.childAge}
                  onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">선택하세요</option>
                  {Array.from({ length: 9 }, (_, i) => i + 4).map(age => (
                    <option key={age} value={age}>{age}세</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              style={{
                padding: '12px 28px',
                background: saved ? 'var(--accent)' : 'var(--primary)',
                color: saved ? 'var(--text-on-accent)' : 'var(--text-on-primary)',
                border: 'none', borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-bold)',
                cursor: 'pointer', transition: 'background var(--dur-base)',
              }}
            >
              {saved ? '저장됐어요!' : '변경사항 저장'}
            </button>
          </form>
        </div>

        {/* ── 만든 동화 통계 ── */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text)', margin: '0 0 18px' }}>
            나의 동화 현황
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: '만든 동화', value: '0편' },
              { label: '이번 달 생성', value: '0편' },
              { label: '마지막 생성', value: '-' },
            ].map(item => (
              <div
                key={item.label}
                style={{
                  background: 'var(--bg)', borderRadius: 'var(--radius-md)',
                  border: 'var(--bw) solid var(--border)',
                  padding: '18px 16px', textAlign: 'center',
                }}
              >
                <p style={{ fontSize: 22, fontWeight: 'var(--fw-black)', color: 'var(--text)', margin: '0 0 4px' }}>
                  {item.value}
                </p>
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', margin: 0 }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/library')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginTop: 18, padding: '10px 22px',
              background: 'transparent', color: 'var(--text)',
              border: 'var(--bw) solid var(--border)', borderRadius: 'var(--radius-pill)',
              fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', cursor: 'pointer',
              transition: 'border-color var(--dur-base)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <BookOpen size={16} />
            나의 서재 보기
          </button>
        </div>

        {/* ── 계정 액션 ── */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px',
              background: 'transparent', color: 'var(--text)',
              border: 'var(--bw) solid var(--border)', borderRadius: 'var(--radius-pill)',
              fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', cursor: 'pointer',
              transition: 'border-color var(--dur-base)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <SignOut size={16} />
            로그아웃
          </button>
          <button
            onClick={handleDelete}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px',
              background: 'transparent', color: 'var(--text-muted)',
              border: 'none', borderRadius: 'var(--radius-pill)',
              fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-regular)', cursor: 'pointer',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            <TrashSimple size={15} />
            회원 탈퇴
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
