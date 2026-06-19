import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, SignOut, TrashSimple, PencilSimple, Check, X } from '@phosphor-icons/react';
import { supabase } from '../api/axios';
import useAuthStore from '../store/authStore';
import axios from '../api/axios';
import Footer from '../components/layout/Footer';

export default function MyPage() {
  const navigate = useNavigate();
  const clearUser = useAuthStore(s => s.clearUser);

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [storyStats, setStoryStats] = useState({ total: 0, thisMonth: 0, lastDate: '-' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        setName(user.user_metadata?.nickname || user.user_metadata?.name || '');
      }
    });

    axios.get('/v1/stories').then(res => {
      const stories = res.data || [];
      const now = new Date();
      const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const thisMonth = stories.filter(s => s.created_at?.startsWith(ym)).length;
      const lastDate = stories[0]?.created_at
        ? new Date(stories[0].created_at).toLocaleDateString('ko-KR')
        : '-';
      setStoryStats({ total: stories.length, thisMonth, lastDate });
    }).catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await supabase.auth.updateUser({ data: { nickname: name } });
      setEditing(false);
    } catch (e) {
      alert('저장에 실패했어요.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    if (!window.confirm('로그아웃 하시겠어요?')) return;
    await supabase.auth.signOut();
    clearUser();
    navigate('/');
  }

  async function handleDelete() {
    if (!window.confirm('정말 탈퇴하시겠어요? 모든 동화가 삭제됩니다.')) return;
    try {
      await axios.delete('/v1/users/me');
      await supabase.auth.signOut();
      clearUser();
      navigate('/');
    } catch {
      alert('회원 탈퇴에 실패했어요. 잠시 후 다시 시도해주세요.');
    }
  }

  const sectionStyle = {
    background: 'var(--surface)', borderRadius: 'var(--radius-card)',
    border: 'var(--bw) solid var(--border)', padding: '28px 24px',
    boxShadow: 'var(--shadow-card)', marginBottom: 24,
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: 'var(--bg)', border: 'var(--bw) solid var(--border)',
    borderRadius: 'var(--radius-input)', fontSize: 'var(--fs-body)',
    color: 'var(--text)', boxSizing: 'border-box',
  };

  const readStyle = {
    padding: '11px 0', fontSize: 'var(--fs-body)',
    color: 'var(--text)', borderBottom: 'var(--bw) solid var(--border)',
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main className="wrap fade" style={{ flex: 1, paddingTop: 52, paddingBottom: 72, maxWidth: 680 }}>
        <h1 style={{ fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-black)', color: 'var(--text)', margin: '0 0 32px' }}>
          마이페이지
        </h1>

        {/* ── 내 정보 ── */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
            <h2 style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text)', margin: 0 }}>
              내 정보
            </h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 'var(--radius-pill)',
                  border: 'var(--bw) solid var(--border)', background: 'var(--bg)',
                  color: 'var(--text)', fontSize: 'var(--fs-sm)', fontWeight: 600, cursor: 'pointer',
                }}
              >
                <PencilSimple size={14} /> 수정하기
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 'var(--radius-pill)',
                    border: 'none', background: 'var(--primary)',
                    color: 'var(--text)', fontSize: 'var(--fs-sm)', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  <Check size={14} /> {saving ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 'var(--radius-pill)',
                    border: 'var(--bw) solid var(--border)', background: 'var(--bg)',
                    color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', cursor: 'pointer',
                  }}
                >
                  <X size={14} /> 취소
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* 이름 */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                이름
              </label>
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="이름을 입력해주세요"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--border-strong)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              ) : (
                <p style={readStyle}>{name || '미설정'}</p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                이메일
              </label>
              <p style={{ ...readStyle, opacity: 0.7 }}>{user?.email || '-'}</p>
            </div>
          </div>
        </div>

        {/* ── 나의 동화 현황 ── */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text)', margin: '0 0 18px' }}>
            나의 동화 현황
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: '만든 동화', value: `${storyStats.total}편` },
              { label: '이번 달 생성', value: `${storyStats.thisMonth}편` },
              { label: '마지막 생성', value: storyStats.lastDate },
            ].map(item => (
              <div key={item.label} style={{
                background: 'var(--bg)', borderRadius: 'var(--radius-md)',
                border: 'var(--bw) solid var(--border)', padding: '18px 16px', textAlign: 'center',
              }}>
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
              fontSize: 'var(--fs-sm)', fontWeight: 500, cursor: 'pointer',
            }}
          >
            <BookOpen size={16} /> 내 서재 보기
          </button>
        </div>

        {/* ── 계정 액션 ── */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 'var(--radius-pill)',
              border: 'var(--bw) solid var(--border)', background: 'transparent',
              color: 'var(--text)', fontSize: 'var(--fs-sm)', fontWeight: 500, cursor: 'pointer',
            }}
          >
            <SignOut size={16} /> 로그아웃
          </button>
          <button
            onClick={handleDelete}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 'var(--radius-pill)',
              border: 'none', background: 'transparent',
              color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', cursor: 'pointer',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            <TrashSimple size={15} /> 회원 탈퇴
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}