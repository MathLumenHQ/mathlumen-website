import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { MathFormula } from "@/components/brand/MathFormula";

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <div className="flex justify-center mb-8">
        <Logo size="lg" variant="gold" />
      </div>

      <p className="text-gold font-mono text-lg mb-4">404</p>

      <h1 className="font-display text-4xl md:text-5xl font-black text-paper mb-6">
        This page is undefined
      </h1>

      <div className="mb-8">
        <MathFormula
          formula="\\lim_{x \\to \\infty} \\text{page} = \\emptyset"
          display
        />
      </div>

      <p className="text-muted text-lg mb-10 max-w-md mx-auto">
        Like an unsolved conjecture, this page remains elusive.
        Perhaps the solution lies elsewhere.
      </p>

      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 bg-gold text-ink font-semibold hover:bg-gold-light transition-colors duration-200"
      >
        Back to home
      </Link>
    </div>
  );
}
