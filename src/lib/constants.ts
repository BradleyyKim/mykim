// API 관련 상수 정의
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

// 엔드포인트 정의
export const API_ENDPOINTS = {
  POSTS: `${API_BASE_URL}/posts`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  CATEGORY: `${API_BASE_URL}/category`,
  AUTH: `${API_BASE_URL}/auth`,
  TAGS: `${API_BASE_URL}/tags`,
  USERS: `${API_BASE_URL}/users`
};

// 기타 상수
export const POSTS_PER_PAGE = 10;

// 재검증 시간 설정 (초 단위)
// 개발 환경에서는 10초, 프로덕션에서는 5분(300초)
export const REVALIDATE_TIME = process.env.NODE_ENV === "development" ? 10 : 300;

export const MAIN = {
  title: "MyKim",
  description: "MyKim's Blog is a blog about my life and my thoughts.",
  keywords: "mykim's blog, mykim, blog",
  author: "김민영",
  url: "https://mykim.in",
  image: "https://mykim.in/images/logo.png",
  twitter: "@mykim",
  facebook: "https://www.facebook.com/mykim",
  // 소셜 링크
  social: {
    linkedin: "https://www.linkedin.com/in/minyoung-kim-fe/",
    github: "https://github.com/BradleyyKim",
    rss: "/rss.xml"
  },
  // 개인 정보
  bio: {
    tagline: "어쩌면 오늘이 가장 행복한 날일지도 모르겠습니다.",
    subtitle: "Software Engineer & Life Architect"
  }
};

// Avatar 설정
export const AVATAR = {
  // 여러 아바타 이미지 목록
  IMAGES: [
    "/images/avatars/mykim-avatar-1.png",
    "/images/avatars/mykim-avatar-2.png",
    "/images/avatars/mykim-avatar-3.png",
    "/images/avatars/mykim-avatar-4.png",
    "/images/avatars/mykim-avatar-5.png",
    "/images/avatars/mykim-avatar-6.png"
  ],
  DEFAULT: "/images/avatars/mykim-avatar-1.png", // 기본값
  ALT: "My Kim Avatar",
  SIZES: {
    SM: 32,
    MD: 40,
    LG: 64,
    XL: 128
  },
  // 반응형 사이즈 (Tailwind 클래스)
  RESPONSIVE_SIZES: {
    SM: "w-8 h-8 sm:w-10 sm:h-10", // 32px -> 40px
    MD: "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14", // 40px -> 48px -> 56px
    LG: "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20", // 48px -> 64px -> 80px
    XL: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32", // 64px -> 80px -> 96px -> 128px
    RESPONSIVE: "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32" // 완전 반응형
  }
} as const;
