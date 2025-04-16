// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

// 디버깅: API URL 출력

// 타입 정의
export interface FeaturedImage {
  url: string;
  width?: number;
  height?: number;
  alternativeText?: string;
  caption?: string;
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
  author?: Record<string, unknown>;
  categories: Array<Record<string, unknown>>;
  tags: Array<Record<string, unknown>>;
  postStatus: string | null;
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

// 서버 컴포넌트에서 사용할 함수
export async function fetchPosts(): Promise<Post[]> {
  try {
    console.log("🔍 fetchPosts - 요청 시작:", `${API_BASE_URL}/posts`);
    console.time("fetchPosts");

    const response = await fetch(`${API_BASE_URL}/posts`, {
      // 캐시 전략: 항상 최신 데이터 우선, 캐시된 데이터는 백그라운드에서 업데이트
      cache: "no-store",
      next: {
        tags: ["posts"] // 이 태그를 사용하여 필요할 때 캐시 무효화 가능
      }
    });

    console.log("🔍 fetchPosts - 응답 상태:", response.status, response.statusText);
    console.timeLog("fetchPosts", "- 응답 수신");

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data = (await response.json()) as StrapiResponse<Post[]>;

    // 원시 데이터 확인
    // console.log("🔍 API 원시 응답 데이터:", JSON.stringify(data, null, 2));

    // console.log("🔍 fetchPosts - 데이터 구조:", {
    //   hasData: !!data.data,
    //   isArray: Array.isArray(data.data),
    //   count: data.data ? data.data.length : 0,
    //   pagination: data.meta?.pagination
    // });
    // console.timeLog("fetchPosts", "- 데이터 파싱");

    // 데이터 구조 확인 및 안전한 매핑
    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected API response structure:", data);
      return [];
    }

    // 이제 데이터는 이미 올바른 형식이므로 추가 변환이 필요 없음
    const posts = data.data;

    // console.log("🔍 fetchPosts - 포스트 목록:", posts);
    console.timeEnd("fetchPosts");
    return posts;
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    console.timeEnd("fetchPosts");
    return [];
  }
}

// 클라이언트 컴포넌트에서 사용할 함수
export async function fetchPostsClient(): Promise<Post[]> {
  try {
    console.log("🔍 fetchPostsClient - 요청 시작:", `${API_BASE_URL}/posts`);

    const response = await fetch(`${API_BASE_URL}/posts`, {
      // 클라이언트에서는 캐시 사용 안 함
      cache: "no-store"
    });

    console.log("🔍 fetchPostsClient - 응답 상태:", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data = (await response.json()) as StrapiResponse<Post[]>;
    console.log("🔍 fetchPostsClient - 데이터 구조:", {
      hasData: !!data.data,
      isArray: Array.isArray(data.data),
      count: data.data ? data.data.length : 0
    });

    // 데이터 구조 확인 및 안전한 매핑
    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected API response structure:", data);
      return [];
    }

    // 이제 데이터는 이미 올바른 형식이므로 추가 변환이 필요 없음
    const posts = data.data;

    console.log("🔍 fetchPostsClient - 포스트 목록:", posts);
    return posts;
  } catch (error) {
    console.error("❌ Error fetching posts in client:", error);
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

    const data = (await response.json()) as StrapiResponse<Post>;

    // 데이터 구조 확인
    if (!data.data) {
      console.error("Unexpected API response structure:", data);
      return null;
    }

    // 이제 데이터는 이미 올바른 형식이므로 추가 변환이 필요 없음
    return data.data;
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

    const data = (await response.json()) as StrapiResponse<Post>;

    // 데이터 구조 확인
    if (!data.data) {
      console.error("Unexpected API response structure:", data);
      return null;
    }

    // 이제 데이터는 이미 올바른 형식이므로 추가 변환이 필요 없음
    return data.data;
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

    const data = (await response.json()) as StrapiResponse<Category[]>;

    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected API response structure:", data);
      return [];
    }

    // 이제 데이터는 이미 올바른 형식이므로 추가 변환이 필요 없음
    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
