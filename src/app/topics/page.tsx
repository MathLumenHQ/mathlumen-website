import Link from "next/link";
import { getArticles } from "@/lib/queries/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Separator } from "@/components/ui/Separator";
import { createMetadata } from "@/lib/metadata";
import { CATEGORIES, SITE_URL } from "@/lib/constants";
import type { Category } from "@/schema/types";

export const revalidate = 3600;

export const metadata = createMetadata({
  title: "Mathematics Topics",
  description:
    "Browse MathLumen by topic: history of mathematics, cutting-edge research, applied math, the mathematics of AI and machine learning, and long-form essays.",
  path: "/topics",
});

/**
 * Topic cluster hub page — one page that links to every category and
 * surfaces the top 5 articles per topic. Google rewards this structure.
 */
export default async function TopicsPage() {
  // Fetch top 5 articles per category in parallel
  const categoryResults = await Promise.all(
    CATEGORIES.map((cat) =>
      getArticles({ category: cat.value as Category, limit: 5 })
        .then((r) => ({ ...cat, articles: r.data, total: r.total }))
        .catch(() => ({ ...cat, articles: [], total: 0 }))
    )
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mathematics Topics — MathLumen",
    description:
      "A comprehensive index of mathematical topics covered by MathLumen, including history, research, applied mathematics, AI and machine learning, and essays.",
    url: `${SITE_URL}/topics`,
    hasPart: CATEGORIES.map((cat) => ({
      "@type": "WebPage",
      name: cat.label,
      url: `${SITE_URL}/category/${cat.value}`,
      description: cat.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Topics" }]} />

        {/* Page header */}
        <div className="mb-14">
          <p className="font-mono text-gold uppercase tracking-[0.2em] text-xs mb-3">
            Browse by Topic
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-black text-paper mb-4">
            Mathematics Topics
          </h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            Every article on MathLumen, organized by subject. Dive into a
            category or browse the latest across all topics.
          </p>
        </div>

        {/* Quick-jump category index */}
        <nav aria-label="Topic categories" className="mb-14">
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.value}
                href={`#${cat.value}`}
                className="px-4 py-2 text-sm font-mono border border-gold/[0.18] text-gold hover:border-gold/40 hover:bg-gold/[0.04] transition-colors duration-200"
              >
                {cat.label}
              </a>
            ))}
          </div>
        </nav>

        <Separator gold className="mb-14" />

        {/* Category sections */}
        <div className="space-y-20">
          {categoryResults.map((cat) => (
            <section key={cat.value} id={cat.value}>
              {/* Section header */}
              <div className="flex items-end justify-between mb-6">
                <div>
                  <Link
                    href={`/category/${cat.value}`}
                    className="group inline-block"
                  >
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-paper group-hover:text-gold-light transition-colors duration-200">
                      {cat.label}
                    </h2>
                    <span className="block h-[2px] w-0 bg-gold group-hover:w-full transition-all duration-300 mt-1" />
                  </Link>
                  <p className="text-muted text-sm mt-2 max-w-xl leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <Link
                  href={`/category/${cat.value}`}
                  className="hidden sm:flex items-center gap-1 shrink-0 text-xs text-gold hover:text-gold-light font-mono transition-colors duration-200"
                >
                  All {cat.total} articles &rarr;
                </Link>
              </div>

              {/* Articles */}
              {cat.articles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <p className="text-muted italic text-sm">
                  No articles published yet.{" "}
                  <Link href="/newsletter" className="text-gold hover:text-gold-light transition-colors duration-200">
                    Subscribe
                  </Link>{" "}
                  to be notified.
                </p>
              )}

              {/* Mobile "View all" */}
              {cat.articles.length > 0 && (
                <div className="sm:hidden mt-6">
                  <Link
                    href={`/category/${cat.value}`}
                    className="text-xs text-gold hover:text-gold-light font-mono transition-colors duration-200"
                  >
                    All {cat.total} {cat.label} articles &rarr;
                  </Link>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
