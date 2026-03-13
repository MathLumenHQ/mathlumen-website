"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Auto-generated table of contents that highlights the current section.
 * Scans the article for h2 and h3 headings.
 */
export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const items: TocItem[] = Array.from(elements).map((el) => {
      if (!el.id) {
        el.id = el.textContent
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

    setHeadings(items);
  }, []);

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
          className={cn(
            "block text-sm py-1 transition-colors duration-200 border-l-2",
            heading.level === 3 ? "pl-6" : "pl-3",
            activeId === heading.id
              ? "text-gold border-l-gold"
              : "text-muted hover:text-paper border-l-transparent"
          )}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
