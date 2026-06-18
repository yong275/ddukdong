import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CaretLeft, CaretRight,
  Translate, SpinnerGap, WarningCircle,
} from '@phosphor-icons/react';
import axios from 'axios';

/* ── 배경 팔레트 ────────────────────────────── */
const ART_PALETTE = {
  fairytale: '#fceabb',
  watercolor: '#d0eaff',
  cartoon: '#ffd6f0',
  animation: '#d6ffe0',
};

/* ── 페이지 카드 ─────────────────────────────── */
function PageCard({ page, coverStyle, isCover, isBack, title }) {
  const bg = coverStyle || '#fff8de';

  if (isCover) {
    return (
      <div style={{
        width: '100%', aspectRatio: '4/3', borderRadius: 20,
        background: bg, border: '1.5px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 32, gap: 20, boxShadow: 'var(--shadow-pop)',
        overflow: 'hidden', position: 'relative',
      }}>
        {page?.image_url
          ? <img src={page.image_url} alt="cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }} />
          : (
            <div style={{ fontSize: 80, zIndex: 1 }}>📖</div>
          )
        }
        <div className="story-cover-title" style={{ position: 'relative', zIndex: 1, textShadow: '0 1px 8px rgba(255,255,255,.7)' }}>
          {title || '나의 동화'}
        </div>
      </div>
    );
  }

  if (isBack) {
    return (
      <div style={{
        width: '100%', aspectRatio: '4/3', borderRadius: 20,
        background: bg, border: '1.5px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 40, gap: 16, boxShadow: 'var(--shadow-pop)',
      }}>
        <div style={{ fontSize: 56 }}>🎉</div>
        <p style={{ fontWeight: 900, fontSize: 22, color: 'var(--text)', textAlign: 'center' }}>끝!</p>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', textAlign: 'center' }}>동화를 즐겁게 읽었나요?</p>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%', borderRadius: 20,
      border: '1.5px solid var(--border)',
      background: 'var(--surface)',
      boxShadow: 'var(--shadow-pop)',
      overflow: 'hidden',
    }}>
      {/* 이미지 영역 */}
      <div style={{
        width: '100%', aspectRatio: '4/3',
        background: bg, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 48, color: 'rgba(92,64,51,.3)',
      }}>
        {page?.image_url
          ? <img src={page.image_url} alt={`page ${page.page_number}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : '🎨'
        }
      </div>
      {/* 텍스트 */}
      <div style={{ padding: '24px 28px 28px' }}>
        <p className="story-page">
          {page?.text_translated || page?.text_ko || ''}
        </p>
      </div>
    </div>
  );
}

/* ── 메인 컴포넌트 ─────────────────────────────── */
export default function ViewerPage() {
  const { story_id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [pages, setPages] = useState([]);
  const [pageIdx, setPageIdx] = useState(0); // 0: 표지, ..., N+1: 뒷표지
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState(false);
  const thumbRef = useRef(null);

  /* 전체 페이지 배열: [cover, ...pages, back] */
  const totalPages = pages.length + 2; // 표지 + 내용 + 뒷표지
  const coverStyle = ART_PALETTE[story?.art_style] || '#fff8de';

  /* 데이터 fetch */
  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`/v1/stories/${story_id}`);
        const data = res.data?.story || res.data;
        setStory(data);
        const sortedPages = (data?.pages || []).slice().sort((a, b) => a.page_number - b.page_number);
        setPages(sortedPages);
      } catch (e) {
        setError('동화를 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    };
    if (story_id) fetchStory();
  }, [story_id]);

  /* 키보드 네비게이션 */
  const goNext = useCallback(() => setPageIdx(i => Math.min(i + 1, totalPages - 1)), [totalPages]);
  const goPrev = useCallback(() => setPageIdx(i => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  /* 썸네일 스크롤 */
  useEffect(() => {
    if (thumbRef.current) {
      const active = thumbRef.current.querySelector('[data-active="true"]');
      if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [pageIdx]);

  /* 번역 */
  const handleTranslate = async () => {
    if (translated) {
      // 원문으로 돌리기
      setPages(prev => prev.map(p => ({ ...p, text_translated: null })));
      setTranslated(false);
      return;
    }
    setTranslating(true);
    try {
      const res = await axios.post(`/v1/stories/${story_id}/translate`, { lang: 'en' });
      const transPages = res.data?.pages || [];
      setPages(prev =>
        prev.map(p => {
          const tp = transPages.find(t => t.page_number === p.page_number);
          return tp ? { ...p, text_translated: tp.text_translated } : p;
        })
      );
      setTranslated(true);
    } catch {
      alert('번역에 실패했어요.');
    } finally {
      setTranslating(false);
    }
  };

  /* 현재 페이지 콘텐츠 결정 */
  const isCover = pageIdx === 0;
  const isBack = pageIdx === totalPages - 1;
  const currentPage = !isCover && !isBack ? pages[pageIdx - 1] : null;

  /* ─── 렌더 ─── */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--text-muted)' }}>
        <SpinnerGap size={24} style={{ animation: 'ttspin .8s linear infinite' }} />
        <span>불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <WarningCircle size={40} color="#e74c3c" />
        <p style={{ color: 'var(--text)', fontWeight: 600 }}>{error}</p>
        <button onClick={() => navigate('/library')} style={{ padding: '11px 24px', borderRadius: 10, border: 'none', background: 'var(--primary)', color: 'var(--text)', fontWeight: 700, cursor: 'pointer' }}>
          책장으로
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* 상단 헤더 */}
      <div style={{
        padding: '14px 24px', display: 'flex', alignItems: 'center',
        gap: 12, borderBottom: '1px solid var(--border)',
        background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 20,
      }}>
        <button
          onClick={() => navigate('/library')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontWeight: 600, fontSize: 14, padding: '4px 0',
          }}
        >
          <ArrowLeft size={18} /> 책장
        </button>
        <div style={{ flex: 1, fontWeight: 700, fontSize: 15, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
          {story?.title || '동화'}
        </div>
        {/* 페이지 배지 */}
        <div style={{
          padding: '5px 12px', borderRadius: 999,
          background: 'var(--primary)', fontSize: 12, fontWeight: 700, color: 'var(--text)',
          whiteSpace: 'nowrap',
        }}>
          {pageIdx + 1} / {totalPages}
        </div>
        {/* 번역 버튼 */}
        <button
          onClick={handleTranslate}
          disabled={translating}
          style={{
            padding: '7px 14px', borderRadius: 10,
            border: '1.5px solid var(--border)',
            background: translated ? 'var(--accent)' : 'var(--surface)',
            color: 'var(--text)', fontWeight: 600, fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all .15s',
          }}
        >
          {translating
            ? <SpinnerGap size={15} style={{ animation: 'ttspin .8s linear infinite' }} />
            : <Translate size={15} />
          }
          {translated ? '원문 보기' : '영어로'}
        </button>
      </div>

      {/* 메인 뷰어 영역 */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{ width: '100%', maxWidth: 680, position: 'relative' }}>
          {/* 왼쪽 화살표 */}
          <button
            className="viewer-nav"
            onClick={goPrev}
            disabled={pageIdx === 0}
            style={{
              position: 'absolute', left: -56, top: '50%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: '50%',
              border: '1.5px solid var(--border)', background: 'var(--surface)',
              color: pageIdx === 0 ? 'var(--step-idle)' : 'var(--text)',
              cursor: pageIdx === 0 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-card)', transition: 'all .15s', zIndex: 5,
            }}
            aria-label="이전 페이지"
          >
            <CaretLeft size={20} weight="bold" />
          </button>

          {/* 페이지 카드 */}
          <div className="fade" key={pageIdx}>
            <PageCard
              page={currentPage}
              coverStyle={coverStyle}
              isCover={isCover}
              isBack={isBack}
              title={story?.title}
            />
          </div>

          {/* 오른쪽 화살표 */}
          <button
            className="viewer-nav"
            onClick={goNext}
            disabled={pageIdx === totalPages - 1}
            style={{
              position: 'absolute', right: -56, top: '50%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: '50%',
              border: '1.5px solid var(--border)', background: 'var(--surface)',
              color: pageIdx === totalPages - 1 ? 'var(--step-idle)' : 'var(--text)',
              cursor: pageIdx === totalPages - 1 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-card)', transition: 'all .15s', zIndex: 5,
            }}
            aria-label="다음 페이지"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* 하단 썸네일 */}
      <div
        ref={thumbRef}
        style={{
          display: 'flex', gap: 8, padding: '14px 20px',
          overflowX: 'auto', borderTop: '1px solid var(--border)',
          background: 'var(--surface)', scrollbarWidth: 'none',
        }}
      >
        {/* 표지 썸네일 */}
        {[0, ...pages.map((_, i) => i + 1), pages.length + 1].map((idx) => {
          const isActive = idx === pageIdx;
          const page = idx > 0 && idx <= pages.length ? pages[idx - 1] : null;
          const isThisCover = idx === 0;
          const isThisBack = idx === pages.length + 1;
          return (
            <button
              key={idx}
              data-active={isActive}
              onClick={() => setPageIdx(idx)}
              className="thumb"
              style={{
                flexShrink: 0, width: 60, height: 45, borderRadius: 8,
                border: `2px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                background: isThisCover || isThisBack ? (coverStyle) : (page?.image_url ? 'transparent' : 'var(--surface-sunk)'),
                cursor: 'pointer', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, transition: 'border-color .15s',
                padding: 0,
              }}
              aria-label={`페이지 ${idx + 1}`}
            >
              {page?.image_url
                ? <img src={page.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : isThisCover ? '📖'
                : isThisBack ? '🎉'
                : <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{idx}</span>
              }
            </button>
          );
        })}
      </div>
    </div>
  );
}
