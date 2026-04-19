import { cn } from "@/lib/utils";
import { getPowPdfHref } from "@/lib/queries/pow";

interface PowPdfPanelProps {
  pdfUrl: string;
  publicId: string;
  title?: string;
  className?: string;
}

const buttonBase =
  "inline-flex items-center justify-center rounded-none font-body transition-all duration-200 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2";

export function PowPdfPanel({
  pdfUrl: _pdfUrl,
  publicId,
  title = "Issue PDF",
  className,
}: PowPdfPanelProps) {
  const viewHref = getPowPdfHref(publicId);
  const downloadHref = getPowPdfHref(publicId, true);

  return (
    <div className={cn("border border-gold/[0.18] bg-ink-2 p-5 sm:p-6", className)}>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-3">
        PDF Edition
      </p>
      <h3 className="font-display text-xl font-semibold text-paper mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-5">
        Official typeset release for <span className="text-paper">{publicId}</span>.
        View in browser or download the final publication PDF.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={viewHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonBase, "bg-gold text-ink font-semibold hover:bg-gold-light px-5 py-2.5")}
        >
          View PDF
        </a>
        <a
          href={downloadHref}
          className={cn(
            buttonBase,
            "bg-ink text-paper border border-gold/[0.18] hover:border-gold/60 active:bg-ink-2 font-semibold px-5 py-2.5"
          )}
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}
