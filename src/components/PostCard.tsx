"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/api";
import { Heart, MessageCircle, Share, Clock, ChevronRight, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// 태그 및 카테고리 타입
interface TagAttribute {
  name?: string;
  slug?: string;
  [key: string]: unknown;
}

interface Tag {
  id?: number;
  attributes?: TagAttribute;
}

interface PostCardProps {
  post: Post;
  onTagClick?: (tag: string) => void;
}

export default function PostCard({ post, onTagClick }: PostCardProps) {
  const [likes, setLikes] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onTagClick) {
      console.log("태그 클릭 이벤트:", tag);
      onTagClick(tag);
    }
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
  const tags = post.tags
    ? (post.tags as Tag[])
        .map(tag => ({
          name: tag.attributes?.name || "",
          slug: tag.attributes?.slug || ""
        }))
        .filter(tag => tag.name)
    : [];

  const readTime = calculateReadTime(post.content);

  // 내용 미리보기 생성
  const createContentPreview = (content: string) => {
    const preview = post.description || content.substring(0, 200);
    if (preview.length < content.length) {
      return preview + "...";
    }
    return preview;
  };

  return (
    <Card
      className={`h-full flex flex-col overflow-hidden transition-all duration-300 ${isHovered ? "shadow-lg transform translate-y-[-5px]" : "shadow-sm"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/?category=${post.category}`} className="inline-block">
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer">
              {post.category}
            </Badge>
          </Link>
          <Button variant="ghost" size="icon" className={`h-8 w-8 ${isBookmarked ? "text-amber-500" : "text-gray-400"}`} onClick={handleBookmark}>
            <Bookmark size={16} className={isBookmarked ? "fill-current" : ""} />
          </Button>
        </div>
        <Link href={`/post/${post.id}`} className="group">
          <CardTitle className={`text-xl font-bold transition-colors duration-300 ${isHovered ? "text-amber-700" : "text-amber-900"}`}>
            {post.title.length > 60 ? post.title.substring(0, 60) + "..." : post.title}
          </CardTitle>
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
        <div className="space-y-2">
          <p className="text-sm text-gray-600 mb-2 line-clamp-3">{createContentPreview(post.content)}</p>
          <Link href={`/post/${post.id}`} className="inline-flex items-center text-xs text-amber-600 hover:text-amber-700 transition-colors group">
            <span>더 읽기</span>
            <ChevronRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-amber-50 text-amber-600 hover:bg-amber-100 cursor-pointer" onClick={e => handleTagClick(tag.slug, e)}>
                #{tag.name}
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
