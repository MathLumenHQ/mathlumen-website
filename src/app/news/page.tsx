import Link from "next/link";
import { Suspense } from "react";
import { getArticles } from "@/lib/queries/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import { SidebarNewsletter } from "@/components/sidebar/SidebarNewsletter";
import { ToolsPromo } from "@/components/sidebar/ToolsPromo";
import { PopularArticles } from "@/components/article/PopularArticles";
import { createMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata = createMetadata({
  title: "Math News",
  description:
    "Fields Medals, Abel Prizes, major proof announcements, and the latest breakthroughs from mathematics departments and research institutes worldwide.",
  path: "/news",
});

const NEWS_PER_PAGE = 10;

interface NewsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const offset = (page - 1) * NEWS_PER_PAGE;

  let result;
  try {
    result = await getArticles({
      category: "news",
      sort: "newest",
      limit: NEWS_PER_PAGE,
      offset,
    });
  } catch {
    result = { data: [], total: 0, limit: NEWS_PER_PAGE, offset, hasMore: false };
  }

  const totalPages = Math.ceil(result.total / NEWS_PER_PAGE);

  function buildPageUrl(targetPage: number) {
    return `/news${targetPage > 1 ? `?page=${targetPage}` : ""}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#ff8c42]/20">
        <p className="text-xs text-[#ff8c42] font-mono uppercase tracking-widest mb-3">
          Latest
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-paper mb-4">
          Math News
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          Prizes, proof announcements, and the latest developments from the global mathematics community.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
        {/* ── Main content ─────────────────────────────────────────── */}
        <div>
          {result.data.length > 0 ? (
            <div className="space-y-0 divide-y divide-gold/[0.10]">
              {result.data.map((article) => (
                <div key={article.id} className="py-8 first:pt-0">
                  <ArticleCard article={article} layout="horizontal" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="font-display text-2xl font-bold text-paper mb-3">
                No news articles yet
              </p>
              <p className="text-muted text-lg max-w-md mx-auto mb-8">
                We&apos;re curating the first batch of math news. Check back soon.
              </p>
              <Link
                href="/articles"
                className="inline-block px-6 py-3 text-sm border border-gold/30 text-gold hover:border-gold/60 hover:bg-gold/[0.04] transition-colors duration-200"
              >
                Browse all articles →
              </Link>
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
        </div>

        {/* ── Desktop sidebar ──────────────────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-8">
            <Suspense fallback={<SidebarPopularSkeleton />}>
              <PopularArticles />
            </Suspense>
            <SidebarNewsletter />
            <ToolsPromo />
          </div>
        </aside>
      </div>
    </div>
  );
}

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
