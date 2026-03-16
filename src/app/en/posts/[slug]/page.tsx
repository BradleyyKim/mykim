import { Metadata } from "next";
import PostPage from "@/components/pages/PostPage";
import { generatePostMetadata } from "@/components/pages/PostPage";

export const revalidate = 300;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generatePostMetadata(slug, "en");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <PostPage slug={slug} locale="en" />;
}
