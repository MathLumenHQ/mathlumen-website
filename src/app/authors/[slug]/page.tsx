import { notFound } from "next/navigation";
import Image from "next/image";
import { getAuthorBySlug, getAuthorArticles } from "@/lib/queries/authors";
import { ArticleCard } from "@/components/article/ArticleCard";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return createMetadata({
      title: "Author Not Found",
      description: "This author could not be found.",
      path: `/authors/${slug}`,
    });
  }

  return createMetadata({
    title: author.name,
    description: author.bio ?? `Articles by ${author.name}`,
    image: author.avatarUrl ?? undefined,
    path: `/authors/${slug}`,
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const articles = await getAuthorArticles(author.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Author header */}
      <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
        {author.avatarUrl && (
          <Image
            src={author.avatarUrl}
            alt={author.name}
            width={120}
            height={120}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-paper mb-3">
            {author.name}
          </h1>
          {author.bio && (
            <p className="text-muted text-lg leading-relaxed max-w-2xl mb-4">
              {author.bio}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm">
            {author.twitterHandle && (
              <a
                href={`https://twitter.com/${author.twitterHandle.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light transition-colors duration-200 font-mono"
              >
                {author.twitterHandle}
              </a>
            )}
            {author.websiteUrl && (
              <a
                href={author.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light transition-colors duration-200 font-mono"
              >
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Author's articles */}
      <h2 className="font-display text-2xl font-bold text-paper mb-8">
        Articles by {author.name}
      </h2>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-lg">No published articles yet.</p>
      )}
    </div>
  );
}
