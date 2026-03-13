import { cn } from "@/lib/utils";

interface MathFormulaProps {
  /** LaTeX-style formula text */
  formula: string;
  /** Whether this is a block-level display formula */
  display?: boolean;
  className?: string;
}

/**
 * Renders a mathematical formula with styling.
 * For v1, renders as styled monospace text.
 * Future versions will integrate KaTeX or MathJax.
 */
export function MathFormula({ formula, display = false, className }: MathFormulaProps) {
  if (display) {
    return (
      <div
        className={cn(
          "math-display font-mono text-gold-light text-center py-4 px-6",
          "bg-gold/[0.04] border border-gold/15 rounded-md my-6",
          className
        )}
        role="math"
        aria-label={formula}
      >
        {formula}
      </div>
    );
  }

  return (
    <span
      className={cn("math-inline font-mono text-gold-light", className)}
      role="math"
      aria-label={formula}
    >
      {formula}
    </span>
  );
}
