import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchTagBySlug, fetchPostsByTag } from "@/lib/api";
import TagDetailPageClient from "@/components/layout/TagDetailPageClient";

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await fetchTagBySlug(slug);

  if (!tag) {
    return {
      title: "Tag Not Found | MyKim",
      description: "요청하신 태그를 찾을 수 없습니다."
    };
  }

  return {
    title: `${tag.name} | MyKim`,
    description: `${tag.name} 태그와 관련된 모든 포스트를 확인해보세요.`,
    openGraph: {
      title: `${tag.name} | MyKim`,
      description: `${tag.name} 태그와 관련된 모든 포스트를 확인해보세요.`,
      type: "website"
    }
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const [tag, postsResult] = await Promise.all([fetchTagBySlug(slug), fetchPostsByTag(slug, 1)]);

  if (!tag) {
    notFound();
  }

  return <TagDetailPageClient tag={tag} initialPosts={postsResult} />;
}
