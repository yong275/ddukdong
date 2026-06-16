# 뚝딱동화 프로젝트 컨텍스트

## 프로젝트 개요
AI 기반 개인 맞춤형 동화 생성 서비스.
아이가 주인공이 되고, 부모의 육아 고민을 반영한 동화를 자동 생성한다.

---

## 폴더 구조

```
ddukddak/
├── CLAUDE.md
├── .gitignore
├── .env                        # 프론트 환경변수 (Vite가 읽음)
├── README.md
├── 깃허브_협업가이드.md
├── docs/                       # 개발일지 (커밋·작업 단위별 기록)
├── package.json                # 프론트 패키지
├── vite.config.js
├── index.html
├── node_modules/
├── .vite/
├── src/                        # 프론트 소스코드 (React)
│   ├── main.jsx
│   ├── App.jsx                 # 라우팅 설정
│   ├── index.css
│   ├── pages/
│   │   ├── MainPage.jsx        # 메인 (비로그인: 샘플 동화 / 로그인: 전체 기능)
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── GeneratePage.jsx    # 동화 생성 입력 (부모/아이 모드)
│   │   ├── StoryCheckPage.jsx  # 스토리 확인 (재생성 / 확정)
│   │   ├── LoadingPage.jsx     # 생성 로딩 (진행 상태 멘트)
│   │   ├── ViewerPage.jsx      # 동화 뷰어
│   │   ├── LibraryPage.jsx     # 나의 서재
│   │   └── SharePage.jsx       # 공유 링크 열람 (비로그인 읽기 전용)
│   ├── components/
│   │   ├── common/             # Button, Input, Modal 등 공통 컴포넌트
│   │   ├── generate/           # 입력 폼 단계별 컴포넌트
│   │   ├── viewer/             # PageCard, NavArrow 등
│   │   └── layout/             # Header, Footer 등
│   ├── store/                  # Zustand 상태관리
│   │   ├── authStore.js        # 로그인 상태
│   │   └── generateStore.js    # 동화 생성 입력값 상태
│   ├── api/                    # Axios API 호출 함수
│   │   ├── axios.js            # 인스턴스 · JWT 인터셉터
│   │   ├── auth.js
│   │   ├── stories.js
│   │   └── translate.js
│   └── utils/
│       ├── polling.js          # job 상태 폴링 로직 (3초 간격)
│       └── constants.js        # 나이대·배경·주제 선택지 상수
└── server/                     # 백엔드 (Express)
    ├── .env                    # 서버 환경변수
    ├── package.json
    ├── node_modules/
    ├── index.js                # Express 앱 진입점
    ├── routes/
    │   ├── auth.js             # /auth/*
    │   ├── users.js            # /users/*
    │   ├── stories.js          # /stories/*
    │   ├── translate.js        # /stories/:id/translate
    │   └── share.js            # /share/*
    ├── services/
    │   ├── solarService.js     # Solar API 호출 · 프롬프트 조합
    │   ├── dalleService.js     # DALL-E 3 병렬 이미지 생성 · 그림 프롬프트 조합
    │   ├── pipelineService.js  # 동화 생성 파이프라인 전체
    │   └── translateService.js # 번역 API 호출 · DB 캐싱
    ├── db/
    │   ├── supabase.js         # Supabase 클라이언트 초기화
    │   └── queries/
    │       ├── stories.js
    │       ├── pages.js
    │       └── users.js
    ├── middleware/
    │   ├── auth.js             # JWT 검증 미들웨어
    │   └── errorHandler.js     # 전역 에러 처리
    ├── prompts/                # Solar API 스토리 프롬프트 템플릿
    │   ├── story_parent_4_6.txt
    │   ├── story_parent_7_9.txt
    │   ├── story_parent_10_12.txt
    │   └── story_child.txt     # 아이 입력 모드 (나이 구분 없음 · 교훈 없음)
    └── utils/
        ├── storage.js          # Supabase Storage 이미지 업로드
        └── jobStore.js         # 비동기 job 상태 관리 (Map)
```

---

## 환경변수

### 루트 .env (프론트 · Vite)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=http://localhost:3000
```

### server/.env (백엔드 · Express)
```
SOLAR_API_KEY=
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
PORT=3000
```

### .gitignore
```
node_modules/
server/node_modules/
.env
server/.env
.vite/
dist/
```

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | React 18, React Router v6, Zustand, Tailwind CSS, Axios |
| 백엔드 | Express.js (Node.js) |
| 인증 | Supabase Auth (이메일 + Google OAuth) |
| DB | Supabase (PostgreSQL) |
| 스토리지 | Supabase Storage (생성 이미지 저장) |
| 텍스트 생성 | Solar API (Upstage) — 한국어 특화 LLM |
| 이미지 생성 | DALL-E 3 (OpenAI) — 컷별 병렬 호출 |
| 번역 | 미정 (DeepL 또는 Google Translate) — 2차 개발 |
| 프론트 배포 | GitHub Pages |
| 백엔드 배포 | Railway |

---

## DB 스키마

### users
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
email         text UNIQUE NOT NULL
password_hash text
nickname      text NOT NULL
provider      text DEFAULT 'email'  -- 'email' | 'google'
created_at    timestamptz DEFAULT now()
```

### stories
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id           uuid REFERENCES users(id) ON DELETE CASCADE
title             text
input_mode        text        -- 'parent' | 'child'
character_name    text
character_gender  text
sub_characters    jsonb       -- [{ name, gender }]
age_group         text        -- '4-6' | '7-9' | '10-12'
background        text
situation         text
moral             text        -- 부모 입력 모드에서만 사용
art_style         text        -- 'fairytale' | 'watercolor' | 'cartoon' | 'animation'
status            text DEFAULT 'pending'
                              -- 'pending' | 'story_done' | 'image_done' | 'completed' | 'failed'
created_at        timestamptz DEFAULT now()
```

### pages
```sql
id               uuid PRIMARY KEY DEFAULT gen_random_uuid()
story_id         uuid REFERENCES stories(id) ON DELETE CASCADE
page_number      int NOT NULL
text_ko          text        -- 한국어 원문
text_translated  text        -- 번역본 (없으면 null)
translate_lang   text        -- 번역 언어 코드 ('en', 'ja' 등)
image_url        text        -- Supabase Storage URL
```

---

## API 엔드포인트

Base URL: `http://localhost:3000/v1` (개발) / `https://api.ddukddak.com/v1` (운영)
인증: `Authorization: Bearer {supabase_jwt}`

### 인증
| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | /auth/signup | 이메일 회원가입 | 불필요 |
| POST | /auth/login | 이메일 로그인 → JWT 반환 | 불필요 |
| POST | /auth/google | 구글 OAuth 로그인 | 불필요 |
| POST | /auth/logout | 로그아웃 | 필요 |

### 회원
| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | /users/me | 내 정보 조회 | 필요 |
| PUT | /users/me | 닉네임 수정 | 필요 |
| DELETE | /users/me | 회원 탈퇴 | 필요 |

### 동화 생성 (비동기)
| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | /stories/generate | 동화 생성 요청 → job_id 즉시 반환 (202) | 필요 |
| GET | /stories/jobs/:job_id | 생성 진행 상태 폴링 | 필요 |
| POST | /stories/:story_id/confirm | 스토리 확정 · 서재 저장 | 필요 |
| GET | /stories | 내 서재 목록 조회 | 필요 |
| GET | /stories/:story_id | 동화 상세 조회 (pages 포함) | 필요 |
| DELETE | /stories/:story_id | 동화 삭제 | 필요 |
| GET | /stories/sample | 샘플 동화 목록 | 불필요 |

### 번역 · 공유
| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | /stories/:story_id/translate | 번역 요청 · DB 캐싱 | 필요 |
| GET | /share/:story_id | 공유 링크 열람 (읽기 전용) | 불필요 |

---

## 동화 생성 파이프라인 (비동기)

```
POST /stories/generate
  → job_id 즉시 반환 (202)
  → 백그라운드에서 파이프라인 실행

파이프라인 (pipelineService.js):
  1. Solar API 호출 → 스토리 텍스트 + 이미지 프롬프트 JSON 생성
     status: story_done
  2. DALL-E 3 → 컷별 이미지 병렬 생성 (Promise.all)
     status: image_done
  3. Supabase Storage → 이미지 업로드 · URL 반환
  4. stories + pages 테이블 insert
     status: completed

프론트 폴링 (polling.js):
  GET /stories/jobs/:job_id (3초 간격)
  status → 로딩 멘트 매핑:
    pending     → "동화를 준비하고 있어요..."
    story_done  → "이야기가 완성됐어요! 그림을 그리는 중..."
    image_done  → "그림이 완성됐어요! 마무리 중..."
    completed   → 뷰어로 자동 이동
    failed      → 에러 메시지 + 재시도 버튼
```

## Solar API 응답 형식 (JSON)
```json
{
  "title": "민준이의 용기",
  "pages": [
    {
      "text": "민준이는 오늘 처음 학교에 갔어요.",
      "image_prompt": "A 6-year-old Korean boy walking to school, watercolor style"
    }
  ]
}
```

## DALL-E 그림 프롬프트 조합 (dalleService.js)
```js
const styleMap = {
  watercolor: 'soft watercolor style',
  cartoon:    'flat cartoon style',
  fairytale:  'classic fairytale illustration',
  animation:  'vibrant animation style'
}
const imagePrompt = `${scene}, ${styleMap[art_style]}, children's book illustration`
```

---

## 나이대별 설정

| 구간 | 글 분량 | 컷 수 | 프롬프트 파일 |
|------|---------|-------|--------------|
| 4–6세 | 1–2문장/페이지 | 6컷 | story_parent_4_6.txt |
| 7–9세 | 3–4문장/페이지 | 8컷 | story_parent_7_9.txt |
| 10–12세 | 5–6문장/페이지 | 10컷 | story_parent_10_12.txt |
| 아이 입력 | 나이대 무관 · 단순 | 6컷 | story_child.txt |

---

## 화면 구조

1. 메인 화면 — 비로그인: 샘플 동화 열람만 / 로그인: 전체 기능
2. 로그인 / 회원가입
3. 동화 생성 입력 — 부모 모드 (교훈 포함) / 아이 모드 (간소화 1단계)
4. 스토리 확인 — 재생성 / 확정
5. 동화 생성 로딩 — 진행 상태 멘트
6. 동화 뷰어 — 페이지 이동 · 번역 · 공유 · 저장
7. 나의 서재 — 저장된 동화 목록
8. 공유 페이지 — 비로그인 읽기 전용

---

## 브랜치 네이밍 예시

### 프론트엔드
```
feature/main-page
feature/login-page
feature/generate-form
feature/story-viewer
feature/library-page
feature/loading-page
```

### 백엔드
```
feature/solar-api
feature/dalle-api
feature/auth-api
feature/stories-api
feature/pipeline
```

### 버그 수정
```
fix/image-url-null
fix/login-redirect
```

---

## 2차 개발 (MVP 제외)
- 성장형 동화 아카이브 (월별 연결)
- 부모-아이 대화 질문 및 기록
- TTS 읽어주기
