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

export const MAIN = {
  title: "MY Kim Blog",
  description: "My Kim Blog is a blog about my life and my thoughts.",
  keywords: "my kim blog, my kim, kim blog",
  author: "My Kim",
  url: "https://mykim.blog",
  image: "https://mykim.blog/images/logo.png",
  twitter: "@mykim",
  facebook: "https://www.facebook.com/mykim"
};
