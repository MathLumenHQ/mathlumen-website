"use client";

/**
 * Button that opens the global SearchDialog via custom event.
 */
export function SearchButton() {
  return (
    <button
      type="button"
      onClick={() => {
        document.dispatchEvent(new CustomEvent("open-search"));
      }}
      className="flex items-center gap-2 text-sm text-muted hover:text-paper transition-colors duration-200 px-3 py-1.5 border border-gold/[0.18]"
      aria-label="Search articles"
    >
      <svg
        className="w-4 h-4"
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
      Search
    </button>
  );
}
