"use client";

import { Button } from "@/components/ui/button";
import PostCard from "./PostCard";
import { Post as PostType } from "@/lib/api";

interface PostListProps {
  posts: PostType[];
  searchQuery?: string;
  isLoading: boolean;
  onClearSearch?: () => void;
}

export default function PostList({ posts, searchQuery = "", isLoading, onClearSearch }: PostListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        {searchQuery ? (
          <div>
            <p className="text-gray-500 mb-4">&lsquo;{searchQuery}&rsquo;에 대한 검색 결과가 없습니다.</p>
            {onClearSearch && (
              <Button variant="outline" onClick={onClearSearch}>
                모든 게시물 보기
              </Button>
            )}
          </div>
        ) : (
          <p className="text-gray-500 mb-4">아직 작성된 포스트가 없습니다.</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
