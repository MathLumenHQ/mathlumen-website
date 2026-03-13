import Link from "next/link";
import Image from "next/image";
import { cn, formatDate, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { ArticleWithAuthor } from "@/schema/types";

interface ArticleCardProps {
  article: ArticleWithAuthor;
  /** Whether to render as a large featured card */
  featured?: boolean;
  className?: string;
}

/**
 * Article preview card with cover image, metadata, and excerpt.
 */
export function ArticleCard({ article, featured = false, className }: ArticleCardProps) {
  return (
    <article
      className={cn(
        "group bg-ink-2 border border-gold/10 rounded-none overflow-hidden",
        "transition-all duration-300 hover:border-gold/25",
        featured && "md:col-span-2 md:grid md:grid-cols-2",
        className
      )}
    >
      {/* Cover image */}
      {article.coverImageUrl && (
        <Link href={`/articles/${article.slug}`} className="block overflow-hidden">
          <div className={cn("relative", featured ? "h-full min-h-[280px]" : "h-48")}>
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            />
          </div>
        </Link>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col justify-between">
        <div>
          {/* Category & read time */}
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="gold">{article.category}</Badge>
            {article.readTimeMinutes && (
              <span className="text-xs text-muted font-mono">
                {article.readTimeMinutes} min read
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/articles/${article.slug}`}>
            <h3
              className={cn(
                "font-display font-bold text-paper leading-tight",
                "group-hover:text-gold-light transition-colors duration-200",
                featured ? "text-2xl mb-3" : "text-lg mb-2"
              )}
            >
              {article.title}
            </h3>
          </Link>

          {/* Subtitle */}
          {article.subtitle && (
            <p className="text-gold-light/70 text-sm mb-2 font-display italic">
              {article.subtitle}
            </p>
          )}

          {/* Excerpt */}
          <p className="text-muted text-sm leading-relaxed">
            {truncate(article.excerpt, featured ? 200 : 120)}
          </p>
        </div>

        {/* Footer: author & date */}
        <div className="mt-4 pt-4 border-t border-gold/10 flex items-center justify-between">
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
      </div>
    </article>
  );
}
