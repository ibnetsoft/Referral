# Referral Signup Temporary Web MVP

추천코드 기반 회원가입, 로그인, 마이페이지 조직도, 관리자 회원조회와 엑셀 다운로드를 제공하는 임시 운영용 웹 MVP입니다.

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS 4
- Supabase PostgreSQL
- Vercel
- SheetJS (`xlsx`)
- Kakao JavaScript SDK

## Features

- `username + password` 회원가입/로그인
- 이름, 핸드폰번호 입력
- `bcryptjs` 비밀번호 해시 저장
- 추천코드 필수 입력과 `/signup?ref=CODE` 자동 고정
- 서버 재검증 후 `recommender_id` 저장
- `httpOnly` 세션 쿠키 로그인
- 마이페이지 추천 URL, 링크복사, 카카오 공유
- `WITH RECURSIVE` 기반 추천 트리 조회
- 관리자 회원 검색, 조직도 조회, `xlsx` 다운로드

## Local Setup

1. `.env.example`을 참고해 환경변수를 설정합니다.
2. `supabase/migrations/20260830_init_referral_signup_mvp.sql`을 적용합니다.
3. 의존성을 설치합니다.
4. 개발 서버를 실행합니다.

```bash
npm install
npm run dev
```

## Required Environment Variables

```bash
SUPABASE_PROJECT_URL=https://ebkqooyhludsvqamfpwo.supabase.co
DATABASE_URL=postgres://...
APP_URL=https://www.uarich.kr
SESSION_COOKIE_NAME=referral_session
SESSION_TTL_DAYS=14
LOGIN_RATE_LIMIT_WINDOW_MINUTES=10
LOGIN_RATE_LIMIT_MAX_ATTEMPTS=5
NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY=
```

`DATABASE_URL`은 `SUPABASE_PROJECT_URL`과 별개입니다. 이 프로젝트는 서버에서 Postgres에 직접 연결하므로 실제 DB connection string이 필요합니다.

## Key Files

- `docs/architecture.md`
- `supabase/migrations/20260830_init_referral_signup_mvp.sql`
- `src/components/referral-tree.tsx`
- `src/lib/tree.ts`
- `src/lib/users.ts`
- `src/lib/admin.ts`
