"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { NAV_LINKS } from "@/lib/constants";

/**
 * Main site navigation with responsive mobile menu.
 */
export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-ink/95 backdrop-blur-sm border-b border-gold/10 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Logo />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-body tracking-wide transition-colors duration-200",
                  pathname === link.href
                    ? "text-gold"
                    : "text-paper/60 hover:text-paper"
                )}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/newsletter"
              className="text-sm font-body px-4 py-1.5 border border-gold text-gold hover:bg-gold/10 rounded-sm transition-colors duration-200"
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden text-paper/60 hover:text-paper p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gold/10 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-2 py-2 text-base font-body transition-colors duration-200",
                  pathname === link.href
                    ? "text-gold"
                    : "text-paper/60 hover:text-paper"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/newsletter"
              className="block px-2 py-2 text-base font-body text-gold"
              onClick={() => setMobileOpen(false)}
            >
              Subscribe
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
