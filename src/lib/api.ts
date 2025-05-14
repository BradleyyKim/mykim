// API 관련 모듈 임포트
import { API_ENDPOINTS } from "./constants";

// 타입 정의
export interface FeaturedImage {
  url: string;
  width?: number;
  height?: number;
  alternativeText?: string;
  caption?: string;
}

export interface Tag {
  id: number;
  name?: string;
  slug?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Post {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  description: string | null;
  featuredImage: FeaturedImage | null;
  publishedDate: string | null;
  postStatus: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  tags: Tag[];
  category:
    | string
    | {
        id?: number | string;
        name?: string;
        slug?: string;
        attributes?: {
          name?: string;
          slug?: string;
          [key: string]: unknown;
        };
        data?: {
          id?: number | string;
          attributes?: {
            name?: string;
            slug?: string;
            [key: string]: unknown;
          };
          [key: string]: unknown;
        };
        [key: string]: unknown;
      }
    | null;
}

// Strapi API 응답 타입 정의
interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// 서버 컴포넌트에서 사용할 함수
export async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await fetch(API_ENDPOINTS.POSTS, {
      cache: "no-store",
      next: {
        tags: ["posts"]
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data = (await response.json()) as StrapiResponse<Post[]>;

    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected API response structure:", data);
      return [];
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// 클라이언트 컴포넌트에서 사용할 함수
export async function fetchPostsClient(): Promise<Post[]> {
  try {
    const response = await fetch(API_ENDPOINTS.POSTS, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data = (await response.json()) as StrapiResponse<Post[]>;

    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected API response structure:", data);
      return [];
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching posts in client:", error);
    return [];
  }
}

// 서버 컴포넌트에서 사용할 함수
export async function fetchPostById(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`${API_ENDPOINTS.POSTS}/${id}`, {
      cache: "no-store",
      next: {
        tags: [`post-${id}`]
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const data = (await response.json()) as StrapiResponse<Post>;

    if (!data.data) {
      console.error("Unexpected API response structure:", data);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// 클라이언트 컴포넌트에서 사용할 함수
export async function fetchPostByIdClient(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`${API_ENDPOINTS.POSTS}/${id}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const data = (await response.json()) as StrapiResponse<Post>;

    if (!data.data) {
      console.error("Unexpected API response structure:", data);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// 카테고리 데이터 가져오기
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(API_ENDPOINTS.CATEGORIES, {
      cache: "no-store",
      next: {
        tags: ["categories"]
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected API response structure:", data);
      return [];
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
