import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/queries/articles";
import { getAllAuthors } from "@/lib/queries/authors";
import { getPowIssueHref, getPublishedPowIssues } from "@/lib/queries/pow";
import { SITE_URL, CATEGORIES } from "@/lib/constants";

/**
 * Generate a dynamic sitemap for search engine indexing.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articlesResult, authors, powIssues] = await Promise.all([
    getArticles({ limit: 1000 }),
    getAllAuthors(),
    getPublishedPowIssues({ limit: 1000 }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/articles`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/authors`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/newsletter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/archive`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/pow`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
    { url: `${SITE_URL}/pow/latest`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/pow/archive`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/topics`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/category/${cat.value}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = articlesResult.data.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const authorPages: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${SITE_URL}/authors/${author.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const powPages: MetadataRoute.Sitemap = powIssues.map((issue) => ({
    url: `${SITE_URL}${getPowIssueHref(issue.publicId)}`,
    lastModified: issue.updatedAt ? new Date(issue.updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...articlePages, ...authorPages, ...powPages];
}
