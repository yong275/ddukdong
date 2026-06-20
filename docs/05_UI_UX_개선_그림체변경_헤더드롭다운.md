# 05. UI/UX 개선 — 그림체 변경, 헤더 드롭다운, 반응형 책장

## 작업 개요

내 책장 카드 크기 통일, 헤더 로그인/로그아웃 UX 개선,
그림체 이름 변경 및 버튼 이미지 추가.

---

## 내 책장 (LibraryPage)

### 카드 크기 통일
- `.grid-5-lib` → `repeat(5, minmax(0, 1fr))` (모든 브레이크포인트 동일 적용)
  - 이전: `1fr` — 긴 제목이 컬럼을 넓혀 카드 크기가 달라지는 버그
  - 원인: CSS Grid `1fr` = `minmax(auto, 1fr)` 이라 min-content보다 좁아지지 않음
- 커버 div `width: 100%` + img `display: block` 추가 (인라인 공백 제거)
- wrapper div `width: 100%` 추가
- `align-items: start` 적용 — 행 내 카드가 서로 높이를 맞추지 않도록

### 새로운 동화 추가 카드
- `minHeight: 180` 제거 → `alignSelf: stretch` + `width: 100%`
- 같은 행의 책 카드 높이에 자동으로 맞춰짐

---

## 헤더 (Header)

### 로그아웃 상태
- UserCircle 아이콘 → **로그인** 필 버튼 (`var(--primary)` 배경)
- 클릭 시 `/login` 이동

### 로그인 상태 — 드롭다운 메뉴
- UserCircle 클릭 → 드롭다운 (마이페이지 / 로그아웃)
- `useRef` + `mousedown` 이벤트로 외부 클릭 시 자동 닫힘
- 로그아웃: `supabase.auth.signOut()` + `clearUser()` 후 홈 이동

---

## 로그인 페이지 (LoginPage)

- 마스코트 이미지 + h1 "뚝딱동화" → `inline-flex` 가로 배치
- 마스코트 크기 96px → 72px (h1 옆 배치 기준)

---

## 그림체 변경

| 이전 | 이후 |
|------|------|
| 동화책 스타일 | 심플동화 |
| 수채화 | 수채화 (유지) |
| 만화 | 종이공예 |
| 애니메이션 | 색연필 |

### 변경 파일
- `src/utils/constants.js` — ART_STYLES 라벨
- `src/pages/GeneratePage.jsx` — 로컬 ART_STYLES, ART_PALETTE
- `src/pages/MainPage.jsx` — 하드코딩 설명 텍스트
- `src/pages/GuidePage.jsx` — 하드코딩 설명 텍스트
- `server/data/options.js` — 서버 옵션 라벨·영문 프롬프트
- `server/prompts/image_*.txt` (6개) — 프롬프트 내 그림체 키워드

### DB 호환
- ART_PALETTE에 구/신 키 모두 포함 (기존 책 배경색 유지)
- 신규 동화: 한글 라벨(심플동화 등)이 `art_style` 컬럼에 저장됨

### 그림체 버튼 이미지 추가
- `public/assets/` 에 이미지 4개 추가
  - `flat_storybook.png` → 심플동화
  - `watercolor.png` → 수채화
  - `layered_paper.png` → 종이공예
  - `colorpencle.png` → 색연필
- 버튼 내 72×72 썸네일로 표시

---

## 남은 작업
- [ ] 공유 기능 (SharePage)
- [ ] 번역 기능 프론트 연동
- [ ] 아이 입력 모드 UI 분기
- [ ] 동화 생성 전체 흐름 E2E 테스트
