/**
 * Problem of the Week — static data file.
 * Manually update this file each Monday to post a new problem.
 * The `statement` and `hint` fields support standard Markdown and LaTeX
 * using $...$ (inline) and $$...$$ (display) delimiters.
 */

export type ProblemDifficulty = "undergraduate" | "graduate" | "competition";

export interface WeeklyProblem {
  /** Sequential problem number displayed to readers */
  number: number;
  /** ISO date of the Monday the problem goes live, e.g. "2026-04-07" */
  weekOf: string;
  difficulty: ProblemDifficulty;
  /** Full problem statement — Markdown + LaTeX allowed */
  statement: string;
  /** Optional hint — Markdown + LaTeX allowed */
  hint?: string;
  /** ISO date of the submission deadline, e.g. "2026-04-13" */
  deadline: string;
  /**
   * Article slug for the previous week's published solution.
   * Set this when you publish the solution article so the page
   * can link readers to it automatically.
   */
  previousSlug?: string;
}

export const currentProblem: WeeklyProblem = {
  number: 1,
  weekOf: "2026-04-07",
  difficulty: "undergraduate",
  statement: `Let $f : [0, 1] \\to \\mathbb{R}$ be a continuous function satisfying

$$
\\int_0^1 f(x)\\,dx = 1.
$$

Prove that there exists a point $c \\in (0, 1)$ such that

$$
f(c) = 2c.
$$`,
  hint: "Consider the auxiliary function $g(x) = \\int_0^x f(t)\\,dt - x^2$ and examine its values at the endpoints of $[0, 1]$.",
  deadline: "2026-04-13",
};
