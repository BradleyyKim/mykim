import { fetchPaginatedPosts } from "@/lib/api";
import { extractPlainText } from "@/lib/tiptap-renderer";

export async function GET() {
  try {
    // 최신 포스트 50개 가져오기
    const { data: posts } = await fetchPaginatedPosts(1, 50);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const currentDate = new Date().toUTCString();

    const rssItems = posts
      .map(post => {
        const postUrl = `${siteUrl}/posts/${post.slug}`;
        const publishedDate = new Date(post.publishedDate || post.createdAt).toUTCString();

        // Tiptap JSON 콘텐츠를 플레인 텍스트로 변환하여 description 생성
        const description = post.description || extractPlainText(post.content, 200);

        return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <description><![CDATA[${description}]]></description>
          <link>${postUrl}</link>
          <guid isPermaLink="true">${postUrl}</guid>
          <pubDate>${publishedDate}</pubDate>
          ${post.category && typeof post.category === "object" && "name" in post.category ? `<category><![CDATA[${post.category.name}]]></category>` : ""}
        </item>
      `.trim();
      })
      .join("\n");

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[MYKim Blog]]></title>
    <description><![CDATA[프로그래밍, 웹 개발, 그리고 더 많은 주제에 대한 블로그]]></description>
    <link>${siteUrl}</link>
    <language>ko-KR</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <generator>Next.js</generator>
    <webMaster>mykim@example.com (MYKim)</webMaster>
    <managingEditor>mykim@example.com (MYKim)</managingEditor>
    <copyright>Copyright ${new Date().getFullYear()} MYKim. All rights reserved.</copyright>
    <ttl>60</ttl>
${rssItems}
  </channel>
</rss>`;

    return new Response(rssXml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600" // 20분 캐시
      }
    });
  } catch (error) {
    console.error("RSS 생성 중 오류:", error);
    return new Response("RSS 피드를 생성할 수 없습니다.", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  }
}
