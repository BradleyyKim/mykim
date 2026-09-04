# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal blog and portfolio for MYKim, live at https://mykim.in. Next.js 15 (App Router) + React 19 + TypeScript, deployed on Vercel with automatic production deploys from `main`.

Node version is pinned via `.nvmrc` (22.16.0) — run `nvm use` before installing/building. Vercel project: `bradleyykims-projects/mykim`.

## Commands

```bash
npm run dev            # start dev server (Turbopack)
npm run build           # production build
npm run type-check      # tsc --noEmit (uses tsconfig.build.json)
npm run lint             # ESLint
npm run format           # Prettier write
npm run test              # Jest
npm run test:watch
npm run test:coverage
```

There is no `--testPathPattern`/single-test shortcut script; run a single test file directly with `npx jest path/to/file.test.tsx`.

Husky `pre-commit` runs `type-check` then `lint` — expect commits to fail if either fails. `next.config.ts` itself sets `typescript.ignoreBuildErrors: true`, so `npm run build` will NOT catch type errors; always run `type-check` separately.

No test files currently exist in the repo despite Jest/RTL being fully configured (`jest.config.js`, `jest.setup.js`, `testMatch` for `__tests__/**` or `*.test.*`).

## Architecture

### Content is MDX files, not a CMS

The repo was migrated off Strapi Cloud + TipTap to local MDX files (see commit `13084e4`). `README.md` was rewritten to describe this MDX architecture and is current.

- Posts live at `content/blog/{ko,en}/*.mdx`, one file per post, per locale. Frontmatter fields: `title`, `slug`, `description`, `publishedDate` (date only, no time — see hydration note below), `category` (slug into `content/categories.json`), `tags` (string array), `featuredImage` (Cloudinary URL or `""`).
- Categories are defined once in `content/categories.json` with per-locale `name`/`description`; the same 4 category slugs (`logging-mind`, `develop-knowledge`, `deploy-life`, `debug-routine`) are shared across both locales.
- To add a post: create both a `content/blog/ko/<slug>.mdx` and, if translating, `content/blog/en/<slug>.mdx` with the same `slug`.
- All MDX reading/parsing/pagination/filtering logic lives in `src/lib/mdx/index.ts` (uses `gray-matter`, reads straight from the filesystem — no build-time content pipeline). `src/lib/api/server/api.ts` wraps these as `fetch*` functions, and `src/lib/cms/post-service.ts` wraps those again into page-level data loaders (`getHomePageData`, `getPostBySlug`, `getCategoryData`). This three-layer indirection is a holdover from when the bottom layer was a real HTTP client to Strapi — the function signatures were kept stable while only the implementation swapped to local files.
- `next.config.ts` sets `outputFileTracingIncludes: { "/**": ["./content/**/*"] }` so the `content/` directory is bundled into the Vercel serverless functions — required for posts to resolve in production (this was a real prod bug, see commit `a5d0d61`).
- `src/lib/content/markdown.ts` (was `content/editor/tiptap-renderer.ts`) holds `extractPlainText` and `extractFirstImageFromContent`, both used by `PostPage.tsx` and `rss.xml/route.ts`. Despite the old name it always operated on markdown strings; the TipTap-era filename, the `editor/` directory, and the `extractFirstImageFromTiptapContent` alias were removed.

### i18n

Custom-built i18n, not next-intl or similar:
- Korean is the default locale with no path prefix; English lives under `/en/*`. Route groups mirror this: `src/app/(ko)/...` vs `src/app/en/...` — these are separately maintained page trees that both call into the same `src/components/pages/*` components with a `locale` prop, not a single templated route.
- `src/middleware.ts` detects locale from the `locale` cookie or `Accept-Language`, sets the cookie, and redirects first-time English-looking visitors from `/` to `/en`.
- Translation strings/dictionaries live in `src/i18n/locales/{ko,en}.json`; `src/i18n/utils.ts` has `t()`, `getLocalePath()`, `getDictionary()`.
- When adding a page or feature, it needs to be wired into both the `(ko)` and `en` route trees.

### Other notable behavior

- `PostPage`/date rendering intentionally drops time-of-day formatting because MDX frontmatter dates have no time component — adding `HH:mm` back reintroduces a UTC/KST hydration mismatch (React #418) that was already fixed once (commit `d572d81`).
- Theme defaults to light (`defaultTheme="light"`, `enableSystem={false}` in `src/app/layout.tsx`). Both theme toggles (`ui/ThemeMode.tsx`, `layout/Header.tsx`) only flip light↔dark, so leaving `enableSystem` on would make the first click behave unpredictably for OS-dark visitors.
- Career page (`src/components/pages/CareerPage.tsx`, `CareerPageClient.tsx`) supports exporting the résumé as a PDF via `src/lib/media/{client,css}-pdf-generator.ts`.
- `src/app/rss.xml/route.ts` and `src/app/sitemap.ts` are generated from the same MDX post data, not separate content.
- Revalidation: `/api/revalidate` and `/api/revalidate-path` plus `src/lib/cache/*` exist for on-demand ISR revalidation, guarded by `REVALIDATE_SECRET` / `NEXT_PUBLIC_REVALIDATE_SECRET`.

## CI/CD

- `.github/workflows/blog-automation.yml`: on push to `main`, runs type-check/lint/build, then (after a 90s sleep for deploy) curls the live site's sitemap, robots.txt, RSS feed, and homepage as a post-deploy smoke test.
- `.github/workflows/auto-version-update.yml`: manual (`workflow_dispatch`) patch/minor/major version bump — updates `package.json` + build date/time in `next.config.ts`, commits, pushes, and cuts a GitHub Release.
- Actual deploys are handled by Vercel's GitHub integration (push to `main` → production deploy), independent of these workflows.

## Writing posts

Post prose follows a fixed voice, enforced by the global `humanize-kr` skill
(`~/.claude/skills/humanize-kr`): plain declarative `-다` endings, no bold (`**`), no emoji,
`#` for section headings, short sentences, prose over bullet lists. The full profile is
`references/voice-profile.md` there.

Posts about a personal project carry a "요청에 담은 것" section: the constraints given to the AI,
the lines of real repo code those constraints landed in, and what was checked in the result. Code
must be copied from the actual repo and numbers must be measured — never invented or adapted.
Company-project code is generalized to interface or pattern level instead of quoted.

A PostToolUse hook audits any `.md`/`.mdx` written under `content/blog/` and reports what it
catches, so expect feedback when a draft drifts from that voice. Company work is generalized in
posts — no partner names, unannounced expo names, unconfirmed clients, or operational screenshots.
