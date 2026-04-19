import { NextRequest, NextResponse } from "next/server";
import { searchArticleResults } from "@/lib/queries/articles";
import { searchPowResults } from "@/lib/queries/pow";
import { searchRequestSchema } from "@/schema/validators";
import type { ApiResponse, SearchResult } from "@/schema/types";
import { buildJsonResponse, enforceRateLimit } from "@/lib/request-security";

/**
 * GET /api/search?query=...&limit=...
 * Full-text search across published articles and POW issues.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<SearchResult[]>>> {
  const blockedByRateLimit = enforceRateLimit(request, "search", 60, 60 * 1000);
  if (blockedByRateLimit) {
    return blockedByRateLimit as NextResponse<ApiResponse<SearchResult[]>>;
  }

  try {
    const { searchParams } = request.nextUrl;

    const parsed = searchRequestSchema.safeParse({
      query: searchParams.get("query") ?? "",
      limit: searchParams.get("limit") ?? 20,
    });

    if (!parsed.success) {
      return buildJsonResponse(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid search query" },
        { status: 400 }
      ) as NextResponse<ApiResponse<SearchResult[]>>;
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

    return buildJsonResponse({ success: true, data: results }) as NextResponse<
      ApiResponse<SearchResult[]>
    >;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";
    return buildJsonResponse(
      { success: false, error: message },
      { status: 500 }
    ) as NextResponse<ApiResponse<SearchResult[]>>;
  }
}
