import { Metadata } from "next";
import PostPage from "@/components/pages/PostPage";
import { generatePostMetadata } from "@/components/pages/PostPage";
import { getAllPosts } from "@/lib/mdx";

export const revalidate = 300;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts("ko");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generatePostMetadata(slug, "ko");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <PostPage slug={slug} locale="ko" />;
}
