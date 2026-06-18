import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MagicWand, WarningCircle } from '@phosphor-icons/react';
import axios from 'axios';
import useGenerateStore from '../store/generateStore';

const ART_STYLE_LABELS = {
  fairytale: '동화책 스타일',
  watercolor: '수채화',
  cartoon: '만화',
  animation: '애니메이션',
};

const ART_PALETTE = {
  fairytale: '#fceabb',
  watercolor: '#d0eaff',
  cartoon: '#ffd6f0',
  animation: '#d6ffe0',
};

/* ── 커버 미리보기 ─────────────────────────────── */
function CoverPreview({ store }) {
  const { chars, artStyle, background } = store;
  const main = chars[0] || {};
  const bg = ART_PALETTE[artStyle] || '#fff8de';

  return (
    <div style={{
      width: '100%', aspectRatio: '3/4', borderRadius: 20,
      background: bg, border: '2px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24, gap: 16, boxShadow: 'var(--shadow-card)',
    }}>
      {/* 마스코트 / 아이콘 자리 */}
      <div style={{
        width: 90, height: 90, borderRadius: '50%',
        background: 'var(--primary)', border: '2px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 40,
      }}>
        {main.gender === 'female' ? '👧' : '👦'}
      </div>
      <div className="story-cover-title">
        {main.name ? `${main.name}의 이야기` : '나의 동화'}
      </div>
      <div style={{ fontSize: 13, color: '#5c4033', opacity: .7, textAlign: 'center' }}>
        {background || ''} {artStyle ? `· ${ART_STYLE_LABELS[artStyle]}` : ''}
      </div>
    </div>
  );
}

/* ── 메인 컴포넌트 ─────────────────────────────── */
export default function StoryCheckPage() {
  const navigate = useNavigate();
  const store = useGenerateStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    input_mode, chars, age, background,
    situation, moral, artStyle,
  } = store;

  const main = chars[0] || {};
  const sub = chars.slice(1);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/v1/stories/generate', {
        input_mode: input_mode,
        character_name: main.name,
        character_gender: main.gender,
        sub_chars: sub.map(c => ({ name: c.name, gender: c.gender })),
        age_group: age,
        background,
        situation,
        moral: input_mode === 'parent' ? moral : '',
        art_style: artStyle,
      });
      const jobId = res.data?.job_id;
      if (jobId) {
        sessionStorage.setItem('job_id', jobId);
      }
      navigate('/loading');
    } catch (e) {
      setError(e?.response?.data?.message || '요청 중 오류가 발생했어요. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const subCharText = sub.filter(c => c.name).map(c =>
    `${c.name} (${c.gender === 'female' ? '여자' : '남자'})`
  ).join(', ');

  const rows = [
    { k: '등장인물', v: main.name ? `${main.name} (${main.gender === 'female' ? '여자' : '남자'})${subCharText ? ', ' + subCharText : ''}` : '미입력' },
    { k: '나이대', v: age || '미선택' },
    { k: '배경', v: background || '미선택' },
    { k: '상황', v: situation || '미입력' },
    ...(input_mode === 'parent' ? [{ k: '교훈', v: moral || '미입력' }] : []),
    { k: '그림체', v: ART_STYLE_LABELS[artStyle] || '미선택' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 60 }}>
      <div className="wrap fade" style={{ maxWidth: 820, paddingTop: 40 }}>
        {/* 스테퍼 (step 2 완료 상태) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32, justifyContent: 'center' }}>
          {['인물·나이', '이야기', '그림체'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 14, color: 'var(--text)',
                }}>
                  ✓
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < 2 && <div style={{ width: 56, height: 3, marginBottom: 20, background: 'var(--primary)' }} />}
            </div>
          ))}
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6, color: 'var(--text)', textAlign: 'center' }}>
          내용을 확인해 주세요
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 36, textAlign: 'center' }}>
          아래 내용으로 동화를 생성합니다
        </p>

        {/* 좌우 레이아웃 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.6fr)',
          gap: 28, alignItems: 'start',
        }}>
          {/* 왼쪽: 커버 미리보기 */}
          <CoverPreview store={store} />

          {/* 오른쪽: 요약 카드 */}
          <div style={{
            background: 'var(--surface)', borderRadius: 20,
            border: '1.5px solid var(--border)', padding: '20px 22px',
            boxShadow: 'var(--shadow-card)',
          }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>입력 내용 요약</h3>
            {rows.map(row => (
              <div key={row.k} className="sum-row">
                <span className="k">{row.k}</span>
                <span className="v" style={{ maxWidth: '62%', wordBreak: 'break-all', textAlign: 'right' }}>{row.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 에러 */}
        {error && (
          <div style={{
            marginTop: 20, padding: '12px 16px', borderRadius: 12,
            background: '#fff0f0', border: '1.5px solid #ffcccc',
            color: '#c0392b', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14,
          }}>
            <WarningCircle size={18} />
            {error}
          </div>
        )}

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <button
            onClick={() => navigate('/create')}
            style={{
              padding: '13px 24px', borderRadius: 12,
              border: '1.5px solid var(--border)', background: 'var(--surface)',
              color: 'var(--text)', fontWeight: 600, fontSize: 15,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
            }}
          >
            <ArrowLeft size={17} />
            다시 고치기
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              flex: 1, padding: '13px 24px', borderRadius: 12,
              border: 'none',
              background: loading ? 'var(--step-idle)' : 'var(--primary)',
              color: loading ? 'var(--text-muted)' : 'var(--text)',
              fontWeight: 700, fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all .15s',
            }}
          >
            <MagicWand size={19} weight="fill" />
            {loading ? '요청 중...' : '동화 만들기'}
          </button>
        </div>
      </div>
    </div>
  );
}
