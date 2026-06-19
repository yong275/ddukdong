import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Books, Plus, Trash, PencilSimple, WarningCircle, SpinnerGap } from '@phosphor-icons/react';
import axios from '../api/axios';
import { SAMPLE_BOOKS } from '../utils/constants';
import Illo from '../components/illustrations/Illo';

/* ── 날짜 포맷 ─────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

/* ── 배경색 (art_style 기반) ─────────────────── */
const ART_PALETTE = {
  fairytale: '#fceabb',
  watercolor: '#d0eaff',
  cartoon: '#ffd6f0',
  animation: '#d6ffe0',
};

/* ── 책 카드 ─────────────────────────────────── */
function BookCard({ story, editMode, onDelete, onClick }) {
  const bg = ART_PALETTE[story.art_style] || '#fff8de';
  const pages = story.page_count || story.pages?.length || 0;

  return (
    <div style={{ position: 'relative' }}>
      {/* 삭제 버튼 (편집 모드) */}
      {editMode && (
        <button
          className="book-del"
          onClick={e => { e.stopPropagation(); onDelete(story.id); }}
          style={{
            position: 'absolute', top: -8, right: -8, zIndex: 10,
            width: 26, height: 26, borderRadius: '50%',
            background: '#e74c3c', border: '2px solid white',
            color: 'white', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,.18)',
          }}
          aria-label="삭제"
        >
          <Trash size={13} weight="bold" />
        </button>
      )}

      {/* 책 카드 */}
      <div
        className="book"
        onClick={() => !editMode && onClick(story.id)}
        style={{
          borderRadius: 16, overflow: 'hidden',
          border: '1.5px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
          cursor: editMode ? 'default' : 'pointer',
          transition: 'transform .18s, box-shadow .18s',
        }}
        onMouseEnter={e => { if (!editMode) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-pop)'; } }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
      >
        {/* 커버 */}
        <div style={{
          background: bg, aspectRatio: '4/3',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, position: 'relative', overflow: 'hidden',
        }}>
          {story.cover_url
            ? <img src={story.cover_url} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : story.illo
              ? <Illo name={story.illo} size={100} />
              : <span>📖</span>
          }
        </div>

        {/* 메타 */}
        <div className="book-meta" style={{
          padding: '12px 14px',
          background: 'var(--surface)',
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {story.title || '제목 없음'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 6 }}>
            <span>{formatDate(story.created_at)}</span>
            {pages > 0 && <span>· {pages}페이지</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 메인 컴포넌트 ─────────────────────────────── */
export default function LibraryPage() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  const fetchStories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/v1/stories');
      const list = res.data?.stories || res.data || [];
      setStories(list.length > 0 ? list : SAMPLE_BOOKS);
    } catch (e) {
      setStories(SAMPLE_BOOKS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStories(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('이 동화를 삭제할까요?')) return;
    try {
      await axios.delete(`/v1/stories/${id}`);
      setStories(prev => prev.filter(s => s.id !== id));
    } catch {
      alert('삭제에 실패했어요.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div className="wrap fade" style={{ maxWidth: 860, paddingTop: 40, flex: 1 }}>

        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>
              내 책장
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {stories.length > 0 ? `동화 ${stories.length}권` : ''}
            </p>
          </div>
          {stories.length > 0 && (
            <button
              onClick={() => setEditMode(m => !m)}
              style={{
                padding: '9px 18px', borderRadius: 10,
                border: '1.5px solid',
                borderColor: editMode ? 'var(--primary)' : 'var(--border)',
                background: editMode ? 'var(--primary)' : 'var(--surface)',
                color: 'var(--text)', fontWeight: 600, fontSize: 13,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all .15s',
              }}
            >
              <PencilSimple size={15} weight={editMode ? 'fill' : 'regular'} />
              {editMode ? '완료' : '편집'}
            </button>
          )}
        </div>

        {/* 로딩 */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', gap: 10, color: 'var(--text-muted)' }}>
            <SpinnerGap size={22} style={{ animation: 'ttspin .8s linear infinite' }} />
            <span style={{ fontSize: 14 }}>불러오는 중...</span>
          </div>
        )}

        {/* 에러 */}
        {!loading && error && (
          <div style={{
            padding: '14px 18px', borderRadius: 14,
            background: '#fff0f0', border: '1.5px solid #ffcccc',
            color: '#c0392b', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 24,
          }}>
            <WarningCircle size={18} /> {error}
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && !error && stories.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '80px 24px', gap: 16, color: 'var(--text-muted)',
          }}>
            <Books size={64} weight="thin" />
            <p style={{ fontSize: 16, fontWeight: 600 }}>아직 책장이 비어 있어요</p>
            <p style={{ fontSize: 14, opacity: .8 }}>첫 동화를 만들어 보세요!</p>
            <button
              onClick={() => navigate('/create')}
              style={{
                marginTop: 8, padding: '13px 28px', borderRadius: 12,
                border: 'none', background: 'var(--primary)',
                color: 'var(--text)', fontWeight: 700, fontSize: 15,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <Plus size={18} weight="bold" />
              동화 만들기
            </button>
          </div>
        )}

        {/* 책 그리드 */}
        {!loading && stories.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 20,
          }}>
            {stories.map(story => (
              <BookCard
                key={story.id}
                story={story}
                editMode={editMode}
                onDelete={handleDelete}
                onClick={id => navigate(`/viewer/${id}`)}
              />
            ))}

            {/* 새로운 동화 추가 카드 */}
            {!editMode && (
              <button
                className="addcard"
                onClick={() => navigate('/create')}
                style={{
                  border: '1.5px dashed var(--border-dashed)', borderRadius: 16,
                  background: 'transparent', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 10, padding: '28px 16px', color: 'var(--text-muted)',
                  minHeight: 180, transition: 'border-color .15s',
                }}
              >
                <Plus size={30} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>새로운 동화<br />만들기</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: 60, padding: '24px 0', textAlign: 'center',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-muted)', fontSize: 13,
      }}>
        © 2026 뚝딱동화 · AI 동화 생성 서비스
      </footer>
    </div>
  );
}
