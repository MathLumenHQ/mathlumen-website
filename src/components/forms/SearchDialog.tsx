"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { ArticleWithAuthor } from "@/schema/types";
import type { Category } from "@/schema/types";

/**
 * Full-text search dialog triggered by Cmd+K (Mac) / Ctrl+K (Windows).
 * Built on Radix Dialog with:
 * - Auto-focused input
 * - Debounced search (300ms)
 * - Keyboard navigation (arrows + enter)
 * - Category badges on results
 * - Empty / no-results / loading states
 *
 * This component renders no visible trigger — it is opened by:
 * 1. Global Cmd/Ctrl+K keyboard shortcut
 * 2. Custom "open-search" event dispatched by Navigation's search button
 */
export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ArticleWithAuthor[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcut: Cmd/Ctrl + K
  // Also listens for custom "open-search" event from Nav button
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    function handleOpenSearch() {
      setOpen(true);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("open-search", handleOpenSearch);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("open-search", handleOpenSearch);
    };
  }, []);

  // Reset state when dialog closes
  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
    }
  }

  // Debounced search
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setActiveIndex(-1);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(value)}&limit=10`
        );
        const json = (await res.json()) as {
          success: boolean;
          data?: ArticleWithAuthor[];
        };

        if (json.success && json.data) {
          setResults(json.data);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  // Keyboard navigation within results
  function handleKeyDown(e: React.KeyboardEvent) {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const article = results[activeIndex];
      if (article) {
        setOpen(false);
        router.push(`/articles/${article.slug}`);
      }
    }
  }

  // Scroll active result into view
  useEffect(() => {
    if (activeIndex < 0 || !resultsRef.current) return;
    const items = resultsRef.current.querySelectorAll("[data-search-item]");
    items[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {/* Backdrop overlay */}
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-sm" />

        {/* Dialog panel */}
        <Dialog.Content
          className="fixed top-[15vh] left-1/2 z-[100] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2"
          onKeyDown={handleKeyDown}
        >
          <VisuallyHidden.Root>
            <Dialog.Title>Search articles</Dialog.Title>
            <Dialog.Description>
              Type to search across all published articles
            </Dialog.Description>
          </VisuallyHidden.Root>

          <div className="bg-ink-2 border border-gold/[0.18] rounded-none shadow-2xl overflow-hidden">
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b border-gold/[0.10]">
              <SearchIcon />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search articles..."
                className="flex-1 bg-transparent text-paper py-4 focus:outline-none placeholder:text-muted font-body"
                autoComplete="off"
                autoFocus
                aria-label="Search articles"
                role="combobox"
                aria-controls="search-results-listbox"
                aria-expanded={results.length > 0}
                aria-activedescendant={
                  activeIndex >= 0 ? `search-result-${activeIndex}` : undefined
                }
              />
              <kbd className="text-[10px] text-muted/50 font-mono px-1.5 py-0.5 border border-gold/10 rounded-none">
                Esc
              </kbd>
            </div>

            {/* Results area */}
            <div
              ref={resultsRef}
              className="max-h-[60vh] overflow-y-auto"
              id="search-results-listbox"
              role="listbox"
            >
              {/* Loading */}
              {loading && (
                <div className="px-4 py-8 text-center text-muted text-sm">
                  Searching...
                </div>
              )}

              {/* Empty — haven't started typing */}
              {!loading && query.length < 2 && (
                <div className="px-4 py-8 text-center text-muted text-sm">
                  Start typing to search...
                </div>
              )}

              {/* No results */}
              {!loading && query.length >= 2 && results.length === 0 && (
                <div className="px-4 py-8 text-center text-muted text-sm">
                  No articles found for &quot;{query}&quot;
                </div>
              )}

              {/* Results list */}
              {results.map((article, idx) => (
                <Link
                  key={article.id}
                  id={`search-result-${idx}`}
                  href={`/articles/${article.slug}`}
                  data-search-item
                  role="option"
                  aria-selected={idx === activeIndex}
                  className={cn(
                    "block px-4 py-3 transition-colors duration-150",
                    "border-b border-gold/5 last:border-b-0",
                    idx === activeIndex
                      ? "bg-gold/10"
                      : "hover:bg-gold/5"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      category={article.category as Category}
                      size="sm"
                    >
                      {article.category}
                    </Badge>
                    {article.publishedAt && (
                      <span className="text-xs text-muted font-mono">
                        {formatDate(article.publishedAt)}
                      </span>
                    )}
                  </div>
                  <h4 className="text-paper font-display font-semibold text-sm">
                    {article.title}
                  </h4>
                  <p className="text-muted text-xs mt-1 line-clamp-1">
                    {article.excerpt}
                  </p>
                </Link>
              ))}
            </div>

            {/* Footer hint */}
            {results.length > 0 && (
              <div className="px-4 py-2 border-t border-gold/[0.10] flex items-center gap-4 text-[10px] text-muted font-mono">
                <span>
                  <kbd className="px-1 py-px border border-gold/10 rounded-none">
                    &uarr;&darr;
                  </kbd>{" "}
                  navigate
                </span>
                <span>
                  <kbd className="px-1 py-px border border-gold/10 rounded-none">
                    Enter
                  </kbd>{" "}
                  open
                </span>
                <span>
                  <kbd className="px-1 py-px border border-gold/10 rounded-none">
                    Esc
                  </kbd>{" "}
                  close
                </span>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Magnifying glass icon */
function SearchIcon() {
  return (
    <svg
      className="w-5 h-5 text-muted shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}
