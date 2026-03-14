import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getArticleBySlug, getRelatedArticles } from "@/lib/queries/articles";
import { getArticleContent, listArticleSlugs } from "@/lib/mdx";
import { createMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { getPlaceholderUrl } from "@/lib/image-utils";
import { ProgressBar } from "@/components/article/ProgressBar";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ShareButtons } from "@/components/article/ShareButtons";
import { CiteDialog } from "@/components/article/CiteDialog";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ViewTracker } from "./ViewTracker";
import type { Category } from "@/schema/types";
import type { Metadata } from "next";

export const revalidate = 3600;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = listArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return createMetadata({
      title: "Article Not Found",
      description: "This article could not be found.",
      path: `/articles/${slug}`,
    });
  }

  return createMetadata({
    title: article.title,
    description: article.excerpt,
    image: article.coverImageUrl ?? undefined,
    path: `/articles/${slug}`,
    type: "article",
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [mdxResult, related] = await Promise.all([
    getArticleContent(slug),
    getRelatedArticles(article.id, article.category, 3),
  ]);

  const articleUrl = `${SITE_URL}/articles/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Person",
      name: article.author.name,
      url: `${SITE_URL}/authors/${article.author.slug}`,
    },
    datePublished: article.publishedAt
      ? new Date(article.publishedAt).toISOString()
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "MathLumen",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-default.png`,
      },
    },
    mainEntityOfPage: articleUrl,
    image: article.coverImageUrl ?? undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProgressBar />
      <ViewTracker articleId={article.id} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header — full width */}
        <header className="max-w-3xl mx-auto mb-10 lg:max-w-none">
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/category/${article.category}`}>
              <Badge category={article.category as Category}>
                {article.category}
              </Badge>
            </Link>
            {article.readTimeMinutes && (
              <span className="text-xs text-muted font-mono">
                {article.readTimeMinutes} min read
              </span>
            )}
          </div>

          <h1 className="font-display text-[2.5rem] md:text-[3.5rem] font-black text-paper leading-[1.1] mb-4">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-xl md:text-2xl text-gold-light/70 font-body italic mb-6">
              {article.subtitle}
            </p>
          )}

          {/* Author block */}
          <div className="flex items-center gap-4">
            {article.author.avatarUrl && (
              <Image
                src={article.author.avatarUrl}
                alt={article.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div className="flex items-center gap-2 text-sm">
              <Link
                href={`/authors/${article.author.slug}`}
                className="text-paper font-semibold hover:text-gold transition-colors duration-200"
              >
                {article.author.name}
              </Link>
              {article.publishedAt && (
                <>
                  <span className="text-muted">&middot;</span>
                  <time
                    dateTime={new Date(article.publishedAt).toISOString()}
                    className="text-muted"
                  >
                    {formatDate(article.publishedAt)}
                  </time>
                </>
              )}
              {article.readTimeMinutes && (
                <>
                  <span className="text-muted">&middot;</span>
                  <span className="text-muted">
                    {article.readTimeMinutes} min read
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Gold separator */}
          <div className="mt-8 h-px bg-gold/[0.18]" />
        </header>

        {/* Three-column layout */}
        <div className="lg:grid lg:grid-cols-[220px_1fr_280px] lg:gap-12">
          {/* Left sidebar — ToC (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              {mdxResult && (
                <TableOfContents headings={mdxResult.headings} />
              )}
            </div>
          </aside>

          {/* Center — article content */}
          <article className="min-w-0">
            {/* Mobile ToC — collapsible */}
            {mdxResult && mdxResult.headings.length > 0 && (
              <details className="lg:hidden mb-8 border border-gold/[0.18] p-4">
                <summary className="font-display text-sm font-semibold text-gold-light uppercase tracking-wider cursor-pointer">
                  Table of Contents
                </summary>
                <nav className="mt-3 space-y-1">
                  {mdxResult.headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block text-sm py-1 text-muted hover:text-paper transition-colors duration-200 ${h.level === 3 ? "pl-4" : ""}`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </details>
            )}

            {/* Cover image */}
            {article.coverImageUrl && (
              <div className="relative h-64 md:h-96 mb-10 -mx-4 sm:mx-0">
                <OptimizedImage
                  src={article.coverImageUrl}
                  alt={article.title}
                  fill
                  className="object-cover sm:rounded-md"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px"
                  fallbackSrc={getPlaceholderUrl(article.category)}
                />
              </div>
            )}

            {/* MDX Content */}
            <div className="prose">
              {mdxResult ? (
                mdxResult.content
              ) : (
                <p className="text-muted italic">
                  Article content is being prepared. Check back soon.
                </p>
              )}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gold/10">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Author bio card */}
            <div className="mt-12 p-6 bg-ink-2 border border-gold/10">
              <div className="flex items-start gap-4">
                {article.author.avatarUrl && (
                  <Image
                    src={article.author.avatarUrl}
                    alt={article.author.name}
                    width={64}
                    height={64}
                    className="rounded-full shrink-0"
                  />
                )}
                <div>
                  <Link
                    href={`/authors/${article.author.slug}`}
                    className="font-display text-lg font-semibold text-paper hover:text-gold transition-colors duration-200"
                  >
                    {article.author.name}
                  </Link>
                  {article.author.bio && (
                    <p className="text-sm text-muted mt-1">{article.author.bio}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    {article.author.twitterHandle && (
                      <a
                        href={`https://twitter.com/${article.author.twitterHandle.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted hover:text-gold transition-colors duration-200"
                      >
                        {article.author.twitterHandle}
                      </a>
                    )}
                    {article.author.linkedinUrl && (
                      <a
                        href={article.author.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted hover:text-gold transition-colors duration-200"
                      >
                        LinkedIn
                      </a>
                    )}
                    {article.author.websiteUrl && (
                      <a
                        href={article.author.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted hover:text-gold transition-colors duration-200"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Share + Cite row */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <ShareButtons title={article.title} url={articleUrl} />
              <CiteDialog
                title={article.title}
                authorName={article.author.name}
                publishedAt={article.publishedAt}
                url={articleUrl}
              />
            </div>
          </article>

          {/* Right sidebar — related + newsletter */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-8">
              {/* Related articles */}
              {related.length > 0 && (
                <div>
                  <h3 className="font-display text-sm font-semibold text-gold-light uppercase tracking-wider mb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {related.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/articles/${rel.slug}`}
                        className="block group"
                      >
                        {rel.coverImageUrl && (
                          <div className="relative h-32 mb-2 overflow-hidden">
                            <Image
                              src={rel.coverImageUrl}
                              alt={rel.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="280px"
                            />
                          </div>
                        )}
                        <Badge
                          category={rel.category as Category}
                          size="sm"
                        >
                          {rel.category}
                        </Badge>
                        <h4 className="text-sm font-display font-semibold text-paper mt-1 group-hover:text-gold transition-colors duration-200 line-clamp-2">
                          {rel.title}
                        </h4>
                        {rel.publishedAt && (
                          <p className="text-xs text-muted font-mono mt-1">
                            {formatDate(rel.publishedAt)}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter mini-form */}
              <div className="border border-gold/[0.18] p-4">
                <h3 className="font-display text-sm font-semibold text-gold-light uppercase tracking-wider mb-3">
                  Newsletter
                </h3>
                <p className="text-xs text-muted mb-3">
                  Get new articles delivered to your inbox.
                </p>
                <Suspense fallback={<Skeleton className="h-20 w-full" />}>
                  <NewsletterForm />
                </Suspense>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related articles — mobile (below article) */}
      {related.length > 0 && (
        <section className="lg:hidden max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-gold/[0.18]">
          <h2 className="font-display text-2xl font-bold text-paper mb-8">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {related.map((rel) => (
              <ArticleCard key={rel.id} article={rel} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
