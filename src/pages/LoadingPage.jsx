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

const STATUS_MESSAGES = {
  pending: '동화를 준비하고 있어요...',
  story_done: '이야기가 완성됐어요! 그림을 그리는 중...',
  image_done: '그림이 완성됐어요! 마무리 중...',
  completed: '동화가 완성됐어요!',
  failed: '생성 중 오류가 발생했어요.',
};

const STATUS_PCT = {
  pending: 15,
  story_done: 45,
  image_done: 80,
  completed: 100,
  failed: 0,
};

export default function LoadingPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending');
  const [errorMsg, setErrorMsg] = useState('');
  const [tipIdx, setTipIdx] = useState(0);
  const intervalRef = useRef(null);
  const tipIntervalRef = useRef(null);

  const jobId = sessionStorage.getItem('job_id');
  const isDemo = sessionStorage.getItem('demo_mode') === 'true';

  const poll = async () => {
    if (isDemo) {
      // 데모 모드: 가짜 로딩 후 랜덤 샘플 동화로 이동
      const samples = ['s1', 's2', 's3', 's4', 's5'];
      const pick = samples[Math.floor(Math.random() * samples.length)];
      let pct = 0;
      const timer = setInterval(() => {
        pct += Math.floor(Math.random() * 15) + 5;
        if (pct >= 100) {
          clearInterval(timer);
          sessionStorage.removeItem('demo_mode');
          navigate('/viewer/' + pick);
        } else {
          setStatus(pct < 40 ? 'pending' : pct < 80 ? 'story_done' : 'image_done');
        }
      }, 600);
      return;
    }
    if (!jobId) {
      setStatus('failed');
      setErrorMsg('작업 ID를 찾을 수 없어요. 다시 시도해 주세요.');
      return;
    }
    try {
      const res = await axios.get(`/v1/stories/jobs/${jobId}`);
      const { status: s, story_id } = res.data;
      setStatus(s);
      if (s === 'completed') {
        clearInterval(intervalRef.current);
        sessionStorage.removeItem('job_id');
        setTimeout(() => navigate(`/viewer/${story_id}`), 600);
      } else if (s === 'failed') {
        clearInterval(intervalRef.current);
        setErrorMsg(res.data?.message || '동화 생성에 실패했어요.');
      }
    } catch (e) {
      // 네트워크 오류는 무시하고 계속 폴링
    }
  };

  useEffect(() => {
    poll();
    intervalRef.current = setInterval(poll, 3000);
    tipIntervalRef.current = setInterval(() => {
      setTipIdx(i => (i + 1) % TIPS.length);
    }, 4000);
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(tipIntervalRef.current);
    };
  }, []);

  const pct = STATUS_PCT[status] || 0;
  const msg = STATUS_MESSAGES[status] || '처리 중...';
  const pctDeg = `${pct}%`;

  const handleRetry = () => {
    navigate('/create');
  };

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
            📖
          </div>
        </div>

        {/* 제목 */}
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8, color: 'var(--text)' }}>
          동화를 만들고 있어요
        </h1>

        {/* 상태 메시지 */}
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32, minHeight: 22 }}>
          {msg}
        </p>

        {/* 원형 진행률 */}
        {status !== 'failed' && (
          <div
            className="loader-ring"
            style={{ '--pct': pctDeg }}
          >
            <div className="inner">
              {pct}
              <span style={{ fontSize: 13, fontWeight: 500 }}>%</span>
            </div>
          </div>
        )}

        {/* 에러 */}
        {status === 'failed' && (
          <div style={{ marginTop: 8 }}>
            <div style={{
              padding: '14px 18px', borderRadius: 14,
              background: '#fff0f0', border: '1.5px solid #ffcccc',
              color: '#c0392b', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14,
              marginBottom: 20, textAlign: 'left',
            }}>
              <WarningCircle size={20} />
              {errorMsg || '생성 중 오류가 발생했어요.'}
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
        {status !== 'failed' && (
          <div style={{
            marginTop: 40, padding: '16px 20px',
            background: 'var(--surface)', borderRadius: 14,
            border: '1.5px solid var(--border)',
            textAlign: 'left',
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginBottom: 6, letterSpacing: .5 }}>
              💡 TIP
            </p>
            <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.65, transition: 'opacity .3s' }}>
              {TIPS[tipIdx]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
