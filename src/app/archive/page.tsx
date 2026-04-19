import Link from "next/link";
import { getArticles } from "@/lib/queries/articles";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { SearchButton } from "@/components/article/SearchButton";
import { createMetadata } from "@/lib/metadata";
import type { Category } from "@/schema/types";

export const metadata = createMetadata({
  title: "Archive",
  description:
    "Browse the complete MathLumen article archive, organized chronologically.",
  path: "/archive",
});

export default async function ArchivePage() {
  const result = await getArticles({ limit: 200, sort: "newest" });

  // Group articles by year and month
  const grouped = new Map<string, typeof result.data>();

  for (const article of result.data) {
    if (!article.publishedAt) continue;

    const date = new Date(article.publishedAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(article);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-paper mb-2">
            Archive
          </h1>
          <p className="text-muted text-lg">
            The complete MathLumen collection, organized chronologically.
          </p>
          <p className="text-sm text-muted font-mono mt-1">
            {result.total} article{result.total !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search within archive */}
        <SearchButton />
      </div>

      <section className="mb-12 border border-gold/[0.18] bg-ink-2 p-6 sm:p-8">
        <p className="font-mono text-gold uppercase tracking-[0.2em] text-xs mb-3">
          Problem of the Week
        </p>
        <h2 className="font-display text-2xl font-bold text-paper mb-3">
          Looking for published POW solutions?
        </h2>
        <p className="text-muted text-base leading-relaxed mb-5 max-w-2xl">
          Published Problem of the Week solutions live in their own archive, separate
          from the main article archive. Browse metadata, solution pages, and final
          PDF releases there.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/pow/archive"
            className="inline-flex items-center justify-center rounded-none bg-gold px-5 py-2.5 text-ink font-semibold hover:bg-gold-light transition-colors duration-200"
          >
            Open POW Archive
          </Link>
          <Link
            href="/problem-of-the-week"
            className="text-sm text-gold hover:text-gold-light transition-colors duration-200 font-mono"
          >
            View current weekly problem &rarr;
          </Link>
        </div>
      </section>

      {grouped.size === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-xl text-muted italic">
            Archive will populate as we publish.
          </p>
        </div>
      ) : (
      <div className="space-y-12">
        {Array.from(grouped.entries()).map(([key, articles]) => {
          const [year, month] = key.split("-");
          const monthName = new Date(
            parseInt(year),
            parseInt(month) - 1
          ).toLocaleString("en-US", { month: "long" });

          return (
            <section key={key}>
              <h2 className="font-display text-xl font-semibold text-gold-light mb-4 border-b border-gold/10 pb-2">
                {monthName} {year}
              </h2>
              <ul className="space-y-3">
                {articles.map((article) => (
                  <li
                    key={article.id}
                    className="flex items-start gap-4"
                  >
                    {article.publishedAt && (
                      <time
                        dateTime={new Date(
                          article.publishedAt
                        ).toISOString()}
                        className="text-xs text-muted font-mono w-16 shrink-0 pt-1"
                      >
                        {formatDate(article.publishedAt, "MMM d")}
                      </time>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/articles/${article.slug}`}
                        className="text-paper hover:text-gold transition-colors duration-200 font-display"
                      >
                        {article.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          category={article.category as Category}
                          size="sm"
                        >
                          {article.category}
                        </Badge>
                        {article.readTimeMinutes && (
                          <span className="text-xs text-muted font-mono">
                            {article.readTimeMinutes} min
                          </span>
                        )}
                        <span className="text-xs text-muted">
                          {article.author.name}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      )}
    </div>
  );
}
