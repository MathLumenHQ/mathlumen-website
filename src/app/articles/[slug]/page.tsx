import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getArticleBySlug } from "@/lib/queries/articles";
import { getArticleContent, listArticleSlugs, getArticleRawBody } from "@/lib/mdx";
import { createMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";
import { getInternalLinks } from "@/lib/internal-links";
import { extractFaqPairs, buildFaqSchema } from "@/lib/faq-schema";
import { Badge } from "@/components/ui/Badge";
import { CoverImage } from "@/components/article/CoverImage";
import { ProgressBar } from "@/components/article/ProgressBar";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ShareButtons } from "@/components/article/ShareButtons";
import { CiteDialog } from "@/components/article/CiteDialog";
import { PopularArticles } from "@/components/article/PopularArticles";
import { RecommendedArticles } from "@/components/article/RecommendedArticles";
import { SidebarNewsletter } from "@/components/sidebar/SidebarNewsletter";
import { ToolsPromo } from "@/components/sidebar/ToolsPromo";
import { AdSlot } from "@/components/sidebar/AdSlot";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ViewTracker } from "./ViewTracker";
import type { Category } from "@/schema/types";
import type { Metadata } from "next";

const CATEGORY_LABELS: Record<string, string> = {
  history: "History",
  research: "Research",
  applied: "Applied Math",
  "ai-ml": "AI & ML",
  essay: "Essays",
  news: "News",
};

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

  const [mdxResult, internalLinks] = await Promise.all([
    getArticleContent(slug),
    getInternalLinks(article.slug, article.category, article.tags ?? []),
  ]);

  const rawBody = getArticleRawBody(slug);
  const faqPairs = rawBody ? extractFaqPairs(rawBody) : [];
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
        url: `${SITE_URL}/images/og-default.svg`,
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
      {faqPairs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(faqPairs)) }}
        />
      )}
      <ProgressBar />
      <ViewTracker articleId={article.id} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            {
              name: CATEGORY_LABELS[article.category] ?? article.category,
              href: `/category/${article.category}`,
            },
            { name: article.title },
          ]}
        />

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

          {/* Share row + separator */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <ShareButtons title={article.title} url={articleUrl} variant="compact" />
          </div>
          <div className="mt-4 h-px bg-gold/[0.18]" />
        </header>

        {/* Three-column layout */}
        <div className="lg:grid lg:grid-cols-[220px_1fr_280px] lg:gap-12">
          {/* Left sidebar — ToC (desktop only) */}
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

            {/* Cover image — sourced from database/frontmatter, never from MDX body */}
            {article.coverImageUrl && (
              <CoverImage
                src={article.coverImageUrl}
                alt={article.title}
                caption={mdxResult?.frontmatter.coverImageCaption}
                category={article.category}
              />
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

            {/* Also on MathLumen — internal links */}
            {internalLinks.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gold/[0.18]">
                <p className="font-mono text-xs text-gold uppercase tracking-[0.2em] mb-4">
                  Also on MathLumen
                </p>
                <ul className="space-y-2.5">
                  {internalLinks.map((link) => (
                    <li key={link.slug}>
                      <Link
                        href={`/articles/${link.slug}`}
                        className="flex items-start gap-2 group text-sm"
                      >
                        <span className="text-gold/40 mt-0.5 shrink-0" aria-hidden="true">
                          &rarr;
                        </span>
                        <span className="text-muted group-hover:text-paper transition-colors duration-200 leading-snug">
                          {link.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
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

          {/* Right sidebar (desktop only) */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-8">
              <SidebarNewsletter />
              <Suspense fallback={<PopularSkeleton />}>
                <PopularArticles />
              </Suspense>
              <ToolsPromo />
              <AdSlot />
            </div>
          </aside>
        </div>
      </div>

      {/* Related articles — mobile (below article, hidden on desktop) */}
      <Suspense fallback={null}>
        <RecommendedArticles articleId={article.id} category={article.category} />
      </Suspense>
    </>
  );
}

function PopularSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-32 bg-gold/10 animate-pulse" />
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
