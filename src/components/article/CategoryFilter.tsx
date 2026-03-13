"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";

/**
 * Category filter pills for the articles listing page.
 */
export function CategoryFilter() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
      <Link
        href="/articles"
        className={cn(
          "px-4 py-1.5 text-sm font-mono uppercase tracking-wider rounded-sm transition-colors duration-200",
          !activeCategory
            ? "bg-gold text-ink"
            : "text-muted hover:text-paper border border-gold/20 hover:border-gold/40"
        )}
        role="tab"
        aria-selected={!activeCategory}
      >
        All
      </Link>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.value}
          href={`/articles?category=${cat.value}`}
          className={cn(
            "px-4 py-1.5 text-sm font-mono uppercase tracking-wider rounded-sm transition-colors duration-200",
            activeCategory === cat.value
              ? "bg-gold text-ink"
              : "text-muted hover:text-paper border border-gold/20 hover:border-gold/40"
          )}
          role="tab"
          aria-selected={activeCategory === cat.value}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
