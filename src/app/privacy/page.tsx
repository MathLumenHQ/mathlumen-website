import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "How MathLumen handles your data. Privacy-first analytics, no cookies, no personal data sold.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const lastUpdated = new Date("2026-04-06").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-bold text-paper mb-3">
        Privacy Policy
      </h1>
      <p className="text-sm text-muted mb-12">Last updated: {lastUpdated}</p>

      <div className="space-y-10 text-base leading-relaxed text-paper">
        <section>
          <h2 className="font-display text-xl font-semibold text-paper mb-3 pb-2 border-b border-gold/20">
            What We Collect
          </h2>
          <p className="text-muted">
            MathLumen uses Vercel Analytics for privacy-first page view
            tracking. No personal data is collected. No cookies are set by our
            analytics. No data is sold to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-paper mb-3 pb-2 border-b border-gold/20">
            Cookie Categories
          </h2>
          <div className="space-y-5 text-muted">
            <div>
              <p className="font-semibold text-paper mb-1">Essential</p>
              <p>
                Required for the site to function. Stores your theme preference
                and cookie consent choices in your browser&apos;s localStorage.
                No data leaves your device.
              </p>
            </div>
            <div>
              <p className="font-semibold text-paper mb-1">Functional</p>
              <p>
                Optional. Stores reading progress, display preferences, and
                editor state locally in your browser. Never transmitted to any
                server.
              </p>
            </div>
            <div>
              <p className="font-semibold text-paper mb-1">Analytics</p>
              <p>
                Optional. Activates enhanced Vercel Analytics including Web
                Vitals and navigation timing. Cookieless, anonymous, and never
                tied to personal data. Basic page view data is always collected
                under legitimate interest (equivalent to server access logs).
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-paper mb-3 pb-2 border-b border-gold/20">
            Your Rights
          </h2>
          <p className="text-muted">
            You can update your cookie preferences at any time using the{" "}
            <span className="text-gold-light">Cookie Settings</span> link in
            the footer.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-paper mb-3 pb-2 border-b border-gold/20">
            Contact
          </h2>
          <p className="text-muted">
            For privacy questions, contact us at{" "}
            <a
              href="mailto:privacy@mathlumen.com"
              className="text-gold-light hover:text-gold transition-colors duration-200"
            >
              privacy@mathlumen.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
