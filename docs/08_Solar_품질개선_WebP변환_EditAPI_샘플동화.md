# 08 — Solar 생성 품질 개선, PNG→WebP 변환, Edit API 테스트, 샘플 동화 추가

## 작업 일자
2026-06-22

---

## 1. Solar 동화 생성 품질 개선

### plan 프롬프트 6개 수정 (`plan_*.txt`)
- **이름 규칙 강화**: `받침이 없는 이름: 이름 그대로만 사용` 예시 추가 (민재 → 민재 등)
- **조연 이름 금지**: 입력된 이름(오빠, 친구 등)을 그대로 사용, 임의 이름 생성 금지
- **결말 규칙**: 마지막 페이지는 반드시 주인공의 달라진 감정·표정·행동으로 끝내기
- **소품명 금지**: 도토리·버섯 같은 구체적 소품 이름 지정 금지
- **10-12세 컷 수**: `10-14페이지`로 수정 (이전 12-16 오류)

### write 프롬프트 6개 수정 (`write_*.txt`)
- **비웃음 장면 금지**: 주인공 실패 시 친구들이 웃거나 비웃는 장면 금지
- **괄호 표현 금지**: `(까르르)`, `(방긋)` 같은 형태 절대 금지
- **어른 교훈 대사 금지**: 할머니·부모 등 어른 캐릭터가 교훈을 직접 말하는 대사 금지

### solarService.js 개선
- `callSolar(systemPrompt, userPrompt, maxTokens = 1024)` — max_tokens 파라미터 추가
  - plan 호출: `3000` (이전 기본값으로 JSON 잘림 현상 발생)
  - write 페이지: 기본 `1024`
- `finish_reason === 'length'` 감지 시 에러 throw (잘린 JSON 방지)
- 페이지별 `nameHint` / `subHint` 주입 — Solar가 이름을 임의 변경하는 문제 보완
- 1페이지 빈 text 발생 시 자동 retry 1회
- text 키 폴백: `result.text ?? result.content ?? result.story ?? result.page ?? ''`

---

## 2. PNG → WebP 자동 변환 (`server/utils/storage.js`)

- `sharp` 라이브러리 설치 (`^0.35.2`)
- `uploadImageFromBase64`: PNG 버퍼 → WebP quality 87 변환 후 업로드
  - `.png` 경로를 `.webp`로 자동 변경
  - 약 1.5MB → 400~700KB (60% 이상 절감)
  - quality 87: 육안으로 차이 없는 수준

---

## 3. gpt-image-1 Edit API 테스트

### 접근 방식
기존 `images.generate` 독립 호출 방식 → 캐릭터 레퍼런스 기반 `images.edit` 방식으로 변경

### 흐름 (`test_image_edit.js`)
1. 캐릭터 레퍼런스 이미지 생성 (`generate`) — 흰 배경, 전신, 정면
2. 커버 + 6페이지 — 레퍼런스 이미지를 `images.edit`에 전달, 장면 프롬프트로 편집
3. 모든 결과물 WebP 변환 후 Supabase Storage 업로드

### 결과
- 레퍼런스 기반 edit API로 캐릭터 얼굴·옷 일관성 개선 확인
- `toFile(buffer, 'reference.png', { type: 'image/png' })` — openai v6 SDK 방식

---

## 4. 샘플 동화 s0 추가 (`src/utils/constants.js`)

- `SAMPLE_BOOKS` s0 항목 추가
  - 제목: "용왕님, 제 말 좀 들어주세요"
  - 소율 (여자, 4-6세) / 용궁 / 솔직하게 말하기
  - 커버 + 6페이지 전부 Supabase Storage WebP 실이미지
  - edit API 생성본 (story_id: `ae841b08-e9f2-42f0-ac9d-632bd4a50fe9`)

---

## 5. 선택지 개편 (`server/data/options.js`)

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 상황 > 친구 | 싸운·처음 만난·도와준 | 다툰·새 친구·질투·힘들어 보이는 |
| 상황 > 도전 | (없음) | 두려운·실수·포기 신규 추가 |
| 상황 > 가족 | 동생 태어남·갈등·여행 | 다투는·싫은·새 가족 |
| 상황 > 학교→마음 | 처음 학교·발표·혼난 | 욕심·거짓말·화남 |
| 목표 > 생활태도→용기·도전 | 정리·끈기·규칙 | 두려움 이겨내기·실수 괜찮아·끈기 |

---

## 6. .gitignore 업데이트

- `server/test_*.js`, `server/test_*.json`, `server/login_result.json`, `server/server.log`, `server/server.err` 추가
