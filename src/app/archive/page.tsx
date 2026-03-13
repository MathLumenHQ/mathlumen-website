import Link from "next/link";
import { getArticles } from "@/lib/queries/articles";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Archive",
  description: "Browse the complete MathLumen article archive, organized chronologically.",
  path: "/archive",
});

export default async function ArchivePage() {
  const result = await getArticles({ limit: 100, sort: "newest" });

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
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-paper mb-4">
          Archive
        </h1>
        <p className="text-muted text-lg">
          The complete MathLumen collection, organized chronologically.
        </p>
      </div>

      <div className="space-y-12">
        {Array.from(grouped.entries()).map(([key, articles]) => {
          const [year, month] = key.split("-");
          const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString(
            "en-US",
            { month: "long" }
          );

          return (
            <section key={key}>
              <h2 className="font-display text-xl font-semibold text-gold-light mb-4 border-b border-gold/10 pb-2">
                {monthName} {year}
              </h2>
              <ul className="space-y-3">
                {articles.map((article) => (
                  <li key={article.id} className="flex items-start gap-4">
                    {article.publishedAt && (
                      <time
                        dateTime={new Date(article.publishedAt).toISOString()}
                        className="text-xs text-muted font-mono w-20 shrink-0 pt-1"
                      >
                        {formatDate(article.publishedAt, "MMM d")}
                      </time>
                    )}
                    <div className="flex-1">
                      <Link
                        href={`/articles/${article.slug}`}
                        className="text-paper hover:text-gold transition-colors duration-200 font-display"
                      >
                        {article.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-muted">{article.author.name}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
