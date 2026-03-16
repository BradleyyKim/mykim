import { Metadata } from "next";
import CategoryPage from "@/components/pages/CategoryPage";
import { generateCategoryMetadata } from "@/components/pages/CategoryPage";

export const revalidate = 300;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateCategoryMetadata(slug, "ko");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CategoryPage slug={slug} locale="ko" />;
}
