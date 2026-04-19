"use server";

import { searchArticleResults } from "@/lib/queries/articles";
import { searchPowResults } from "@/lib/queries/pow";
import { searchRequestSchema } from "@/schema/validators";
import type { ApiResponse, SearchResult } from "@/schema/types";

/**
 * Server action for searching articles.
 * Parses the query, validates input, and returns matching articles.
 */
export async function searchAction(
  formData: FormData
): Promise<ApiResponse<SearchResult[]>> {
  try {
    const raw = {
      query: formData.get("query"),
      limit: formData.get("limit") ?? 20,
    };

    const parsed = searchRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid search query",
      };
    }

    const { query, limit } = parsed.data;
    const perSourceLimit = Math.max(5, Math.min(limit, 20));
    const [articleResults, powResults] = await Promise.all([
      searchArticleResults(query, perSourceLimit),
      searchPowResults(query, perSourceLimit),
    ]);

    const results = [...powResults, ...articleResults]
      .sort((a, b) => {
        const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, limit);

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";
    return {
      success: false,
      error: message,
    };
  }
}
