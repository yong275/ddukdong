# 07 — OG 태그, 이미지 프롬프트 개선, 로딩 UX 개선, 네비 개선

## 작업 일자
2026-06-21

---

## 1. Open Graph 태그 추가

- `index.html`에 OG 메타태그 6개 추가 (url, type, site_name, title, description, image)
- OG 이미지: Edge 헤드리스로 `og-banner.html` → `public/assets/og-image.png` (1200×630) 생성
- 카카오 공유 디버거 확인 완료

---

## 2. 이미지 생성 품질 조정

- `server/services/dalleService.js`: gpt-image-1 `quality: 'medium'` 추가 (커버 + 페이지)
- 한 장 ~2MB → ~800KB (약 60% 절감)
- Supabase Storage 1GB 기준 ~100편 → ~160편으로 여유 증가

---

## 3. 그림체별 이미지 프롬프트 교체

- `server/prompts/image_*.txt` 6개 파일 그림체별 상세 프롬프트로 교체
- 심플동화: Modern Flat Storybook + negative prompts (no watercolor, no 3D 등)
- 수채화 / 종이공예 / 색연필: 각 스타일 특화 키워드
- 전체: `consistent character design` + `consistent illustration style` 통일
- 미사용 `story_*.txt` 6개 삭제

---

## 4. 데모 모드 개선

- 비로그인 그림체 선택 → 랜덤 샘플에서 그림체별 고정 샘플로 변경
  - fairytale → s1, watercolor → s2, cartoon → s4, animation → s5
  - s3(별을 모으는 하늘이)는 SAMPLE_BOOKS 유지, 데모 매핑 제외
- 데모 흐름: `/create` → `/loading` → `/story-check` → `/loading` → `/viewer`
  - 이전엔 `/loading` 없이 바로 `/story-check`로 이동했음

---

## 5. 로딩 페이지 UX 개선 (LoadingPage.jsx 리팩토링)

### 구조 변경
- 기존: STATUS_PCT 하드코딩 값으로 퍼센트 점프
- 변경: `fakePct` 슬로우 fill + 실제 상태 도착 시 패스트 fill → 100% 후 이동

### 단계 분리
| | 이전 | 이후 |
|--|--|--|
| 글 로딩 | 0→45% 점프 후 이동 | 0→44% 슬로우 → 100% 패스트 → 이동 |
| 그림 로딩 | 15% 리셋 | 0%에서 시작 → 88% 슬로우 → 100% 패스트 → 이동 |

### 버그 수정
- `isImagePhase`를 `useRef`로 고정 (렌더링마다 재평가되던 문제 해결)
  - 100% 도달 시 세션키 삭제 → 리렌더 → 이모지 바뀌던 버그 수정
- 데모 타이머 누수 수정: `setInterval` → `setTimeout` 단일 타이머로 교체
- 이미지 단계 로딩에서 `story_done` 감지 시 `/story-check`로 되돌아가던 버그 수정
  - `&& !isImagePhase` 조건 추가
- 데모 이미지 단계 인식 버그 수정
  - `isImagePhase`: `image_phase='true'` OR `demo_phase='image'` 둘 다 체크
- 로딩 완료 후 navigate에 `replace: true` 추가 → 뒤로가기 시 로딩 재진입 방지

### 기타
- 글 로딩: 📖 이모지, 그림 로딩: 🎨 이모지로 구분
- 단계별 상태 메시지 변경 (fakePct 기준)

---

## 6. 비로그인 UX 개선

- 메인 히어로 + CTA 버튼: 비로그인 시 "동화만들기 체험하기", 로그인 시 "동화 만들기"
- LibraryPage: 로그인 시 샘플 동화 숨김, 내 동화만 표시

---

## 7. 동화 생성 모드 선택 UI (GeneratePage)

- 기존 Step0 상단 pill 버튼(부모 입력 / 아이 입력) 제거
- `/create` 진입 시 모드 선택 오버레이 추가
  - "누가 동화를 만들고 있나요?" 제목
  - 부모 / 아이 카드 선택 (clamp로 반응형 처리)
  - 우측 상단 X 버튼으로 취소 → 이전 페이지 이동
- URL은 `/create` 그대로 유지

---

## 8. 헤더 네비게이션 버튼 개선

- `text-base`, `px-7 py-2.5`, `gap-16`, `whitespace-nowrap` 적용
- 버튼 크기 키우고 간격 넓힘
- 태블릿에서 텍스트 2줄 줄바꿈 방지
