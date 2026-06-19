import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function Icon({ d, size = 20, sw = 2.3, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {d ? <path d={d} /> : children}
    </svg>
  );
}

export default function StoryCheckPage() {
  const navigate = useNavigate();
  const jobId = sessionStorage.getItem('job_id');

  const [story, setStory] = useState(null);
  const [pages, setPages] = useState([]);
  const [openIdx, setOpenIdx] = useState(0);
  const [editIdx, setEditIdx] = useState(-1);
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const MAX_REGEN = 3;

  useEffect(() => {
    if (!jobId) { navigate('/create'); return; }
    // job에서 story 데이터 가져오기
    axios.get(`/v1/stories/jobs/${jobId}`).then(res => {
      const { story: s } = res.data;
      if (s) {
        setStory(s);
        setPages((s.pages || []).map((p, i) => ({ ...p, id: i + 1 })));
      }
    }).catch(() => navigate('/create'));
  }, [jobId]);

  const setPageText = (i, v) =>
    setPages(prev => prev.map((p, j) => j === i ? { ...p, text: v } : p));

  const handleRegenerate = async () => {
    if (regenerateCount >= MAX_REGEN) return;
    setRegenerating(true);
    try {
      await axios.post(`/v1/stories/jobs/${jobId}/regenerate`);
      setRegenerateCount(c => c + 1);
      navigate('/loading');
    } catch {
      alert('재생성에 실패했어요.');
      setRegenerating(false);
    }
  };

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      // 수정된 페이지 텍스트를 job에 반영
      await axios.post(`/v1/stories/${jobId}/confirm`, { pages });
      navigate('/loading');
    } catch (e) {
      alert(e?.response?.data?.error || '확정에 실패했어요.');
      setConfirming(false);
    }
  };

  if (!story) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <p style={{ color: 'var(--text-muted)' }}>줄거리 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 120 }}>
      <div className="wrap fade" style={{ maxWidth: 800, paddingTop: 40 }}>

        {/* 스테퍼 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 36 }}>
          {[{ label: '인물', done: true }, { label: '이야기', active: true }, { label: '그림', idle: true }].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: s.done ? 'var(--accent)' : s.active ? 'var(--primary)' : 'var(--step-idle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 18, color: s.idle ? 'var(--text-muted)' : 'var(--text)',
                }}>
                  {s.done ? <Icon d="M5 12l5 5 9-10" size={22} sw={2.8} /> : i + 1}
                </div>
                <span style={{ fontSize: 14, fontWeight: s.active ? 700 : 500, color: s.active ? 'var(--text)' : 'var(--text-muted)' }}>{s.label}</span>
              </div>
              {i < 2 && <div style={{ width: 60, height: 2, borderTop: '2px dashed var(--border)', margin: '0 8px 20px' }} />}
            </div>
          ))}
        </div>

        {/* 제목 */}
        <h2 style={{ fontSize: 'clamp(20px,3vw,26px)', fontWeight: 900, color: 'var(--text)', margin: '0 0 6px' }}>이야기 확인</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 24px' }}>그림은 확정 후 생성돼요. 지금 스토리를 확인하고 수정할 수 있어요.</p>

        {/* 스토리 카드 */}
        <div style={{ background: 'var(--surface)', borderRadius: 22, padding: 'clamp(18px,3vw,28px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, color: 'var(--text)', flex: 1 }}>{story.title}</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pages.map((page, i) => {
              const open = i === openIdx;
              const editing = open && i === editIdx;
              const text = page.text || '';
              return (
                <div key={i} style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
                  {/* 헤더 토글 */}
                  <button
                    onClick={() => { setOpenIdx(open ? -1 : i); setEditIdx(-1); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                      padding: '16px 20px', background: 'transparent', border: 'none',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                    }}
                  >
                    <span style={{
                      flexShrink: 0, background: 'var(--primary)', color: 'var(--text-on-primary)',
                      fontWeight: 700, fontSize: 13, padding: '6px 14px', borderRadius: 999,
                    }}>
                      {i + 1}쪽
                    </span>
                    <span style={{ flex: 1, fontSize: 14, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {text}
                    </span>
                    <span style={{ flexShrink: 0, color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>
                      <Icon d="M6 9l6 6 6-6" />
                    </span>
                  </button>

                  {/* 펼쳐진 내용 */}
                  {open && (
                    <div style={{ padding: '0 20px 20px', borderTop: '1.5px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingTop: 16, flexWrap: 'wrap' }}>
                        {editing ? (
                          <>
                            <textarea
                              value={text}
                              onChange={e => setPageText(i, e.target.value)}
                              style={{
                                flex: 1, minWidth: 240, minHeight: 100,
                                background: 'var(--bg)', border: '1.5px solid var(--border)',
                                borderRadius: 12, padding: '12px 16px',
                                fontSize: 15, lineHeight: 1.8, color: 'var(--text)',
                                fontFamily: 'inherit', resize: 'vertical',
                              }}
                            />
                            <button
                              onClick={() => setEditIdx(-1)}
                              style={{
                                flexShrink: 0, background: 'var(--primary)', color: 'var(--text-on-primary)',
                                border: 'none', borderRadius: 11, padding: '10px 20px',
                                fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                              }}
                            >완료</button>
                          </>
                        ) : (
                          <>
                            <p style={{ flex: 1, minWidth: 240, margin: 0, fontSize: 15, lineHeight: 1.9, color: 'var(--text)', whiteSpace: 'pre-line' }}>
                              {text}
                            </p>
                            <button
                              onClick={() => setEditIdx(i)}
                              style={{
                                flexShrink: 0, background: 'var(--surface)', color: 'var(--text)',
                                border: '1.5px solid var(--border)', borderRadius: 11,
                                padding: '10px 20px', fontSize: 14, fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'inherit',
                              }}
                            >수정</button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 하단 고정 액션 바 */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--nav-track)', borderTop: '1.5px solid var(--border)', zIndex: 30 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(14px,2vw,18px) 24px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={handleRegenerate}
            disabled={regenerating || regenerateCount >= MAX_REGEN}
            style={{
              flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--surface-2)', color: 'var(--text)',
              border: '1.5px solid var(--border)', borderRadius: 14,
              padding: '14px 20px', fontSize: 14, fontWeight: 700,
              cursor: regenerateCount >= MAX_REGEN ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', opacity: regenerateCount >= MAX_REGEN ? 0.5 : 1,
            }}
          >
            <Icon d="M3 12a9 9 0 1 0 3-6.7L3 8" size={18} />
            전체 재생성
            <span style={{ fontWeight: 500, opacity: 0.6, fontSize: 13 }}>({regenerateCount}/{MAX_REGEN})</span>
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirming}
            style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: confirming ? 'var(--step-idle)' : 'var(--primary)',
              color: confirming ? 'var(--text-muted)' : 'var(--text-on-primary)',
              border: 'none', borderRadius: 14, padding: '16px 24px',
              fontSize: 'clamp(15px,2vw,18px)', fontWeight: 800,
              cursor: confirming ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}
          >
            {confirming ? '처리 중...' : '확정 후 그림 생성하기'}
            {!confirming && <Icon d="M9 6l6 6-6 6" size={20} sw={2.6} />}
          </button>
        </div>
      </div>
    </div>
  );
}