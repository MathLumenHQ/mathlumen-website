import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/lib/queries/articles";
import { searchRequestSchema } from "@/schema/validators";
import type { ApiResponse, ArticleWithAuthor } from "@/schema/types";

/**
 * GET /api/search?query=...&limit=...
 * Full-text search across published articles.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ArticleWithAuthor[]>>> {
  try {
    const { searchParams } = request.nextUrl;

    const parsed = searchRequestSchema.safeParse({
      query: searchParams.get("query") ?? "",
      limit: searchParams.get("limit") ?? 20,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid search query" },
        { status: 400 }
      );
    }

    const { query, limit } = parsed.data;
    const results = await searchArticles(query, limit);

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
