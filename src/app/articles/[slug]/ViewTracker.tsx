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
    trackViewAction(articleId);
  }, [articleId]);

  return null;
}
