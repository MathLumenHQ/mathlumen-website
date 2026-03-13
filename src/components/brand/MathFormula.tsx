"use client";

import { useMemo } from "react";
import katex from "katex";
import { cn } from "@/lib/utils";

interface MathFormulaProps {
  /** LaTeX formula string (e.g. "e^{i\\pi}+1=0") */
  formula: string;
  /** Render as block-level display formula (true) or inline (false) */
  display?: boolean;
  className?: string;
}

/**
 * Renders a LaTeX formula using KaTeX.
 * For standalone formulas outside MDX articles.
 *
 * - Display mode: centered, gold left border, padded
 * - Inline mode: flows within surrounding text
 * - On render failure: shows the raw LaTeX source as fallback
 */
export function MathFormula({
  formula,
  display = false,
  className,
}: MathFormulaProps) {
  const rendered = useMemo(() => {
    try {
      return {
        html: katex.renderToString(formula, {
          displayMode: display,
          throwOnError: false,
          strict: false,
          trust: true,
        }),
        error: null,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Render error";
      return { html: null, error: message };
    }
  }, [formula, display]);

  // Error fallback: show the raw LaTeX source
  if (rendered.error || !rendered.html) {
    return (
      <code
        className={cn(
          "font-mono text-sm text-red-400 bg-red-900/10 px-2 py-1 rounded-none",
          display && "block text-center my-4",
          className
        )}
        title={rendered.error ?? "Failed to render formula"}
        role="math"
        aria-label={formula}
      >
        {formula}
      </code>
    );
  }

  if (display) {
    return (
      <div
        className={cn(
          "my-6 py-4 px-6 text-center",
          "border-l-2 border-gold bg-gold/[0.04]",
          "overflow-x-auto",
          className
        )}
        role="math"
        aria-label={formula}
        dangerouslySetInnerHTML={{ __html: rendered.html }}
      />
    );
  }

  return (
    <span
      className={cn("inline", className)}
      role="math"
      aria-label={formula}
      dangerouslySetInnerHTML={{ __html: rendered.html }}
    />
  );
}
