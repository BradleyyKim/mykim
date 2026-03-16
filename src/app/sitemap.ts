import { fetchPaginatedPosts } from "@/lib/api";
import { MAIN } from "@/lib/constants";

export default async function sitemap() {
  const { data: posts } = await fetchPaginatedPosts(1, 1000);

  const postUrls = posts.flatMap(post => [
    {
      url: `${MAIN.url}/posts/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    {
      url: `${MAIN.url}/en/posts/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }
  ]);

  const staticUrls = [
    {
      url: MAIN.url,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0
    },
    {
      url: `${MAIN.url}/en`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9
    },
    {
      url: `${MAIN.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7
    },
    {
      url: `${MAIN.url}/en/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6
    },
    {
      url: `${MAIN.url}/career`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7
    },
    {
      url: `${MAIN.url}/en/career`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6
    }
  ];

  return [...staticUrls, ...postUrls];
}
