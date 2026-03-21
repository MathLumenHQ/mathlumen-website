import { db } from "@/lib/db";
import { articles } from "@/schema/tables";
import { eq, ne, and, desc, sql } from "drizzle-orm";

export interface InternalLink {
  slug: string;
  title: string;
  category: string;
}

/**
 * Return up to 3 internal link suggestions for the "Also on MathLumen" block:
 *   1. A different article in the same category  (reinforces topical depth)
 *   2. An article sharing a tag                  (semantic cross-linking)
 *   3. An article from a different category      (cross-pollination / discovery)
 *
 * Results are de-duplicated and never include the current article.
 */
export async function getInternalLinks(
  currentSlug: string,
  category: string,
  tags: string[]
): Promise<InternalLink[]> {
  const results: InternalLink[] = [];
  const usedSlugs: string[] = [currentSlug];

  const cat = category as
    | "history"
    | "research"
    | "applied"
    | "ai-ml"
    | "essay";

  try {
    // ── 1. Same category ──────────────────────────────────────────────────
    const [sameCategory] = await db
      .select({
        slug: articles.slug,
        title: articles.title,
        category: articles.category,
      })
      .from(articles)
      .where(
        and(
          eq(articles.isPublished, true),
          eq(articles.category, cat),
          ne(articles.slug, currentSlug)
        )
      )
      .orderBy(desc(articles.publishedAt))
      .limit(1);

    if (sameCategory) {
      results.push(sameCategory);
      usedSlugs.push(sameCategory.slug);
    }

    // ── 2. Shares a tag ───────────────────────────────────────────────────
    if (tags.length > 0) {
      const tagOverlap = sql`${articles.tags} && ARRAY[${sql.join(
        tags.map((t) => sql`${t}`),
        sql`, `
      )}]::text[]`;

      const excludeConditions = usedSlugs.map((s) => ne(articles.slug, s));
      const [sharedTag] = await db
        .select({
          slug: articles.slug,
          title: articles.title,
          category: articles.category,
        })
        .from(articles)
        .where(and(eq(articles.isPublished, true), ...excludeConditions, tagOverlap))
        .orderBy(desc(articles.publishedAt))
        .limit(1);

      if (sharedTag) {
        results.push(sharedTag);
        usedSlugs.push(sharedTag.slug);
      }
    }

    // ── 3. Cross-category ─────────────────────────────────────────────────
    const excludeConditions = usedSlugs.map((s) => ne(articles.slug, s));
    const [crossCategory] = await db
      .select({
        slug: articles.slug,
        title: articles.title,
        category: articles.category,
      })
      .from(articles)
      .where(
        and(
          eq(articles.isPublished, true),
          ne(articles.category, cat),
          ...excludeConditions
        )
      )
      .orderBy(desc(articles.publishedAt))
      .limit(1);

    if (crossCategory) results.push(crossCategory);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown";
    console.error(`getInternalLinks failed: ${message}`);
  }

  return results;
}
