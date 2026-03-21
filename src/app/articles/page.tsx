import Link from "next/link";
import { Suspense } from "react";
import { getArticles } from "@/lib/queries/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import { CategoryFilter } from "@/components/article/CategoryFilter";
import { SortSelect } from "@/components/article/SortSelect";
import { SearchButton } from "@/components/article/SearchButton";
import { PopularArticles } from "@/components/article/PopularArticles";
import { SidebarNewsletter } from "@/components/sidebar/SidebarNewsletter";
import { ToolsPromo } from "@/components/sidebar/ToolsPromo";
import { AdSlot } from "@/components/sidebar/AdSlot";
import { Skeleton } from "@/components/ui/Skeleton";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { createMetadata } from "@/lib/metadata";
import type { Category } from "@/schema/types";

const ARTICLES_PER_PAGE = 6;

export const metadata = createMetadata({
  title: "All Articles",
  description:
    "Browse every MathLumen article: pure mathematics, history of math, applied methods, AI and machine learning theory, and long-form essays on mathematical beauty.",
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
  const sortParam = params.sort ?? "newest";
  const isFeatured = sortParam === "featured";
  const sort = isFeatured ? "newest" : (sortParam as "newest" | "oldest" | "popular");
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * limit;

  const result = await getArticles({
    category,
    sort,
    limit,
    offset,
    featured: isFeatured ? true : undefined,
  });

  const totalPages = Math.ceil(result.total / limit);
  const showFrom = result.total > 0 ? offset + 1 : 0;
  const showTo = Math.min(offset + limit, result.total);

  function buildPageUrl(targetPage: number) {
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (sortParam !== "newest") p.set("sort", sortParam);
    if (targetPage > 1) p.set("page", String(targetPage));
    const qs = p.toString();
    return `/articles${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-paper mb-4">
          All Articles
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          Deep dives into mathematical beauty, research frontiers, and the
          equations shaping our world.
        </p>
      </div>

      {/* Filters row — full width */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Suspense fallback={<Skeleton className="h-10 w-full max-w-md" />}>
          <CategoryFilter />
        </Suspense>
        <div className="flex items-center gap-3">
          <Suspense fallback={<Skeleton className="h-8 w-28" />}>
            <SortSelect />
          </Suspense>
          <SearchButton />
        </div>
      </div>

      {/* Two-column layout: main content + sidebar */}
      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
        {/* ── Main content ─────────────────────────────────────────── */}
        <div>
          {/* Count */}
          {result.total > 0 && (
            <p className="text-sm text-muted font-mono mb-6">
              Showing {showFrom}–{showTo} of {result.total} articles
            </p>
          )}

          {/* Articles grid */}
          {result.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="font-display text-2xl font-bold text-paper mb-3">
                No articles published yet
              </h2>
              <p className="text-muted text-lg max-w-md mx-auto mb-8">
                We&apos;re working on our first publications. Check back soon or
                subscribe to our newsletter.
              </p>
              <div className="max-w-md mx-auto">
                <Suspense fallback={<Skeleton className="h-20 w-full" />}>
                  <NewsletterForm />
                </Suspense>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              {page > 1 && (
                <Link
                  href={buildPageUrl(page - 1)}
                  className="px-4 py-2 text-sm text-gold border border-gold/20 hover:border-gold/40 transition-colors duration-200"
                >
                  &larr; Previous
                </Link>
              )}
              <span className="text-sm text-muted font-mono">
                Page {page} of {totalPages}
              </span>
              {result.hasMore && (
                <Link
                  href={buildPageUrl(page + 1)}
                  className="px-4 py-2 text-sm text-gold border border-gold/20 hover:border-gold/40 transition-colors duration-200"
                >
                  Next &rarr;
                </Link>
              )}
            </div>
          )}

          {/* Mobile: PopularArticles as horizontal scroll (below grid) */}
          {result.data.length > 0 && (
            <div className="lg:hidden mt-14 pt-10 border-t border-gold/[0.18]">
              <Suspense fallback={<MobilePopularSkeleton />}>
                <PopularArticles variant="scroll" />
              </Suspense>
            </div>
          )}
        </div>

        {/* ── Desktop sidebar ──────────────────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-8">
            <Suspense fallback={<SidebarPopularSkeleton />}>
              <PopularArticles />
            </Suspense>
            <SidebarNewsletter />
            <ToolsPromo />
            <AdSlot />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ── Skeletons ────────────────────────────────────────────────────── */

function SidebarPopularSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-36 bg-gold/10 animate-pulse" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="w-5 h-3 bg-gold/10 animate-pulse shrink-0 mt-1" />
          <div className="flex-1 space-y-1">
            <div className="h-3 w-full bg-paper/5 animate-pulse" />
            <div className="h-3 w-3/4 bg-paper/5 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MobilePopularSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="shrink-0 w-52 h-28 bg-paper/5 animate-pulse border border-gold/10" />
      ))}
    </div>
  );
}
