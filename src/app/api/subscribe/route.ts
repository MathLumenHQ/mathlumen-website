import { NextRequest, NextResponse } from "next/server";
import { createSubscriber, checkSubscriberExists } from "@/lib/queries/subscribers";
import { env } from "@/lib/env";
import { subscribeRequestSchema } from "@/schema/validators";
import type { ApiResponse, Subscriber } from "@/schema/types";
import {
  buildJsonResponse,
  enforceRateLimit,
  enforceSameOrigin,
} from "@/lib/request-security";

/**
 * POST /api/subscribe
 * Subscribe an email address to the MathLumen newsletter.
 */

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Subscriber>>> {
  // 1. Enforce same-origin requests
  const originError = enforceSameOrigin(request);

  if (originError) {
    return originError as NextResponse<ApiResponse<Subscriber>>;
  }

  // 2. Check internal authorization
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

  // 3. Apply rate limiting
  if (!isValidInternalRequest) {
    try {
      const blockedByRateLimit = await enforceRateLimit(
        request,
        "subscribe",
        8,
        15 * 60 * 1000
      );

      if (blockedByRateLimit) {
        return blockedByRateLimit as NextResponse<ApiResponse<Subscriber>>;
      }
    } catch (error) {
      console.error("[API /subscribe] Rate limit failed:", error);

      return buildJsonResponse(
        { success: false, error: "Unable to process request" },
        { status: 500 }
      ) as NextResponse<ApiResponse<Subscriber>>;
    }
  }

  // 4. Parse JSON separately
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return buildJsonResponse(
      { success: false, error: "Invalid JSON request body" },
      { status: 400 }
    ) as NextResponse<ApiResponse<Subscriber>>;
  }

  // 5. Validate request
  const parsed = subscribeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return buildJsonResponse(
      {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      },
      { status: 400 }
    ) as NextResponse<ApiResponse<Subscriber>>;
  }

  // 6. Process subscription
  try {
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
    console.error("[API /subscribe] Subscription failed:", error);

    return buildJsonResponse(
      { success: false, error: "Unable to process subscription" },
      { status: 500 }
    ) as NextResponse<ApiResponse<Subscriber>>;
  }
}

