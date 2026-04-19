"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink text-paper font-body antialiased">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <p className="font-mono text-gold uppercase tracking-[0.2em] text-sm mb-4">
            Application Error
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-black text-paper mb-6">
            Something went wrong
          </h1>
          <p className="text-muted text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            An unexpected error interrupted rendering. You can retry the request
            or return to the homepage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center px-6 py-3 bg-gold text-ink font-semibold hover:bg-gold-light transition-colors duration-200"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gold/20 text-gold hover:border-gold/40 hover:bg-gold/[0.03] transition-colors duration-200"
            >
              Back to home
            </Link>
          </div>
          {process.env.NODE_ENV !== "production" && error?.message ? (
            <pre className="mt-10 overflow-x-auto border border-gold/10 bg-ink-2 p-4 text-left text-xs text-muted">
              {error.message}
            </pre>
          ) : null}
        </div>
      </body>
    </html>
  );
}
