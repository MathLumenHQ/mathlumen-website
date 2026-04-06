"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { subscribeAction } from "@/actions/subscribe";
import {
  FOOTER_LINKS,
  TWITTER_URL,
  GITHUB_URL,
  YOUTUBE_URL,
  LINKEDIN_URL,
} from "@/lib/constants";
import { useCookieConsent } from "@/components/cookie/CookieConsentProvider";
import type { ApiResponse, Subscriber } from "@/schema/types";

const initialState: ApiResponse<Subscriber> = { success: false };

/**
 * 4-column site footer.
 * Col 1: Logo + tagline + social icons (YouTube, LinkedIn, X, GitHub)
 * Col 2: Publication links
 * Col 3: Topic category links
 * Col 4: Newsletter mini-signup
 * Bottom bar: copyright + legal links
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const { openPreferences } = useCookieConsent();

  const [state, formAction, isPending] = useActionState(
    async (_prev: ApiResponse<Subscriber>, formData: FormData) => {
      return subscribeAction(formData);
    },
    initialState
  );

  return (
    <footer className="bg-ink-2 border-t border-gold/[0.18] no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Logo size="sm" />
              <span className="font-display text-lg font-bold text-paper tracking-tight">
                Math<span className="text-gold">Lumen</span>
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Illuminating Mathematics
            </p>
            <div className="flex items-center gap-3 pt-2">
              {/* YouTube */}
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 text-muted hover:text-gold transition-colors duration-200"
                aria-label="Follow us on YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 text-muted hover:text-gold transition-colors duration-200"
                aria-label="Follow us on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* X (Twitter) */}
              <a
                href={TWITTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 text-muted hover:text-gold transition-colors duration-200"
                aria-label="Follow us on X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* GitHub */}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 text-muted hover:text-gold transition-colors duration-200"
                aria-label="View our GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Publication + Tools */}
          <div>
            <h3 className="font-display text-sm font-semibold text-gold-light uppercase tracking-wider mb-4">
              Publication
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.publication.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-paper transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-display text-sm font-semibold text-gold-light uppercase tracking-wider mb-4 mt-6">
              Tools
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-paper transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Topics */}
          <div>
            <h3 className="font-display text-sm font-semibold text-gold-light uppercase tracking-wider mb-4">
              Topics
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.topics.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-paper transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter mini-signup */}
          <div>
            <h3 className="font-display text-sm font-semibold text-gold-light uppercase tracking-wider mb-4">
              Newsletter
            </h3>
            {state.success ? (
              <p className="text-sm text-gold-light">You&apos;re subscribed!</p>
            ) : (
              <form action={formAction} className="space-y-3">
                <Input
                  type="email"
                  id="footer-newsletter-email"
                  name="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  required
                  aria-label="Email address for newsletter"
                  disabled={isPending}
                />
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  loading={isPending}
                  className="w-full"
                >
                  Subscribe
                </Button>
                {state.error && (
                  <p className="text-xs text-red-400">{state.error}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gold/[0.18] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {currentYear} MathLumen. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted">
            <Link href="/privacy" className="px-2 py-2 hover:text-paper transition-colors duration-200">
              Privacy
            </Link>
            <span className="text-gold/20">&middot;</span>
            <Link href="/about" className="px-2 py-2 hover:text-paper transition-colors duration-200">
              Terms
            </Link>
            <span className="text-gold/20">&middot;</span>
            <button
              type="button"
              onClick={openPreferences}
              className="px-2 py-2 hover:text-paper transition-colors duration-200 cursor-pointer"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
