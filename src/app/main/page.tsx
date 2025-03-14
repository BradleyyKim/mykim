"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { posts } from "@/lib/data";
// import { useEffect, useState } from "react";

// interface Post {
//   id: number;
//   title: string;
//   content: string;
// }

export default function Main() {
  // const [posts, setPosts] = useState<Post[]>([]);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
  //     const data = await response.json();
  //     setPosts(data.data);
  //   };

  //   fetchPosts();
  // }, []);

  return (
    <div className="bg-amber-50 min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6 text-amber-900">블로그 포스트</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map(post => (
          <Button key={post.id} variant="ghost" className="p-0 h-auto block w-full hover:scale-105 transition-transform duration-200">
            <Card className="h-full w-full border-amber-200 shadow-md hover:shadow-lg">
              <CardHeader className="bg-amber-100 rounded-t-lg">
                <CardTitle className="text-amber-900">{post.title}</CardTitle>
                <CardDescription className="text-amber-700">{post.date}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-amber-800">{post.content}</p>
              </CardContent>
              <CardFooter className="bg-amber-50">
                <p className="text-amber-600 text-sm">Read more</p>
              </CardFooter>
            </Card>
          </Button>
        ))}
      </div>
    </div>
  );
}
