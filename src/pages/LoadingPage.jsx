import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowClockwise, WarningCircle } from '@phosphor-icons/react';
import axios from '../api/axios';

const TIPS = [
  '아이의 이름을 넣으면 더 특별한 동화가 완성돼요!',
  '동화는 총 6~10컷으로 구성돼요.',
  '완성된 동화는 책장에 영구 보관할 수 있어요.',
  '그림체를 바꾸면 전혀 다른 느낌의 동화가 만들어져요.',
  '번역 기능으로 영어 동화도 읽을 수 있어요.',
  'Solar AI가 한국어로 이야기를 쓰고, DALL·E가 그림을 그려요.',
];

function getMsg(pct, isImagePhase) {
  if (isImagePhase) {
    if (pct < 65) return '그림 준비 중이에요...';
    if (pct < 85) return '그림을 그리고 있어요...';
    if (pct < 100) return '색을 입히고 있어요...';
    return '동화가 완성됐어요!';
  } else {
    if (pct < 30) return '이야기 구조를 잡고 있어요...';
    if (pct < 70) return '동화를 쓰고 있어요...';
    if (pct < 100) return '마무리 손질 중이에요...';
    return '이야기가 완성됐어요!';
  }
}

export default function LoadingPage() {
  const navigate = useNavigate();
  const isImagePhaseRef = useRef(
    sessionStorage.getItem('image_phase') === 'true' ||
    sessionStorage.getItem('demo_phase') === 'image'
  );
  const isImagePhase = isImagePhaseRef.current;
  const isDemo      = sessionStorage.getItem('demo_mode')   === 'true';
  const jobId       = sessionStorage.getItem('job_id');

  const [fakePct,    setFakePct]    = useState(0);
  const [errorMsg,   setErrorMsg]   = useState('');
  const [tipIdx,     setTipIdx]     = useState(0);
  const [readyToNav, setReadyToNav] = useState(false);
  const [navTarget,  setNavTarget]  = useState(null);

  const pollRef = useRef(null);
  const slowRef = useRef(null);
  const fastRef = useRef(null);

  /* ── 슬로우 fill ─────────────────────────────── */
  useEffect(() => {
    const cap = isImagePhase ? 88 : 44;
    slowRef.current = setInterval(() => {
      setFakePct(p => (p >= cap ? p : p + Math.floor(Math.random() * 2) + 1));
    }, 700);
    return () => clearInterval(slowRef.current);
  }, [isImagePhase]);

  /* ── 패스트 fill → 이동 ──────────────────────── */
  useEffect(() => {
    if (!readyToNav || !navTarget) return;
    clearInterval(slowRef.current);
    fastRef.current = setInterval(() => {
      setFakePct(p => {
        const next = Math.min(p + 7, 100);
        if (next >= 100) {
          clearInterval(fastRef.current);
          setTimeout(() => navigate(navTarget, { replace: true }), 350);
        }
        return next;
      });
    }, 60);
    return () => clearInterval(fastRef.current);
  }, [readyToNav, navTarget, navigate]);

  /* ── 폴링 / 데모 ─────────────────────────────── */
  useEffect(() => {
    if (isDemo) {
      const delay = isImagePhase ? 4500 : 3500;
      const t = setTimeout(() => {
        if (isImagePhase) {
          const pick = sessionStorage.getItem('demo_pick') || 's1';
          sessionStorage.removeItem('demo_mode');
          sessionStorage.removeItem('demo_phase');
          sessionStorage.removeItem('demo_pick');
          setNavTarget('/viewer/' + pick);
        } else {
          sessionStorage.setItem('demo_phase', 'image');
          setNavTarget('/story-check');
        }
        setReadyToNav(true);
      }, delay);
      return () => clearTimeout(t);
    }

    if (!jobId) {
      setErrorMsg('작업 ID를 찾을 수 없어요. 다시 시도해 주세요.');
      return;
    }

    const poll = async () => {
      try {
        const res = await axios.get(`/v1/stories/jobs/${jobId}`);
        const { status: s, story_id } = res.data;
        if (s === 'story_done' && !isImagePhase) {
          clearInterval(pollRef.current);
          setNavTarget('/story-check');
          setReadyToNav(true);
        } else if (s === 'completed') {
          clearInterval(pollRef.current);
          sessionStorage.removeItem('job_id');
          sessionStorage.removeItem('image_phase');
          setNavTarget(`/viewer/${story_id}`);
          setReadyToNav(true);
        } else if (s === 'failed') {
          clearInterval(pollRef.current);
          setErrorMsg(res.data?.error_message || '동화 생성에 실패했어요.');
        }
      } catch {
        // 네트워크 오류 무시, 계속 폴링
      }
    };

    poll();
    pollRef.current = setInterval(poll, 3000);
    return () => clearInterval(pollRef.current);
  }, []);

  /* ── 팁 로테이션 ─────────────────────────────── */
  useEffect(() => {
    const t = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleRetry = () => {
    if (isImagePhase) {
      sessionStorage.removeItem('image_phase');
      navigate('/story-check');
    } else {
      navigate('/create');
    }
  };

  const msg = getMsg(fakePct, isImagePhase);

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="wrap fade" style={{ maxWidth: 440, textAlign: 'center', paddingTop: 40, paddingBottom: 60 }}>

        {/* 마스코트 */}
        <div style={{ marginBottom: 28 }}>
          <div
            className="mascot"
            style={{
              width: 150, height: 150, borderRadius: '50%',
              background: 'var(--primary)', margin: '0 auto',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 72, boxShadow: '0 8px 24px rgba(255,219,77,0.35)',
            }}
          >
            {isImagePhase ? '🎨' : '📖'}
          </div>
        </div>

        {/* 제목 */}
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8, color: 'var(--text)' }}>
          {isImagePhase ? '그림을 그리고 있어요' : '동화를 만들고 있어요'}
        </h1>

        {/* 상태 메시지 */}
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32, minHeight: 22 }}>
          {errorMsg || msg}
        </p>

        {/* 원형 진행률 */}
        {!errorMsg && (
          <div
            className="loader-ring"
            style={{ '--pct': `${fakePct}%` }}
          >
            <div className="inner">
              {fakePct}
              <span style={{ fontSize: 13, fontWeight: 500 }}>%</span>
            </div>
          </div>
        )}

        {/* 에러 */}
        {errorMsg && (
          <div style={{ marginTop: 8 }}>
            <div style={{
              padding: '14px 18px', borderRadius: 14,
              background: '#fff0f0', border: '1.5px solid #ffcccc',
              color: '#c0392b', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14,
              marginBottom: 20, textAlign: 'left',
            }}>
              <WarningCircle size={20} />
              {errorMsg}
            </div>
            <button
              onClick={handleRetry}
              style={{
                padding: '13px 32px', borderRadius: 12,
                border: 'none', background: 'var(--primary)',
                color: 'var(--text)', fontWeight: 700, fontSize: 15,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <ArrowClockwise size={18} weight="bold" />
              다시 시도하기
            </button>
          </div>
        )}

        {/* 팁 카드 */}
        {!errorMsg && (
          <div style={{
            marginTop: 40, padding: '16px 20px',
            background: 'var(--surface)', borderRadius: 14,
            border: '1.5px solid var(--border)',
            textAlign: 'left',
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginBottom: 6, letterSpacing: .5 }}>
              💡 TIP
            </p>
            <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.65 }}>
              {TIPS[tipIdx]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
