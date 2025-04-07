// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

// 디버깅: API URL 출력
console.log("API_BASE_URL:", API_BASE_URL);

// 타입 정의
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  description: string;
  featuredImage?: Record<string, unknown>;
  publishedDate: string;
  author?: Record<string, unknown>;
  categories?: Record<string, unknown>[];
  tags?: Record<string, unknown>[];
  postStatus?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
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

interface StrapiPost {
  id: number;
  attributes: {
    Title?: string;
    Slug?: string;
    Content?: string;
    Description?: string;
    FeaturedImage?: Record<string, unknown>;
    PublishedDate?: string;
    Author?: Record<string, unknown>;
    Categories?: {
      data?: Array<{ id: number; attributes: Record<string, unknown> }>;
    };
    Tags?: {
      data?: Array<{ id: number; attributes: Record<string, unknown> }>;
    };
    PostStatus?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  };
}

interface StrapiCategory {
  id: number;
  attributes: {
    name?: string;
    slug?: string;
    description?: string;
  };
}

// 서버 컴포넌트에서 사용할 함수
export async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      // 캐시 전략: 항상 최신 데이터 우선, 캐시된 데이터는 백그라운드에서 업데이트
      cache: "no-store",
      next: {
        tags: ["posts"] // 이 태그를 사용하여 필요할 때 캐시 무효화 가능
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data = (await response.json()) as StrapiResponse<StrapiPost[]>;

    // 데이터 구조 확인 및 안전한 매핑
    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected API response structure:", data);
      return [];
    }

    return data.data.map(post => {
      // attributes가 없는 경우를 처리
      const attributes = post.attributes || {};

      // Categories와 Tags 데이터 추출
      const categoriesData = attributes.Categories?.data || [];
      const tagsData = attributes.Tags?.data || [];

      return {
        id: post.id,
        title: attributes.Title || "",
        slug: attributes.Slug || "",
        content: attributes.Content || "",
        description: attributes.Description || "",
        featuredImage: attributes.FeaturedImage,
        publishedDate: attributes.PublishedDate || "",
        author: attributes.Author,
        categories: categoriesData,
        tags: tagsData,
        postStatus: attributes.PostStatus || "",
        createdAt: attributes.createdAt || "",
        updatedAt: attributes.updatedAt || "",
        publishedAt: attributes.publishedAt || ""
      };
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// 클라이언트 컴포넌트에서 사용할 함수
export async function fetchPostsClient(): Promise<Post[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      // 클라이언트에서는 캐시 사용 안 함
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data = (await response.json()) as StrapiResponse<StrapiPost[]>;

    // 데이터 구조 확인 및 안전한 매핑
    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected API response structure:", data);
      return [];
    }

    return data.data.map(post => {
      // attributes가 없는 경우를 처리
      const attributes = post.attributes || {};

      // Categories와 Tags 데이터 추출
      const categoriesData = attributes.Categories?.data || [];
      const tagsData = attributes.Tags?.data || [];

      return {
        id: post.id,
        title: attributes.Title || "",
        slug: attributes.Slug || "",
        content: attributes.Content || "",
        description: attributes.Description || "",
        featuredImage: attributes.FeaturedImage,
        publishedDate: attributes.PublishedDate || "",
        author: attributes.Author,
        categories: categoriesData,
        tags: tagsData,
        postStatus: attributes.PostStatus || "",
        createdAt: attributes.createdAt || "",
        updatedAt: attributes.updatedAt || "",
        publishedAt: attributes.publishedAt || ""
      };
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// 서버 컴포넌트에서 사용할 함수
export async function fetchPostById(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      cache: "no-store",
      next: {
        tags: [`post-${id}`] // 개별 포스트에 대한 태그
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const data = (await response.json()) as StrapiResponse<StrapiPost>;

    // 데이터 구조 확인
    if (!data.data) {
      console.error("Unexpected API response structure:", data);
      return null;
    }

    const post = data.data;
    const attributes = post.attributes || {};

    // Categories와 Tags 데이터 추출
    const categoriesData = attributes.Categories?.data || [];
    const tagsData = attributes.Tags?.data || [];

    return {
      id: post.id,
      title: attributes.Title || "",
      slug: attributes.Slug || "",
      content: attributes.Content || "",
      description: attributes.Description || "",
      featuredImage: attributes.FeaturedImage,
      publishedDate: attributes.PublishedDate || "",
      author: attributes.Author,
      categories: categoriesData,
      tags: tagsData,
      postStatus: attributes.PostStatus || "",
      createdAt: attributes.createdAt || "",
      updatedAt: attributes.updatedAt || "",
      publishedAt: attributes.publishedAt || ""
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// 클라이언트 컴포넌트에서 사용할 함수
export async function fetchPostByIdClient(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const data = (await response.json()) as StrapiResponse<StrapiPost>;

    // 데이터 구조 확인
    if (!data.data) {
      console.error("Unexpected API response structure:", data);
      return null;
    }

    const post = data.data;
    const attributes = post.attributes || {};

    // Categories와 Tags 데이터 추출
    const categoriesData = attributes.Categories?.data || [];
    const tagsData = attributes.Tags?.data || [];

    return {
      id: post.id,
      title: attributes.Title || "",
      slug: attributes.Slug || "",
      content: attributes.Content || "",
      description: attributes.Description || "",
      featuredImage: attributes.FeaturedImage,
      publishedDate: attributes.PublishedDate || "",
      author: attributes.Author,
      categories: categoriesData,
      tags: tagsData,
      postStatus: attributes.PostStatus || "",
      createdAt: attributes.createdAt || "",
      updatedAt: attributes.updatedAt || "",
      publishedAt: attributes.publishedAt || ""
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// 카테고리 데이터 가져오기
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      cache: "no-store",
      next: {
        tags: ["categories"]
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const data = (await response.json()) as StrapiResponse<StrapiCategory[]>;

    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected API response structure:", data);
      return [];
    }

    return data.data.map(category => {
      const attributes = category.attributes || {};
      return {
        id: category.id,
        name: attributes.name || "",
        slug: attributes.slug || "",
        description: attributes.description
      };
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
