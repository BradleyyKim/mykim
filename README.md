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
Strapi Cloud를 Headless CMS로 활용하여 컨텐츠를 관리하며, Next.js의 SSR/ISR 기능으로 SEO를 개선했습니다.

## ✨ 주요 기능

### 컨텐츠 작성 및 관리
- 📝 TipTap 에디터 기반 WYSIWYG 문서 편집
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
- **UI Components**: shadcn/ui
- **Editor**: TipTap (ProseMirror 기반)
- **State Management**: Tanstack/react-query
- **Form**: React Hook Form + Zod

### Backend & Infrastructure
- **CMS**: Strapi Cloud (Headless CMS)
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics
- **Image Optimization**: Next.js Image + WebP

### Development
- **Code Quality**: ESLint, Prettier
- **Git Hooks**: Husky
- **Package Manager**: npm

---

## 🏗️ 주요 기술적 특징

### Headless CMS 아키텍처
```
Client (Next.js) ←→ Strapi Cloud API ←→ Database
```
컨텐츠 관리와 프론트엔드를 분리하여 각각 독립적으로 확장 가능

### SSR/ISR 하이브리드 렌더링
- **SSR**: 동적 페이지 서버 사이드 렌더링
- **ISR**: 정적 페이지 점진적 재생성 (Revalidate: 5분)
- SEO 개선 및 빠른 초기 로딩

### 이미지 최적화
- WebP 포맷 자동 변환
- Next.js Image 컴포넌트 활용
- 파일 크기 50-90% 감소

### 캐싱 전략
- React Query로 서버 상태 관리
- Stale-while-revalidate 패턴 적용
- API 호출 최소화

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (posts)/           # 포스트 관련 페이지
│   ├── about/             # 소개 페이지
│   ├── career/            # 경력 페이지
│   ├── category/          # 카테고리별 포스트
│   ├── tags/              # 태그별 포스트
│   └── api/               # API Routes
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   └── editor/            # TipTap 에디터
├── hooks/                 # Custom React Hooks
├── lib/                   # 유틸리티 함수
└── styles/                # 전역 스타일
```

---

## 🚀 시작하기

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가:

```bash
# Strapi CMS
NEXT_PUBLIC_API_URL=your-strapi-url
STRAPI_API_TOKEN=your-api-token

# Vercel Analytics (선택)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
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

### 1. 에디터 선택
- 마크다운 작성의 편의성과 WYSIWYG 편집의 직관성을 모두 원함
- TipTap을 선택하여 두 가지 방식을 모두 지원

### 2. 상태 관리
- 서버 데이터는 React Query로 캐싱 및 관리
- 클라이언트 상태는 React의 useState/useContext 활용
- 전역 상태를 최소화하여 복잡도 감소

### 3. 성능 개선
- 이미지 자동 WebP 변환으로 파일 크기 50-90% 감소
- ISR로 정적 페이지 생성 (5분 주기 재검증)
- React Query 캐싱으로 불필요한 API 호출 제거

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
- Zod 스키마로 런타임 검증
- API 응답 타입 정의

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
