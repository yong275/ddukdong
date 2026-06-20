import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { SAMPLE_BOOKS } from '../utils/constants';

/* ── 아이콘 ─────────────────────────────────────── */
function Icon({ d, size = 22, sw = 2.2, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {d ? <path d={d} /> : children}
    </svg>
  );
}

/* ── 화살표 버튼 ─────────────────────────────────── */
function ArrowBtn({ direction, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? '이전' : '다음'}
      style={{
        width: 'clamp(40px,6vw,56px)', height: 'clamp(40px,6vw,56px)',
        borderRadius: '50%', border: '1.5px solid var(--border)',
        background: 'var(--surface-2)', color: 'var(--text)',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: disabled ? 0.3 : 1, transition: 'opacity .15s', flexShrink: 0,
      }}
    >
      <Icon d={direction === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
    </button>
  );
}

/* ── 표지 ────────────────────────────────────────── */
function CoverPage({ story }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        width: 'min(440px, 100%)', aspectRatio: '1/1',
        borderRadius: 20, border: '1.5px solid var(--border)',
        overflow: 'hidden', boxShadow: 'var(--shadow-pop)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 14, padding: 36, textAlign: 'center',
        background: story.cover_url ? 'transparent' : 'var(--surface)',
        position: 'relative',
      }}>
        {story.cover_url && (
          <img src={story.cover_url} alt="표지" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        <div style={{ position: 'relative', zIndex: 1, background: story.cover_url ? 'rgba(0,0,0,.45)' : 'transparent', borderRadius: 12, padding: story.cover_url ? '16px 24px' : 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: story.cover_url ? '#fff' : 'var(--text-muted)', marginBottom: 10 }}>PICTURE BOOK</p>
          <h1 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 900, lineHeight: 1.3, color: story.cover_url ? '#fff' : 'var(--text)', margin: '0 0 10px' }}>
            {story.title}
          </h1>
          <p style={{ fontSize: 14, color: story.cover_url ? 'rgba(255,255,255,.8)' : 'var(--text-muted)', margin: 0 }}>글·그림 · 뚝딱동화</p>
        </div>
      </div>
    </div>
  );
}

/* ── 내용 페이지 ─────────────────────────────────── */
function ContentPage({ page, pageNum, totalPages, lang, onToggleLang, translating }) {
  const text = lang === 'en' && page.text_translated ? page.text_translated : (page.text_ko || page.text || '');
  const tint = page.tint || 'var(--surface)';

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      borderRadius: 20, overflow: 'hidden', border: '1.5px solid var(--border)',
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* 이미지 */}
      <div style={{
        minHeight: 'clamp(260px, 38vw, 440px)',
        background: page.image_url ? 'transparent' : tint,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', fontSize: 15, fontWeight: 600,
      }}>
        {page.image_url
          ? <img src={page.image_url} alt={`${pageNum}쪽`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : page.illo
            ? <span style={{ fontSize: 60 }}>📖</span>
            : <span>이미지 생성 중...</span>
        }
      </div>

      {/* 텍스트 */}
      <div style={{
        background: 'var(--surface)', padding: 'clamp(22px,3vw,40px)',
        display: 'flex', flexDirection: 'column', minHeight: 'clamp(260px,38vw,440px)',
      }}>
        <p style={{ fontFamily: "'Poppins','Noto Sans KR',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--text-muted)', marginBottom: 18 }}>
          {pageNum} / {totalPages}
        </p>
        <p style={{ flex: 1, fontSize: 'clamp(16px,2.2vw,21px)', lineHeight: 1.95, color: 'var(--text)', margin: 0, whiteSpace: 'pre-line' }}>
          {text}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button
            onClick={onToggleLang}
            disabled={translating}
            style={{
              background: 'var(--bg)', color: 'var(--text)',
              border: '1.5px solid var(--border)', borderRadius: 12,
              padding: '10px 20px', fontSize: 15, fontWeight: 700,
              cursor: translating ? 'wait' : 'pointer', fontFamily: 'inherit',
              opacity: translating ? 0.6 : 1,
            }}
          >
            {translating ? '번역 중...' : lang === 'ko' ? 'English' : '한국어'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 끝 페이지 ───────────────────────────────────── */
function EndPage({ story, onRestart, onPdf }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: story.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('링크가 복사됐어요!');
    }
  };

  const btnStyle = (primary) => ({
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '14px 26px', borderRadius: 14, fontSize: 16, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit', border: primary ? 'none' : '1.5px solid var(--border)',
    background: primary ? 'var(--primary)' : 'var(--surface)',
    color: primary ? 'var(--text-on-primary)' : 'var(--text)',
  });

  return (
    <div style={{
      borderRadius: 20, background: 'var(--surface)', border: '1.5px solid var(--border)',
      padding: 'clamp(30px,5vw,56px)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 24,
      minHeight: 'clamp(280px,40vw,440px)', textAlign: 'center',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ fontSize: 56 }}>🎉</div>
      <div>
        <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, color: 'var(--text)', margin: '0 0 8px' }}>동화 끝!</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0 }}>{story.character_name || ''}의 이야기를 끝까지 읽어주셔서 고마워요</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        <button onClick={onRestart} style={btnStyle(false)}>
          <Icon d="M3 12a9 9 0 1 0 3-6.7L3 8" /> 다시보기
        </button>
        <button onClick={onPdf} style={btnStyle(false)}>
          <Icon><><path d="M12 3v12" /><path d="M7 11l5 5 5-5" /><path d="M5 21h14" /></></Icon>
          PDF 저장
        </button>
        <button onClick={handleShare} style={btnStyle(true)}>
          <Icon><><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></></Icon>
          공유하기
        </button>
      </div>
    </div>
  );
}

/* ── 메인 뷰어 ───────────────────────────────────── */
export default function ViewerPage() {
  const { story_id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [pages, setPages] = useState([]);
  const [idx, setIdx] = useState(0);
  const [lang, setLang] = useState('ko');
  const [translating, setTranslating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!story_id) { navigate('/library'); return; }

    // 샘플 동화
    if (story_id.startsWith('s')) {
      const sample = SAMPLE_BOOKS.find(b => b.id === story_id);
      if (sample) {
        setStory(sample);
        setPages((sample.pages || []).slice().sort((a, b) => a.page_number - b.page_number));
        setLoading(false);
        return;
      }
    }

    // 실제 동화 API
    axios.get(`/v1/stories/${story_id}`)
      .then(res => {
        const data = res.data;
        setStory(data);
        setPages((data.pages || []).slice().sort((a, b) => a.page_number - b.page_number));
      })
      .catch(() => navigate('/library'))
      .finally(() => setLoading(false));
  }, [story_id]);

  // 키보드 네비게이션
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(idx - 1);
      if (e.key === 'ArrowRight') go(idx + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, pages]);

  const totalSlides = pages.length + 2; // 표지 + 내용 + 끝
  const go = (i) => setIdx(Math.max(0, Math.min(totalSlides - 1, i)));

  const handleToggleLang = async () => {
    if (lang === 'en') { setLang('ko'); return; }
    const hasTranslation = pages.every(p => p.text_translated);
    if (hasTranslation) { setLang('en'); return; }

    setTranslating(true);
    try {
      const res = await axios.post(`/v1/stories/${story_id}/translate`, { lang: 'en' });
      const transPages = res.data?.pages || [];
      setPages(prev => prev.map(p => {
        const t = transPages.find(tp => tp.id === p.id);
        return t ? { ...p, text_translated: t.text_translated } : p;
      }));
      setLang('en');
    } catch {
      alert('번역에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setTranslating(false);
    }
  };

  const handlePdf = () => {
    window.open(`${import.meta.env.VITE_API_URL}/v1/stories/${story_id}/pdf`, '_blank');
  };

  const thumbLabel = (i) => {
    if (i === 0) return '표지';
    if (i === totalSlides - 1) return '끝';
    return String(i);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-muted)' }}>불러오는 중...</p>
      </div>
    );
  }

  if (!story) return null;

  const contentPageIdx = idx - 1; // 0=표지, 1~N=내용, N+1=끝
  const isEnd = idx === totalSlides - 1;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      <div className="wrap fade" style={{ maxWidth: 960, paddingTop: 32 }}>

        {/* 상단: 뒤로가기 + 제목 + 페이지 뱃지 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button
            onClick={() => navigate('/library')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: 'none', color: 'var(--text-muted)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '8px 0',
            }}
          >
            <Icon d="M19 12H5M5 12l7-7M5 12l7 7" size={18} /> 책장
          </button>
          <h2 style={{ flex: 1, margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {story.title}
          </h2>
          <span style={{
            background: 'var(--surface-sunk)', color: 'var(--text-muted)',
            fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 999,
            fontFamily: "'Poppins',sans-serif",
          }}>
            {idx + 1} / {totalSlides}
          </span>
        </div>

        {/* 메인 스테이지 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px,2vw,18px)' }}>
          <ArrowBtn direction="prev" onClick={() => go(idx - 1)} disabled={idx === 0} />

          <div style={{ flex: 1, minWidth: 0 }}>
            {idx === 0 && <CoverPage story={story} />}
            {!isEnd && idx > 0 && pages[contentPageIdx] && (
              <ContentPage
                page={pages[contentPageIdx]}
                pageNum={contentPageIdx + 1}
                totalPages={pages.length}
                lang={lang}
                onToggleLang={handleToggleLang}
                translating={translating}
              />
            )}
            {isEnd && (
              <EndPage
                story={story}
                onRestart={() => go(0)}
                onPdf={handlePdf}
              />
            )}
          </div>

          <ArrowBtn direction="next" onClick={() => go(idx + 1)} disabled={isEnd} />
        </div>

        {/* 썸네일 */}
        <div style={{
          display: 'grid', gridTemplateColumns: `repeat(${totalSlides}, minmax(48px, 1fr))`,
          gap: 'clamp(6px,1.4vw,14px)', marginTop: 'clamp(20px,3vw,32px)',
          overflowX: 'auto', paddingBottom: 4,
        }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button key={i} onClick={() => go(i)} style={{
              aspectRatio: '4/3', borderRadius: 10, cursor: 'pointer',
              background: 'var(--surface-sunk)',
              border: i === idx ? '2.5px solid var(--primary)' : '1.5px solid var(--border)',
              color: i === idx ? 'var(--text)' : 'var(--text-muted)',
              fontFamily: "'Poppins','Noto Sans KR',sans-serif",
              fontWeight: 700, fontSize: 'clamp(11px,1.4vw,14px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'border-color .15s',
            }}>
              {thumbLabel(i)}
            </button>
          ))}
        </div>

        {/* 키보드 안내 */}
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, marginTop: 14 }}>
          ← → 키로도 넘길 수 있어요
        </p>
      </div>
    </div>
  );
}