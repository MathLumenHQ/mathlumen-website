import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getRelatedArticles } from "@/lib/queries/articles";
import { getArticleContent } from "@/lib/mdx";
import { createMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/article/ProgressBar";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Separator } from "@/components/ui/Separator";
import { ViewTracker } from "./ViewTracker";
import type { Category } from "@/schema/types";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
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

  const [mdxContent, related] = await Promise.all([
    getArticleContent(slug),
    getRelatedArticles(article.id, article.category, 3),
  ]);

  return (
    <>
      <ProgressBar />
      <ViewTracker articleId={article.id} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/category/${article.category}`}>
              <Badge category={article.category as Category}>{article.category}</Badge>
            </Link>
            {article.readTimeMinutes && (
              <span className="text-xs text-muted font-mono">
                {article.readTimeMinutes} min read
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-bold text-paper leading-tight mb-4">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-xl text-gold-light/70 font-display italic mb-6">
              {article.subtitle}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted">
            <Link
              href={`/authors/${article.author.slug}`}
              className="text-paper hover:text-gold transition-colors duration-200"
            >
              {article.author.name}
            </Link>
            {article.publishedAt && (
              <>
                <span>&middot;</span>
                <time dateTime={new Date(article.publishedAt).toISOString()}>
                  {formatDate(article.publishedAt)}
                </time>
              </>
            )}
          </div>
        </header>

        {/* Cover image */}
        {article.coverImageUrl && (
          <div className="relative h-64 md:h-96 mb-10 -mx-4 sm:mx-0">
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              fill
              className="object-cover sm:rounded-md"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        )}

        {/* Content area with sidebar */}
        <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-12">
          {/* Article body */}
          <div className="prose">
            {mdxContent ? (
              <div dangerouslySetInnerHTML={{ __html: mdxContent.content }} />
            ) : (
              <p className="text-muted italic">
                Article content is being prepared. Check back soon.
              </p>
            )}
          </div>

          {/* Sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <TableOfContents />
            </div>
          </aside>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gold/10">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Author card */}
        <div className="mt-12 p-6 bg-ink-2 border border-gold/10">
          <div className="flex items-start gap-4">
            {article.author.avatarUrl && (
              <Image
                src={article.author.avatarUrl}
                alt={article.author.name}
                width={56}
                height={56}
                className="rounded-full"
              />
            )}
            <div>
              <Link
                href={`/authors/${article.author.slug}`}
                className="font-display font-semibold text-paper hover:text-gold transition-colors duration-200"
              >
                {article.author.name}
              </Link>
              {article.author.bio && (
                <p className="text-sm text-muted mt-1 line-clamp-2">{article.author.bio}</p>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <>
          <Separator gold />
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="font-display text-2xl font-bold text-paper mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
