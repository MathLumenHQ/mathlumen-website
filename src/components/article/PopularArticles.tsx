import Link from "next/link";
import { getArticles } from "@/lib/queries/articles";
import { Badge } from "@/components/ui/Badge";
import type { Category } from "@/schema/types";

interface PopularArticlesProps {
  /**
   * "list"   — vertical numbered list, for sidebar (default)
   * "scroll" — horizontal scroll row, for mobile breakpoints
   */
  variant?: "list" | "scroll";
}

/**
 * Top 5 articles sorted by view count.
 * Async server component — safe to use inside Suspense.
 */
export async function PopularArticles({ variant = "list" }: PopularArticlesProps) {
  let articles: Awaited<ReturnType<typeof getArticles>>["data"] = [];

  try {
    const result = await getArticles({ sort: "popular", limit: 5 });
    articles = result.data;
  } catch {
    return null;
  }

  if (articles.length === 0) return null;

  /* ── Horizontal scroll variant (mobile) ──────────────────────── */
  if (variant === "scroll") {
    return (
      <div>
        <h2 className="font-display text-xl font-bold text-paper mb-4">
          Popular This Week
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {articles.map((article, idx) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group shrink-0 w-52 border border-gold/[0.18] p-4 hover:border-gold/40 transition-colors duration-200"
            >
              <span className="block font-mono text-gold text-xs mb-2">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <Badge category={article.category as Category} size="sm" className="mb-2">
                {article.category}
              </Badge>
              <h3 className="font-display text-sm font-semibold text-paper line-clamp-3 leading-snug group-hover:text-gold-light transition-colors duration-200">
                {article.title}
              </h3>
              {article.viewCount !== null && article.viewCount > 0 && (
                <p className="mt-2 text-xs text-muted font-mono">
                  {article.viewCount.toLocaleString()} views
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  /* ── Vertical list variant (sidebar) ─────────────────────────── */
  return (
    <div>
      <h3 className="font-display text-sm font-semibold text-gold-light uppercase tracking-wider mb-4">
        Popular This Week
      </h3>
      <ol className="space-y-3">
        {articles.map((article, idx) => (
          <li key={article.id} className="flex gap-3 group">
            <span className="font-mono text-gold text-sm shrink-0 pt-0.5 w-5 text-right">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <Link
              href={`/articles/${article.slug}`}
              className="text-sm font-display text-paper line-clamp-2 leading-snug group-hover:text-gold-light transition-colors duration-200"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
