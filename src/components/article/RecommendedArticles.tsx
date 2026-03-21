import { getRelatedArticles } from "@/lib/queries/articles";
import { getArticles } from "@/lib/queries/articles";
import { ArticleCard } from "@/components/article/ArticleCard";

interface RecommendedArticlesProps {
  articleId: string;
  category: string;
}

/**
 * "You Might Like" — related articles in the same category.
 * Falls back to featured articles when fewer than 3 related exist.
 * Async server component — safe to use inside Suspense.
 */
export async function RecommendedArticles({
  articleId,
  category,
}: RecommendedArticlesProps) {
  let articles = await getRelatedArticles(articleId, category, 3);

  // Fallback: pad with featured articles if needed
  if (articles.length < 3) {
    try {
      const { data: featured } = await getArticles({ featured: true, limit: 6 });
      const seen = new Set(articles.map((a) => a.id));
      seen.add(articleId);
      for (const a of featured) {
        if (!seen.has(a.id)) {
          articles = [...articles, a];
          seen.add(a.id);
        }
        if (articles.length >= 3) break;
      }
    } catch {
      // best-effort; show whatever related we found
    }
  }

  if (articles.length === 0) return null;

  return (
    <section className="lg:hidden max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-gold/[0.18]">
      <h2 className="font-display text-2xl font-bold text-paper mb-8">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
