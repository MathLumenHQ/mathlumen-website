import { NextResponse } from "next/server";
import { getArticles } from "@/lib/queries/articles";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";

/**
 * GET /api/rss
 * Generate an RSS 2.0 feed of the latest published articles.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const { data: articles } = await getArticles({ limit: 50, sort: "newest" });

    const items = articles
      .map(
        (article) => `    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${SITE_URL}/articles/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/articles/${article.slug}</guid>
      <description><![CDATA[${article.excerpt}]]></description>
      <author>${article.author.name}</author>
      <category>${article.category}</category>
      <pubDate>${article.publishedAt ? new Date(article.publishedAt).toUTCString() : ""}</pubDate>
    </item>`
      )
      .join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate RSS feed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
