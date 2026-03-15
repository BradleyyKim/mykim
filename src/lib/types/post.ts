// 1. Basic entity types
export interface Tag {
  id: number;
  name: string;
  slug?: string;
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

// 2. Core Post type
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

// 3. Page-specific types
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

// 4. Component Props
export interface PostDetailProps {
  post: Post;
  categoryName?: string | null;
  categorySlug?: string | null;
}

// 5. Pagination
export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}
