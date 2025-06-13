import { fetchPaginatedPosts } from "@/lib/api";
import { MAIN } from "@/lib/constants";

export default async function sitemap() {
  const { data: posts } = await fetchPaginatedPosts(1, 1000);

  const postUrls = posts.map(post => ({
    url: `${MAIN.url}/posts/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  const staticUrls = [
    {
      url: MAIN.url,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0
    },
    {
      url: `${MAIN.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7
    },
    {
      url: `${MAIN.url}/career`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7
    }
  ];

  return [...staticUrls, ...postUrls];
}
