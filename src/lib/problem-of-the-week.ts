/**
 * Problem of the Week — static data file.
 * Manually update this file each Monday to post a new problem.
 * The `statement` and `hint` fields support standard Markdown and LaTeX
 * using $...$ (inline) and $$...$$ (display) delimiters.
 */

export type ProblemDifficulty = "undergraduate" | "graduate" | "competition";

export interface Problem {
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
  /** Topic tags for this problem, e.g. ["real-analysis", "continuity", "fixed-point"] */
  topics?: string[];
  /**
   * Slug of the published solution article for this problem.
   * Leave unset until the solution article is published.
   * e.g. "pow-001-solution"
   */
  solutionSlug?: string;
}

export const currentProblem: Problem = {
  number: 2,
  weekOf: "2026-04-20",
  difficulty: "graduate",
  statement: `Evaluate the exact closed-form value of the infinite series

$$
S = \\sum_{n=1}^{\\infty} \\frac{H_{n+\\frac{1}{2}}}{(2n-1)^2(2n+1)}.
$$

For any real $x > 0$, the generalized harmonic number is defined by

$$
H_x = \\psi(x+1) + \\gamma,
$$

where $\\psi(x)$ is the digamma function and $\\gamma$ is the Euler--Mascheroni constant. Here $n \\in \\mathbb{N}$ with $n \\geq 1$, all logarithms are natural logarithms, and the series is absolutely convergent.

Determine the exact value of $S$ in closed form. Your answer must be expressed as a linear combination of rational multiples of $1$, $\\pi^2$, $\\ln 2$, and $\\zeta(3)$.`,
  hint: `Use the reflection formula for the digamma function,

$$
\\psi(1-x) - \\psi(x) = \\pi \\cot(\\pi x),
$$

and the known value $H_{1/2} = 2 - 2\\ln 2 - \\gamma$, to express $H_{n+1/2}$ via the recurrence $H_{x+1} = H_x + \\frac{1}{x+1}$. Then decompose the summand using partial fractions on $\\frac{1}{(2n-1)^2(2n+1)}$ and evaluate the resulting sums against known Dirichlet series and special values of $\\zeta$.`,
  deadline: "2026-04-26",
  previousSlug: "pow-001-solution",
  topics: ["special-functions", "digamma-function", "harmonic-series", "zeta-values", "infinite-series"],
};

/**
 * All past problems, newest first.
 * After each week: move currentProblem here (with solutionSlug filled in),
 * then update currentProblem to the new problem.
 */
export const pastProblems: Problem[] = [
  {
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
    hint: `Consider the auxiliary function $g(x) = \\int_0^x f(t)\\,dt - x^2$ and examine its values at the endpoints of $[0, 1]$.`,
    deadline: "2026-04-13",
    topics: ["real-analysis", "continuity", "rolle-theorem", "ftc"],
    solutionSlug: "pow-001-solution",
  },
];

/**
 * Returns all problems in reverse chronological order (current first, then past).
 */
export function getAllProblems(): Problem[] {
  return [currentProblem, ...pastProblems];
}

export function getProblemBySolutionSlug(solutionSlug: string): Problem | null {
  return getAllProblems().find((problem) => problem.solutionSlug === solutionSlug) ?? null;
}
