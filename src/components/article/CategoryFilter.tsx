"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";

/**
 * Horizontal category filter tabs for article listings.
 * Uses Radix Tabs for keyboard accessibility.
 * Syncs with URL search params (?category=research).
 * Horizontal scroll on mobile.
 */
export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "all";

  function handleValueChange(value: string) {
    if (value === "all") {
      router.push("/articles");
    } else {
      router.push(`/articles?category=${value}`);
    }
  }

  return (
    <Tabs.Root
      value={activeCategory}
      onValueChange={handleValueChange}
    >
      <Tabs.List
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
        aria-label="Filter articles by category"
      >
        <Tabs.Trigger
          value="all"
          className={cn(
            "shrink-0 px-4 py-1.5 text-sm font-mono uppercase tracking-wider rounded-none",
            "transition-colors duration-200 border",
            "focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2",
            activeCategory === "all"
              ? "bg-gold text-ink border-gold font-semibold"
              : "text-muted border-gold/[0.18] hover:text-paper hover:border-gold/40"
          )}
        >
          All
        </Tabs.Trigger>

        {CATEGORIES.map((cat) => (
          <Tabs.Trigger
            key={cat.value}
            value={cat.value}
            className={cn(
              "shrink-0 px-4 py-1.5 text-sm font-mono uppercase tracking-wider rounded-none",
              "transition-colors duration-200 border",
              "focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2",
              activeCategory === cat.value
                ? "bg-gold text-ink border-gold font-semibold"
                : "text-muted border-gold/[0.18] hover:text-paper hover:border-gold/40"
            )}
          >
            {cat.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
