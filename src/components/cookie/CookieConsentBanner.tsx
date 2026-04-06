"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCookieConsent } from "./CookieConsentProvider";

/**
 * Fixed bottom banner shown to first-time visitors.
 * Slides up on mount and slides away once the user makes a choice.
 * Renders nothing until the client has hydrated (prevents SSR flash).
 */
export function CookieConsentBanner() {
  const { hydrated, hasConsented, acceptAll, rejectAll, openPreferences } =
    useCookieConsent();

  // Controls the CSS slide-in/out. Separate from hasConsented so the
  // dismiss animation can play before the component unmounts.
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (hydrated && !hasConsented) {
      // Tiny delay so the initial paint completes before the transition fires.
      const t = setTimeout(() => setShow(true), 80);
      return () => clearTimeout(t);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(false);
    }
  }, [hydrated, hasConsented]);

  // Don't render at all until we know whether the user has consented.
  if (!hydrated || hasConsented) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className={`cookie-banner ${show ? "cookie-banner--visible" : ""}`}
    >
      <div className="cookie-banner__inner">
        {/* Text */}
        <p className="cookie-banner__text">
          MathLumen uses cookies to improve your reading experience.{" "}
          <Link href="/privacy" className="cookie-banner__link">
            Privacy policy
          </Link>
        </p>

        {/* Actions */}
        <div className="cookie-banner__actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={openPreferences}
            aria-label="Manage cookie preferences"
          >
            Manage Preferences
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={rejectAll}
            aria-label="Reject all optional cookies"
          >
            Reject All
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={acceptAll}
            aria-label="Accept all cookies"
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
