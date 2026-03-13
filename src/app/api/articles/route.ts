import { NextRequest, NextResponse } from "next/server";
import { getArticles } from "@/lib/queries/articles";
import { articleQuerySchema } from "@/schema/validators";
import type { ApiResponse, ArticleWithAuthor, PaginatedResponse } from "@/schema/types";

/**
 * GET /api/articles
 * Fetch paginated articles with optional category, tag, and sort filters.
 * Cache-Control: s-maxage=60, stale-while-revalidate=120
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<PaginatedResponse<ArticleWithAuthor>>>> {
  try {
    const { searchParams } = request.nextUrl;

    const parsed = articleQuerySchema.safeParse({
      category: searchParams.get("category") ?? undefined,
      tag: searchParams.get("tag") ?? undefined,
      limit: searchParams.get("limit") ?? 12,
      offset: searchParams.get("offset") ?? 0,
      featured: searchParams.get("featured") ?? undefined,
      sort: searchParams.get("sort") ?? "newest",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid parameters" },
        { status: 400 }
      );
    }

    const result = await getArticles(parsed.data);

    return NextResponse.json(
      { success: true, data: result },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
