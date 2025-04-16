import { fetchPosts } from "@/lib/api";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function Home() {
  // 서버 컴포넌트에서 데이터 가져오기
  const posts = await fetchPosts();
  console.log("posts", posts);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="w-full max-w-xl">
          <SearchBar />
        </div>
        <Link href="/write">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            글쓰기
          </Button>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">최근 포스트</h2>

      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">아직 작성된 포스트가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
