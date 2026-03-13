"use server";

import { searchArticles } from "@/lib/queries/articles";
import { searchRequestSchema } from "@/schema/validators";
import type { ApiResponse, ArticleWithAuthor } from "@/schema/types";

/**
 * Server action for searching articles.
 * Parses the query, validates input, and returns matching articles.
 */
export async function searchAction(
  formData: FormData
): Promise<ApiResponse<ArticleWithAuthor[]>> {
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
    const results = await searchArticles(query, limit);

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
