/*
 * MathLumen Cookie Consent + Analytics Architecture
 *
 * Layer 1 — Always active (no consent needed):
 *   <Analytics /> in layout.tsx
 *   Vercel's cookieless baseline tracking (page views, referrers)
 *   Legal basis: legitimate interest (equivalent to server logs)
 *
 * Layer 2 — Functional consent (user opt-in):
 *   Reading progress, editor state, display preferences
 *   Stored in localStorage only, never transmitted
 *
 * Layer 3 — Analytics consent (user opt-in):
 *   inject() from @vercel/analytics
 *   Activates Web Vitals + navigation timing
 *   Still cookieless, still no personal data
 *
 * Future Layer 4 — Additional analytics (user opt-in):
 *   Drop any future script into loadAnalytics()
 *   Consent gate is already in place
 */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { inject } from "@vercel/analytics";
import {
  type ConsentState,
  DEFAULT_CONSENT,
  acceptAll as libAcceptAll,
  getConsent,
  rejectAll as libRejectAll,
  saveConsent,
} from "@/lib/cookie-consent";

// ─── Analytics loader ─────────────────────────────────────────────────────────

function loadAnalytics(): void {
  if (typeof window === "undefined") return;
  try {
    inject();
    console.log("[MathLumen] Enhanced analytics activated");
  } catch (err) {
    console.error("[MathLumen] Analytics injection failed:", err);
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

export type CookieConsentContextValue = {
  consent: ConsentState;
  /** True only after the component has mounted and read localStorage. */
  hydrated: boolean;
  /** True if savedAt is not null (user made an explicit choice). */
  hasConsented: boolean;
  isPreferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (state: ConsentState) => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue>({
  consent: DEFAULT_CONSENT,
  hydrated: false,
  hasConsented: false,
  isPreferencesOpen: false,
  openPreferences: () => undefined,
  closePreferences: () => undefined,
  acceptAll: () => undefined,
  rejectAll: () => undefined,
  savePreferences: () => undefined,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const [hydrated, setHydrated] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Track whether analytics was already initialised so we don't fire it twice.
  const analyticsLoaded = useRef(false);

  // Read stored consent on mount (client-only — localStorage unavailable on server).
  // Both setters are intentional hydration guards reading from an external system.
  useEffect(() => {
    const stored = getConsent();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(stored);
    setHydrated(true);
    if (stored.analytics && !analyticsLoaded.current) {
      analyticsLoaded.current = true;
      loadAnalytics();
    }
  }, []);

  // Re-evaluate analytics whenever consent changes after mount.
  useEffect(() => {
    if (!hydrated) return;
    if (consent.analytics && !analyticsLoaded.current) {
      analyticsLoaded.current = true;
      loadAnalytics();
    }
  }, [consent.analytics, hydrated]);

  const openPreferences = useCallback(() => setIsPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setIsPreferencesOpen(false), []);

  const acceptAll = useCallback(() => {
    const next = libAcceptAll();
    saveConsent(next);
    setConsent(next);
  }, []);

  const rejectAll = useCallback(() => {
    const next = libRejectAll();
    saveConsent(next);
    setConsent(next);
  }, []);

  const savePreferences = useCallback((state: ConsentState) => {
    saveConsent(state);
    setConsent(state);
    setIsPreferencesOpen(false);
  }, []);

  const hasConsented = hydrated && consent.savedAt !== null;

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hydrated,
        hasConsented,
        isPreferencesOpen,
        openPreferences,
        closePreferences,
        acceptAll,
        rejectAll,
        savePreferences,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCookieConsent(): CookieConsentContextValue {
  return useContext(CookieConsentContext);
}
