import { useState } from 'react';
import {
  SparkleIcon,
  UserCirclePlus,
  Books,
  PaintBrushBroad,
  BookOpenText,
} from '@phosphor-icons/react';
import Footer from '../components/layout/Footer';
import Badge from '../components/common/Badge';

const STEPS = [
  {
    num: '01',
    icon: <UserCirclePlus size={40} weight="duotone" />,
    title: '인물·나이를 알려주세요',
    desc: '아이의 이름, 나이, 성별을 입력하고\n함께 등장할 친구나 가족도 추가할 수 있어요.',
  },
  {
    num: '02',
    icon: <Books size={40} weight="duotone" />,
    title: '이야기 배경을 골라요',
    desc: '숲속, 우주, 바닷속, 마법 왕국…\n아이가 좋아하는 세계를 골라보세요.',
  },
  {
    num: '03',
    icon: <PaintBrushBroad size={40} weight="duotone" />,
    title: '그림체를 선택해요',
    desc: '심플동화, 수채화, 종이공예, 색연필 중\n취향에 맞는 스타일로 동화를 완성해요.',
  },
  {
    num: '04',
    icon: <BookOpenText size={40} weight="duotone" />,
    title: '뷰어로 읽어요',
    desc: 'AI가 만든 동화를 예쁜 뷰어로 감상하고\n저장·공유까지 한 번에 할 수 있어요.',
  },
];

const FAQS = [
  {
    q: '동화 생성에 얼마나 걸리나요?',
    a: '보통 1~2분 내외로 완성돼요. 이미지 생성 시간에 따라 달라질 수 있어요.',
  },
  {
    q: '만든 동화는 저장되나요?',
    a: '로그인 후 확정 버튼을 누르면 나의 서재에 영구 저장돼요. 언제든지 다시 읽을 수 있어요.',
  },
  {
    q: '가족이나 친구에게 공유할 수 있나요?',
    a: '공유 버튼을 누르면 링크가 생성돼요. 링크만 있으면 로그인 없이도 읽을 수 있어요.',
  },
];

export default function GuidePage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Hero ── */}
      <section className="wrap fade" style={{ paddingTop: 72, paddingBottom: 56, textAlign: 'center' }}>
        <Badge icon={<SparkleIcon size={14} weight="fill" />} style={{ marginBottom: 16 }}>
          이용 가이드
        </Badge>
        <h1 style={{
          fontSize: 'var(--fs-display)', fontWeight: 'var(--fw-black)',
          color: 'var(--text)', margin: '0 0 16px', lineHeight: 'var(--lh-heading)',
        }}>
          3단계면 우리 아이 동화가 뚝딱
        </h1>
        <p style={{ fontSize: 'var(--fs-lead)', color: 'var(--text-muted)', margin: 0 }}>
          어렵지 않아요. 차근차근 따라해보세요.
        </p>
      </section>

      {/* ── Steps (feature-row 좌우 교차) ── */}
      <section className="wrap" style={{ paddingBottom: 72 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {STEPS.map((step, i) => {
            const isEven = i % 2 === 1;
            return (
              <div
                key={step.num}
                className="feature-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 40,
                  alignItems: 'center',
                  direction: isEven ? 'rtl' : 'ltr',
                }}
              >
                {/* 일러스트 영역 */}
                <div
                  style={{
                    direction: 'ltr',
                    background: 'var(--surface)', borderRadius: 'var(--radius-card-lg)',
                    border: 'var(--bw) solid var(--border)',
                    height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <div style={{ color: 'var(--primary)', opacity: 0.85 }}>{step.icon}</div>
                </div>

                {/* 텍스트 */}
                <div style={{ direction: 'ltr' }}>
                  <span style={{
                    fontFamily: 'var(--font-latin)', fontWeight: 'var(--fw-black)',
                    fontSize: 13, letterSpacing: '0.08em',
                    color: 'var(--text-muted)', display: 'block', marginBottom: 8,
                  }}>
                    STEP {step.num}
                  </span>
                  <h2 style={{
                    fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-black)',
                    color: 'var(--text)', margin: '0 0 14px', lineHeight: 'var(--lh-heading)',
                  }}>
                    {step.title}
                  </h2>
                  <p style={{
                    fontSize: 'var(--fs-lead)', color: 'var(--text-muted)',
                    lineHeight: 'var(--lh-body)', margin: 0, whiteSpace: 'pre-line',
                  }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="wrap" style={{ paddingBottom: 72 }}>
        <h2 style={{
          fontSize: 'var(--fs-h1)', fontWeight: 'var(--fw-bold)',
          color: 'var(--text)', textAlign: 'center', marginBottom: 32,
        }}>
          자주 묻는 질문
        </h2>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)', borderRadius: 'var(--radius-card)',
                border: 'var(--bw) solid var(--border)',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '18px 22px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                }}
              >
                <span style={{ fontWeight: 'var(--fw-bold)', color: 'var(--text)', fontSize: 'var(--fs-body)' }}>
                  Q. {faq.q}
                </span>
                <span style={{
                  color: 'var(--text-muted)', fontSize: 18, lineHeight: 1,
                  transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform var(--dur-base)',
                  flexShrink: 0,
                }}>
                  ▾
                </span>
              </button>
              {openFaq === i && (
                <div style={{
                  padding: '0 22px 18px',
                  fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', lineHeight: 'var(--lh-body)',
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
