import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { SITE_DESCRIPTION, FOOTER_LINKS, TWITTER_HANDLE } from "@/lib/constants";

/**
 * Site footer with navigation links, description, and social links.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-2 border-t border-gold/10 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand column */}
          <div className="space-y-4">
            <Logo />
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              {SITE_DESCRIPTION}
            </p>
          </div>

          {/* Explore column */}
          <div>
            <h3 className="font-display text-sm font-semibold text-gold-light uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.explore.map((link) => (
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

          {/* About column */}
          <div>
            <h3 className="font-display text-sm font-semibold text-gold-light uppercase tracking-wider mb-4">
              About
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.about.map((link) => (
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
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {currentYear} MathLumen. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`https://twitter.com/${TWITTER_HANDLE.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-gold transition-colors duration-200"
              aria-label="Follow us on Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <Link
              href="/api/rss"
              className="text-muted hover:text-gold transition-colors duration-200"
              aria-label="RSS Feed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3.429 5.1v2.4c7.18 0 13.029 5.849 13.029 13.029h2.4C18.857 12.249 11.709 5.1 3.429 5.1zm0 4.8v2.4a5.76 5.76 0 0 1 5.829 5.829h2.4c0-4.491-3.738-8.229-8.229-8.229zM5.1 17.1a1.671 1.671 0 1 0 0 3.343 1.671 1.671 0 0 0 0-3.343z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
