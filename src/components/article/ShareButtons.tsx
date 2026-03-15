"use client";

import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  url: string;
  /** Compact variant for top-of-article placement */
  variant?: "default" | "compact";
}

/**
 * Social share buttons: X, LinkedIn, Facebook, Reddit, WhatsApp, Copy Link.
 * Automatically generates share URLs from article title + URL.
 */
export function ShareButtons({ title, url, variant = "default" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareTitle = `${title} | MathLumen`;
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      name: "X",
      href: `https://twitter.com/share?url=${encodedUrl}&text=${encodedTitle}&via=MathLumen&hashtags=Mathematics,AI,MachineLearning`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Reddit",
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm6.066 13.28c.068.346.104.7.104 1.06 0 3.626-4.03 6.56-9.006 6.56-4.976 0-9.006-2.934-9.006-6.56 0-.36.036-.714.104-1.06a1.872 1.872 0 01-.808-1.536c0-1.038.843-1.88 1.882-1.88.494 0 .943.19 1.28.502 1.26-.86 2.98-1.408 4.892-1.47l.924-4.352a.347.347 0 01.412-.268l3.074.65a1.316 1.316 0 012.46.616c0 .726-.59 1.316-1.316 1.316a1.316 1.316 0 01-1.302-1.14l-2.726-.578-.82 3.864c1.876.076 3.558.626 4.796 1.474a1.876 1.876 0 011.28-.502c1.038 0 1.882.842 1.882 1.88 0 .616-.298 1.162-.758 1.504zM8.236 13.284a1.316 1.316 0 000 2.632 1.316 1.316 0 000-2.632zm7.528 0a1.316 1.316 0 000 2.632 1.316 1.316 0 000-2.632zm-1.02 3.89a4.606 4.606 0 01-5.488 0 .347.347 0 01.412-.558 3.912 3.912 0 004.664 0 .347.347 0 01.412.558z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
  ] as const;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const btnClass =
    variant === "compact"
      ? "p-1.5 text-muted hover:text-gold hover:border-gold/30 border border-transparent transition-all duration-200 hover:scale-110"
      : "p-2 text-muted hover:text-gold border border-gold/[0.18] hover:border-gold/30 hover:bg-gold/[0.04] transition-all duration-200 hover:scale-110";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted font-mono uppercase tracking-wider mr-1">
        Share
      </span>

      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          aria-label={`Share on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopy}
        className={btnClass}
        aria-label={copied ? "Link copied" : "Copy link"}
      >
        {copied ? (
          <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.576a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.343 8.28" />
          </svg>
        )}
      </button>
    </div>
  );
}
