import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Newsletter",
  description: "Subscribe to the MathLumen newsletter for weekly dispatches on mathematical beauty and discovery.",
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-paper mb-6">
          The MathLumen Newsletter
        </h1>
        <p className="text-muted text-lg mb-4">
          A weekly dispatch on mathematical beauty, groundbreaking research,
          and the equations that shape our understanding of the universe.
        </p>
        <p className="text-muted mb-10">
          Join thousands of mathematicians, researchers, and curious minds
          who start their week with MathLumen.
        </p>

        <div className="bg-ink-2 border border-gold/10 p-8">
          <NewsletterForm />
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="font-display text-2xl font-bold text-gold mb-1">Weekly</p>
            <p className="text-sm text-muted">One curated issue per week</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-gold mb-1">Free</p>
            <p className="text-sm text-muted">Always free, no paywall</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-gold mb-1">Focused</p>
            <p className="text-sm text-muted">Deep mathematics, no fluff</p>
          </div>
        </div>
      </div>
    </div>
  );
}
