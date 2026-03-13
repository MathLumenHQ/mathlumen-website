"use client";

import { useEffect } from "react";
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
      <h1 className="font-display text-4xl md:text-5xl font-bold text-paper mb-6">
        Something went wrong
      </h1>
      <p className="text-muted text-lg mb-10 max-w-md mx-auto">
        An unexpected error occurred. Our equations didn&apos;t quite balance out this time.
      </p>
      <Button onClick={reset} variant="primary" size="lg">
        Try again
      </Button>
    </div>
  );
}
