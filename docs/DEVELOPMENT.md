# 개발 환경 설정 가이드

## 필수 요구사항

### Node.js 및 npm

- **Node.js**: v20.15.1 이상
- **npm**: v10.7.0 이상

```bash
node --version  # v20.15.1
npm --version   # 10.7.0
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

### 2. VSCode 설정

프로젝트를 VSCode로 열면 자동으로 권장 확장 프로그램 설치를 제안합니다.
설치 후 VSCode를 재시작하세요.

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 코드 포맷팅 확인

```bash
# 포맷팅 체크
npm run format:check

# 자동 포맷팅 적용
npm run format
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
```

### 방법 2: 프로젝트 폴더 복사

1. 전체 프로젝트 폴더를 복사
2. 다른 기기에서 `npm install` 실행
3. VSCode로 열어서 확장 프로그램 설치

## 트러블슈팅

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
