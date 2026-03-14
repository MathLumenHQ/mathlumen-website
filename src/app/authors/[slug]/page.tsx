import { notFound } from "next/navigation";
import { getAuthorBySlug, getAuthorArticles } from "@/lib/queries/authors";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
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
      {/* Hero */}
      <div className="flex flex-col md:flex-row items-start gap-8 mb-12 pb-8 border-b border-gold/[0.18]">
        {author.avatarUrl && (
          <OptimizedImage
            src={author.avatarUrl}
            alt={author.name}
            width={120}
            height={120}
            className="rounded-full shrink-0"
            sizes="120px"
            fallbackSrc="/images/placeholder-avatar.svg"
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
                className="flex items-center gap-1.5 text-muted hover:text-gold transition-colors duration-200 font-mono"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                {author.twitterHandle}
              </a>
            )}
            {author.linkedinUrl && (
              <a
                href={author.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted hover:text-gold transition-colors duration-200 font-mono"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            )}
            {author.websiteUrl && (
              <a
                href={author.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted hover:text-gold transition-colors duration-200 font-mono"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                Website
              </a>
            )}
            <span className="text-muted font-mono">
              {articles.length} article{articles.length !== 1 ? "s" : ""}
            </span>
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
