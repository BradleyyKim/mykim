import { Metadata } from "next";
import { fetchTags } from "@/lib/api";
import TagsPageClient from "@/components/layout/TagsPageClient";

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
