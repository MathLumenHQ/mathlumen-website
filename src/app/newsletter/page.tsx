import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Newsletter",
  description:
    "Subscribe to the MathLumen newsletter for weekly dispatches on mathematical beauty and discovery.",
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-xs text-gold font-mono uppercase tracking-widest mb-4">
          Newsletter
        </p>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-paper mb-6">
          The MathLumen Newsletter
        </h1>
        <p className="text-muted text-lg mb-4">
          A weekly dispatch on mathematical beauty, groundbreaking research,
          and the equations that shape our understanding of the universe.
        </p>
        <p className="text-muted mb-10">
          Join mathematicians and researchers worldwide who start their week
          with MathLumen.
        </p>

        <div className="bg-ink-2 border border-gold/10 p-8">
          <NewsletterForm />
        </div>

        {/* What subscribers get */}
        <div className="mt-16 text-left">
          <h2 className="font-display text-xl font-bold text-paper mb-6 text-center">
            What you&apos;ll receive
          </h2>
          <div className="space-y-6">
            {[
              {
                title: "Weekly Digest",
                description:
                  "A curated selection of the best new articles, delivered every Sunday morning.",
              },
              {
                title: "Exclusive Content",
                description:
                  "Subscriber-only essays, problem sets, and behind-the-scenes editorial notes.",
              },
              {
                title: "Research Highlights",
                description:
                  "Concise summaries of the most important new results in mathematics and AI.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 items-start border-l-2 border-gold/30 pl-4"
              >
                <div>
                  <h3 className="font-display font-semibold text-paper mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="font-display text-2xl font-bold text-gold mb-1">
              Weekly
            </p>
            <p className="text-sm text-muted">One curated issue per week</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-gold mb-1">
              Free
            </p>
            <p className="text-sm text-muted">Always free, no paywall</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-gold mb-1">
              Focused
            </p>
            <p className="text-sm text-muted">Deep mathematics, no fluff</p>
          </div>
        </div>
      </div>
    </div>
  );
}
