"use client";

import { useRouter, useSearchParams } from "next/navigation";

/**
 * Sort dropdown for article listing pages.
 * Navigates via URL search params.
 */
export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "newest";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", e.target.value);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `?${qs}` : window.location.pathname);
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="text-xs text-muted font-mono uppercase tracking-wider"
      >
        Sort
      </label>
      <select
        id="sort-select"
        value={sort}
        onChange={handleChange}
        className="bg-ink-2 border border-gold/[0.18] text-paper text-sm px-3 py-1.5 font-body focus:outline-none focus:border-gold transition-colors duration-200"
      >
        <option value="newest">Newest</option>
        <option value="popular">Most Read</option>
        <option value="featured">Featured</option>
      </select>
    </div>
  );
}
