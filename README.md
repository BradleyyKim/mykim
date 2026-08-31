# mykim.in

개인 기술 블로그 겸 포트폴리오. 개발하면서 배운 것과 생각한 것을 기록한다.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

Live: [https://mykim.in](https://mykim.in)

## 구조

글은 저장소 안의 MDX 파일이다. CMS도 데이터베이스도 없다.

```
content/blog/{ko,en}/*.mdx  →  gray-matter 파싱  →  Next.js 페이지
```

한 편이 한 파일이고, 한국어와 영어가 같은 `slug`로 짝을 이룬다. 카테고리는
`content/categories.json`에 로케일별 이름과 함께 한 번만 정의한다.

원래는 Strapi Cloud와 TipTap 에디터로 웹에서 글을 쓰는 구조였다. 운영비와 배포
복잡도를 줄이려고 로컬 MDX로 옮겼고, 그때 프론트엔드 쪽 함수 시그니처
(`fetch*`, `get*PageData`)는 그대로 두어 마이그레이션 범위를 좁혔다. `src/lib/mdx` →
`src/lib/api/server` → `src/lib/cms`로 이어지는 세 겹은 그 시절의 흔적이다.

```
src/
├── app/
│   ├── (ko)/          한국어(기본) 라우트 — /, /about, /career, /posts/[slug], /category/[slug], /tags
│   ├── en/            영어 라우트 — 같은 화면을 별도 트리로 유지
│   ├── api/           revalidate, categories, tags
│   ├── rss.xml/       MDX 데이터에서 생성
│   └── sitemap.ts
├── components/
│   ├── ui/            shadcn/ui
│   ├── layout/        헤더·푸터
│   ├── pages/         (ko)와 en이 함께 쓰는 페이지 컴포넌트
│   └── blog/          목록·상세·검색
├── i18n/              사전과 t(), getLocalePath()
├── lib/
│   ├── mdx/           파일시스템에서 MDX를 읽고 파싱·정렬·페이지네이션
│   ├── api/, cms/     위 결과를 페이지 단위 데이터로 감싸는 층
│   ├── content/       본문에서 SEO 텍스트·대표 이미지 추출
│   ├── cache/         온디맨드 ISR 재검증
│   └── media/         이력서 PDF 생성
└── middleware.ts      로케일 감지와 쿠키 설정
```

## 기술

Next.js 15 App Router, React 19, TypeScript 5, Tailwind CSS 3.4, shadcn/ui(Radix).
본문은 react-markdown에 remark-gfm과 rehype-highlight를 물려 렌더링한다.
배포는 Vercel, 계측은 Vercel Analytics와 Speed Insights.

렌더링은 ISR이다. 목록·글·카테고리·태그 페이지가 300초마다 재검증되고, 글을 고쳤을 때는
`/api/revalidate`로 즉시 갱신할 수 있다. `REVALIDATE_SECRET`으로 보호한다.

이미지는 Next.js Image가 WebP·AVIF로 변환하고 30일 캐시한다. 원본은 Cloudinary에 둔다.

기본 테마는 라이트다. 헤더의 토글로 다크와 오간다.

## 시작하기

Node 버전은 `.nvmrc`에 22.16.0으로 고정돼 있다.

```bash
nvm use
npm install
npm run dev        # http://localhost:3000
```

환경 변수는 전부 선택 사항이다. 없어도 로컬 개발과 글 렌더링은 동작한다.

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://mykim.in            # RSS·사이트맵 절대경로
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...
REVALIDATE_SECRET=...                            # 온디맨드 재검증 보호
NEXT_PUBLIC_REVALIDATE_SECRET=...
```

## 명령

```bash
npm run dev            # 개발 서버 (Turbopack)
npm run build          # 프로덕션 빌드
npm run type-check     # tsc --noEmit
npm run lint           # ESLint
npm run format         # Prettier
npm run test           # Jest
```

`npm run build`는 타입 오류를 잡지 않는다. `next.config.ts`가
`typescript.ignoreBuildErrors: true`로 두고 있어서, 타입은 `type-check`로 따로 본다.
Husky pre-commit이 `type-check`와 `lint`를 차례로 돌리므로 둘 중 하나라도 깨지면 커밋이 막힌다.

Jest와 React Testing Library는 설정돼 있지만 테스트 파일은 아직 없다.

## 글 쓰기

```bash
content/blog/ko/<slug>.mdx    # 한국어
content/blog/en/<slug>.mdx    # 영어판 (같은 slug)
```

프론트매터는 `title`, `slug`, `description`, `publishedDate`(날짜만), `category`,
`tags`, `featuredImage`를 받는다. `publishedDate`에 시각을 붙이면 UTC/KST 하이드레이션
불일치가 되살아나니 날짜만 쓴다.

문체 규칙은 `~/.claude/skills/humanize-kr`에 있다. 볼드를 쓰지 않고, 평서체 `-다`로
쓰고, 이모지를 넣지 않는다. `content/blog` 아래 파일을 저장하면 자동으로 검수가 돈다.

## 배포

`main`에 push하면 Vercel이 프로덕션으로 배포한다.

GitHub Actions는 두 개다. `blog-automation.yml`은 push마다 type-check·lint·build를 돌리고
배포를 기다린 뒤 사이트맵·robots.txt·RSS·홈을 실제로 받아 보며 확인한다.
`auto-version-update.yml`은 수동 실행으로 버전을 올리고 릴리스를 만든다.

콘텐츠 디렉터리는 `outputFileTracingIncludes`로 서버리스 함수 번들에 포함시킨다.
빠뜨리면 프로덕션에서 글이 뜨지 않는다. 실제로 한 번 겪었다.
