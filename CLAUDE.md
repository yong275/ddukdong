# 뚝딱동화 프로젝트 컨텍스트

## 프로젝트 개요
AI 기반 개인 맞춤형 동화 생성 서비스.
아이가 주인공이 되고, 부모의 육아 고민을 반영한 동화를 자동 생성한다.

---

## 폴더 구조

```
ddukdong/
├── CLAUDE.md
├── .gitignore
├── .env                        # 프론트 환경변수 (Vite가 읽음)
├── README.md
├── docs/                       # 개발일지 (커밋·작업 단위별 기록)
├── package.json                # 프론트 패키지
├── vite.config.js
├── index.html                  # OG 태그 포함
├── public/
│   └── assets/                 # og-image.png, 그림체 썸네일 webp 등
├── src/
│   ├── main.jsx
│   ├── App.jsx                 # 라우팅 설정 (HashRouter)
│   ├── index.css               # 반응형 브레이크포인트 (960px / 600px)
│   ├── pages/
│   │   ├── MainPage.jsx        # 메인 (비로그인: 체험하기 / 로그인: 동화 만들기)
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── MyPage.jsx          # 마이페이지
│   │   ├── GuidePage.jsx       # 이용안내 (Header 오버레이로 표시)
│   │   ├── GeneratePage.jsx    # 동화 생성 입력 (3단계 + 모드 선택 오버레이)
│   │   ├── StoryCheckPage.jsx  # 줄거리 확인 (재생성 / 확정)
│   │   ├── LoadingPage.jsx     # 생성 로딩 (fakePct 슬로우+패스트 fill)
│   │   ├── ViewerPage.jsx      # 동화 뷰어
│   │   ├── LibraryPage.jsx     # 내 책장 (로그인 시 샘플 숨김)
│   │   └── SharePage.jsx       # 공유 링크 열람 (미구현)
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── ScrollToTop.jsx # 페이지 이동 시 자동 최상단
│   │   │   └── Toast.jsx
│   │   ├── illustrations/
│   │   │   └── Illo.jsx        # SVG 일러스트 컴포넌트
│   │   └── layout/
│   │       ├── Header.jsx      # PC/태블릿 네비, 이용안내 오버레이, 유저 드롭다운
│   │       ├── BottomNav.jsx   # 모바일 하단 탭바
│   │       └── Footer.jsx
│   ├── store/
│   │   ├── authStore.js        # 로그인 상태 (Zustand)
│   │   ├── generateStore.js    # 동화 생성 입력값 상태
│   │   ├── guideStore.js       # 이용안내 오버레이 open 상태
│   │   └── optionsStore.js     # 서버 선택지 캐싱 (/v1/options)
│   ├── api/
│   │   ├── axios.js            # Axios 인스턴스 · JWT 인터셉터 · supabase 클라이언트
│   │   ├── auth.js
│   │   ├── stories.js
│   │   └── translate.js
│   └── utils/
│       ├── constants.js        # NAV, AGE_OPTIONS, SAMPLE_BOOKS, ART_STYLES 등
│       └── polling.js          # job 상태 폴링 유틸
└── server/
    ├── .env
    ├── package.json
    ├── index.js                # Express 앱 진입점
    ├── routes/
    │   ├── auth.js             # /v1/auth/*
    │   ├── users.js            # /v1/users/*
    │   ├── stories.js          # /v1/stories/*
    │   ├── translate.js        # /v1/stories/:id/translate
    │   ├── share.js            # /v1/share/*
    │   └── options.js          # /v1/options (선택지 목록)
    ├── services/
    │   ├── solarService.js     # Solar API — plan→write 2단계 + 캐릭터 시트 생성
    │   ├── dalleService.js     # gpt-4o-mini 이미지 프롬프트 생성 + gpt-image-1 이미지 생성
    │   ├── pipelineService.js  # 동화 생성 전체 파이프라인
    │   ├── translateService.js # 번역 (GPT-4o-mini) · DB 캐싱
    │   └── pdfService.js       # PDF 내보내기
    ├── data/
    │   └── options.js          # 배경·상황·교훈·그림체 선택지 (en 번역 포함)
    ├── prompts/                # AI 프롬프트 템플릿 (입력모드 × 나이대 × 단계)
    │   ├── plan_parent_4_6.txt   # Solar: 동화 계획
    │   ├── plan_parent_7_9.txt
    │   ├── plan_parent_10_12.txt
    │   ├── plan_child_4_6.txt
    │   ├── plan_child_7_9.txt
    │   ├── plan_child_10_12.txt
    │   ├── write_parent_4_6.txt  # Solar: 본문 + 캐릭터 시트
    │   ├── write_parent_7_9.txt
    │   ├── write_parent_10_12.txt
    │   ├── write_child_4_6.txt
    │   ├── write_child_7_9.txt
    │   ├── write_child_10_12.txt
    │   ├── image_parent_4_6.txt  # gpt-4o-mini: 페이지별 이미지 프롬프트
    │   ├── image_parent_7_9.txt
    │   ├── image_parent_10_12.txt
    │   ├── image_child_4_6.txt
    │   ├── image_child_7_9.txt
    │   └── image_child_10_12.txt
    ├── db/
    │   ├── supabase.js
    │   └── queries/
    │       ├── stories.js
    │       ├── pages.js
    │       └── users.js
    ├── middleware/
    │   ├── auth.js
    │   └── errorHandler.js
    └── utils/
        ├── jobStore.js         # 비동기 job 상태 관리 (Map)
        ├── storage.js          # Supabase Storage 이미지 업로드
        ├── classifyError.js    # API 에러 분류
        └── loadConfig.js
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

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | React 18, React Router v6 (HashRouter), Zustand, Tailwind CSS (일부), Axios, @phosphor-icons/react |
| 백엔드 | Express.js (Node.js, ESM) |
| 인증 | Supabase Auth (이메일 + Google OAuth) |
| DB | Supabase (PostgreSQL) |
| 스토리지 | Supabase Storage (생성 이미지 저장) |
| 동화 생성 | Solar API (Upstage, `solar-pro`) — plan→write 2단계, 캐릭터 시트 포함 |
| 이미지 프롬프트 | GPT-4o-mini — 페이지별 영문 이미지 프롬프트 생성 |
| 이미지 생성 | gpt-image-1 (OpenAI) — 커버 + 페이지 병렬 생성, quality: medium |
| 번역 | GPT-4o-mini — DB 캐싱 |
| 프론트 배포 | GitHub Pages (`npm run deploy`) |
| 백엔드 배포 | Render (무료) |

---

## DB 스키마

### users
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
email         text UNIQUE NOT NULL
nickname      text NOT NULL
provider      text DEFAULT 'email'  -- 'email' | 'google'
created_at    timestamptz DEFAULT now()
```

### stories
```sql
id                    uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id               uuid REFERENCES users(id) ON DELETE CASCADE
title                 text
input_mode            text        -- 'parent' | 'child'
character_name        text
character_gender      text        -- 'male' | 'female'
sub_characters        jsonb       -- [{ name, gender }]
age_group             text        -- '4-6' | '7-9' | '10-12'
background            text
situation             text
moral                 text        -- 부모 입력 모드에서만 사용
art_style             text        -- 'fairytale' | 'watercolor' | 'cartoon' | 'animation'
character_description jsonb       -- Solar가 생성한 캐릭터 외모 시트
cover_url             text
status                text DEFAULT 'pending'
                                  -- 'pending' | 'story_done' | 'generating_images' | 'image_done' | 'completed' | 'failed'
created_at            timestamptz DEFAULT now()
```

### pages
```sql
id               uuid PRIMARY KEY DEFAULT gen_random_uuid()
story_id         uuid REFERENCES stories(id) ON DELETE CASCADE
page_number      int NOT NULL
text_ko          text
text_translated  text
translate_lang   text
image_url        text
```

---

## 동화 생성 파이프라인

```
POST /v1/stories/generate (requireAuth)
  → job_id 즉시 반환 (202)
  → 백그라운드 파이프라인 실행

[1단계 — 이야기 생성] Solar API (solar-pro)
  plan_*.txt → 동화 구조 계획 (JSON)
  write_*.txt → 본문 + 캐릭터 시트 (JSON)
    character: { hair, eyes, skin, outfit, features }
    age_appearance은 코드에서 입력값 기반으로 고정 추가
  status: story_done

[사용자 확인] /story-check → 줄거리 확인 후 확정

POST /v1/stories/:job_id/confirm
  → stories + pages 테이블 insert

[2단계 — 이미지 생성]
  gpt-4o-mini: image_*.txt + 캐릭터 시트 → 페이지별 영문 이미지 프롬프트
  gpt-image-1: 커버 1장 + 페이지 n장 병렬 생성 (Promise.all)
    size: 1024×1024, quality: medium
  Supabase Storage 업로드 → image_url 저장
  status: completed
```

### Job 상태 흐름
```
pending → story_done → generating_images → image_done → completed | failed
```

### 나이대별 설정

| 구간 | 글 분량 | 컷 수 | 프롬프트 파일 |
|------|---------|-------|--------------|
| 4–6세 | 1–2문장/페이지 | 6–8컷 | *_4_6.txt |
| 7–9세 | 2–4문장/페이지 | 8–10컷 | *_7_9.txt |
| 10–12세 | 3–6문장/페이지 | 10–14컷 | *_10_12.txt |
| 아이 입력 | 나이대 별도 파일 | 나이대 동일 | *_child_*.txt |

### 그림체 매핑

| 프론트 value | 한국어 label | gpt-image-1 스타일 |
|-------------|-------------|-------------------|
| fairytale | 심플동화 | Modern Flat Storybook Illustration |
| watercolor | 수채화 | Soft storybook watercolor |
| cartoon | 종이공예 | Soft layered paper cut storybook |
| animation | 색연필 | Soft colored pencil storybook illustration |

---

## API 엔드포인트

Base URL: `http://localhost:3000/v1` (개발) / `https://ddukdong.onrender.com/v1` (운영)
인증: `Authorization: Bearer {supabase_jwt}`

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | /auth/signup | 이메일 회원가입 | 불필요 |
| POST | /auth/login | 이메일 로그인 | 불필요 |
| GET | /users/me | 내 정보 조회 | 필요 |
| PUT | /users/me | 닉네임 수정 | 필요 |
| DELETE | /users/me | 회원 탈퇴 | 필요 |
| POST | /stories/generate | 동화 생성 요청 | 필요 |
| GET | /stories/jobs/:job_id | 생성 상태 폴링 | 필요 |
| POST | /stories/jobs/:job_id/regenerate | 줄거리 재생성 | 필요 |
| POST | /stories/:job_id/confirm | 줄거리 확정 + 이미지 생성 시작 | 필요 |
| GET | /stories | 내 동화 목록 | 필요 |
| GET | /stories/:story_id | 동화 상세 (pages 포함) | 불필요 |
| DELETE | /stories/:story_id | 동화 삭제 | 필요 |
| GET | /stories/:story_id/pdf | PDF 내보내기 | 불필요 |
| POST | /stories/:story_id/translate | 번역 | 필요 |
| GET | /options | 선택지 목록 | 불필요 |

---

## 반응형 브레이크포인트

| 범위 | 구분 | 특징 |
|------|------|------|
| 960px+ | PC | 기본 레이아웃, Header 네비 표시 |
| 600~960px | 태블릿 | 그리드 축소 |
| ~600px | 모바일 | Header 네비 숨김, BottomNav 표시 |

BottomNav는 `/story-check`, `/loading` 경로에서 숨김.

---

## sessionStorage 키 (동화 생성 흐름)

| 키 | 값 | 용도 |
|----|-----|------|
| `job_id` | uuid | 생성 job 추적 |
| `image_phase` | `'true'` | 이미지 생성 단계 진입 표시 |
| `demo_mode` | `'true'` | 비로그인 데모 흐름 |
| `demo_pick` | `'s1'~'s5'` | 데모 시 표시할 샘플 ID |
| `demo_phase` | `'image'` | 데모 이미지 단계 표시 |

---

## 배포 방법

```bash
# 프론트
npm run deploy          # 빌드 + gh-pages 브랜치 자동 배포

# 백엔드
# Render에 연결된 GitHub 리포 main 브랜치 push 시 자동 배포
```

프론트 배포 URL: https://yong275.github.io/ddukdong/
백엔드 배포 URL: https://ddukdong.onrender.com

---

