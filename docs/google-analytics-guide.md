# Google Analytics 4 구현 가이드

이 프로젝트에 Google Analytics 4가 완전히 구현되었습니다. 이 문서는 설정 방법과 사용법을 안내합니다.

## 🎯 구현된 기능

### ✅ 자동 추적 기능

- **페이지 조회**: 모든 페이지 이동 자동 추적
- **사용자 세션**: 방문자 수, 세션 시간, 이탈률
- **외부 링크 클릭**: 다른 도메인으로의 링크 클릭 추적

### ✅ 블로그 특화 추적

- **포스트 조회**: 개별 포스트 조회수 및 카테고리별 분석
- **읽기 진행률**: 25%, 50%, 75%, 90%, 100% 스크롤 추적
- **읽기 시간**: 30초, 1분, 2분, 5분 체류 시간 추적
- **읽기 완료**: 포스트를 끝까지 읽은 사용자 추적
- **카테고리 탐색**: 카테고리별 방문 패턴 분석
- **검색 행동**: 내부 검색 키워드 및 결과 추적
- **테마 변경**: 다크/라이트 모드 선호도 추적

### ✅ 개발/운영 환경 분리

- **개발 환경**: 콘솔 로그로 이벤트 확인 가능
- **운영 환경**: 실제 GA 데이터 수집
- **환경별 GA ID**: 개발용과 운영용 측정 ID 분리 가능

## 🚀 설정 방법

### 1단계: Google Analytics 4 계정 생성

1. [Google Analytics](https://analytics.google.com/)에 접속
2. 새 속성 생성 → "웹" 플랫폼 선택
3. **측정 ID** 복사 (형식: `G-XXXXXXXXXX`)

### 2단계: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# 필수: 운영 환경용 GA4 측정 ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# 선택: 개발 환경용 GA4 측정 ID (개발 시에도 GA 추적하려면 설정)
NEXT_PUBLIC_GA_MEASUREMENT_ID_DEV=G-YYYYYYYYYY
```

### 3단계: 배포 및 확인

1. **개발 환경에서 테스트**:

   ```bash
   npm run dev
   ```

   - 브라우저 개발자 도구 → 콘솔에서 `📊 GA` 로그 확인

2. **운영 환경 배포**:
   ```bash
   npm run build
   npm start
   ```
   - Google Analytics 실시간 보고서에서 데이터 확인

## 📊 Google Analytics에서 확인할 수 있는 데이터

### 기본 보고서

- **실시간**: 현재 사이트를 방문 중인 사용자
- **사용자**: 방문자 수, 신규/재방문자 비율
- **이벤트**: 사용자 행동 패턴

### 맞춤 이벤트 분석

#### 포스트 인기도 분석

```
이벤트 이름: view_post
매개변수:
- post_id: 포스트 슬러그
- category: 카테고리명
- post_title: 포스트 제목
```

#### 읽기 참여도 분석

```
이벤트 이름: scroll
매개변수:
- scroll_depth: 25, 50, 75, 90, 100
- post_id: 포스트 슬러그

이벤트 이름: reading_time
매개변수:
- time_spent: 30, 60, 120, 300 (초)
- post_id: 포스트 슬러그
```

#### 카테고리별 관심도

```
이벤트 이름: view_category
매개변수:
- category: 카테고리명
```

#### 검색 패턴 분석

```
이벤트 이름: search
매개변수:
- search_term: 검색어
- results_count: 검색 결과 수 (선택)
```

#### 사용자 선호도

```
이벤트 이름: change_theme
매개변수:
- theme: light, dark
```

### 권장 맞춤 보고서

1. **포스트 성과 분석**:

   - 이벤트 이름: `view_post`
   - 분석 차원: `post_id`, `category`, `post_title`

2. **읽기 참여도 분석**:

   - 이벤트 이름: `scroll`, `reading_time`, `complete_reading`
   - 분석 차원: `post_id`, `scroll_depth`, `time_spent`

3. **검색 인사이트**:
   - 이벤트 이름: `search`
   - 분석 차원: `search_term`

## 🔧 고급 설정

### 추가 이벤트 추적하기

새로운 이벤트를 추가하려면:

1. `src/lib/google-analytics.ts`의 `blogEvents` 객체에 함수 추가
2. `src/hooks/useGoogleAnalytics.ts`의 `useBlogAnalytics` 훅에 함수 추가
3. 컴포넌트에서 해당 함수 호출

예시:

```typescript
// 1. google-analytics.ts에 추가
sharePost: (postId: string, platform: string) => {
  trackEvent("share_post", {
    post_id: postId,
    platform: platform,
    content_type: "blog_post"
  });
};

// 2. 컴포넌트에서 사용
const { trackShare } = useBlogAnalytics();
const handleShare = () => {
  trackShare(postId, "twitter");
};
```

### 개발 환경에서 실제 GA 추적하기

개발 중에도 GA 데이터를 보고 싶다면:

```bash
# .env.local에 개발용 GA ID 추가
NEXT_PUBLIC_GA_MEASUREMENT_ID_DEV=G-YYYYYYYYYY
```

### 프라이버시 설정

현재 구현은 GDPR 준수를 위해:

- IP 익명화 적용
- 개인정보 최소 수집
- 사용자 동의 관리 준비 완료

추가 프라이버시 설정이 필요하다면 `src/lib/google-analytics.ts`에서 설정 가능합니다.

## 🐛 문제 해결

### GA 데이터가 나타나지 않는 경우

1. **환경 변수 확인**:

   ```bash
   echo $NEXT_PUBLIC_GA_MEASUREMENT_ID
   ```

2. **개발 환경에서 콘솔 확인**:

   - 브라우저 개발자 도구 → 콘솔
   - `📊 GA` 로그가 나타나는지 확인

3. **Network 탭에서 확인**:

   - `google-analytics.com` 요청이 전송되는지 확인

4. **GA 실시간 보고서 확인**:
   - Google Analytics → 보고서 → 실시간

### 일반적인 문제

- **측정 ID 형식 오류**: `G-`로 시작하는 올바른 형식인지 확인
- **환경 변수 누락**: `.env.local` 파일이 올바른 위치에 있는지 확인
- **캐시 문제**: 브라우저 캐시 삭제 후 재시도

## 📈 성과 측정 예시

### 블로그 성과 KPI

1. **콘텐츠 품질**:

   - 평균 읽기 완료율
   - 포스트별 평균 체류 시간
   - 스크롤 깊이 분포

2. **사용자 관심도**:

   - 카테고리별 인기도
   - 검색 키워드 트렌드
   - 재방문율

3. **기술적 성과**:
   - 페이지 로딩 속도
   - 모바일/데스크톱 사용 비율
   - 다크모드 사용률

이제 Google Analytics 4를 통해 블로그의 상세한 사용자 행동 데이터를 수집하고 분석할 수 있습니다! 🎉
