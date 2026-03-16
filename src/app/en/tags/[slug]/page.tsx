import { Metadata } from "next";
import TagDetailPage from "@/components/pages/TagDetailPage";
import { generateTagDetailMetadata } from "@/components/pages/TagDetailPage";

export const revalidate = 300;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateTagDetailMetadata(slug, "en");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <TagDetailPage slug={slug} locale="en" />;
}
