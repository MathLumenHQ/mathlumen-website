import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About",
  description:
    "Learn about MathLumen — a scholarly mathematics publication exploring beauty, history, and applications of mathematics.",
  path: "/about",
});

const PILLARS = [
  {
    title: "History",
    description:
      "The stories behind mathematical breakthroughs — from ancient geometry to modern conjectures.",
  },
  {
    title: "Research",
    description:
      "Rigorous coverage of new theorems, proofs, and mathematical breakthroughs.",
  },
  {
    title: "Applied Math",
    description:
      "Where abstract mathematics meets the physical world — spectral methods, cryptography, and beyond.",
  },
  {
    title: "AI & ML",
    description:
      "The deep mathematical foundations of artificial intelligence and machine learning.",
  },
  {
    title: "Essays",
    description:
      "Long-form explorations of ideas that deserve more than a theorem statement.",
  },
  {
    title: "Pedagogy",
    description:
      "Making serious mathematics accessible without sacrificing depth or rigor.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Mission */}
      <header className="mb-16 text-center">
        <div className="flex justify-center mb-6">
          <Logo size="lg" animated />
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-paper mb-6">
          About MathLumen
        </h1>
        <blockquote className="max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl text-gold-light font-body italic leading-relaxed">
            &ldquo;MathLumen exists to make serious mathematics accessible,
            beautiful, and impossible to ignore.&rdquo;
          </p>
        </blockquote>
      </header>

      {/* Intro prose */}
      <div className="prose mb-16">
        <p>
          We believe mathematics is not merely a tool for science and
          engineering but a profound human endeavor that reveals the deep
          structure of reality. MathLumen bridges the gap between rigorous
          mathematical research and accessible, beautifully crafted writing —
          for working mathematicians, students, and curious minds alike.
        </p>
      </div>

      {/* What We Publish — 6 pillars grid */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-paper mb-8 border-b border-gold/[0.18] pb-3">
          What We Publish
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="relative bg-ink-2 border border-gold/10 p-6 pillar-card hover:border-gold/25 transition-colors duration-200"
            >
              <h3 className="font-display text-lg font-semibold text-gold-light mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Standards — numbered prose */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-paper mb-8 border-b border-gold/[0.18] pb-3">
          Editorial Standards
        </h2>
        <div className="space-y-6">
          {[
            {
              num: 1,
              title: "Mathematical Accuracy",
              text: "Every equation, proof sketch, and claim is reviewed for correctness. We do not publish hand-waving where precision is required.",
            },
            {
              num: 2,
              title: "Clear Exposition",
              text: "Difficulty is not an excuse for obscurity. Our authors explain ideas at the highest level of clarity the subject permits, building intuition before formalism.",
            },
            {
              num: 3,
              title: "Beautiful Typesetting",
              text: "Mathematics deserves presentation that honors its elegance. We use KaTeX for display equations, carefully chosen fonts, and layouts designed for sustained reading.",
            },
            {
              num: 4,
              title: "Expert Authorship",
              text: "Our authors include university professors, research mathematicians, and science writers who share our passion for mathematical clarity and beauty.",
            },
            {
              num: 5,
              title: "Original Perspective",
              text: "We publish work that offers new insight, not mere summaries. Every article should leave the reader understanding something they did not before.",
            },
          ].map((standard) => (
            <div key={standard.num} className="flex gap-5">
              <span className="text-2xl font-display font-bold text-gold/40 shrink-0 w-8 text-right">
                {standard.num}
              </span>
              <div>
                <h3 className="font-display font-semibold text-paper mb-1">
                  {standard.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {standard.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="font-display text-2xl font-bold text-paper mb-4 border-b border-gold/[0.18] pb-3">
          Contact
        </h2>
        <p className="text-muted leading-relaxed">
          We welcome submissions, corrections, and correspondence from readers.
          Reach us at{" "}
          <a
            href="mailto:editors@mathlumen.com"
            className="text-gold hover:text-gold-light transition-colors duration-200 underline underline-offset-2"
          >
            editors@mathlumen.com
          </a>
          .
        </p>
        <div className="mt-8">
          <Link
            href="/newsletter"
            className="inline-flex items-center px-6 py-3 bg-gold text-ink font-semibold hover:bg-gold-light transition-colors duration-200"
          >
            Subscribe to the newsletter
          </Link>
        </div>
      </section>
    </div>
  );
}
