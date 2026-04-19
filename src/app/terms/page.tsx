import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Terms of Use",
  description:
    "Terms governing access to MathLumen, including editorial content, newsletter delivery, and Problem of the Week submissions.",
  path: "/terms",
});

export default function TermsPage() {
  const lastUpdated = new Date("2026-04-19").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-bold text-paper mb-3">Terms of Use</h1>
      <p className="text-sm text-muted mb-12">Last updated: {lastUpdated}</p>

      <div className="space-y-10 text-base leading-relaxed text-paper">
        <section>
          <h2 className="font-display text-xl font-semibold text-paper mb-3 pb-2 border-b border-gold/20">
            Use of the Site
          </h2>
          <p className="text-muted">
            MathLumen provides mathematical articles, editorial commentary, tools, and
            Problem of the Week content for informational and educational use. You may
            browse and share links to our content, but you may not misuse the site,
            attempt to disrupt availability, or submit abusive automated traffic.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-paper mb-3 pb-2 border-b border-gold/20">
            User Submissions
          </h2>
          <p className="text-muted">
            When you submit a Problem of the Week solution or subscribe to the newsletter,
            you are responsible for the accuracy of the information you provide. We may
            review, reject, summarize, or editorially reference submitted proofs.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-paper mb-3 pb-2 border-b border-gold/20">
            Intellectual Property
          </h2>
          <p className="text-muted">
            Unless otherwise noted, MathLumen editorial content, branding, and site design
            are protected by applicable intellectual property law. Do not reproduce full
            articles, PDFs, or branded assets without permission.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-paper mb-3 pb-2 border-b border-gold/20">
            Service Availability
          </h2>
          <p className="text-muted">
            We aim for reliable access, but availability is not guaranteed. Features may
            change, move, or be removed as the publication evolves.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-paper mb-3 pb-2 border-b border-gold/20">
            Contact
          </h2>
          <p className="text-muted">
            For legal or policy questions, contact{" "}
            <a
              href="mailto:editorial@mathlumen.com"
              className="text-gold-light hover:text-gold transition-colors duration-200"
            >
              editorial@mathlumen.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
