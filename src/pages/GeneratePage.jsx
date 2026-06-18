import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Plus, X, ArrowLeft, ArrowRight, CheckCircle,
  Bookmarks, Mountains, House, Waves, Ghost, Park,
  Storefront, Star, PaintBrush
} from '@phosphor-icons/react';
import useGenerateStore from '../store/generateStore';

/* ── 상수 ─────────────────────────────────────── */
const AGE_OPTIONS = [
  { label: '4-6세', value: '4-6' },
  { label: '7-9세', value: '7-9' },
  { label: '10-12세', value: '10-12' },
];

const BG_OPTIONS = [
  { label: '학교', value: '학교', icon: <Bookmarks size={18} /> },
  { label: '깊은 산속', value: '깊은 산속', icon: <Mountains size={18} /> },
  { label: '한옥마을', value: '한옥마을', icon: <House size={18} /> },
  { label: '용궁', value: '용궁', icon: <Waves size={18} /> },
  { label: '도깨비 마을', value: '도깨비 마을', icon: <Ghost size={18} /> },
  { label: '놀이터', value: '놀이터', icon: <Park size={18} /> },
  { label: '전통시장', value: '전통시장', icon: <Storefront size={18} /> },
  { label: '설·추석', value: '설·추석', icon: <Star size={18} /> },
];

const ART_STYLES = [
  { value: 'fairytale', label: '동화책 스타일', desc: '따뜻하고 클래식한 삽화' },
  { value: 'watercolor', label: '수채화', desc: '부드럽고 몽환적인 수채화' },
  { value: 'cartoon', label: '만화', desc: '귀엽고 생동감 있는 만화' },
  { value: 'animation', label: '애니메이션', desc: '선명하고 밝은 애니 스타일' },
];

const ART_PALETTE = {
  fairytale: '#fceabb',
  watercolor: '#d0eaff',
  cartoon: '#ffd6f0',
  animation: '#d6ffe0',
};

/* ── 스테퍼 ─────────────────────────────────────── */
function Stepper({ step }) {
  const steps = ['인물·나이', '이야기', '그림체'];
  return (
    <div className="stepper" style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32, justifyContent: 'center' }}>
      {steps.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div className="stp" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div
              className="stp-dot"
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: i <= step ? 'var(--primary)' : 'var(--step-idle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14,
                color: i <= step ? 'var(--text)' : 'var(--text-muted)',
                transition: 'background .2s',
              }}
            >
              {i < step ? <CheckCircle size={18} weight="fill" /> : i + 1}
            </div>
            <span
              className="stp-label"
              style={{
                fontSize: 12, fontWeight: 600,
                color: i === step ? 'var(--text)' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="stp-bar"
              style={{
                width: 56, height: 3, marginBottom: 20,
                background: i < step ? 'var(--primary)' : 'var(--step-idle)',
                transition: 'background .2s',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── 캐릭터 카드 ─────────────────────────────────── */
function CharCard({ char, idx, onChange, onRemove, isMain }) {
  return (
    <div
      className="card"
      style={{
        background: 'var(--surface)', border: '1.5px solid var(--border)',
        borderRadius: 16, padding: '16px 18px', display: 'flex',
        flexDirection: 'column', gap: 12, position: 'relative', minWidth: 0,
      }}
    >
      {!isMain && (
        <button
          onClick={() => onRemove(idx)}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: 2,
          }}
          aria-label="삭제"
        >
          <X size={16} />
        </button>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <User size={17} weight="fill" color="#5c4033" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-muted)' }}>
          {isMain ? '주인공' : `등장인물 ${idx}`}
        </span>
      </div>
      <div className="field" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label className="label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>이름</label>
        <input
          type="text"
          value={char.name}
          onChange={e => onChange(idx, 'name', e.target.value)}
          placeholder="이름을 입력하세요"
          style={{
            padding: '10px 14px', borderRadius: 10,
            border: '1.5px solid var(--border)', background: 'var(--bg)',
            color: 'var(--text)', fontSize: 14, width: '100%',
          }}
        />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {[{ label: '여자', value: 'female' }, { label: '남자', value: 'male' }].map(g => (
          <button
            key={g.value}
            onClick={() => onChange(idx, 'gender', g.value)}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 8,
              border: '1.5px solid',
              borderColor: char.gender === g.value ? 'var(--primary)' : 'var(--border)',
              background: char.gender === g.value ? 'var(--primary)' : 'var(--bg)',
              color: 'var(--text)', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', transition: 'all .15s',
            }}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Step 0 ─────────────────────────────────────── */
function Step0({ store }) {
  const { input_mode, chars, age, setinput_mode, setage, updateCharacter, addCharacter, removeCharacter } = store;

  return (
    <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* 모드 토글 */}
      <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end' }}>
        {[{ label: '아이 입력', value: 'child' }, { label: '부모 입력', value: 'parent' }].map(m => (
          <button
            key={m.value}
            onClick={() => setinput_mode(m.value)}
            className="pill"
            style={{
              padding: '7px 18px', borderRadius: 999,
              border: '1.5px solid',
              borderColor: input_mode === m.value ? 'var(--primary)' : 'var(--border)',
              background: input_mode === m.value ? 'var(--primary)' : 'var(--bg)',
              color: 'var(--text)', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', transition: 'all .15s',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 캐릭터 */}
      <div>
        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: 'var(--text)' }}>등장인물</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {chars.map((c, i) => (
            <CharCard
              key={i} char={c} idx={i}
              onChange={updateCharacter}
              onRemove={removeCharacter}
              isMain={i === 0}
            />
          ))}
          {chars.length < 3 && (
            <button
              className="addcard"
              onClick={addCharacter}
              style={{
                border: '1.5px dashed var(--border-dashed)', borderRadius: 16,
                background: 'transparent', cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '28px 16px', color: 'var(--text-muted)',
                transition: 'border-color .15s',
                minHeight: 140,
              }}
            >
              <Plus size={28} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>인물 추가하기</span>
              <span style={{ fontSize: 11, opacity: .7 }}>최대 3명</span>
            </button>
          )}
        </div>
      </div>

      {/* 나이 */}
      <div>
        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: 'var(--text)' }}>나이대</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          {AGE_OPTIONS.map(a => (
            <button
              key={a.value}
              onClick={() => setage(a.value)}
              className="opt"
              style={{
                flex: 1, padding: '14px 8px', borderRadius: 14,
                border: '1.5px solid',
                borderColor: age === a.value ? 'var(--primary)' : 'var(--border)',
                background: age === a.value ? 'var(--primary)' : 'var(--surface)',
                color: 'var(--text)', fontWeight: 700, fontSize: 15,
                cursor: 'pointer', transition: 'all .15s',
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Step 1 ─────────────────────────────────────── */
function Step1({ store }) {
  const { input_mode, background, situation, moral, setBackground, setSituation, setMoral } = store;

  return (
    <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* 배경 */}
      <div>
        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>배경</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {BG_OPTIONS.map(b => (
            <button
              key={b.value}
              onClick={() => setBackground(b.value)}
              className="pill"
              style={{
                padding: '9px 18px', borderRadius: 999,
                border: '1.5px solid',
                borderColor: background === b.value ? 'var(--primary)' : 'var(--border)',
                background: background === b.value ? 'var(--primary)' : 'var(--surface)',
                color: 'var(--text)', fontWeight: 600, fontSize: 14,
                cursor: 'pointer', transition: 'all .15s',
                display: 'flex', alignItems: 'center', gap: 7,
              }}
            >
              {b.icon}
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* 상황 */}
      <div className="field" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label className="label" style={{ fontWeight: 700, fontSize: 14 }}>
          어떤 이야기를 담고 싶으세요?
        </label>
        <textarea
          value={situation}
          onChange={e => setSituation(e.target.value)}
          placeholder="예: 처음 학교에 가는 날, 새 친구를 사귀게 되는 이야기"
          rows={4}
          style={{
            padding: '12px 16px', borderRadius: 12,
            border: '1.5px solid var(--border)', background: 'var(--surface)',
            color: 'var(--text)', fontSize: 14, resize: 'vertical', lineHeight: 1.7,
          }}
        />
      </div>

      {/* 교훈 (부모 모드만) */}
      {input_mode === 'parent' && (
        <div className="field fade" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label className="label" style={{ fontWeight: 700, fontSize: 14 }}>
            아이에게 전하고 싶은 교훈은 무엇인가요?
          </label>
          <textarea
            value={moral}
            onChange={e => setMoral(e.target.value)}
            placeholder="예: 용기를 내면 무엇이든 할 수 있다는 것을 알려주고 싶어요"
            rows={3}
            style={{
              padding: '12px 16px', borderRadius: 12,
              border: '1.5px solid var(--border)', background: 'var(--surface)',
              color: 'var(--text)', fontSize: 14, resize: 'vertical', lineHeight: 1.7,
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ── Step 2 ─────────────────────────────────────── */
function Step2({ store }) {
  const { artStyle, setArtStyle, chars, age, background, situation, moral, input_mode } = store;
  const main = chars[0] || {};

  return (
    <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* 그림체 */}
      <div>
        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>그림체</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {ART_STYLES.map(a => (
            <button
              key={a.value}
              onClick={() => setArtStyle(a.value)}
              className="artcard"
              style={{
                padding: '20px 16px', borderRadius: 16, cursor: 'pointer',
                border: '2px solid',
                borderColor: artStyle === a.value ? 'var(--primary)' : 'var(--border)',
                background: artStyle === a.value ? ART_PALETTE[a.value] : 'var(--surface)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                transition: 'all .18s',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: ART_PALETTE[a.value],
                border: '1.5px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <PaintBrush size={26} color="#5c4033" weight="duotone" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{a.label}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>{a.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 요약 미리보기 */}
      <div style={{
        background: 'var(--surface)', borderRadius: 16,
        border: '1.5px solid var(--border)', padding: '18px 20px',
      }}>
        <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: 'var(--text-muted)' }}>입력 요약</h3>
        {[
          { k: '주인공', v: main.name ? `${main.name} (${main.gender === 'female' ? '여자' : '남자'})` : '미입력' },
          { k: '나이대', v: age || '미선택' },
          { k: '배경', v: background || '미선택' },
          { k: '상황', v: situation || '미입력' },
          ...(input_mode === 'parent' ? [{ k: '교훈', v: moral || '미입력' }] : []),
          { k: '그림체', v: ART_STYLES.find(a => a.value === artStyle)?.label || '미선택' },
        ].map(row => (
          <div key={row.k} className="sum-row">
            <span className="k">{row.k}</span>
            <span className="v" style={{ maxWidth: '65%', wordBreak: 'break-all', textAlign: 'right' }}>{row.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 메인 컴포넌트 ─────────────────────────────── */
export default function GeneratePage() {
  const navigate = useNavigate();
  const store = useGenerateStore();
  const [step, setStep] = useState(0);

  const canNext = () => {
    if (step === 0) return store.chars[0]?.name && store.age;
    if (step === 1) return store.setting && store.situation;
    if (step === 2) return !!store.artStyle;
    return false;
  };

  const handleNext = () => {
    if (step < 2) setStep(s => s + 1);
    else navigate('/story-check');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 60 }}>
      <div className="wrap" style={{ maxWidth: 560, paddingTop: 40 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, color: 'var(--text)' }}>
          동화 만들기
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
          주인공과 이야기를 입력해주세요
        </p>

        <Stepper step={step} />

        {step === 0 && <Step0 store={store} />}
        {step === 1 && <Step1 store={store} />}
        {step === 2 && <Step2 store={store} />}

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: 12, marginTop: 36, justifyContent: 'space-between' }}>
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                padding: '13px 24px', borderRadius: 12,
                border: '1.5px solid var(--border)', background: 'var(--surface)',
                color: 'var(--text)', fontWeight: 600, fontSize: 15,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
              }}
            >
              <ArrowLeft size={17} /> 이전
            </button>
          ) : <div />}
          <button
            onClick={handleNext}
            disabled={!canNext()}
            style={{
              padding: '13px 32px', borderRadius: 12,
              border: 'none',
              background: canNext() ? 'var(--primary)' : 'var(--step-idle)',
              color: canNext() ? 'var(--text)' : 'var(--text-muted)',
              fontWeight: 700, fontSize: 15,
              cursor: canNext() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: 7,
              transition: 'all .15s',
            }}
          >
            {step === 2 ? '확인하기' : '다음'}
            {step < 2 && <ArrowRight size={17} />}
          </button>
        </div>
      </div>
    </div>
  );
}
