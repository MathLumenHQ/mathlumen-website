import Link from "next/link";
import { searchArticles, getArticles } from "@/lib/queries/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import { createMetadata } from "@/lib/metadata";
import type { Category } from "@/schema/types";

export const metadata = createMetadata({
  title: "Search",
  description: "Search MathLumen articles across all categories.",
  path: "/search",
});

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const category = params.category as Category | undefined;

  let results = query.length >= 2 ? await searchArticles(query) : [];

  // Filter by category if specified
  if (category && results.length > 0) {
    results = results.filter((a) => a.category === category);
  }

  // When no results, show featured articles as suggestions
  const suggestions =
    query.length >= 2 && results.length === 0
      ? (await getArticles({ featured: true, limit: 3 })).data
      : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-paper mb-4">
          Search
        </h1>

        <form method="GET" action="/search" className="max-w-xl">
          <div className="flex gap-3">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search for articles..."
              className="flex-1 bg-ink-2 border border-gold/20 px-4 py-2.5 text-paper placeholder:text-muted font-body focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors duration-200"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-gold text-ink font-semibold hover:bg-gold-light transition-colors duration-200"
            >
              Search
            </button>
          </div>

          {/* Category filter */}
          {query && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-muted font-mono">Filter:</span>
              {["history", "research", "applied", "ai-ml", "essay"].map((cat) => (
                <a
                  key={cat}
                  href={`/search?q=${encodeURIComponent(query)}&category=${cat}`}
                  className={`text-xs px-2 py-1 border transition-colors duration-200 ${
                    category === cat
                      ? "border-gold text-gold"
                      : "border-gold/10 text-muted hover:text-paper hover:border-gold/30"
                  }`}
                >
                  {cat}
                </a>
              ))}
              {category && (
                <a
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="text-xs text-muted hover:text-paper ml-1"
                >
                  Clear
                </a>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Results count */}
      {query && (
        <p className="text-sm text-muted mb-8 font-mono">
          {results.length} result{results.length !== 1 ? "s" : ""} for
          &quot;{query}&quot;
          {category && ` in ${category}`}
        </p>
      )}

      {/* Results grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : query.length >= 2 ? (
        <div className="text-center py-16">
          <p className="font-display text-xl text-paper mb-2">
            No results for &quot;{query}&quot;
          </p>
          <p className="text-muted text-sm mb-2">
            Try different keywords or browse by category.
          </p>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-12 text-left">
              <h2 className="font-display text-xl font-bold text-paper mb-6">
                You might enjoy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {suggestions.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12">
          <p className="font-display text-xl text-muted italic mb-6">
            Search MathLumen
          </p>
          <div className="flex flex-wrap gap-3">
            {(["history", "research", "applied", "ai-ml", "essay"] as const).map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat}`}
                className="px-4 py-2 text-sm border border-gold/20 text-gold hover:border-gold/40 hover:bg-gold/[0.03] transition-colors duration-200"
              >
                {cat === "ai-ml" ? "AI & ML" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
