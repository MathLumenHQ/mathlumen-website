import { db } from "@/lib/db";
import { articles, authors } from "@/schema/tables";
import { eq, desc, asc, and, sql, ilike, ne } from "drizzle-orm";
import type { ArticleQueryParams, ArticleWithAuthor, PaginatedResponse } from "@/schema/types";

/**
 * Fetch a paginated list of published articles with optional filters.
 */
export async function getArticles(
  params: ArticleQueryParams = {}
): Promise<PaginatedResponse<ArticleWithAuthor>> {
  const {
    category,
    limit = 12,
    offset = 0,
    featured,
    sort = "newest",
  } = params;

  try {
    const conditions = [eq(articles.isPublished, true)];

    if (category) {
      conditions.push(eq(articles.category, category));
    }

    if (featured !== undefined) {
      conditions.push(eq(articles.featured, featured));
    }

    const orderBy =
      sort === "oldest"
        ? asc(articles.publishedAt)
        : sort === "popular"
          ? desc(articles.viewCount)
          : desc(articles.publishedAt);

    const whereClause = and(...conditions);

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(articles)
        .innerJoin(authors, eq(articles.authorId, authors.id))
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(articles)
        .where(whereClause),
    ]);

    const total = countResult[0]?.count ?? 0;

    const mapped: ArticleWithAuthor[] = data.map((row) => ({
      ...row.articles,
      author: row.authors,
    }));

    return {
      data: mapped,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch articles: ${message}`);
  }
}

/**
 * Fetch a single published article by its URL slug, including author data.
 */
export async function getArticleBySlug(slug: string): Promise<ArticleWithAuthor | null> {
  try {
    const result = await db
      .select()
      .from(articles)
      .innerJoin(authors, eq(articles.authorId, authors.id))
      .where(and(eq(articles.slug, slug), eq(articles.isPublished, true)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return {
      ...result[0].articles,
      author: result[0].authors,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch article "${slug}": ${message}`);
  }
}

/**
 * Fetch related articles by the same category, excluding the current article.
 */
export async function getRelatedArticles(
  articleId: string,
  category: string,
  limit: number = 3
): Promise<ArticleWithAuthor[]> {
  try {
    const result = await db
      .select()
      .from(articles)
      .innerJoin(authors, eq(articles.authorId, authors.id))
      .where(
        and(
          eq(articles.isPublished, true),
          eq(articles.category, category as "history" | "research" | "applied" | "ai-ml" | "essay" | "news"),
          ne(articles.id, articleId)
        )
      )
      .orderBy(desc(articles.publishedAt))
      .limit(limit);

    return result.map((row) => ({
      ...row.articles,
      author: row.authors,
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch related articles: ${message}`);
  }
}

/**
 * Increment the view count for an article by its ID.
 */
export async function incrementViewCount(articleId: string): Promise<void> {
  try {
    await db
      .update(articles)
      .set({ viewCount: sql`${articles.viewCount} + 1` })
      .where(eq(articles.id, articleId));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to increment view count for "${articleId}": ${message}`);
  }
}

/**
 * Full-text search across articles using PostgreSQL tsvector.
 * Falls back to ILIKE title search if tsvector returns no results.
 */
export async function searchArticles(
  query: string,
  limit: number = 20
): Promise<ArticleWithAuthor[]> {
  try {
    const trimmed = query.trim();
    const tsQuery = trimmed
      .split(/\s+/)
      .filter(Boolean)
      .join(" & ");

    // Primary: tsvector full-text search
    const result = await db
      .select()
      .from(articles)
      .innerJoin(authors, eq(articles.authorId, authors.id))
      .where(
        and(
          eq(articles.isPublished, true),
          sql`${articles.searchVector} @@ to_tsquery('english', ${tsQuery})`
        )
      )
      .orderBy(
        sql`ts_rank(${articles.searchVector}, to_tsquery('english', ${tsQuery})) DESC`
      )
      .limit(limit);

    if (result.length > 0) {
      return result.map((row) => ({
        ...row.articles,
        author: row.authors,
      }));
    }

    // Fallback: ILIKE title search
    const fallback = await db
      .select()
      .from(articles)
      .innerJoin(authors, eq(articles.authorId, authors.id))
      .where(
        and(
          eq(articles.isPublished, true),
          ilike(articles.title, `%${trimmed}%`)
        )
      )
      .orderBy(desc(articles.publishedAt))
      .limit(limit);

    return fallback.map((row) => ({
      ...row.articles,
      author: row.authors,
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Search failed: ${message}`);
  }
}
