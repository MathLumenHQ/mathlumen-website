import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { currentProblem } from "@/lib/problem-of-the-week";
import type { ProblemDifficulty } from "@/lib/problem-of-the-week";
import { createMetadata } from "@/lib/metadata";
import { getPowIssueHref, getPublishedPowIssueBySlug } from "@/lib/queries/pow";
import { SubmissionForm } from "./SubmissionForm";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: `Problem of the Week #${currentProblem.number}`,
  description: `Submit your solution to MathLumen Problem of the Week #${currentProblem.number}. Deadline: ${currentProblem.deadline}.`,
  path: "/problem-of-the-week",
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

/** Compile a Markdown+LaTeX string with remark-math and rehype-katex. */
async function compileMath(source: string) {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeKatex as never],
      },
    },
  });
  return content;
}

export default async function ProblemOfTheWeekPage() {
  const [statementContent, hintContent, previousIssue] = await Promise.all([
    compileMath(currentProblem.statement),
    currentProblem.hint ? compileMath(currentProblem.hint) : Promise.resolve(null),
    currentProblem.previousSlug
      ? getPublishedPowIssueBySlug(currentProblem.previousSlug)
      : Promise.resolve(null),
  ]);

  const weekLabel = new Date(currentProblem.weekOf).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const deadlineLabel = new Date(currentProblem.deadline).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs font-mono text-muted">
          <li>
            <Link href="/" className="hover:text-gold transition-colors duration-200">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-gold/30">/</li>
          <li className="text-paper/60">Problem of the Week</li>
        </ol>
      </nav>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <p className="font-mono text-gold uppercase tracking-[0.2em] text-xs">
            Problem of the Week
          </p>
          <span
            className={`inline-block px-2.5 py-0.5 text-xs font-mono border ${DIFFICULTY_STYLES[currentProblem.difficulty]}`}
          >
            {DIFFICULTY_LABELS[currentProblem.difficulty]}
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black text-paper leading-tight mb-4">
          Problem #{currentProblem.number}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted font-mono flex-wrap">
          <span>
            Week of{" "}
            <time dateTime={currentProblem.weekOf} className="text-paper/80">
              {weekLabel}
            </time>
          </span>
          <span className="text-gold/30">&middot;</span>
          <span>
            Deadline:{" "}
            <time dateTime={currentProblem.deadline} className="text-paper/80">
              {deadlineLabel}
            </time>
          </span>
        </div>
        <div className="mt-6 h-px bg-gold/[0.18]" />
      </header>

      {/* ── Problem statement ──────────────────────────────────────── */}
      <section aria-labelledby="problem-statement-heading" className="mb-10">
        <h2
          id="problem-statement-heading"
          className="font-display text-lg font-semibold text-gold-light mb-4 uppercase tracking-wider text-sm"
        >
          Problem Statement
        </h2>
        <div className="border border-gold/[0.18] p-6 md:p-8 bg-ink-2">
          <div className="prose">{statementContent}</div>
        </div>
      </section>

      {/* ── Hint (collapsible) ─────────────────────────────────────── */}
      {hintContent && (
        <section aria-labelledby="hint-heading" className="mb-10">
          <details className="border border-gold/[0.12] group">
            <summary
              id="hint-heading"
              className="px-5 py-3 font-mono text-sm text-gold/70 hover:text-gold cursor-pointer select-none transition-colors duration-200 list-none flex items-center justify-between"
            >
              <span>Show Hint</span>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </summary>
            <div className="px-5 pb-5 pt-2 border-t border-gold/[0.12]">
              <div className="prose">{hintContent}</div>
            </div>
          </details>
        </section>
      )}

      {/* ── Submission form ────────────────────────────────────────── */}
      <section aria-labelledby="submission-heading" className="mb-14">
        <h2
          id="submission-heading"
          className="font-display text-2xl font-bold text-paper mb-2"
        >
          Submit Your Solution
        </h2>
        <p className="text-muted text-sm font-body mb-6">
          Write out your complete proof below. We review all submissions and
          publish a solution article the following week.
        </p>
        <SubmissionForm problemNumber={currentProblem.number} />
      </section>

      {/* ── Previous solution link ─────────────────────────────────── */}
      {currentProblem.previousSlug && (
        <section className="border-t border-gold/[0.18] pt-8">
          <p className="font-mono text-xs text-gold uppercase tracking-[0.2em] mb-3">
            Last Week&apos;s Solution
          </p>
          <Link
            href={previousIssue ? getPowIssueHref(previousIssue.publicId) : `/${currentProblem.previousSlug}`}
            className="inline-flex items-center gap-2 text-paper hover:text-gold transition-colors duration-200 font-body"
          >
            <span aria-hidden="true" className="text-gold/50">&rarr;</span>
            Read Problem #{currentProblem.number - 1} solution
          </Link>
        </section>
      )}

      {/* ── Archive link ───────────────────────────────────────────── */}
      <div className="mt-8 pt-6 border-t border-gold/[0.12]">
        <Link
          href="/problem-of-the-week/archive"
          className="font-mono text-xs text-gold/60 hover:text-gold transition-colors duration-200 uppercase tracking-[0.15em]"
        >
          View all past problems →
        </Link>
      </div>
    </div>
  );
}
