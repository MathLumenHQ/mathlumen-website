"use client";

import { useEffect } from "react";
import { trackViewAction } from "@/actions/view-count";

interface ViewTrackerProps {
  articleId: string;
}

/**
 * Client component that tracks article views on mount.
 * Fire-and-forget — does not block rendering.
 */
export function ViewTracker({ articleId }: ViewTrackerProps) {
  useEffect(() => {
    if (/bot|crawler|spider|slurp|headless|facebookexternalhit|preview/i.test(navigator.userAgent)) {
      return;
    }

    const key = `mathlumen:view:${articleId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Storage unavailable (private mode / blocked): track once per mount.
    }

    trackViewAction(articleId).catch(() => {});
  }, [articleId]);

  return null;
}
