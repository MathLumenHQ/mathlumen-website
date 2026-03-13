"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <p className="text-gold font-mono text-lg mb-4">Error</p>
      <h1 className="font-display text-4xl md:text-5xl font-bold text-paper mb-4">
        Something went wrong
      </h1>
      <p className="text-muted/60 font-mono text-sm italic mb-6">
        An unexpected exception in the proof
      </p>
      <p className="text-muted text-lg mb-10 max-w-md mx-auto">
        Our equations didn&apos;t quite balance out this time.
        Please try again or return to safer ground.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Button onClick={reset} variant="gold" size="lg">
          Try again
        </Button>
        <Link
          href="/"
          className="px-6 py-3 text-sm text-gold border border-gold/20 hover:border-gold/40 transition-colors duration-200"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
