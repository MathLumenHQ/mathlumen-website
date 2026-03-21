import Link from "next/link";
import { SITE_URL } from "@/lib/constants";

export interface BreadcrumbItem {
  name: string;
  /** Internal Next.js href. Omit for the current (last) item. */
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Renders a breadcrumb trail + BreadcrumbList JSON-LD structured data.
 *
 * Usage:
 *   <Breadcrumbs items={[
 *     { name: "Home", href: "/" },
 *     { name: "AI & ML", href: "/category/ai-ml" },
 *     { name: "Article Title" },   ← current page has no href
 *   ]} />
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center flex-wrap gap-1.5 font-mono text-xs text-muted">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="text-gold/30" aria-hidden="true">
                  /
                </span>
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-gold transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className="text-paper/50 truncate max-w-[240px] sm:max-w-none"
                  aria-current="page"
                >
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
