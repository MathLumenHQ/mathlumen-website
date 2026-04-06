"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { NAV_CATEGORY_LINKS, NAV_LINKS } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * Fixed top navigation bar.
 * - Transparent at top, ink/80% backdrop-blur after 50px scroll
 * - Category links centered on desktop
 * - Gold subscribe CTA on right
 * - Cmd+K hint for search
 * - Mobile: Radix Dialog sheet drawer with all links
 */
export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200 no-print",
        scrolled
          ? "bg-ink/80 backdrop-blur-md border-b border-gold/[0.18]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="MathLumen home"
          >
            <Logo size="sm" animated />
            <span className="font-display text-base sm:text-lg font-bold text-paper tracking-tight">
              Math<span className="text-gold">Lumen</span>
            </span>
          </Link>

          {/* Desktop category links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_CATEGORY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative px-3 py-2 text-sm font-body tracking-wide transition-colors duration-200",
                  isActive(link.href) ? "text-gold" : "text-paper/60 hover:text-paper"
                )}
              >
                {link.label}
                {/* Active indicator — gold underline */}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />

            {/* Cmd+K search hint */}
            <button
              type="button"
              onClick={() => {
                document.dispatchEvent(new CustomEvent("open-search"));
              }}
              className="flex items-center gap-2 text-sm text-muted hover:text-paper transition-colors duration-200 px-3 py-1.5 border border-gold/[0.18] rounded-none"
              aria-label="Search articles (Ctrl+K)"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <span className="text-xs">Search</span>
              <kbd className="text-[10px] text-muted/50 font-mono ml-1 px-1 py-px border border-gold/10 rounded-none">
                Ctrl+K
              </kbd>
            </button>

            {/* Subscribe CTA */}
            <Link
              href="/newsletter"
              className="text-sm font-body px-4 py-1.5 bg-gold text-ink font-semibold hover:bg-gold-light rounded-none transition-colors duration-200"
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile right-side controls */}
          <div className="lg:hidden flex items-center gap-1">
            {/* Mobile search trigger */}
            <button
              type="button"
              onClick={() => document.dispatchEvent(new CustomEvent("open-search"))}
              className="text-paper/60 hover:text-paper p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-200"
              aria-label="Search articles"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Mobile hamburger — Radix Dialog trigger */}
            <Dialog.Root key={pathname} open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="text-paper/60 hover:text-paper p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-200"
                aria-label="Open navigation menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              {/* Backdrop */}
              <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />

              {/* Sheet drawer — slides from right */}
              <Dialog.Content
                className={cn(
                  "fixed top-0 right-0 z-50 h-full w-[300px] max-w-[85vw]",
                  "bg-ink-2 border-l border-gold/[0.18] shadow-2xl",
                  "flex flex-col",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out",
                  "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
                  "duration-200"
                )}
              >
                <VisuallyHidden.Root>
                  <Dialog.Title>Navigation menu</Dialog.Title>
                  <Dialog.Description>Site navigation links</Dialog.Description>
                </VisuallyHidden.Root>

                {/* Close button */}
                <div className="flex items-center justify-between px-6 h-16 border-b border-gold/[0.18]">
                  <Logo size="sm" />
                  <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="text-paper/60 hover:text-paper p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-200"
                        aria-label="Close navigation menu"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </Dialog.Close>
                  </div>
                </div>

                {/* Links */}
                <div className="flex-1 overflow-y-auto py-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={cn(
                        "block px-6 py-3 text-base font-body transition-colors duration-200",
                        isActive(link.href)
                          ? "text-gold bg-gold/5 border-l-2 border-l-gold"
                          : "text-paper/60 hover:text-paper hover:bg-paper/[0.03]"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div className="px-6 py-4 border-t border-gold/[0.18]">
                  <Link
                    href="/newsletter"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center text-sm font-body px-4 py-2.5 bg-gold text-ink font-semibold hover:bg-gold-light rounded-none transition-colors duration-200"
                  >
                    Subscribe
                  </Link>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          </div>
        </div>
      </div>
    </nav>
  );
}
