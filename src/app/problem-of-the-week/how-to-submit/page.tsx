import Link from "next/link";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "How to Submit a Solution — Problem of the Week",
  description:
    "Learn how to write and verify your mathematical proof using MLTeX before submitting to MathLumen's Problem of the Week.",
  path: "/problem-of-the-week/how-to-submit",
});

export default function HowToSubmitPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          <li className="text-paper/60">How to Submit</li>
        </ol>
      </nav>

      <header>
        <p className="font-mono text-gold uppercase tracking-[0.2em] text-xs mb-4">
          Problem of the Week
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-paper leading-tight mb-4">
          How to Submit a Solution
        </h1>
        <p className="text-muted font-body text-lg mb-8 leading-relaxed">
          MathLumen expects complete mathematical proofs, not just answers. This
          guide explains how to write, verify, and format your submission using
          MLTeX — our built-in LaTeX editor.
        </p>
        <div className="h-px bg-gold/[0.18] mb-12" />
      </header>

      <section className="border border-gold/[0.35] bg-ink-2 p-6 md:p-8 mb-12 relative">
        <p className="font-mono text-xs text-gold uppercase tracking-[0.2em] mb-2">
          Recommended Tool
        </p>
        <h2 className="font-display text-2xl font-bold text-paper mb-3">
          Write your proof in MLTeX
        </h2>
        <p className="text-muted font-body text-sm leading-relaxed mb-6">
          MLTeX is MathLumen&apos;s browser-based LaTeX editor with live rendering.
          Write your proof, see it rendered in real time with full KaTeX support,
          and copy the raw LaTeX to paste into the submission form. No installation
          required.
        </p>
        <div className="flex flex-col md:flex-row gap-3 md:gap-6 mb-6">
          {[
            "Live KaTeX rendering as you type",
            "No account or installation needed",
            "Copy LaTeX with one click",
          ].map((item) => (
            <p key={item} className="font-mono text-xs text-paper/70 flex items-center gap-2">
              <span className="text-gold" aria-hidden="true">•</span>
              <span>{item}</span>
            </p>
          ))}
        </div>
        <a
          href="/tools/mltex"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open MLTeX LaTeX editor in a new tab"
          className="inline-flex items-center justify-center rounded-none font-body transition-all duration-200 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 bg-ink-2 text-paper border border-gold/[0.18] hover:border-gold/40 hover:text-gold-light px-5 py-2.5 text-base gap-2"
        >
          Open MLTeX
        </a>
      </section>

      <section aria-labelledby="what-we-expect" className="mb-12">
        <h2 id="what-we-expect" className="font-display text-2xl font-bold text-paper mb-6">
          What We Expect in a Submission
        </h2>
        <p className="text-muted font-body leading-relaxed mb-6">
          A valid submission must be a complete mathematical proof — not a numerical
          answer, not a sketch, and not a reference to a known result without
          derivation. The standard is the same as a written homework solution in a
          graduate analysis or algebra course.
        </p>
        {[
          {
            heading: "Completeness",
            body: "Every logical step must be present. Do not write 'by standard arguments' or 'it is easy to see' for non-trivial steps. If you invoke a theorem, name it and verify its hypotheses apply.",
          },
          {
            heading: "Correct Notation",
            body: "Use standard mathematical notation throughout. Define every symbol when it first appears. If your proof introduces a function, state its domain and codomain. Ambiguous notation is grounds for rejection.",
          },
          {
            heading: "LaTeX Formatting",
            body: "Submit your proof as LaTeX source. All mathematical expressions — including inline variables like $n$ or $f(x)$ — must be wrapped in LaTeX delimiters. Do not mix Unicode math symbols with LaTeX; use \\int, \\sum, \\to instead.",
          },
          {
            heading: "Single Final Answer",
            body: "State your final answer clearly and unambiguously at the end of your proof, set apart from the derivation. For closed-form answers, verify numerically where possible and include that check.",
          },
        ].map((block) => (
          <div key={block.heading} className="border-l-2 border-gold/[0.35] pl-5 mb-6">
            <h3 className="font-mono text-sm font-semibold text-paper mb-1">
              {block.heading}
            </h3>
            <p className="font-body text-sm text-muted leading-relaxed">
              {block.body}
            </p>
          </div>
        ))}
      </section>

      <section aria-labelledby="workflow" className="mb-12">
        <h2 id="workflow" className="font-display text-2xl font-bold text-paper mb-6">
          Step-by-Step: From Proof to Submission
        </h2>
        {[
          {
            step: "1",
            heading: "Read the problem carefully",
            body: "Before writing anything, read the problem statement twice. Identify what is given, what is to be proved, and which techniques are likely relevant. For series problems, determine whether the series converges absolutely — this affects which manipulations are valid.",
          },
          {
            step: "2",
            heading: "Draft your proof on paper first",
            body: "Write a rough proof by hand before opening any editor. Identify the key steps, the theorems you will invoke, and the structure of the argument. A proof written directly in LaTeX without prior thought is almost always poorly structured.",
          },
          {
            step: "3",
            heading: "Open MLTeX and type your proof",
            body: "Go to MLTeX at /tools/mltex (opens in a new tab). Type your proof in the left pane. The right pane renders your LaTeX live using KaTeX. Use display math for key equations:",
          },
          {
            step: "4",
            heading: "Verify your LaTeX renders correctly",
            body: "Check that every equation in the right pane of MLTeX looks exactly as intended. Pay particular attention to: fraction nesting (\\frac inside \\frac), subscript and superscript grouping, align environment column alignment, and that all \\left( \\right) pairs are balanced. Fix any rendering errors before proceeding.",
          },
          {
            step: "5",
            heading: "Copy and paste into the submission form",
            body: "Once your proof is correct, copy the raw LaTeX from MLTeX's left pane and paste it into the solution textarea on the submission page. Fill in your name and email, then submit. We render and review every submission — you will not see a live preview on the submission page itself.",
          },
        ].map((item) => (
          <div key={item.step} className="flex gap-5 mb-8 last:mb-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-gold/[0.35] flex items-center justify-center font-mono text-sm font-bold text-gold">
              {item.step}
            </div>
            <div className="flex-1">
              <h3 className="font-mono text-sm font-semibold text-paper mb-1">
                {item.heading}
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed">
                {item.body}
              </p>
              {item.step === "3" && (
                <pre className="bg-ink-2 border border-gold/[0.12] p-4 mt-3 font-mono text-xs text-paper/80 leading-relaxed overflow-x-auto whitespace-pre">{`$$
\\begin{align*}
  S &= \\sum_{n=1}^{\\infty} \\frac{H_{n+\\frac{1}{2}}}{(2n-1)^2(2n+1)} \\\\
    &= \\frac{\\pi^2}{8}\\ln 2 - \\frac{3}{16}\\zeta(3) + \\cdots
\\end{align*}
$$`}</pre>
              )}
            </div>
          </div>
        ))}
      </section>

      <section aria-labelledby="latex-reference" className="mb-12">
        <h2 id="latex-reference" className="font-display text-2xl font-bold text-paper mb-2">
          LaTeX Quick Reference for Proofs
        </h2>
        <p className="text-muted font-body text-sm mb-6">
          The constructs you will most likely need for POW submissions.
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-gold/[0.18]">
                <th className="text-left py-2 pr-6 text-paper/60 font-normal text-xs uppercase tracking-wider">
                  What you need
                </th>
                <th className="text-left py-2 pr-6 text-paper/60 font-normal text-xs uppercase tracking-wider">
                  LaTeX
                </th>
                <th className="text-left py-2 text-paper/60 font-normal text-xs uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Inline math", "$f(x) = x^2$", "Single dollar signs. Use for variables in prose."],
                ["Display equation", "$$...$$", "On its own line. For any equation worth visual space."],
                ["Aligned derivation", "\\begin{align*} ... \\end{align*}", "Use & before = to align. \\\\ to break lines."],
                ["Fraction", "\\frac{a}{b}", "Never use a/b for display fractions."],
                ["Sum / Integral", "\\sum_{n=1}^{\\infty}  \\int_a^b", "Limits go in {} after _ and ^"],
                ["Digamma function", "\\psi(x)", "Standard notation. Define on first use."],
                ["Euler–Mascheroni", "\\gamma", "No subscript needed; \\gamma alone is conventional."],
                ["Zeta function", "\\zeta(3)", "Riemann zeta. Spell out \\zeta, not z."],
                ["Natural logarithm", "\\ln x", "Never \\log unless base is ambiguous and stated."],
                ["Real / integer sets", "\\mathbb{R}  \\mathbb{N}  \\mathbb{Z}", "Requires no extra package — KaTeX supports \\mathbb."],
                ["Therefore / QED", "\\therefore  \\blacksquare", "Put \\blacksquare at the end of the final line."],
                ["Cases", "\\begin{cases} ... \\end{cases}", "Use & to separate case from condition."],
              ].map(([what, latex, notes]) => (
                <tr key={what} className="border-b border-gold/[0.08]">
                  <td className="py-2.5 pr-6">{what}</td>
                  <td className="py-2.5 pr-6 text-paper/80">{latex}</td>
                  <td className="py-2.5 text-muted">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted font-mono mt-2">
          MLTeX uses KaTeX for rendering. All standard KaTeX commands are
          supported. For a full reference see{" "}
          <a
            href="https://katex.org/docs/support_table.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/70 hover:text-gold underline underline-offset-2"
          >
            katex.org/docs/support_table
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="common-mistakes" className="mb-12">
        <h2 id="common-mistakes" className="font-display text-2xl font-bold text-paper mb-6">
          Common Mistakes That Lead to Rejection
        </h2>
        {[
          {
            title: "Submitting Unicode math instead of LaTeX",
            body: "Writing ∑ or using copy-pasted Unicode symbols makes your proof unrenderable. Always use \\sum_{n=1}^{\\infty} and proper LaTeX delimiters.",
          },
          {
            title: "Missing dollar signs around inline variables",
            body: "Writing 'Let n be an integer' instead of 'Let $n$ be an integer' means n will appear as plain text. Every mathematical symbol, including single-letter variables, must be inside $ $.",
          },
          {
            title: "Invoking results without citing them",
            body: "Writing 'by the dominated convergence theorem' without verifying domination, or 'by symmetry' without explaining the symmetry, are incomplete arguments. Name and verify every theorem you apply.",
          },
          {
            title: "Swapping the order of limits without justification",
            body: "Interchanging \\sum and \\int, or two limits, requires explicit justification — uniform convergence, dominated convergence, Fubini's theorem, or Tonelli's theorem as appropriate. State which theorem applies and why.",
          },
          {
            title: "No clearly stated final answer",
            body: "A proof that ends mid-derivation without isolating the final closed-form value is incomplete. State the answer explicitly on its own display line at the end, for example: $$S = \\frac{\\pi^2}{8}\\ln 2 - \\frac{3}{16}\\zeta(3)$$",
          },
        ].map((mistake) => (
          <div key={mistake.title} className="bg-ink-2 border border-gold/[0.08] p-5 mb-4 last:mb-0 flex gap-4 items-start">
            <div className="flex-shrink-0 font-mono text-xs text-[#ff8c42] mt-0.5">
              ×
            </div>
            <div className="flex-1">
              <h3 className="font-mono text-sm font-semibold text-paper mb-1">
                {mistake.title}
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed">
                {mistake.body}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section aria-labelledby="after-submission" className="mb-12">
        <h2 id="after-submission" className="font-display text-2xl font-bold text-paper mb-6">
          After You Submit
        </h2>
        {[
          {
            heading: "We receive and log your submission",
            body: "Every submission is stored and associated with the problem number. You will not receive an automated confirmation email — the success message on screen confirms receipt.",
          },
          {
            heading: "We review all proofs after the deadline",
            body: "After the submission deadline, we read every proof submitted. We look for correctness, completeness, and clarity. Partially correct proofs are noted — elegant or novel approaches to sub-problems may be highlighted in the published solution.",
          },
          {
            heading: "The solution is published the following week",
            body: "A full solution article is published on MathLumen the following week. If your proof is selected as exemplary, it will be credited by name in the solution article.",
          },
        ].map((item, index, arr) => (
          <div key={item.heading} className="flex gap-4 mb-6 last:mb-0 items-start">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-gold/[0.5] mt-1.5 flex-shrink-0" />
              {index < arr.length - 1 && <div className="w-px flex-1 bg-gold/[0.12] mt-2" />}
            </div>
            <div className="flex-1">
              <h3 className="font-mono text-sm font-semibold text-paper mb-1">
                {item.heading}
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="border-t border-gold/[0.18] pt-10 mt-4">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-paper mb-1">
              Ready to submit?
            </h2>
            <p className="text-muted text-sm font-body">
              Draft your proof in MLTeX, then come back to submit.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/tools/mltex"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-none font-body transition-all duration-200 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 bg-gold text-ink font-semibold hover:bg-gold-light active:bg-gold-dark px-5 py-2.5 text-base gap-2 text-[#06080f]"
            >
              Open MLTeX
            </a>
            <Link
              href="/problem-of-the-week#submission-heading"
              className="inline-flex items-center justify-center rounded-none font-body transition-all duration-200 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 bg-ink-2 text-paper border border-gold/[0.18] hover:border-gold/40 hover:text-gold-light px-5 py-2.5 text-base gap-2"
            >
              Submit a Solution
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
