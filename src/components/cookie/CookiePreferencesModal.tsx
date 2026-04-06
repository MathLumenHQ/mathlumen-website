"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { type ConsentState } from "@/lib/cookie-consent";
import { useCookieConsent } from "./CookieConsentProvider";

// ─── Toggle switch ────────────────────────────────────────────────────────────

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
}

function Toggle({ id, checked, onChange, disabled = false, label }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`consent-toggle ${checked ? "consent-toggle--on" : ""} ${disabled ? "consent-toggle--disabled" : ""}`}
      type="button"
    >
      <span className="consent-toggle__thumb" aria-hidden="true" />
    </button>
  );
}

// ─── Row ─────────────────────────────────────────────────────────────────────

interface ConsentRowProps {
  title: string;
  description: string;
  includes?: string;
  toggleId: string;
  toggleLabel: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  alwaysOn?: boolean;
}

function ConsentRow({
  title,
  description,
  includes,
  toggleId,
  toggleLabel,
  checked,
  onChange,
  alwaysOn = false,
}: ConsentRowProps) {
  return (
    <div className="consent-row">
      <div className="consent-row__header">
        <h3 className="consent-row__title">{title}</h3>
        {alwaysOn ? (
          <span className="consent-always-on" aria-label="Always enabled">
            Always On
          </span>
        ) : (
          <Toggle
            id={toggleId}
            checked={checked}
            onChange={onChange}
            label={toggleLabel}
          />
        )}
      </div>
      <p className="consent-row__desc">{description}</p>
      {includes && (
        <p className="consent-row__includes">
          <span className="consent-row__includes-label">Includes: </span>
          {includes}
        </p>
      )}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

/**
 * Full-screen overlay modal for granular cookie preferences.
 * Traps focus, responds to Escape, and returns focus to the opener on close.
 */
export function CookiePreferencesModal() {
  const { consent, isPreferencesOpen, closePreferences, savePreferences } =
    useCookieConsent();

  // Local toggle state — only committed on "Save Preferences".
  const [local, setLocal] = useState<ConsentState>(consent);

  // Re-sync local state when the modal opens so it reflects the current consent.
  useEffect(() => {
    if (isPreferencesOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocal(consent);
    }
  }, [isPreferencesOpen, consent]);

  const modalRef = useRef<HTMLDivElement>(null);
  // Remember the element that triggered the modal so we can restore focus.
  const triggerRef = useRef<Element | null>(null);

  // Capture the opener and trap focus when modal opens.
  useEffect(() => {
    if (!isPreferencesOpen) return;

    triggerRef.current = document.activeElement;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableSelectors =
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function getFocusable() {
      return Array.from(
        modal!.querySelectorAll<HTMLElement>(focusableSelectors)
      );
    }

    // Focus the first focusable element inside the modal.
    const first = getFocusable()[0];
    first?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closePreferences();
        return;
      }
      if (e.key === "Tab") {
        const focusable = getFocusable();
        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl?.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl?.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Return focus to the element that opened the modal.
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
  }, [isPreferencesOpen, closePreferences]);

  const handleSave = useCallback(() => {
    savePreferences(local);
  }, [savePreferences, local]);

  if (!isPreferencesOpen) return null;

  return (
    <div className="consent-overlay" role="presentation">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-prefs-title"
        className="consent-modal"
      >
        {/* Header */}
        <div className="consent-modal__header">
          <h2 id="cookie-prefs-title" className="consent-modal__title">
            Cookie Preferences
          </h2>
          <button
            type="button"
            onClick={closePreferences}
            aria-label="Close cookie preferences"
            className="consent-modal__close"
          >
            {/* X icon (inline SVG — lucide-react not installed) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Rows */}
        <div className="consent-modal__body">
          <ConsentRow
            title="Essential Cookies"
            description="Required for MathLumen to function correctly. These cannot be disabled."
            includes="theme preference, reading session continuity, security tokens, and your cookie consent preferences."
            toggleId="toggle-essential"
            toggleLabel="Essential cookies (always on)"
            checked={true}
            onChange={() => undefined}
            alwaysOn
          />
          <ConsentRow
            title="Functional Cookies"
            description="Enhance your reading experience with optional features that remember your preferences between visits."
            includes="reading progress indicators, display preferences, font size settings, and editor state in MLTeX."
            toggleId="toggle-functional"
            toggleLabel="Toggle functional cookies"
            checked={local.functional}
            onChange={(v) => setLocal((p) => ({ ...p, functional: v }))}
          />
          <ConsentRow
            title="Analytics Cookies"
            description="Help us understand how readers discover and engage with content. MathLumen uses privacy-first Vercel Analytics — no personal data is collected, no cookies are set, and data is never sold. Basic page view data is always collected. Enabling this adds Web Vitals and navigation timing to help improve site performance."
            toggleId="toggle-analytics"
            toggleLabel="Toggle analytics cookies"
            checked={local.analytics}
            onChange={(v) => setLocal((p) => ({ ...p, analytics: v }))}
          />
        </div>

        {/* Footer */}
        <div className="consent-modal__footer">
          <Button variant="ghost" size="sm" onClick={closePreferences}>
            Cancel
          </Button>
          <Button variant="gold" size="sm" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
