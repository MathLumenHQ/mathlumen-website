import { searchArticles } from "@/lib/queries/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Search",
  description: "Search MathLumen articles across all categories.",
  path: "/search",
});

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const results = query.length >= 2 ? await searchArticles(query) : [];

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
              className="flex-1 bg-ink-2 border border-gold/20 rounded-sm px-4 py-2.5 text-paper placeholder:text-muted font-body focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors duration-200"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-gold text-ink font-semibold rounded-sm hover:bg-gold-light transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {query && (
        <p className="text-sm text-muted mb-8">
          {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : query.length >= 2 ? (
        <div className="text-center py-20">
          <p className="text-muted text-lg">No articles match your search.</p>
        </div>
      ) : null}
    </div>
  );
}
