/**
 * Pure cookie consent utilities — no React dependency.
 * All localStorage access is guarded with try/catch for private-browsing safety.
 */

export type ConsentCategory = "essential" | "functional" | "analytics";

export type ConsentState = {
  essential: true; // always true, not configurable
  functional: boolean;
  analytics: boolean;
  savedAt: string | null; // ISO timestamp, null = never saved
};

export const DEFAULT_CONSENT: ConsentState = {
  essential: true,
  functional: false,
  analytics: false,
  savedAt: null,
};

const STORAGE_KEY = "mathlumen-cookie-consent";

/** Reads stored consent. Returns DEFAULT_CONSENT if nothing is saved yet. */
export function getConsent(): ConsentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONSENT };
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      essential: true,
      functional: parsed.functional ?? false,
      analytics: parsed.analytics ?? false,
      savedAt: parsed.savedAt ?? null,
    };
  } catch {
    return { ...DEFAULT_CONSENT };
  }
}

/** Persists consent state, always overwriting savedAt with the current time. */
export function saveConsent(state: ConsentState): void {
  try {
    const toSave: ConsentState = {
      ...state,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage unavailable (private browsing, storage quota, etc.)
  }
}

/** True only after the user has explicitly made a choice (savedAt is set). */
export function hasUserConsented(): boolean {
  return getConsent().savedAt !== null;
}

/** Accept all categories and return the resulting state (not yet persisted). */
export function acceptAll(): ConsentState {
  return {
    essential: true,
    functional: true,
    analytics: true,
    savedAt: new Date().toISOString(),
  };
}

/** Reject all optional categories and return the resulting state (not yet persisted). */
export function rejectAll(): ConsentState {
  return {
    essential: true,
    functional: false,
    analytics: false,
    savedAt: new Date().toISOString(),
  };
}
