"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  /** Pre-computed headings. If omitted, scans the DOM on mount. */
  headings?: TocItem[];
}

/**
 * Table of contents sidebar for article pages.
 * - Fixed on desktop (lg+)
 * - Active heading highlighted with gold left border
 * - Smooth scrolls to heading on click
 * - Tracks scroll position via IntersectionObserver
 */
export function TableOfContents({ headings: propHeadings }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>(propHeadings ?? []);
  const [activeId, setActiveId] = useState<string>("");

  // Auto-scan headings from article DOM if not provided via props
  useEffect(() => {
    if (propHeadings) return;

    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const items: TocItem[] = Array.from(elements).map((el) => {
      if (!el.id) {
        el.id =
          el.textContent
            ?.toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-") ?? "";
      }
      return {
        id: el.id,
        text: el.textContent ?? "",
        level: el.tagName === "H2" ? 2 : 3,
      };
    });

    // DOM scan to sync headings into state — valid external-system sync
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(items);
  }, [propHeadings]);

  // Track active heading via IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveId(id);
        // Update URL hash without jumping
        window.history.replaceState(null, "", `#${id}`);
      }
    },
    []
  );

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-1" aria-label="Table of contents">
      <h4 className="font-display text-sm font-semibold text-gold-light uppercase tracking-wider mb-3">
        Contents
      </h4>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          onClick={(e) => handleClick(e, heading.id)}
          className={cn(
            "block text-sm py-1 transition-all duration-200 border-l-2",
            heading.level === 3 ? "pl-6" : "pl-3",
            activeId === heading.id
              ? "text-gold border-l-gold"
              : "text-muted hover:text-paper border-l-transparent hover:border-l-gold/30"
          )}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
