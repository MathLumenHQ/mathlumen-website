import Link from "next/link";
import { getAllAuthors } from "@/lib/queries/authors";
import { getArticles } from "@/lib/queries/articles";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Authors",
  description:
    "Meet the mathematicians, researchers, and writers behind MathLumen.",
  path: "/authors",
});

export default async function AuthorsPage() {
  const [authors, articlesResult] = await Promise.all([
    getAllAuthors(),
    getArticles({ limit: 200 }),
  ]);

  // Count articles per author
  const articleCounts = new Map<string, number>();
  for (const article of articlesResult.data) {
    const count = articleCounts.get(article.authorId) ?? 0;
    articleCounts.set(article.authorId, count + 1);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-paper mb-4">
          Authors
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          Meet the mathematicians, researchers, and writers who illuminate the
          world of mathematics.
        </p>
      </div>

      {authors.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-xl text-muted italic">
            Our team is coming together. Stay tuned.
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => {
          const count = articleCounts.get(author.id) ?? 0;
          return (
            <Link
              key={author.id}
              href={`/authors/${author.slug}`}
              className="group bg-ink-2 border border-gold/10 rounded-none p-6 hover:border-gold/25 transition-all duration-200"
            >
              <div className="flex items-center gap-4 mb-4">
                {author.avatarUrl && (
                  <OptimizedImage
                    src={author.avatarUrl}
                    alt={author.name}
                    width={56}
                    height={56}
                    className="rounded-full"
                    sizes="56px"
                    fallbackSrc="/images/placeholder-avatar.svg"
                  />
                )}
                <div>
                  <h2 className="font-display font-semibold text-paper group-hover:text-gold transition-colors duration-200">
                    {author.name}
                  </h2>
                  <p className="text-xs text-muted font-mono">
                    {count} article{count !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {author.bio && (
                <p className="text-sm text-muted line-clamp-3">{author.bio}</p>
              )}
            </Link>
          );
        })}
      </div>
      )}
    </div>
  );
}
