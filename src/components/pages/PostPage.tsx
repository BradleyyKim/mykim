import { Metadata } from "next";
import PostDetail from "@/components/blog/PostDetail";
import { NotFound as PostNotFound } from "@/components/ui";
import { getPostBySlug } from "@/lib/cms";
import { extractPlainText, extractFirstImageFromContent } from "@/lib/content";
import { MAIN } from "@/lib/constants";
import type { Locale } from "@/i18n";
import { getLocalePath } from "@/i18n";

interface PostPageProps {
  slug: string;
  locale: Locale;
}

// Thumbnail image URL generation
function getThumbnailImage(post: { featuredImage?: { url?: string } | null; content: string | object }): string {
  if (post.featuredImage?.url) {
    return post.featuredImage.url;
  }
  const firstImage = extractFirstImageFromContent(post.content);
  if (firstImage) {
    return firstImage;
  }
  return MAIN.image;
}

// Structured data generation
function generateStructuredData(post: {
  title: string;
  description?: string | null;
  content: string | object;
  publishedDate?: string | null;
  updatedAt?: string;
  slug: string;
  featuredImage?: { url?: string } | null;
}) {
  const thumbnailImage = getThumbnailImage(post);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || extractPlainText(post.content, 160),
    image: thumbnailImage,
    datePublished: post.publishedDate || undefined,
    dateModified: post.updatedAt || undefined,
    author: {
      "@type": "Person",
      name: MAIN.author,
      url: MAIN.url
    },
    publisher: {
      "@type": "Organization",
      name: MAIN.title,
      logo: {
        "@type": "ImageObject",
        url: MAIN.image
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${MAIN.url}/posts/${post.slug}`
    }
  };
}

// Metadata generation helper
export async function generatePostMetadata(slug: string, locale: Locale): Promise<Metadata> {
  try {
    const post = await getPostBySlug(slug, locale);

    if (!post) {
      return {
        title: locale === "en" ? "Post not found" : "포스트를 찾을 수 없습니다",
        description: locale === "en" ? "The requested post could not be found." : "요청하신 포스트를 찾을 수 없습니다."
      };
    }

    const description = post.description || extractPlainText(post.content, 160);
    const thumbnailImage = getThumbnailImage(post);

    return {
      title: post.title,
      description,
      openGraph: {
        title: post.title,
        description,
        type: "article",
        locale: locale === "en" ? "en_US" : "ko_KR",
        publishedTime: post.publishedDate || undefined,
        modifiedTime: post.updatedAt || undefined,
        authors: [MAIN.author],
        images: [
          {
            url: thumbnailImage,
            width: 1200,
            height: 630,
            alt: post.title
          }
        ],
        url: `${MAIN.url}${getLocalePath(locale, `/posts/${post.slug}`)}`
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: [thumbnailImage],
        creator: MAIN.twitter
      },
      alternates: {
        canonical: `${MAIN.url}${getLocalePath(locale, `/posts/${post.slug}`)}`,
        languages: {
          "ko": `${MAIN.url}/posts/${post.slug}`,
          "en": `${MAIN.url}/en/posts/${post.slug}`
        }
      }
    };
  } catch (error) {
    console.warn(`Metadata generation failed for slug: ${slug}`, error);
    return {
      title: `Post: ${slug}`,
      description: "Blog post content"
    };
  }
}

export default async function PostPage({ slug, locale }: PostPageProps) {
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    return <PostNotFound />;
  }

  const structuredData = generateStructuredData(post);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <PostDetail post={post} locale={locale} />
    </>
  );
}
