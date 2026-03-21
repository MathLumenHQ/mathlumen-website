import { Suspense } from "react";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Compact newsletter signup for sidebar placements.
 * Wraps the shared NewsletterForm with a heading and tagline.
 */
export function SidebarNewsletter() {
  return (
    <div className="border border-gold/[0.18] p-4">
      <p className="font-mono text-gold uppercase tracking-[0.15em] text-xs mb-1">
        Newsletter
      </p>
      <h3 className="font-display text-sm font-semibold text-paper mb-2">
        Get MathLumen Weekly
      </h3>
      <p className="text-xs text-muted mb-4 leading-relaxed">
        New articles, research highlights, and mathematical curiosities — every Sunday.
      </p>
      {/* Force stacked layout in the narrow sidebar column */}
      <div className="[&_form>div]:!flex-col">
        <Suspense fallback={<Skeleton className="h-16 w-full" />}>
          <NewsletterForm />
        </Suspense>
      </div>
    </div>
  );
}
