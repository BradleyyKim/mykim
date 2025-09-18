import { Metadata } from "next";
import { fetchTags } from "@/lib/api";
import TagsPageClient from "@/components/layout/TagsPageClient";
import { getRevalidateTime } from "@/lib/cache/revalidate-config";

// ISR 설정 - 중앙화된 설정 사용
export const revalidate = getRevalidateTime("TAGS");

export const metadata: Metadata = {
  title: "Tags | MyKim",
  description: "모든 태그를 확인하고 관련 포스트를 찾아보세요.",
  openGraph: {
    title: "Tags | MyKim",
    description: "모든 태그를 확인하고 관련 포스트를 찾아보세요.",
    type: "website"
  }
};

export default async function TagsPage() {
  const tags = await fetchTags();

  return <TagsPageClient tags={tags} />;
}
