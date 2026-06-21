import { useNavigate } from 'react-router-dom';
import useGuideStore from '../store/guideStore';
import useAuthStore from '../store/authStore';
import { Sparkle, UserCirclePlus, SlidersHorizontal, PaintBrushBroad } from '@phosphor-icons/react';

import Footer from '../components/layout/Footer';
import Badge from '../components/common/Badge';
import Illo from '../components/illustrations/Illo';
import { SAMPLE_BOOKS } from '../utils/constants';

const FEATURES = [
  {
    icon: <UserCirclePlus size={32} weight="duotone" />,
    title: '내 아이가 주인공',
    desc: '아이 이름과 나이, 성별을 입력하면\nAI가 딱 맞는 이야기를 만들어줘요.',
  },
  {
    icon: <SlidersHorizontal size={32} weight="duotone" />,
    title: '고민을 동화로',
    desc: '분리불안, 식사 거부, 형제 다툼…\n부모의 육아 고민을 녹여드려요.',
  },
  {
    icon: <PaintBrushBroad size={32} weight="duotone" />,
    title: '4가지 그림체',
    desc: '심플동화, 수채화, 종이공예, 색연필 중\n아이가 좋아하는 스타일로 골라요.',
  },
];



export default function MainPage() {
  const navigate = useNavigate();
  const setGuideOpen = useGuideStore(s => s.setOpen);
  const user = useAuthStore(s => s.user);



  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      

      {/* ── Hero ── */}
      <section className="wrap fade" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="grid-hero">
          {/* Left */}
          <div>
            <Badge icon={<Sparkle size={14} weight="fill" />} style={{ marginBottom: 20 }}>
              AI 그림동화 생성
            </Badge>
            <h1 style={{ fontSize: 'var(--fs-display)', fontWeight: 'var(--fw-black)', lineHeight: 'var(--lh-heading)', color: 'var(--text)', margin: '0 0 24px' }}>
              내가 주인공이 될 수 있는<br />세상에서 하나뿐인 그림동화
            </h1>
            <p style={{ fontSize: 'var(--fs-lead)', color: 'var(--text-muted)', marginBottom: 36, lineHeight: 'var(--lh-body)' }}>
              아이의 이름과 고민을 입력하면, AI가 세상에서 단 하나뿐인<br />맞춤 동화를 뚝딱 만들어드려요.
            </p>
            <div className="hero-btns" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/create')}
                style={{
                  background: 'var(--primary)', color: 'var(--text-on-primary)',
                  border: 'none', borderRadius: 'var(--radius-pill)',
                  padding: '14px 32px', fontSize: 16, fontWeight: 'var(--fw-bold)',
                  cursor: 'pointer', transition: 'background var(--dur-base)',
                  boxShadow: '0 4px 14px rgba(255,219,77,0.45)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
              >
                {user ? '동화 만들기' : '동화만들기 체험하기'}
              </button>
              <button
                onClick={() => setGuideOpen(true)}
                style={{
                  background: 'transparent', color: 'var(--text)',
                  border: 'var(--bw) solid var(--border)', borderRadius: 'var(--radius-pill)',
                  padding: '14px 32px', fontSize: 16, fontWeight: 'var(--fw-medium)',
                  cursor: 'pointer', transition: 'border-color var(--dur-base)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                이용안내
              </button>
            </div>
          </div>

          {/* Right — mascot */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={`${import.meta.env.BASE_URL}assets/mascot-light.png`}
              alt="뚝딱 마스코트"
              className="mascot"
              style={{ width: 210, height: 'auto' }}
            />
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="wrap" style={{ paddingBottom: 72 }}>
        <h2 style={{ fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-bold)', color: 'var(--text)', marginBottom: 32, textAlign: 'center' }}>
          뚝딱동화가 특별한 이유
        </h2>
        <div className="grid-3-feat">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)', borderRadius: 'var(--radius-card)',
                border: 'var(--bw) solid var(--border)', padding: '28px 24px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ color: 'var(--primary)', marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 'var(--fs-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text)', margin: '0 0 10px' }}>{f.title}</h3>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', margin: 0, lineHeight: 'var(--lh-body)', whiteSpace: 'pre-line' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sample Stories ── */}
      <section className="wrap" style={{ paddingBottom: 72 }}>
        <h2 style={{ fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-bold)', color: 'var(--text)', marginBottom: 8, textAlign: 'center' }}>
          샘플 동화 미리보기
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 32, fontSize: 'var(--fs-sm)' }}>
          로그인하면 직접 만들어볼 수 있어요
        </p>
        <div className="grid-5">
          {SAMPLE_BOOKS.map(s => (
            <div
              key={s.id}
              onClick={() => navigate(`/viewer/${s.id}`)}
              style={{
                background: 'var(--surface)', borderRadius: 'var(--radius-card)',
                border: 'var(--bw) solid var(--border)', overflow: 'hidden',
                cursor: 'pointer', transition: 'transform var(--dur-base), box-shadow var(--dur-base)',
                boxShadow: 'var(--shadow-card)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-pop)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
            >
              <div style={{ aspectRatio: '3/4', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Illo name={s.illo} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Card ── */}
      <section className="wrap" style={{ paddingBottom: 80 }}>
        <div style={{
          background: 'var(--primary)', borderRadius: 'var(--radius-card-lg)',
          padding: '52px 40px', textAlign: 'center',
          boxShadow: '0 8px 28px rgba(255,219,77,0.35)',
        }}>
          <h2 style={{ fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-black)', color: 'var(--text-on-primary)', margin: '0 0 16px', lineHeight: 'var(--lh-heading)' }}>
            지금, 우리 아이만의 동화를<br />뚝딱 만들어보세요
          </h2>
          <p style={{ color: 'var(--text-on-primary)', opacity: 0.75, marginBottom: 32, fontSize: 'var(--fs-lead)' }}>
            무료로 시작할 수 있어요
          </p>
          <button
            onClick={() => navigate('/create')}
            style={{
              background: 'var(--text-on-primary)', color: 'var(--primary)',
              border: 'none', borderRadius: 'var(--radius-pill)',
              padding: '15px 40px', fontSize: 16, fontWeight: 'var(--fw-bold)',
              cursor: 'pointer',
            }}
          >
            {user ? '동화 만들기' : '동화만들기 체험하기'}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
