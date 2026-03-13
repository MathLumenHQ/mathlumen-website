"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface CiteDialogProps {
  title: string;
  authorName: string;
  publishedAt: Date | null;
  url: string;
}

/**
 * "Cite this article" button + dialog with BibTeX format.
 */
export function CiteDialog({ title, authorName, publishedAt, url }: CiteDialogProps) {
  const [copied, setCopied] = useState(false);

  const year = publishedAt ? new Date(publishedAt).getFullYear() : new Date().getFullYear();
  const month = publishedAt
    ? new Date(publishedAt).toLocaleString("en", { month: "long" }).toLowerCase()
    : "";

  // Generate BibTeX key from author last name + year
  const lastNameMatch = authorName.match(/\S+$/);
  const lastName = lastNameMatch ? lastNameMatch[0].toLowerCase() : "author";
  const citeKey = `${lastName}${year}`;

  const bibtex = `@article{${citeKey},
  title     = {${title}},
  author    = {${authorName}},
  journal   = {MathLumen},
  year      = {${year}},${month ? `\n  month     = {${month}},` : ""}
  url       = {${url}},
  note      = {Accessed: ${new Date().toISOString().split("T")[0]}}
}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-muted hover:text-paper border border-gold/[0.18] hover:border-gold/30 px-3 py-1.5 transition-colors duration-200"
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          Cite this article
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[20vh] left-1/2 z-[100] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 bg-ink-2 border border-gold/[0.18] shadow-2xl">
          <div className="px-6 py-4 border-b border-gold/[0.10] flex items-center justify-between">
            <Dialog.Title className="font-display text-lg font-semibold text-paper">
              Cite this article
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-muted hover:text-paper transition-colors duration-200"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          <VisuallyHidden.Root>
            <Dialog.Description>BibTeX citation for this article</Dialog.Description>
          </VisuallyHidden.Root>

          <div className="p-6">
            <p className="text-xs text-muted font-mono uppercase tracking-wider mb-3">
              BibTeX
            </p>
            <pre className="bg-ink border border-gold/10 p-4 text-sm font-mono text-paper/80 overflow-x-auto whitespace-pre-wrap">
              {bibtex}
            </pre>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-4 px-4 py-2 text-sm bg-gold text-ink font-semibold hover:bg-gold-light transition-colors duration-200"
            >
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
