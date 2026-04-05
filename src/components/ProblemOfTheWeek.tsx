import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { currentProblem } from "@/lib/problem-of-the-week";
import type { ProblemDifficulty } from "@/lib/problem-of-the-week";

const DIFFICULTY_LABELS: Record<ProblemDifficulty, string> = {
  undergraduate: "Undergraduate",
  graduate: "Graduate",
  competition: "Competition",
};

/*
 * Colors chosen to read on both dark (--color-ink-2) and light (#EDEAE4)
 * section backgrounds. Orange (#ff8c42) is already used site-wide for
 * the news pulse indicator.
 */
const DIFFICULTY_STYLES: Record<ProblemDifficulty, string> = {
  undergraduate: "text-paper/70 border-paper/25",
  graduate: "text-gold border-gold/35",
  competition: "text-[#ff8c42] border-[#ff8c42]/35",
};

/**
 * Server component — compiles the problem statement with KaTeX at request
 * time. Placed between Featured and Latest Articles on the homepage.
 */
export async function ProblemOfTheWeek() {
  const { content } = await compileMDX({
    source: currentProblem.statement,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeKatex as never],
      },
    },
  });

  const weekLabel = new Date(currentProblem.weekOf).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const deadlineLabel = new Date(currentProblem.deadline).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <section className="bg-ink-2 border-y border-gold/[0.18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-gold uppercase tracking-[0.2em] text-xs mb-1.5">
              Problem of the Week
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-paper">
              Problem #{currentProblem.number}
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap sm:pt-1">
            <span
              className={`inline-block px-2.5 py-1 text-xs font-mono border ${DIFFICULTY_STYLES[currentProblem.difficulty]}`}
            >
              {DIFFICULTY_LABELS[currentProblem.difficulty]}
            </span>
            <span className="text-xs text-muted font-mono">
              Week of {weekLabel}
            </span>
          </div>
        </div>

        {/* ── Problem statement ────────────────────────────────────── */}
        <div className="border border-gold/[0.18] p-6 md:p-8 mb-6 bg-ink">
          <div className="prose">
            {content}
          </div>
        </div>

        {/* ── Footer: deadline + CTA ───────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-muted font-mono">
            Deadline:{" "}
            <time
              dateTime={currentProblem.deadline}
              className="text-paper"
            >
              {deadlineLabel}
            </time>
          </p>
          {/*
           * text-[#06080f] is the original dark ink value, hardcoded here
           * so the gold CTA button always carries readable dark text in both
           * light and dark themes. (In light mode --color-ink is parchment
           * which would produce ~1.9:1 contrast on gold — below WCAG AA.)
           */}
          <Link
            href="/problem-of-the-week"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-[#06080f] text-sm font-semibold font-body transition-colors duration-200"
          >
            View &amp; Submit Solution
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
