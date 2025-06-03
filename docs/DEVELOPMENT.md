# 개발 환경 설정 가이드

## 필수 요구사항

### Node.js 및 npm

- **Node.js**: v20.15.1 이상 (v22.x도 호환됨)
- **npm**: v10.7.0 이상

**호환되는 Node.js 버전**:

- Node.js 20.15.1 (권장)
- Node.js 22.x (완전 호환)
- Node.js 18.18.0+ (최소 요구사항)

```bash
node --version  # v20.15.1 또는 v22.x
npm --version   # 10.7.0 이상
```

**nvm 사용자의 경우**:

```bash
# .nvmrc 파일 사용
nvm use

# 또는 특정 버전 설치/사용
nvm install 20.15.1
nvm use 20.15.1
```

### 환경변수 설정

프로젝트 루트에 다음 환경변수 파일들을 생성하세요:

#### .env.local (개발용)

```bash
NEXT_PUBLIC_API_URL=http://localhost:1337/api
```

#### .env.production (프로덕션 빌드용)

```bash
# 실제 백엔드 API URL로 변경
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api

# 또는 빌드 시점에서 API 호출을 완전히 비활성화하려면
# NEXT_PUBLIC_API_URL=disabled
```

### VSCode 확장 프로그램

이 프로젝트에서는 다음 VSCode 확장 프로그램을 권장합니다:

1. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
2. **TypeScript Importer** (`pmneo.tsimporter`)
3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
4. **ESLint** (`ms-vscode.vscode-eslint`)
5. **Auto Rename Tag** (`formulahendry.auto-rename-tag`)
6. **Path Intellisense** (`christian-kohler.path-intellisense`)

### 설정 파일들

프로젝트는 다음 설정 파일들을 포함합니다:

- `.prettierrc` - Prettier 코드 포맷팅 설정
- `.editorconfig` - 에디터 통합 설정
- `.vscode/settings.json` - VSCode 워크스페이스 설정
- `.vscode/extensions.json` - 권장 확장 프로그램 목록
- `eslint.config.mjs` - ESLint 린팅 설정

## 개발 환경 구축

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd mykim-blog-front
npm install
```

### 2. 환경변수 설정

```bash
# .env.local 파일 생성
echo "NEXT_PUBLIC_API_URL=http://localhost:1337/api" > .env.local

# .env.production 파일 생성
echo "NEXT_PUBLIC_API_URL=https://your-backend-api.com/api" > .env.production
```

### 3. VSCode 설정

프로젝트를 VSCode로 열면 자동으로 권장 확장 프로그램 설치를 제안합니다.
설치 후 VSCode를 재시작하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

### 5. 코드 포맷팅 확인

```bash
# 포맷팅 체크
npm run format:check

# 자동 포맷팅 적용
npm run format
```

## 빌드 관련 설정

### 빌드 에러 해결

`npm run build` 시 fetch 에러가 발생하는 경우:

1. **환경변수 확인**: `.env.production` 파일이 있는지 확인
2. **API URL 설정**: 유효한 백엔드 API URL을 설정하거나 `disabled`로 설정
3. **백엔드 서버**: 빌드 시점에 백엔드 서버가 실행 중인지 확인

### 안전한 빌드를 위한 환경변수

```bash
# API가 없는 상태에서 빌드하려면
echo "NEXT_PUBLIC_API_URL=disabled" > .env.production
npm run build
```

## 다른 기기로 이전할 때

### 방법 1: Git을 통한 동기화 (권장)

```bash
# 현재 작업을 커밋
git add .
git commit -m "Development setup update"
git push

# 다른 기기에서
git pull
npm install

# 환경변수 파일 생성
echo "NEXT_PUBLIC_API_URL=http://localhost:1337/api" > .env.local
```

### 방법 2: 프로젝트 폴더 복사

1. 전체 프로젝트 폴더를 복사
2. 다른 기기에서 `npm install` 실행
3. 환경변수 파일들 생성
4. VSCode로 열어서 확장 프로그램 설치

## 트러블슈팅

### 빌드 시 fetch 에러

```bash
[TypeError: fetch failed] {
  [cause]: [AggregateError: ] { code: 'ECONNREFUSED' }
}
```

**해결 방법**:

1. `.env.production` 파일에 올바른 API URL 설정
2. 또는 임시로 `NEXT_PUBLIC_API_URL=disabled` 설정
3. 백엔드 서버가 실행 중인지 확인

### Prettier가 작동하지 않는 경우

1. VSCode에서 Prettier 확장 프로그램이 설치되어 있는지 확인
2. 설정에서 기본 포매터가 Prettier로 설정되어 있는지 확인
3. `.prettierrc` 파일이 프로젝트 루트에 있는지 확인

### ESLint 에러가 발생하는 경우

```bash
# ESLint 캐시 삭제
npx eslint --cache --fix .
```

### Node.js 버전 불일치

```bash
# nvm 사용하는 경우
nvm use 20.15.1
```

## 코딩 스타일 가이드

- **들여쓰기**: 2 스페이스
- **줄 길이**: 120자
- **따옴표**: 쌍따옴표 사용
- **세미콜론**: 항상 사용
- **줄 끝**: LF (Unix 스타일)

모든 설정은 `.prettierrc`와 `.editorconfig`에 정의되어 있으며, 저장 시 자동으로 포맷팅됩니다.
