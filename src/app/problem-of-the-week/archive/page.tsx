import Link from "next/link";
import type { Metadata } from "next";
import { getAllProblems } from "@/lib/problem-of-the-week";
import type { Problem, ProblemDifficulty } from "@/lib/problem-of-the-week";
import { createMetadata } from "@/lib/metadata";
import { getPowIssueHref, getPublishedPowIssues } from "@/lib/queries/pow";

export const metadata: Metadata = createMetadata({
  title: "Problem of the Week — Archive",
  description: "All past MathLumen Problems of the Week with full solutions.",
  path: "/problem-of-the-week/archive",
});

const DIFFICULTY_LABELS: Record<ProblemDifficulty, string> = {
  undergraduate: "Undergraduate",
  graduate: "Graduate",
  competition: "Competition",
};

const DIFFICULTY_STYLES: Record<ProblemDifficulty, string> = {
  undergraduate: "text-paper/70 border-paper/25",
  graduate: "text-gold border-gold/35",
  competition: "text-[#ff8c42] border-[#ff8c42]/35",
};

function formatWeekOf(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Strip LaTeX delimiters so the statement preview renders as plain text. */
function statementPreview(statement: string): string {
  return statement.replace(/\$\$?[^$]+\$\$?/g, "[math]").slice(0, 120) + "…";
}

function ProblemCard({
  problem,
  solutionHref,
}: {
  problem: Problem & { solutionSlug: string };
  solutionHref: string;
}) {
  return (
    <article className="py-6 border-b border-gold/[0.12] last:border-b-0">
      {/* ── Meta row ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-mono text-gold text-sm">
          #{problem.number}
        </span>
        <span className="text-gold/30 font-mono text-xs">&middot;</span>
        <span
          className={`inline-block px-2 py-px text-[10px] font-mono border ${DIFFICULTY_STYLES[problem.difficulty]}`}
        >
          {DIFFICULTY_LABELS[problem.difficulty]}
        </span>
        <span className="text-gold/30 font-mono text-xs">&middot;</span>
        <time
          dateTime={problem.weekOf}
          className="font-mono text-xs text-muted"
        >
          Week of {formatWeekOf(problem.weekOf)}
        </time>
      </div>

      {/* ── Topics ───────────────────────────────────────── */}
      {problem.topics && problem.topics.length > 0 && (
        <p className="font-mono text-xs text-muted mb-3">
          {problem.topics.join(" · ")}
        </p>
      )}

      {/* ── Statement preview ────────────────────────────── */}
      <p className="font-body text-sm text-paper/60 leading-relaxed mb-4">
        {statementPreview(problem.statement)}
      </p>

      {/* ── Read solution link ───────────────────────────── */}
      <Link
        href={solutionHref}
        className="inline-flex items-center gap-2 text-paper hover:text-gold transition-colors duration-200 font-body text-sm"
      >
        <span aria-hidden="true" className="text-gold/50">&rarr;</span>
        Read solution
      </Link>
    </article>
  );
}

export default async function ProblemArchivePage() {
  const solved = getAllProblems().filter(
    (p): p is Problem & { solutionSlug: string } =>
      typeof p.solutionSlug === "string" && p.solutionSlug.length > 0
  );
  const publishedIssues = await getPublishedPowIssues({ limit: 1000 });
  const hrefBySlug = new Map(
    publishedIssues.map((issue) => [issue.slug, getPowIssueHref(issue.publicId)])
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ── Breadcrumb ───────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs font-mono text-muted">
          <li>
            <Link href="/" className="hover:text-gold transition-colors duration-200">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-gold/30">/</li>
          <li>
            <Link
              href="/problem-of-the-week"
              className="hover:text-gold transition-colors duration-200"
            >
              Problem of the Week
            </Link>
          </li>
          <li aria-hidden="true" className="text-gold/30">/</li>
          <li className="text-paper/60">Archive</li>
        </ol>
      </nav>

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="mb-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="font-mono text-gold uppercase tracking-[0.2em] text-xs mb-4">
              Problem of the Week
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-black text-paper leading-tight">
              Archive
            </h1>
          </div>
          <Link
            href="/problem-of-the-week"
            className="shrink-0 font-mono text-xs text-gold/60 hover:text-gold transition-colors duration-200 mt-1"
          >
            &larr; Current problem
          </Link>
        </div>

        <p className="font-mono text-xs text-muted mb-2">
          {solved.length} {solved.length === 1 ? "problem" : "problems"} solved
        </p>
        <div className="h-px bg-gold/[0.18]" />
      </header>

      {/* ── Problem list ─────────────────────────────────────────── */}
      {solved.length === 0 ? (
        <div className="border border-gold/[0.12] p-8 text-center">
          <p className="font-display text-lg text-muted italic">
            No archived problems yet. Check back next week.
          </p>
        </div>
      ) : (
        <section aria-label="Archived problems">
          {solved.map((problem) => (
            <ProblemCard
              key={problem.number}
              problem={problem}
              solutionHref={hrefBySlug.get(problem.solutionSlug) ?? `/${problem.solutionSlug}`}
            />
          ))}
        </section>
      )}
    </div>
  );
}
