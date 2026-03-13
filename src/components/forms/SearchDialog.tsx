"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { ArticleWithAuthor } from "@/schema/types";

/**
 * Search dialog with keyboard shortcut (Cmd/Ctrl + K) support.
 * Performs full-text search via the /api/search endpoint.
 */
export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ArticleWithAuthor[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // Debounced search
  const handleSearch = useCallback((value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(value)}&limit=10`);
        const json = await res.json() as { success: boolean; data?: ArticleWithAuthor[] };

        if (json.success && json.data) {
          setResults(json.data);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-muted hover:text-paper transition-colors duration-200 px-3 py-1.5 border border-gold/20 rounded-sm"
        aria-label="Search articles"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline text-xs text-muted/50 font-mono ml-2">
          Ctrl+K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Search">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Dialog */}
      <div className="relative max-w-2xl mx-auto mt-[15vh] mx-4">
        <div className="bg-ink-2 border border-gold/20 rounded-md shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 border-b border-gold/10">
            <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 bg-transparent text-paper py-4 focus:outline-none placeholder:text-muted font-body"
            />
            <kbd className="text-xs text-muted/50 font-mono px-1.5 py-0.5 border border-gold/10 rounded">
              Esc
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="px-4 py-8 text-center text-muted text-sm">Searching...</div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="px-4 py-8 text-center text-muted text-sm">
                No articles found for &quot;{query}&quot;
              </div>
            )}

            {results.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className={cn(
                  "block px-4 py-3 hover:bg-gold/5 transition-colors duration-150",
                  "border-b border-gold/5 last:border-b-0"
                )}
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="gold" className="text-[10px]">{article.category}</Badge>
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
        </div>
      </div>
    </div>
  );
}
