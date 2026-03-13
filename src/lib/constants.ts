/** Site-wide constants for MathLumen */

export const SITE_NAME = "MathLumen";
export const SITE_DESCRIPTION =
  "A scholarly mathematics publication exploring the beauty, history, and applications of mathematics.";
export const SITE_URL = "https://mathlumen.com";
export const TWITTER_HANDLE = "@TheMathLumen";
export const GITHUB_URL = "https://github.com/mathlumen";

export const CATEGORIES = [
  { value: "history", label: "History", description: "The stories behind mathematical breakthroughs" },
  { value: "research", label: "Research", description: "Frontiers of mathematical discovery" },
  { value: "applied", label: "Applied Math", description: "Mathematics in practice and engineering" },
  { value: "ai-ml", label: "AI & ML", description: "The mathematics powering artificial intelligence" },
  { value: "essay", label: "Essays", description: "Reflections on mathematical beauty and philosophy" },
] as const;

export const ARTICLES_PER_PAGE = 12;
export const RELATED_ARTICLES_COUNT = 3;
export const MAX_SEARCH_RESULTS = 20;

/** Navigation links used in the top nav bar category section */
export const NAV_CATEGORY_LINKS = [
  { href: "/category/research", label: "Research" },
  { href: "/category/history", label: "History" },
  { href: "/category/applied", label: "Applied Math" },
  { href: "/category/ai-ml", label: "AI & ML" },
  { href: "/category/essay", label: "Essays" },
] as const;

/** Full navigation links for mobile drawer */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/category/research", label: "Research" },
  { href: "/category/history", label: "History" },
  { href: "/category/applied", label: "Applied Math" },
  { href: "/category/ai-ml", label: "AI & ML" },
  { href: "/category/essay", label: "Essays" },
  { href: "/authors", label: "Authors" },
  { href: "/about", label: "About" },
  { href: "/archive", label: "Archive" },
] as const;

export const FOOTER_LINKS = {
  publication: [
    { href: "/about", label: "About" },
    { href: "/authors", label: "Write for Us" },
    { href: "/archive", label: "Archive" },
  ],
  topics: [
    { href: "/category/research", label: "Research" },
    { href: "/category/history", label: "History" },
    { href: "/category/applied", label: "Applied Math" },
    { href: "/category/ai-ml", label: "AI & ML" },
    { href: "/category/essay", label: "Essays" },
  ],
} as const;
