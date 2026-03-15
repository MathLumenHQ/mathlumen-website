import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { MltexEditor } from "@/components/tools/MltexEditor";

export const metadata = createMetadata({
  title: "MLTeX — Online Math Equation Editor",
  description:
    "MLTeX is a free online math editor with real-time MathJax preview. Write LaTeX equations, formulas, and expressions with instant rendering. No sign-up required.",
  path: "/tools/mltex",
});

export default function MltexPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "MLTeX",
          url: "https://mathlumen.com/tools/mltex",
          description:
            "MLTeX — free online math equation editor with real-time LaTeX preview powered by MathJax.",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          creator: {
            "@type": "Organization",
            name: "MathLumen",
            url: "https://mathlumen.com",
          },
        }}
      />

      {/* Banner */}
      <div className="bg-ink-2 border-b border-gold/[0.18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10">
          <p className="text-xs font-mono text-muted">
            Part of{" "}
            <Link
              href="/"
              className="text-gold hover:text-gold-light transition-colors duration-200"
            >
              MathLumen
            </Link>{" "}
            <span className="hidden sm:inline">— Illuminating Mathematics</span>
          </p>
          <Link
            href="/"
            className="text-xs text-muted hover:text-paper font-mono transition-colors duration-200"
          >
            &larr; Back to MathLumen
          </Link>
        </div>
      </div>

      {/* Editor */}
      <MltexEditor />
    </>
  );
}
