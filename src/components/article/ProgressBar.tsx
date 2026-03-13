"use client";

import { useEffect, useState } from "react";

/**
 * Reading progress indicator for article pages.
 * Fixed at top of viewport, below navigation.
 * Gold color, 2px height, smooth width transitions.
 */
export function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) {
        setProgress(0);
        return;
      }

      setProgress(Math.min(100, (scrollTop / docHeight) * 100));
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-16 left-0 right-0 z-[55] h-[2px] bg-ink-2 no-print"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gold transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />
    </div>
  );
}
