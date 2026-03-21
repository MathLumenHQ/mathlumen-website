import Link from "next/link";

/**
 * Compact promotional card for MLTeX — shown in sidebars.
 */
export function ToolsPromo() {
  return (
    <div className="border border-gold/[0.18] p-4 bg-gold/[0.02]">
      <p className="font-mono text-gold uppercase tracking-[0.15em] text-xs mb-2">
        Free Tool
      </p>
      <h3 className="font-display text-base font-bold text-paper mb-1">
        Try MLTeX
      </h3>
      <p className="text-xs text-muted leading-relaxed mb-4">
        Free LaTeX editor in your browser. Write and preview math equations in
        real-time — no sign-up required.
      </p>
      <Link
        href="/tools/mltex"
        className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold-light font-mono transition-colors duration-200"
      >
        Launch Editor &rarr;
      </Link>
    </div>
  );
}
