import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { applyRateLimit } from "@/lib/rate-limit";

const allowedOrigin = new URL(env.NEXT_PUBLIC_APP_URL).origin;

function getForwardedIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function setRateLimitHeaders(response: NextResponse, limit: number, remaining: number, resetAt: number) {
  response.headers.set("X-RateLimit-Limit", String(limit));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.floor(resetAt / 1000)));
  response.headers.set("Cache-Control", "no-store");
}

function serializeDates<T>(value: T): T {
  if (value instanceof Date) {
    return value.toISOString() as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeDates(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, serializeDates(entry)])
    ) as T;
  }

  return value;
}

export function buildJsonResponse(body: unknown, init?: ResponseInit): NextResponse {
  const response = NextResponse.json(serializeDates(body), init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export function enforceSameOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");

  if (origin && origin !== allowedOrigin) {
    return buildJsonResponse({ error: "Invalid origin" }, { status: 403 });
  }

  return null;
}

export async function enforceRateLimit(
  request: NextRequest,
  scope: string,
  limit: number,
  windowMs: number
): Promise<NextResponse | null> {
  const ip = getForwardedIp(request);
  const result = await applyRateLimit({
    key: `${scope}:${ip}`,
    limit,
    windowMs,
  });

  if (!result.allowed) {
    const response = buildJsonResponse(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
    response.headers.set("Retry-After", String(result.retryAfter));
    setRateLimitHeaders(response, limit, result.remaining, result.resetAt);
    return response;
  }

  return null;
}

export async function withRateLimitHeaders(
  request: NextRequest,
  response: NextResponse,
  scope: string,
  limit: number,
  windowMs: number
): Promise<NextResponse> {
  const ip = getForwardedIp(request);
  const result = await applyRateLimit({
    key: `${scope}:headers:${ip}`,
    limit,
    windowMs,
  });
  setRateLimitHeaders(response, limit, result.remaining, result.resetAt);
  return response;
}
