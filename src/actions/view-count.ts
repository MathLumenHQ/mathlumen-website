"use server";

import { incrementViewCount } from "@/lib/queries/articles";

/**
 * Server action to increment the view count for an article.
 * Fire-and-forget — does not block the UI.
 */
export async function trackViewAction(articleId: string): Promise<void> {
  try {
    await incrementViewCount(articleId);
  } catch (error) {
    // Silently fail — view tracking should never break the user experience
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`View tracking failed for "${articleId}": ${message}`);
  }
}
