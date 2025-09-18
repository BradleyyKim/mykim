/**
 * 통합 Post 관련 타입 정의
 * 모든 Post 관련 타입을 중앙에서 관리
 */

// 1. 기본 엔티티 타입들
export interface Tag {
  id: number;
  name: string;
  slug?: string; // 선택적, 향후 확장용
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface FeaturedImage {
  url: string;
  width?: number;
  height?: number;
  alternativeText?: string;
  caption?: string;
}

// 2. 핵심 Post 타입 (통합)
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
  category: Category | null;
}

// 3. API 요청/응답용 타입들
export interface PostCreateRequest {
  title: string;
  content: string;
  slug: string;
  description?: string;
  publishedDate?: string;
  category: number; // ID만 전송
  featuredImage?: FeaturedImage;
  tags?: string[]; // 이름 배열로 전송
}

export interface PostUpdateRequest {
  title: string;
  content: string;
  description?: string;
  publishedDate?: string;
  slug?: string;
  category?: number;
  featuredImage?: FeaturedImage;
  tags?: number[]; // ID 배열로 전송
}

// 4. 폼용 타입들
export interface PostFormData {
  title: string;
  content: string;
  category: string; // 카테고리 이름
  description?: string;
  publishedDate?: string;
  slug: string;
  tags?: string[]; // 태그 이름 배열
}

// 5. 페이지별 특화 타입들
export interface PostListItem {
  id: number;
  title: string;
  slug: string;
  publishedDate: string;
  createdAt: string;
  category: Category | null;
  tags: Tag[];
}

export interface PostsByYear {
  [year: string]: {
    posts: PostListItem[];
    totalCount: number;
  };
}

// 6. 컴포넌트 Props 타입들
export interface PostDetailProps {
  post: Post;
  categoryName?: string | null;
  categorySlug?: string | null;
}

export interface PostFormProps {
  initialData?: Partial<PostFormData>;
  onSubmit: (
    data: PostFormData & {
      featuredImage?: FeaturedImage | null;
    }
  ) => Promise<void>;
  submitText: string;
  title: string;
}

// 7. API 응답 타입들
export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

// 8. Strapi 응답 타입 (내부용)
export interface StrapiResponse<T> {
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
