# 06. 그림체 썸네일 WebP 전환 & 비로그인 데모 모드

## 작업 개요

그림체 선택 이미지 엑박 수정, 비로그인 사용자 데모 플로우 연결,
이용안내 토글 버그 수정 및 PC 닫기 버튼 위치 개선.

---

## 그림체 썸네일 이미지 엑박 수정

### 원인 1 — 서버 options에 img 필드 누락
- `server/data/options.js`의 `art_style` 배열에 `img` 필드가 없었음
- `Step2` 컴포넌트가 `options.art_style[].img`를 읽어 `src={BASE_URL}assets/${a.img}` 렌더링
- `a.img`가 `undefined` → `src="assets/undefined"` → 엑박

**수정**: `server/data/options.js` art_style 각 항목에 `img` 필드 추가

```js
{ label: '심플동화', en: '...', img: 'flat_storybook.webp' },
{ label: '수채화',   en: '...', img: 'watercolor.webp'     },
{ label: '종이공예', en: '...', img: 'layered_paper.webp'  },
{ label: '색연필',  en: '...', img: 'colorpencle.webp'    },
```

### 원인 2 — PNG 파일 용량 과다
- 기존 PNG 4개: 1.9 ~ 3.0 MB (72×72 썸네일에 비해 과도하게 큼)
- WebP로 교체 후: 14 ~ 21 KB (약 100배 감소)

| 파일 | 이전 | 이후 |
|------|------|------|
| flat_storybook | 1.9 MB (PNG) | 13.6 KB (WebP) |
| watercolor | 2.9 MB (PNG) | 20.5 KB (WebP) |
| layered_paper | 2.7 MB (PNG) | 16.9 KB (WebP) |
| colorpencle | 3.0 MB (PNG) | 21.2 KB (WebP) |

### 썸네일 크기 개선
- 72×72 고정 → `width: 100%`, `aspectRatio: '1/1'` (버튼 너비 꽉 채움)

---

## 비로그인 데모 모드 플로우 연결

### 문제
- `/create`, `/story-check`, `/loading` 모두 `ProtectedRoute`로 막혀있어
  비로그인 시 로그인 페이지로 리다이렉트됨

### 수정 — App.jsx ProtectedRoute 해제
```jsx
// 변경 전
<Route path="/create"      element={<ProtectedRoute><GeneratePage /></ProtectedRoute>} />
<Route path="/story-check" element={<ProtectedRoute><StoryCheckPage /></ProtectedRoute>} />
<Route path="/loading"     element={<ProtectedRoute><LoadingPage /></ProtectedRoute>} />

// 변경 후
<Route path="/create"      element={<GeneratePage />} />
<Route path="/story-check" element={<StoryCheckPage />} />
<Route path="/loading"     element={<LoadingPage />} />
```

### 수정 — GeneratePage 비로그인 분기
- `useAuthStore`로 로그인 여부 확인
- 비로그인 시 API 미호출, `SAMPLE_BOOKS`에서 랜덤 샘플 선택 후 `/story-check` 이동

```js
if (!user) {
  sessionStorage.setItem('demo_mode', 'true');
  const randomSample = SAMPLE_BOOKS[Math.floor(Math.random() * SAMPLE_BOOKS.length)];
  sessionStorage.setItem('demo_pick', randomSample.id);
  navigate('/story-check');
  return;
}
```

### 데모 플로우 전체
```
비로그인 → /create (입력) → "동화 만들기"
  → sessionStorage: demo_mode=true, demo_pick=랜덤 샘플 ID
  → /story-check (샘플 줄거리 표시, 수정 비활성)
  → "확정 후 그림 생성하기"
  → sessionStorage: demo_phase=image
  → /loading (이미지 생성 시뮬레이션)
  → /viewer/:sampleId (샘플 동화 뷰어)
```

---

## 이용안내 오버레이 버그 수정

### 토글 버그
- `setOpen: (v) => set({ open: v })` 인데 `setGuideOpen(o => !o)`로 호출
- Zustand updater 패턴 미지원 → `open`에 함수가 저장되어 항상 truthy
- **수정**: `setGuideOpen(!guideOpen)` 으로 변경

### PC 닫기 버튼 위치
- 이전: `position: fixed, right: 16` → 화면 우측 끝에 고정
- 수정: `max-width: 64rem` 컨테이너 안 우측에 배치 → 콘텐츠와 정렬

---

## 남은 작업
- [ ] 공유 기능 (SharePage)
- [ ] 번역 기능 프론트 연동
- [ ] 아이 입력 모드 UI 분기
- [ ] 동화 생성 전체 흐름 E2E 테스트
