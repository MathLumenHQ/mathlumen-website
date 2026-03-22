/** Site-wide constants for MathLumen */

export const SITE_NAME = "MathLumen";
export const SITE_DESCRIPTION =
  "MathLumen publishes rigorous, beautifully written articles on pure and applied mathematics, the history of math, and the deep mathematics powering modern AI.";
export const SITE_URL = "https://mathlumen.com";
export const TWITTER_HANDLE = "@MathLumen";
export const GITHUB_URL = "https://github.com/MathLumen";
export const YOUTUBE_URL = "https://www.youtube.com/@TheMathLumen";
export const LINKEDIN_URL = "https://www.linkedin.com/company/mathlumen";
export const TWITTER_URL = "https://x.com/MathLumen";

export const CATEGORIES = [
  { value: "history", label: "History", description: "The stories behind mathematical breakthroughs" },
  { value: "research", label: "Research", description: "Frontiers of mathematical discovery" },
  { value: "applied", label: "Applied Math", description: "Mathematics in practice and engineering" },
  { value: "ai-ml", label: "AI & ML", description: "The mathematics powering artificial intelligence" },
  { value: "essay", label: "Essays", description: "Reflections on mathematical beauty and philosophy" },
  { value: "news", label: "News", description: "Prizes, breakthroughs, and latest developments in mathematics" },
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
  { href: "/news", label: "News" },
  { href: "/tools/mltex", label: "MLTeX" },
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
  { href: "/news", label: "News" },
  { href: "/tools/mltex", label: "MLTeX" },
  { href: "/authors", label: "Authors" },
  { href: "/about", label: "About" },
  { href: "/archive", label: "Archive" },
] as const;

export const FOOTER_LINKS = {
  publication: [
    { href: "/about", label: "About" },
    { href: "/topics", label: "All Topics" },
    { href: "/authors", label: "Write for Us" },
    { href: "/archive", label: "Archive" },
  ],
  topics: [
    { href: "/category/research", label: "Research" },
    { href: "/category/history", label: "History" },
    { href: "/category/applied", label: "Applied Math" },
    { href: "/category/ai-ml", label: "AI & ML" },
    { href: "/category/essay", label: "Essays" },
    { href: "/news", label: "News" },
  ],
  tools: [
    { href: "/tools/mltex", label: "MLTeX" },
  ],
} as const;
