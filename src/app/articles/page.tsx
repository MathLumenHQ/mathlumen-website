import { Suspense } from "react";
import { getArticles } from "@/lib/queries/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import { CategoryFilter } from "@/components/article/CategoryFilter";
import { Skeleton } from "@/components/ui/Skeleton";
import { createMetadata } from "@/lib/metadata";
import type { Category } from "@/schema/types";

export const metadata = createMetadata({
  title: "Articles",
  description: "Explore all articles on mathematics — from pure theory and history to AI and applied methods.",
  path: "/articles",
});

interface ArticlesPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const category = params.category as Category | undefined;
  const sort = (params.sort as "newest" | "oldest" | "popular") ?? "newest";
  const page = parseInt(params.page ?? "1", 10);
  const limit = 12;
  const offset = (page - 1) * limit;

  const result = await getArticles({ category, sort, limit, offset });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-paper mb-4">
          Articles
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          Deep dives into mathematical beauty, research frontiers, and the equations shaping our world.
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-10">
        <Suspense fallback={<Skeleton className="h-10 w-full max-w-xl" />}>
          <CategoryFilter />
        </Suspense>
      </div>

      {/* Articles grid */}
      {result.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.data.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted text-lg">No articles found in this category yet.</p>
        </div>
      )}

      {/* Pagination */}
      {result.total > limit && (
        <div className="mt-12 flex items-center justify-center gap-4">
          {page > 1 && (
            <a
              href={`/articles?${new URLSearchParams({
                ...(category ? { category } : {}),
                sort,
                page: String(page - 1),
              }).toString()}`}
              className="px-4 py-2 text-sm text-gold border border-gold/20 hover:border-gold/40 rounded-sm transition-colors duration-200"
            >
              &larr; Previous
            </a>
          )}
          <span className="text-sm text-muted font-mono">
            Page {page} of {Math.ceil(result.total / limit)}
          </span>
          {result.hasMore && (
            <a
              href={`/articles?${new URLSearchParams({
                ...(category ? { category } : {}),
                sort,
                page: String(page + 1),
              }).toString()}`}
              className="px-4 py-2 text-sm text-gold border border-gold/20 hover:border-gold/40 rounded-sm transition-colors duration-200"
            >
              Next &rarr;
            </a>
          )}
        </div>
      )}
    </div>
  );
}
