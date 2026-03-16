import { Metadata } from "next";
import TagsPage from "@/components/pages/TagsPage";
import { generateTagsMetadata } from "@/components/pages/TagsPage";

export const revalidate = 300;

export const metadata: Metadata = generateTagsMetadata("ko");

export default function Page() {
  return <TagsPage locale="ko" />;
}
