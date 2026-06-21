import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/axios';
import {
  User, Plus, X, ArrowLeft, ArrowRight, CheckCircle,
  Bookmarks, Mountains, House, Waves, Ghost, Park,
  Storefront, Star, PaintBrush
} from '@phosphor-icons/react';
import useGenerateStore from '../store/generateStore';
import axios from '../api/axios';
import useOptionsStore from '../store/optionsStore';
import useAuthStore from '../store/authStore';
import { SAMPLE_BOOKS } from '../utils/constants';
import { AGE_OPTIONS } from '../utils/constants';

/* ── 상수 ─────────────────────────────────────── */
// AGE_OPTIONS는 constants에서 import

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
  { value: 'fairytale', label: '심플동화', desc: '따뜻하고 심플한 동화 삽화', img: 'flat_storybook.webp' },
  { value: 'watercolor', label: '수채화', desc: '부드럽고 몽환적인 수채화', img: 'watercolor.webp' },
  { value: 'cartoon', label: '종이공예', desc: '입체적인 종이공예 스타일', img: 'layered_paper.webp' },
  { value: 'animation', label: '색연필', desc: '따뜻한 색연필 드로잉 스타일', img: 'colorpencle.webp' },
];

const ART_PALETTE = {
  fairytale: '#fceabb', '심플동화': '#fceabb',
  watercolor: '#d0eaff', '수채화': '#d0eaff',
  cartoon: '#ffd6f0',   '종이공예': '#ffd6f0',
  animation: '#d6ffe0', '색연필': '#d6ffe0',
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
                transition: 'setting .2s',
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
                transition: 'setting .2s',
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

/* ── 모드 선택 오버레이 ──────────────────────────── */
function ModeModal({ onConfirm, onClose }) {
  const [mode, setMode] = useState('parent');

  const MODES = [
    { value: 'parent', label: '부모', sub: '아이를 위해\n동화를 만들어요' },
    { value: 'child',  label: '아이',  sub: '내가 주인공인\n동화를 만들어요' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(20px, 5vw, 48px) 20px',
      gap: 'clamp(20px, 4vw, 36px)',
    }}>
      <div style={{ textAlign: 'center', position: 'relative', width: '100%', maxWidth: 480 }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 0, right: 0,
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)',
          }}
        >
          <X size={18} />
        </button>
        <h2 style={{
          fontSize: 'clamp(20px, 4vw, 28px)',
          fontWeight: 900, color: 'var(--text)', marginBottom: 8,
        }}>
          누가 동화를 만들고 있나요?
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          입력 방식이 달라져요
        </p>
      </div>

      <div style={{
        display: 'flex', gap: 16,
        width: '100%', maxWidth: 480,
      }}>
        {MODES.map(m => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            style={{
              flex: 1,
              minHeight: 'clamp(130px, 20vw, 180px)',
              borderRadius: 20,
              border: '2px solid',
              borderColor: mode === m.value ? 'transparent' : 'var(--border)',
              background: mode === m.value ? 'var(--text)' : 'var(--surface)',
              color: mode === m.value ? 'var(--bg)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 10, transition: 'all .2s', fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 'clamp(28px, 7vw, 48px)', fontWeight: 900 }}>
              {m.label}
            </span>
            <span style={{
              fontSize: 'clamp(11px, 2vw, 13px)',
              opacity: 0.65, textAlign: 'center',
              lineHeight: 1.5, whiteSpace: 'pre-line',
            }}>
              {m.sub}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => onConfirm(mode)}
        style={{
          width: '100%', maxWidth: 480,
          padding: 'clamp(13px, 3vw, 17px)',
          borderRadius: 14, border: 'none',
          background: 'var(--primary)',
          color: 'var(--text)', fontWeight: 700,
          fontSize: 'clamp(15px, 3vw, 17px)',
          cursor: 'pointer',
        }}
      >
        동화 만들기
      </button>
    </div>
  );
}

/* ── Step 0 ─────────────────────────────────────── */
function Step0({ store }) {
  const { chars, age, setAge, updateChar, addChar, removeChar } = store;

  return (
    <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* 캐릭터 */}
      <div>
        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: 'var(--text)' }}>등장인물</h3>
        <div className="grid-3">
          {chars.map((c, i) => (
            <CharCard
              key={i} char={c} idx={i}
              onChange={updateChar}
              onRemove={removeChar}
              isMain={i === 0}
            />
          ))}
          {chars.length < 3 && (
            <button
              className="addcard"
              onClick={addChar}
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
              onClick={() => setAge(a.value)}
              className="opt"
              style={{
                flex: 1, padding: '16px 12px', borderRadius: 14,
                border: '1.5px solid',
                borderColor: age === a.value ? 'var(--primary)' : 'var(--border)',
                background: age === a.value ? 'var(--primary)' : 'var(--surface)',
                color: 'var(--text)', cursor: 'pointer', transition: 'all .15s',
                textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6,
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 15 }}>{a.title}</span>
              {a.lines.map((l, i) => (
                <span key={i} style={{ fontSize: 12, color: age === a.value ? 'var(--text-on-primary)' : 'var(--text-muted)', fontWeight: 400 }}>{l}</span>
              ))}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 2단계 선택 공통 컴포넌트 ──────────────────── */
function TwoLevelSelect({ label, desc, items, selectedParent, selectedChild, onSelectParent, onSelectChild, hasEn }) {
  return (
    <div>
      <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: 'var(--text)' }}>{label}</h3>
      {desc && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{desc}</p>}
      {/* 1단계 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: selectedParent ? 10 : 0 }}>
        {items.map(item => (
          <button key={item.label} onClick={() => onSelectParent(item)}
            style={{
              padding: '9px 18px', borderRadius: 999, cursor: 'pointer',
              border: '1.5px solid',
              borderColor: selectedParent?.label === item.label ? 'var(--primary)' : 'var(--border)',
              background: selectedParent?.label === item.label ? 'var(--primary)' : 'var(--surface)',
              color: 'var(--text)', fontWeight: 700, fontSize: 14, transition: 'all .15s',
            }}
          >{item.label}</button>
        ))}
      </div>
      {/* 2단계 */}
      {selectedParent?.children?.length > 0 && (
        <div className="fade" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {selectedParent.children.map(child => (
            <button key={child.label} onClick={() => onSelectChild(child)}
              style={{
                padding: '8px 16px', borderRadius: 999, cursor: 'pointer',
                border: '1.5px solid',
                borderColor: selectedChild?.label === child.label ? 'var(--accent)' : 'var(--border)',
                background: selectedChild?.label === child.label ? 'var(--accent)' : 'var(--bg)',
                color: 'var(--text)', fontWeight: 600, fontSize: 13, transition: 'all .15s',
              }}
            >{child.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Step 1 ─────────────────────────────────────── */
function Step1({ store }) {
  const { input_mode, setting, situation, moral, setSetting, setSituation, setMoral } = store;
  const options = useOptionsStore(s => s.options);
  const [settingParent, setSettingParent] = React.useState(null);
  const [settingChild, setSettingChild] = React.useState(null);
  const [situationParent, setSituationParent] = React.useState(null);
  const [situationChild, setSituationChild] = React.useState(null);
  const [goalParent, setGoalParent] = React.useState(null);
  const [goalChild, setGoalChild] = React.useState(null);

  if (!options) return <div style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>선택지 불러오는 중...</div>;

  return (
    <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* 배경 */}
      <TwoLevelSelect
        label="배경"
        desc="동화가 펼쳐지는 공간을 선택해주세요"
        items={options.setting}
        selectedParent={settingParent}
        selectedChild={settingChild}
        onSelectParent={p => { setSettingParent(p); setSettingChild(null); setSetting('', ''); }}
        onSelectChild={c => { setSettingChild(c); setSetting(c.label, c.en); }}
      />

      {/* 상황 */}
      <TwoLevelSelect
        label="상황 입력"
        desc="어떤 일이 일어났나요? 큰 상황을 먼저 고른 뒤 세부 상황을 선택해주세요"
        items={options.situation}
        selectedParent={situationParent}
        selectedChild={situationChild}
        onSelectParent={p => { setSituationParent(p); setSituationChild(null); setSituation(''); }}
        onSelectChild={c => { setSituationChild(c); setSituation(c.label); }}
      />

      {/* 성장 목표 (부모 모드) */}
      {input_mode === 'parent' && (
        <TwoLevelSelect
          label="성장 목표"
          desc="이 동화를 통해 아이가 무엇을 느꼈으면 하나요?"
          items={options.goal}
          selectedParent={goalParent}
          selectedChild={goalChild}
          onSelectParent={p => { setGoalParent(p); setGoalChild(null); setMoral(''); }}
          onSelectChild={c => { setGoalChild(c); setMoral(c.label); }}
        />
      )}
    </div>
  );
}

/* ── Step 2 ─────────────────────────────────────── */
function Step2({ store }) {
  const { artStyle, setArtStyle, chars, age, setting, situation, moral, input_mode } = store;
  const options = useOptionsStore(s => s.options);
  const main = chars[0] || {};
  const artStyles = options?.art_style || [];
  const ART_PALETTE_DEFAULT = '#fff8de';

  return (
    <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* 그림체 */}
      <div>
        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: 'var(--text)' }}>그림체</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>동화에 어울리는 그림 스타일을 골라주세요</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {artStyles.map(a => (
            <button
              key={a.label}
              onClick={() => setArtStyle(a.label, a.en)}
              style={{
                padding: '12px', borderRadius: 16, cursor: 'pointer',
                border: '2px solid',
                borderColor: artStyle === a.label ? 'var(--primary)' : 'var(--border)',
                background: artStyle === a.label ? 'var(--primary)' : 'var(--surface)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                transition: 'all .18s', fontFamily: 'inherit',
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}assets/${a.img}`}
                alt={a.label}
                style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 12, objectFit: 'cover', display: 'block' }}
              />
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{a.label}</span>
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
          { k: '배경', v: setting || '미선택' },
          { k: '상황', v: situation || '미입력' },
          ...(input_mode === 'parent' ? [{ k: '교훈', v: moral || '미입력' }] : []),
          { k: '그림체', v: artStyle || '미선택' },
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
  const user = useAuthStore(s => s.user);
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = React.useState(false);
  const [showModeModal, setShowModeModal] = useState(true);

  const handleModeConfirm = (mode) => {
    store.setInputMode(mode);
    setShowModeModal(false);
  };

  const canNext = () => {
    if (step === 0) return store.chars[0]?.name && store.age;
    if (step === 1) return store.setting && store.situation;
    if (step === 2) return !!store.artStyle && !!store.setting && !!store.situation;
    return false;
  };

  const handleNext = async () => {
    if (step < 2) { setStep(s => s + 1); return; }

    // 비로그인: 선택한 그림체에 해당하는 샘플 동화 보여주기
    if (!user) {
      const DEMO_BY_STYLE = { fairytale: 's1', watercolor: 's2', cartoon: 's4', animation: 's5' };
      sessionStorage.setItem('demo_mode', 'true');
      sessionStorage.setItem('demo_pick', DEMO_BY_STYLE[store.artStyle] ?? 's1');
      navigate('/loading');
      return;
    }

    setGenerating(true);
    try {
      const main = store.chars[0] || {};
      const sub = store.chars.slice(1);
      const res = await axios.post('/v1/stories/generate', {
        input_mode: store.input_mode,
        character_name: main.name,
        character_gender: main.gender,
        sub_characters: sub.map(c => ({ name: c.name, gender: c.gender })),
        age_group: store.age,
        background: store.setting,
        setting_en: store.settingEn,
        situation: store.situation,
        moral: store.input_mode === 'parent' ? store.moral : '',
        art_style: store.artStyle,
        art_style_en: store.artStyleEn,
      });
      const jobId = res.data?.job_id;
      if (jobId) sessionStorage.setItem('job_id', jobId);
      navigate('/loading');
    } catch (e) {
      alert(e?.response?.data?.error || '요청에 실패했어요. 다시 시도해주세요.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 60 }}>
      {showModeModal && <ModeModal onConfirm={handleModeConfirm} onClose={() => navigate(-1)} />}
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
            {generating ? '생성 중...' : step === 2 ? '동화 만들기' : '다음'}
            {step < 2 && <ArrowRight size={17} />}
          </button>
        </div>
      </div>
    </div>
  );
}
