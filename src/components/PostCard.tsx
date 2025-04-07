"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/api";
import { Heart, MessageCircle, Share, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// 태그 및 카테고리 타입
interface TagAttribute {
  name?: string;
  [key: string]: any;
}

interface Tag {
  id?: number;
  attributes?: TagAttribute;
}

interface CategoryAttribute {
  name?: string;
  [key: string]: any;
}

interface Category {
  id?: number;
  attributes?: CategoryAttribute;
}

export default function PostCard({ post }: { post: Post }) {
  const [likes, setLikes] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // 읽기 시간 계산 (대략 1분에 200단어)
  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));
    return readTimeMinutes;
  };

  // 태그 추출
  const tags = post.tags ? (post.tags as Tag[]).map(tag => tag.attributes?.name || "").filter(Boolean) : [];

  // 카테고리 추출
  const category = post.categories && post.categories.length > 0 ? (post.categories as Category[])[0]?.attributes?.name : "일반";

  const readTime = calculateReadTime(post.content);

  return (
    <Card
      className={`h-full flex flex-col overflow-hidden transition-all duration-300 ${isHovered ? "shadow-lg transform translate-y-[-5px]" : "shadow-sm"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        {category && (
          <div className="mb-2">
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100">
              {category}
            </Badge>
          </div>
        )}
        <Link href={`/post/${post.id}`}>
          <CardTitle className={`text-xl font-bold line-clamp-2 transition-colors duration-300 ${isHovered ? "text-amber-700" : "text-amber-900"}`}>{post.title}</CardTitle>
        </Link>
        <CardDescription className="text-sm flex items-center justify-between mt-2">
          <span>{formatDate(post.publishedDate || post.publishedAt)}</span>
          <span className="flex items-center gap-1 text-amber-600">
            <Clock size={14} />
            {readTime}분 소요
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm line-clamp-3 text-gray-600">{post.description || post.content.substring(0, 150)}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.slice(0, 3).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs bg-amber-50 text-amber-600 hover:bg-amber-100">
                #{tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-3">
        <div className="flex gap-2 text-sm text-gray-500">
          <Button variant="ghost" size="sm" onClick={handleLike} className={`flex items-center gap-1 transition-colors ${likes > 0 ? "text-red-500" : "hover:text-red-500"}`}>
            <Heart size={16} className={likes > 0 ? "fill-current" : ""} />
            {likes}
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-blue-500">
            <MessageCircle size={16} />
            댓글
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-green-500">
            <Share size={16} />
            공유
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
