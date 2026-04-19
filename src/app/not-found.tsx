import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Page Not Found",
  description:
    "The page you are looking for does not exist. Explore MathLumen's articles on mathematics, AI, and scientific computing.",
  path: "/404",
  robots: {
    index: false,
    follow: true,
  },
});

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
      <p className="font-mono text-gold uppercase tracking-[0.2em] text-sm mb-4">404</p>
      <h1 className="font-display text-4xl md:text-5xl font-black text-paper mb-6">
        Page not found
      </h1>
      <p className="text-muted text-lg mb-10 max-w-xl mx-auto leading-relaxed">
        The page you requested does not exist or may have moved. Use the main
        navigation or return home to continue browsing MathLumen.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-gold text-ink font-semibold hover:bg-gold-light transition-colors duration-200"
        >
          Back to home
        </Link>
        <Link
          href="/archive"
          className="inline-flex items-center px-6 py-3 border border-gold/20 text-gold hover:border-gold/40 hover:bg-gold/[0.03] transition-colors duration-200"
        >
          Browse archive
        </Link>
      </div>
    </div>
  );
}
