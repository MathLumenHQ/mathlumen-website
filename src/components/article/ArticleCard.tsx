import Link from "next/link";
import { cn, formatDate, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { getPlaceholderUrl } from "@/lib/image-utils";
import type { ArticleWithAuthor } from "@/schema/types";
import type { Category } from "@/schema/types";

type ArticleCardLayout = "vertical" | "horizontal" | "featured";

interface ArticleCardProps {
  article: ArticleWithAuthor;
  /** Layout variant: vertical (default), horizontal, or featured */
  layout?: ArticleCardLayout;
  className?: string;
}

/**
 * Article preview card with cover image, metadata, and excerpt.
 * Three layout variants:
 * - vertical: image top, text below (default)
 * - horizontal: image left, text right
 * - featured: large image area with overlay text
 */
export function ArticleCard({
  article,
  layout = "vertical",
  className,
}: ArticleCardProps) {
  const articleHref = `/articles/${article.slug}`;
  const category = article.category as Category;

  if (layout === "featured") {
    return (
      <article
        className={cn(
          "group relative bg-ink-2 border border-gold/[0.18] rounded-none overflow-hidden",
          "transition-all duration-200 hover:border-gold/40",
          "md:col-span-2",
          className
        )}
      >
        {/* Full-bleed cover image */}
        {article.coverImageUrl && (
          <Link href={articleHref} className="block relative h-80 md:h-96 overflow-hidden">
            <OptimizedImage
              src={article.coverImageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 66vw"
              fallbackSrc={getPlaceholderUrl(article.category)}
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

            {/* Text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <Badge category={category} size="sm">{article.category}</Badge>
                {article.readTimeMinutes && (
                  <span className="text-xs text-paper/60 font-mono">
                    {article.readTimeMinutes} min read
                  </span>
                )}
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-paper leading-tight mb-2 group-hover:text-gold-light transition-colors duration-200">
                {article.title}
              </h3>
              {article.subtitle && (
                <p className="text-gold-light/70 text-sm font-display italic mb-3">
                  {article.subtitle}
                </p>
              )}
              <p className="text-paper/60 text-sm leading-relaxed max-w-2xl">
                {truncate(article.excerpt, 200)}
              </p>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <span className="text-paper/70">{article.author.name}</span>
                {article.publishedAt && (
                  <>
                    <span className="text-gold/30">&middot;</span>
                    <time
                      dateTime={new Date(article.publishedAt).toISOString()}
                      className="text-paper/50 font-mono text-xs"
                    >
                      {formatDate(article.publishedAt)}
                    </time>
                  </>
                )}
              </div>
            </div>
          </Link>
        )}
      </article>
    );
  }

  if (layout === "horizontal") {
    return (
      <article
        className={cn(
          "group bg-ink-2 border border-gold/[0.18] rounded-none overflow-hidden",
          "transition-all duration-200 hover:border-gold/40",
          "grid grid-cols-1 md:grid-cols-[260px_1fr]",
          className
        )}
      >
        {/* Image left */}
        {article.coverImageUrl && (
          <Link href={articleHref} className="block overflow-hidden">
            <div className="relative h-48 md:h-full min-h-[160px]">
              <OptimizedImage
                src={article.coverImageUrl}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="260px"
                fallbackSrc={getPlaceholderUrl(article.category)}
              />
            </div>
          </Link>
        )}

        {/* Text right */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge category={category} size="sm">{article.category}</Badge>
              {article.readTimeMinutes && (
                <span className="text-xs text-muted font-mono">
                  {article.readTimeMinutes} min
                </span>
              )}
            </div>
            <Link href={articleHref}>
              <h3 className="font-display text-lg font-bold text-paper leading-tight mb-2 group-hover:text-gold-light transition-colors duration-200">
                {article.title}
                <span className="block h-[2px] w-0 bg-gold group-hover:w-full transition-all duration-300 mt-1" />
              </h3>
            </Link>
            <p className="text-muted text-sm leading-relaxed">
              {truncate(article.excerpt, 140)}
            </p>
          </div>
          <ArticleCardFooter article={article} />
        </div>
      </article>
    );
  }

  // Default: vertical layout
  return (
    <article
      className={cn(
        "group bg-ink-2 border border-gold/[0.18] rounded-none overflow-hidden",
        "transition-all duration-200 hover:border-gold/40",
        className
      )}
    >
      {/* Cover image */}
      {article.coverImageUrl && (
        <Link href={articleHref} className="block overflow-hidden">
          <div className="relative h-48">
            <OptimizedImage
              src={article.coverImageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              fallbackSrc={getPlaceholderUrl(article.category)}
            />
          </div>
        </Link>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col justify-between min-h-[200px]">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Badge category={category} size="sm">{article.category}</Badge>
            {article.readTimeMinutes && (
              <span className="text-xs text-muted font-mono">
                {article.readTimeMinutes} min
              </span>
            )}
          </div>

          <Link href={articleHref}>
            <h3 className="font-display text-lg font-bold text-paper leading-tight mb-2 group-hover:text-gold-light transition-colors duration-200">
              {article.title}
              {/* Animated gold underline on hover */}
              <span className="block h-[2px] w-0 bg-gold group-hover:w-full transition-all duration-300 mt-1" />
            </h3>
          </Link>

          {article.subtitle && (
            <p className="text-gold-light/70 text-sm mb-2 font-display italic">
              {article.subtitle}
            </p>
          )}

          <p className="text-muted text-sm leading-relaxed">
            {truncate(article.excerpt, 120)}
          </p>
        </div>

        <ArticleCardFooter article={article} />
      </div>
    </article>
  );
}

/** Shared footer row for author name + date + tags */
function ArticleCardFooter({ article }: { article: ArticleWithAuthor }) {
  return (
    <div className="mt-4 pt-4 border-t border-gold/[0.10] flex items-center justify-between">
      <span className="text-sm text-paper/70">{article.author.name}</span>
      {article.publishedAt && (
        <time
          dateTime={new Date(article.publishedAt).toISOString()}
          className="text-xs text-muted font-mono"
        >
          {formatDate(article.publishedAt)}
        </time>
      )}
    </div>
  );
}
