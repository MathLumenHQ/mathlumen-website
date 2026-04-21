import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter: number;
};

type RateLimitRow = {
  count: number;
  resetAt: Date;
};

export async function applyRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);
  const nowIso = now.toISOString();
  const resetAtIso = resetAt.toISOString();

  const result = await db.execute(sql<RateLimitRow>`
    insert into request_rate_limits ("key", "count", "reset_at", "updated_at")
    values (${key}, 1, ${resetAtIso}, ${nowIso})
    on conflict ("key") do update
    set
      "count" = case
        when request_rate_limits.reset_at <= ${nowIso} then 1
        else request_rate_limits.count + 1
      end,
      "reset_at" = case
        when request_rate_limits.reset_at <= ${nowIso} then ${resetAtIso}
        else request_rate_limits.reset_at
      end,
      "updated_at" = ${nowIso}
    returning
      "count",
      "reset_at" as "resetAt"
  `);

  const bucket = result[0] as RateLimitRow | undefined;

  if (!bucket) {
    throw new Error("Rate limit bucket could not be created");
  }

  const resetAtMs = new Date(bucket.resetAt).getTime();

  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: resetAtMs,
    retryAfter: Math.max(1, Math.ceil((resetAtMs - now.getTime()) / 1000)),
  };
}
