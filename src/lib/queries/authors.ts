import { db } from "@/lib/db";
import { authors, articles } from "@/schema/tables";
import { eq, desc, and } from "drizzle-orm";
import type { Author, ArticleWithAuthor } from "@/schema/types";

/**
 * Fetch all authors, ordered by name.
 */
export async function getAllAuthors(): Promise<Author[]> {
  try {
    return await db
      .select()
      .from(authors)
      .orderBy(authors.name);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch authors: ${message}`);
  }
}

/**
 * Fetch a single author by their URL slug.
 */
export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const result = await db
      .select()
      .from(authors)
      .where(eq(authors.slug, slug))
      .limit(1);

    return result[0] ?? null;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch author "${slug}": ${message}`);
  }
}

/**
 * Fetch published articles by a specific author.
 */
export async function getAuthorArticles(
  authorId: string,
  limit: number = 20,
  offset: number = 0
): Promise<ArticleWithAuthor[]> {
  try {
    const result = await db
      .select()
      .from(articles)
      .innerJoin(authors, eq(articles.authorId, authors.id))
      .where(
        and(
          eq(articles.authorId, authorId),
          eq(articles.isPublished, true)
        )
      )
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);

    return result.map((row) => ({
      ...row.articles,
      author: row.authors,
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch articles for author "${authorId}": ${message}`);
  }
}
