# 02. 캐릭터 일관성 / 에러 처리 / PDF 생성 / 공유 API

## 작업 일자
2026-06-17

## 작업 내용

### 1. 에러 유형별 분류 (`server/utils/classifyError.js`)
- OpenAI/Solar API 에러를 HTTP 상태코드 기준으로 5가지로 분류
  - `AUTH_INVALID_KEY` — 401 (API 키 오류)
  - `AUTH_QUOTA_EXCEEDED` — 429 + quota 메시지 (할당량 초과)
  - `CONTENT_POLICY` — 400 + content/policy 메시지 (콘텐츠 정책 위반)
  - `SERVER_TIMEOUT` — ETIMEDOUT (응답 시간 초과)
  - `SERVER_OVERLOAD` — 429 / 502 / 503 (AI 서버 과부하)
  - `NETWORK_OFFLINE` — ENOTFOUND / ECONNREFUSED (네트워크 오프라인)
- `solarService.js`, `dalleService.js`에 적용
- `pipelineService.js` jobStore + stories 테이블에 `error_code` 저장

### 2. 캐릭터 일관성 (Solar 프롬프트 + dalleService)
- Solar 응답 JSON에 `character`, `sub_characters` 외모 묘사 필드 추가
  - `hair`, `eyes`, `skin`, `outfit`, `age_appearance`, `features`
- 조연 미입력 시 Solar가 스토리에 어울리는 조연 1~2명 자동 생성
- 페이지별 `characters` 필드 — 해당 페이지에 실제 등장하는 캐릭터 목록
- `dalleService.js` — 등장 캐릭터 설명만 이미지 프롬프트에 주입 (미등장 조연 제외)
- `stories` 테이블 `character_description` (jsonb) 컬럼 저장
- 이미지 사이즈: `1024x1024`

### 3. 표지 이미지 생성
- `generateCoverImage` — 제목 + 주인공 외모 기반 표지 이미지 생성
- Storage 경로: `{story_id}/cover.png`
- `stories.cover_url` 컬럼 저장

### 4. 재생성 3회 제한
- `jobStore.js` — `regenerate_count` 필드 추가 (초기값 0)
- `pipelineService.js` — `regenerateStory` 함수
  - 3회 초과 시 429 에러 반환
  - 미만 시 count 증가 후 재호출
- `routes/stories.js` — `POST /v1/stories/jobs/:job_id/regenerate` 추가

### 5. PDF 생성 (`server/services/pdfService.js`)
- `pdfkit` + `NotoSansKR.ttf` (한글 폰트) 사용
- 레이아웃: 표지(전체) → 스토리 페이지(좌측 이미지 50% / 우측 텍스트 50%)
- 이미지 비율 유지, 상하 여백 자동 계산
- 표지에 제목 오버레이 (하단 반투명 배경 + 흰 글씨)
- `GET /v1/stories/:story_id/pdf` 엔드포인트 추가

### 6. 공유 API (`server/routes/share.js`)
- `GET /v1/share/:story_id` — 비로그인 읽기 전용
- `status: 'completed'` 인 동화만 조회 가능
- story 기본 정보 + pages(page_number, text_ko, image_url) 반환

## Supabase 변경사항
```sql
-- pages 테이블 신규 생성
CREATE TABLE pages ( ... );

-- stories 테이블 컬럼 추가
ALTER TABLE stories ADD COLUMN character_description jsonb;
ALTER TABLE stories ADD COLUMN error_code text;
ALTER TABLE stories ADD COLUMN cover_url text;

-- 컬럼명 오타 수정
ALTER TABLE stories RENAME COLUMN statuding TO status;
```

## 테스트 결과
- 이미지 3개 병렬 생성: 약 58초
- 캐릭터 일관성: 동일 외모 3페이지 확인
- 페이지별 등장인물 필터링: 3페이지에서만 엄마 등장 확인
- PDF 생성: 표지 + 스토리 페이지 정상 출력, 한글 깨짐 없음
- 공유 API: 비로그인 조회 정상

## 브랜치 현황
| 브랜치 | 상태 |
|--------|------|
| `feature/error-handling` | 완료, 미머지 |

## 다음 작업
- 인증(auth) API 구현
- prompts 파일 커밋
- feature 브랜치 main 머지
