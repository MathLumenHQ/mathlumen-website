import { Suspense } from "react";
import Link from "next/link";

export const revalidate = 3600;
import { getArticles } from "@/lib/queries/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import { CategoryFilter } from "@/components/article/CategoryFilter";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { MathFormula } from "@/components/brand/MathFormula";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProblemOfTheWeek } from "@/components/ProblemOfTheWeek";
import type { Category } from "@/schema/types";

/* ═══════════════════════════════════════════════════════════════════════
   CONTENT PILLARS DATA
   ═══════════════════════════════════════════════════════════════════════ */

const HERO_FORMULA = "e^{i\\pi} + 1 = 0";

const PILLARS = [
  {
    num: "01",
    title: "History of Mathematics",
    description:
      "From ancient Babylon to Ramanujan — the lives and revolutions that built modern mathematics.",
  },
  {
    num: "02",
    title: "Research Articles",
    description:
      "Rigorous coverage of new papers, breakthroughs, and open problems across all branches of mathematics.",
  },
  {
    num: "03",
    title: "Applied Mathematics",
    description:
      "PDEs, numerical methods, optimization — mathematics that powers the physical world.",
  },
  {
    num: "04",
    title: "Mathematics of AI",
    description:
      "Backpropagation, transformers, information theory — the deep mathematics behind artificial intelligence.",
  },
  {
    num: "05",
    title: "Long-form Essays",
    description:
      'Ideas worth 5,000 words. Elegant expositions of beautiful mathematics for the curious mind.',
  },
  {
    num: "06",
    title: "Latest Developments",
    description:
      "Weekly coverage of what's new — from arXiv to Fields Medal announcements.",
  },
] as const;

const FLOATING_SYMBOLS = [
  { char: "\u2211", top: "8%", right: "12%", className: "float-slow text-5xl opacity-[0.06]", delay: "0s" },
  { char: "\u2202", top: "22%", right: "28%", className: "float-medium text-4xl opacity-[0.05]", delay: "0.5s" },
  { char: "\u2207", top: "45%", right: "8%", className: "float-fast text-3xl opacity-[0.07]", delay: "1s" },
  { char: "\u222B", top: "15%", right: "45%", className: "float-medium text-6xl opacity-[0.04]", delay: "0.8s" },
  { char: "\u03C0", top: "60%", right: "22%", className: "float-slow text-4xl opacity-[0.06]", delay: "1.5s" },
  { char: "\u221E", top: "70%", right: "42%", className: "float-fast text-3xl opacity-[0.05]", delay: "0.3s" },
  { char: "\u03BB", top: "35%", right: "52%", className: "float-medium text-3xl opacity-[0.08]", delay: "2s" },
  { char: "\u0394", top: "80%", right: "15%", className: "float-slow text-4xl opacity-[0.05]", delay: "1.2s" },
] as const;

const CATEGORY_ROWS: { category: Category; label: string }[] = [
  { category: "history", label: "History" },
  { category: "research", label: "Research" },
  { category: "applied", label: "Applied Math" },
  { category: "ai-ml", label: "AI & ML" },
];

/* ═══════════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MathLumen",
    url: "https://mathlumen.com",
    description:
      "A scholarly mathematics publication exploring the beauty, history, and applications of mathematics.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://mathlumen.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Section 1: HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
        {/* Background: radial gradient + math grid + noise */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-ink)_0%,_var(--color-ink-2)_100%)]" />
        <div className="absolute inset-0 math-grid" />
        <div className="absolute inset-0 noise-overlay" />

        {/* Horizontal light streak */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-center">
            {/* Left: Content */}
            <div>
              {/* Eyebrow */}
              <p className="fade-up font-mono text-gold uppercase tracking-[0.2em] text-sm mb-6">
                A Mathematics Publication
              </p>

              {/* H1 */}
              <h1 className="fade-up fade-up-delay-1 mb-6">
                <span className="block font-display font-black text-[2.5rem] sm:text-5xl lg:text-[4rem] text-paper leading-[1.08]">
                  Illuminating
                </span>
                <span className="block font-display font-black text-[2.5rem] sm:text-5xl lg:text-[4rem] italic text-gold leading-[1.08]">
                  Mathematics
                </span>
              </h1>

              {/* Formula */}
              <div className="fade-up fade-up-delay-2 mb-6">
                <MathFormula formula={HERO_FORMULA} display />
              </div>

              {/* Description */}
              <p className="fade-up fade-up-delay-3 text-lg sm:text-xl font-body text-paper/70 leading-relaxed max-w-[520px] mb-8">
                Where rigorous mathematics meets beautiful exposition. Research, history,
                and the deep mathematics powering artificial intelligence.
              </p>

              {/* CTAs */}
              <div className="fade-up fade-up-delay-4 flex flex-wrap gap-4 items-center">
                <Link href="/articles">
                  <Button variant="gold" size="lg">
                    Start Reading
                  </Button>
                </Link>
                <Link href="/category/research">
                  <Button variant="ghost" size="lg">
                    Latest Research
                  </Button>
                </Link>
                <Link href="/problem-of-the-week" className="potw-btn">
                  <span className="potw-dot animate-pulse" aria-hidden="true" />
                  Problem of the Week →
                </Link>
              </div>
            </div>

            {/* Right: Logo + floating symbols */}
            <div className="hidden lg:flex items-center justify-center relative h-[480px]">
              {/* Logo */}
              <div className="fade-up fade-up-delay-2">
                <Logo size="xl" variant="gold" animated />
              </div>

              {/* Floating math symbols */}
              {FLOATING_SYMBOLS.map((sym) => (
                <span
                  key={sym.char}
                  className={`absolute font-display text-gold select-none pointer-events-none ${sym.className}`}
                  style={{
                    top: sym.top,
                    right: sym.right,
                    animationDelay: sym.delay,
                  }}
                  aria-hidden="true"
                >
                  {sym.char}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bounce-down">
          <svg
            className="w-6 h-6 text-gold/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* ── Section 2: CONTENT PILLARS ──────────────────────────────── */}
      <section className="bg-ink-2 border-y border-gold/[0.18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Section heading */}
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-paper mb-4">
              What We Cover
            </h2>
            <Separator gold className="max-w-[80px] mx-auto" />
          </div>

          {/* 3x2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.num}
                className="pillar-card relative group p-6 border border-gold/[0.18] rounded-none bg-ink transition-all duration-200 hover:bg-gold/[0.03]"
              >
                <span className="block font-mono text-gold text-sm mb-3">
                  {pillar.num}
                </span>
                <h3 className="font-display text-lg font-bold text-paper mb-2">
                  {pillar.title}
                </h3>
                <p className="font-body text-muted text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: FEATURED ARTICLES ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-paper">
            Featured
          </h2>
          <Link
            href="/articles"
            className="text-sm text-gold hover:text-gold-light transition-colors duration-200 font-mono"
          >
            View all &rarr;
          </Link>
        </div>

        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedArticles />
        </Suspense>
      </section>

      <Separator gold className="max-w-7xl mx-auto" />

      {/* ── Section 3b: LATEST NEWS ──────────────────────────────────── */}
      <Suspense fallback={null}>
        <LatestNewsSection />
      </Suspense>

      {/* ── Section 3c: PROBLEM OF THE WEEK ─────────────────────────── */}
      <Suspense fallback={<ProblemOfTheWeekSkeleton />}>
        <ProblemOfTheWeek />
      </Suspense>

      {/* ── Section 4: LATEST BY CATEGORY ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-paper mb-6">
            Latest Articles
          </h2>
          <Suspense fallback={<Skeleton className="h-10 w-full max-w-xl" />}>
            <CategoryFilter />
          </Suspense>
        </div>

        <Suspense fallback={<GridSkeleton count={6} />}>
          <LatestArticles />
        </Suspense>

        <div className="mt-10 text-center">
          <Link
            href="/articles"
            className="text-sm text-gold hover:text-gold-light transition-colors duration-200 font-mono"
          >
            View all articles &rarr;
          </Link>
        </div>
      </section>

      {/* ── Section 5: NEWSLETTER CTA ───────────────────────────────── */}
      <section className="bg-ink border-y border-gold/[0.18]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="font-mono text-gold uppercase tracking-[0.2em] text-sm mb-4">
            Stay Current
          </p>
          <h2 className="font-display text-3xl md:text-[2.5rem] font-black text-paper mb-4 leading-tight">
            Mathematics, Delivered Weekly
          </h2>
          <p className="font-body text-muted text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            New research, historical deep-dives, and the mathematics of AI — every Sunday morning.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
          <p className="mt-6 text-xs text-muted/60 font-mono">
            Join mathematicians and researchers worldwide
          </p>
        </div>
      </section>

      {/* ── Section 6: MLTEX EDITOR PROMO ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative border border-gold/[0.18] overflow-hidden">
          {/* Subtle background */}
          <div className="absolute inset-0 bg-gradient-to-r from-gold/[0.03] via-transparent to-gold/[0.03]" />

          <div className="relative flex flex-col lg:flex-row items-center gap-8 p-8 lg:p-12">
            {/* Left: content */}
            <div className="flex-1 text-center lg:text-left">
              <p className="font-mono text-gold uppercase tracking-[0.2em] text-xs mb-3">
                Free Tool
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-paper mb-3">
                MLTeX
              </h2>
              <p className="font-body text-muted text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
                Write and preview math equations in real-time. Split-pane editor
                with MathJax rendering, templates, dark &amp; light modes, and
                fullscreen support — no sign-up required.
              </p>
            </div>

            {/* Right: preview snippet + CTA */}
            <div className="shrink-0 flex flex-col items-center gap-5">
              {/* Mini formula preview */}
              <div className="px-6 py-4 bg-ink-2 border border-gold/10 text-center">
                <p className="font-mono text-gold/70 text-xs mb-2">Live Preview</p>
                <MathFormula formula={HERO_FORMULA} display />
              </div>
              <Link href="/tools/mltex">
                <Button variant="gold" size="lg">
                  Open Editor &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: RECENT FROM EACH CATEGORY ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {CATEGORY_ROWS.map((row) => (
          <Suspense key={row.category} fallback={<CategoryRowSkeleton label={row.label} />}>
            <CategoryRow category={row.category} label={row.label} />
          </Suspense>
        ))}
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ASYNC SUB-COMPONENTS (Server Components with data fetching)
   ═══════════════════════════════════════════════════════════════════════ */

/** Featured articles: 1 large (left 60%) + up to 3 sidebar (right 40%) */
async function FeaturedArticles() {
  const result = await getArticles({ featured: true, limit: 4 });
  const articles = result.data;

  if (articles.length === 0) {
    return <FeaturedEmptyState />;
  }

  const lead = articles[0];
  const sidebar = articles.slice(1, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
      {/* Large featured card */}
      {lead && (
        <ArticleCard article={lead} layout="featured" />
      )}

      {/* Sidebar: numbered list */}
      <div className="flex flex-col gap-0 border border-gold/[0.18] rounded-none divide-y divide-gold/[0.10]">
        {sidebar.map((article, idx) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group flex gap-4 p-5 hover:bg-gold/[0.03] transition-colors duration-200"
          >
            <span className="font-mono text-gold text-sm shrink-0 pt-0.5">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-base font-semibold text-paper leading-snug group-hover:text-gold-light transition-colors duration-200 mb-1.5">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted font-mono">
                <span className="uppercase">{article.category}</span>
                {article.publishedAt && (
                  <>
                    <span className="text-gold/20">&middot;</span>
                    <time dateTime={new Date(article.publishedAt).toISOString()}>
                      {new Date(article.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}

        {/* Fill remaining slots as "Coming soon" if fewer than 3 */}
        {Array.from({ length: Math.max(0, 3 - sidebar.length) }).map((_, i) => (
          <div key={`placeholder-${i}`} className="flex gap-4 p-5 opacity-40">
            <span className="font-mono text-gold text-sm shrink-0 pt-0.5">
              {String(sidebar.length + i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-display text-base text-muted italic">Coming soon</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Latest 6 articles for the category tab section */
async function LatestArticles() {
  const result = await getArticles({ limit: 6 });

  if (result.data.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-display text-xl text-muted italic mb-2">
          We&apos;re preparing our first articles.
        </p>
        <p className="text-muted text-sm mb-8">
          Subscribe to be notified when we publish.
        </p>
        <div className="max-w-md mx-auto">
          <NewsletterForm />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {result.data.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

/** Latest News — shows only when news articles exist */
async function LatestNewsSection() {
  let result;
  try {
    result = await getArticles({ category: "news", limit: 3, sort: "newest" });
  } catch {
    return null;
  }
  if (result.data.length === 0) return null;

  return (
    <>
      <Separator gold className="max-w-7xl mx-auto" />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#ff8c42] animate-pulse shrink-0" aria-hidden="true" />
            <h2 className="font-display text-3xl font-bold text-paper">
              Latest News
            </h2>
          </div>
          <Link
            href="/news"
            className="text-sm text-gold hover:text-gold-light transition-colors duration-200 font-mono"
          >
            All news &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.data.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}

/** Category row — 3 articles from a single category */
async function CategoryRow({
  category,
  label,
}: {
  category: Category;
  label: string;
}) {
  const result = await getArticles({ category, limit: 3 });

  if (result.data.length === 0) return null;

  return (
    <div className="mb-16 last:mb-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-bold text-paper">{label}</h3>
        <Link
          href={`/category/${category}`}
          className="text-sm text-gold hover:text-gold-light transition-colors duration-200 font-mono"
        >
          View All &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.data.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SKELETON / EMPTY STATES
   ═══════════════════════════════════════════════════════════════════════ */

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
      <Skeleton variant="article" className="h-96" />
      <div className="flex flex-col gap-0 border border-gold/[0.18] divide-y divide-gold/[0.10]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 p-5">
            <Skeleton className="w-6 h-4" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedEmptyState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="border-2 border-dashed border-gold/30 p-8 flex flex-col items-center justify-center min-h-[220px] text-center"
        >
          <span className="font-mono text-gold/40 text-sm mb-3">
            {String(i).padStart(2, "0")}
          </span>
          <p className="font-display text-base text-muted italic">
            Featured articles coming soon
          </p>
        </div>
      ))}
    </div>
  );
}

function GridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton variant="image" className="h-48" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function ProblemOfTheWeekSkeleton() {
  return (
    <div className="bg-ink-2 border-y border-gold/[0.18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="border border-gold/[0.18] p-8 mb-6 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>
    </div>
  );
}

function CategoryRowSkeleton({ label }: { label: string }) {
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-bold text-paper">{label}</h3>
        <Skeleton className="h-4 w-20" />
      </div>
      <GridSkeleton count={3} />
    </div>
  );
}
