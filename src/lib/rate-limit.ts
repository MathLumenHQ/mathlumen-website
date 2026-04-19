type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __mathlumenRateLimitStore: Map<string, RateLimitBucket> | undefined;
}

const store = globalThis.__mathlumenRateLimitStore ?? new Map<string, RateLimitBucket>();

if (!globalThis.__mathlumenRateLimitStore) {
  globalThis.__mathlumenRateLimitStore = store;
}

function pruneExpiredEntries(now: number) {
  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function applyRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  pruneExpiredEntries(now);

  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      resetAt,
      retryAfter: Math.ceil(windowMs / 1000),
    };
  }

  current.count += 1;
  store.set(key, current);

  return {
    allowed: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
    resetAt: current.resetAt,
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}
