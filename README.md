# MY Kim Blog

> 개인 기술 블로그 및 포트폴리오 웹사이트
> Next.js 15 + React 19로 구축한 블로그 플랫폼

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

🔗 **Live**: [https://mykim.in](https://mykim.in)

---

## 📖 소개

개발하면서 배운 내용과 경험을 기록하는 개인 블로그입니다.
콘텐츠는 로컬 MDX 파일로 관리하며, Next.js의 SSR/ISR 기능으로 SEO를 개선했습니다.

## ✨ 주요 기능

### 컨텐츠 작성 및 관리
- 📝 MDX 파일 기반 포스트 작성 (`content/blog/{ko,en}/*.mdx`)
- 🌐 한국어/영어 다국어(i18n) 지원
- 🏷️ 카테고리 & 태그 시스템
- 🔍 포스트 검색 기능
- 📊 Vercel Analytics 통합

### 사용자 경험
- 🌓 시간대별 배경 이미지 변경 (낮/밤)
- 👤 매일 바뀌는 아바타
- 🎨 다크모드 지원
- 📱 모바일 반응형 디자인

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: React 19, TypeScript 5
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui (Radix 기반)
- **Markdown 렌더링**: react-markdown + remark-gfm + rehype-highlight

### Backend & Infrastructure
- **Content**: 로컬 MDX 파일 (`gray-matter`로 프론트매터 파싱)
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics
- **Image Optimization**: Next.js Image + WebP

### Development
- **Code Quality**: ESLint, Prettier
- **Git Hooks**: Husky
- **Package Manager**: npm

---

## 🏗️ 주요 기술적 특징

### MDX 파일 기반 콘텐츠 아키텍처
```
content/blog/{ko,en}/*.mdx  →  gray-matter 파싱  →  Next.js 페이지
```
빌드/배포 시점에 별도 CMS 호출 없이 파일시스템에서 바로 콘텐츠를 읽어 렌더링

### SSR/ISR 하이브리드 렌더링
- **SSR**: 동적 페이지 서버 사이드 렌더링
- **ISR**: 정적 페이지 점진적 재생성 (Revalidate: 5분)
- SEO 개선 및 빠른 초기 로딩

### 이미지 최적화
- WebP 포맷 자동 변환
- Next.js Image 컴포넌트 활용
- 파일 크기 50-90% 감소

### 캐싱 전략
- Next.js ISR 기반 재검증 (`/api/revalidate`, `/api/revalidate-path`)
- Stale-while-revalidate 패턴 적용

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── (ko)/               # 한국어(기본) 라우트: /, /about, /career, /category/[slug], /posts/[slug], /tags
│   ├── en/                 # 영어 라우트: /en, /en/about, /en/career, ...
│   └── api/                # API Routes (revalidate, categories, tags)
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트
│   ├── layout/              # 레이아웃 컴포넌트
│   ├── pages/                # 페이지 단위 컴포넌트 ((ko)/en이 공유)
│   └── blog/                 # 포스트 목록/상세/검색 컴포넌트
├── i18n/                   # 다국어 사전 및 유틸
├── hooks/                  # Custom React Hooks
├── lib/
│   ├── mdx/                 # MDX 파싱/조회 (콘텐츠 소스)
│   ├── api/, cms/            # 파싱된 데이터를 페이지에 전달하는 래퍼 계층
│   └── cache/                 # ISR 재검증 로직
└── middleware.ts            # locale 감지/쿠키 설정
```

---

## 🚀 시작하기

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가 (전부 선택 사항 — 없어도 로컬 개발/포스트 렌더링은 동작):

```bash
# 사이트 URL (RSS/사이트맵 절대경로 생성용)
NEXT_PUBLIC_SITE_URL=https://mykim.in

# Google Analytics / Search Console
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code

# On-demand ISR 재검증 API 보호용 시크릿
REVALIDATE_SECRET=your-secret
NEXT_PUBLIC_REVALIDATE_SECRET=your-secret
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

```bash
npm run build
npm start
```

## 📝 개발 과정에서 고민한 부분

### 1. CMS에서 MDX 파일로 전환
- 초기에는 Strapi Cloud + TipTap 에디터로 웹에서 직접 글을 작성/편집하는 구조였음
- Strapi Cloud 운영 비용과 배포 구조 복잡도를 줄이기 위해 로컬 MDX 파일 기반으로 전환
- 글쓰기는 저장소에 MDX 파일을 추가하는 방식으로 바뀌었지만, 프론트엔드 쪽 함수 시그니처(`fetch*`, `get*PageData`)는 그대로 유지해 마이그레이션 범위를 최소화

### 2. 상태 관리
- 클라이언트 상태는 React의 useState/useContext 활용
- 전역 상태를 최소화하여 복잡도 감소

### 3. 성능 개선
- 이미지 자동 WebP 변환으로 파일 크기 50-90% 감소
- ISR로 정적 페이지 생성 (5분 주기 재검증)

### 4. SEO
- App Router의 metadata API 활용
- 동적 OG 이미지 생성
- sitemap.xml 및 rss.xml 자동 생성

---

## 🔧 주요 구현 사항

### 시간대별 배경 이미지
- 6:00 AM - 6:00 PM: 낮 이미지
- 6:00 PM - 6:00 AM: 밤 이미지
- 새로고침 시 랜덤 이미지 선택

### 타입 안전성
- TypeScript Strict Mode 활성화
- `gray-matter`로 파싱한 프론트매터를 `Post`/`Category`/`Tag` 타입(`src/lib/types/post.ts`)으로 매핑

### 코드 품질
- ESLint + Prettier로 코드 스타일 통일
- Husky로 커밋 전 자동 검증
- 컴포넌트 재사용성 고려한 설계

---

## 📚 참고

- **Live**: [https://mykim.in](https://mykim.in)
- **GitHub**: [https://github.com/BradleyyKim](https://github.com/BradleyyKim)

---

**Built with ❤️ by MYKim**
