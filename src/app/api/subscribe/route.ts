import { NextRequest, NextResponse } from "next/server";
import { createSubscriber, checkSubscriberExists } from "@/lib/queries/subscribers";
import { env } from "@/lib/env";
import { subscribeRequestSchema } from "@/schema/validators";
import type { ApiResponse, Subscriber } from "@/schema/types";
import {
  buildJsonResponse,
  enforceRateLimit,
} from "@/lib/request-security";

/**
 * POST /api/subscribe
 * Subscribe an email address to the MathLumen newsletter.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Subscriber>>> {
  const authHeader = request.headers.get("Authorization");
  const isInternalAttempt = authHeader?.startsWith("Bearer ") ?? false;
  const bearerToken =
    isInternalAttempt && authHeader
      ? authHeader.slice("Bearer ".length).trim()
      : null;
  const isValidInternalRequest =
    Boolean(bearerToken) &&
    Boolean(env.NEWSLETTER_SECRET) &&
    bearerToken === env.NEWSLETTER_SECRET;

  if (isInternalAttempt && !isValidInternalRequest) {
    return buildJsonResponse(
      { success: false, error: "Forbidden" },
      { status: 403 }
    ) as NextResponse<ApiResponse<Subscriber>>;
  }

  if (!isValidInternalRequest) {
    const blockedByRateLimit = await enforceRateLimit(
      request,
      "subscribe",
      8,
      15 * 60 * 1000
    );
    if (blockedByRateLimit) {
      return blockedByRateLimit as NextResponse<ApiResponse<Subscriber>>;
    }
  }

  try {
    const body: unknown = await request.json();
    const parsed = subscribeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return buildJsonResponse(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      ) as NextResponse<ApiResponse<Subscriber>>;
    }

    const { email, name } = parsed.data;

    const exists = await checkSubscriberExists(email);
    if (exists) {
      return buildJsonResponse(
        { success: false, error: "This email is already subscribed" },
        { status: 409 }
      ) as NextResponse<ApiResponse<Subscriber>>;
    }

    const subscriber = await createSubscriber(email, name);

    return buildJsonResponse(
      { success: true, data: subscriber },
      { status: 201 }
    ) as NextResponse<ApiResponse<Subscriber>>;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return buildJsonResponse(
      { success: false, error: message },
      { status: 500 }
    ) as NextResponse<ApiResponse<Subscriber>>;
  }
}
