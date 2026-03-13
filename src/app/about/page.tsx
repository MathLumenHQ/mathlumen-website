import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About",
  description: "Learn about MathLumen — a scholarly mathematics publication exploring beauty, history, and applications of mathematics.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display text-3xl md:text-5xl font-bold text-paper mb-8">
        About MathLumen
      </h1>

      <div className="prose">
        <p>
          MathLumen is a scholarly mathematics publication dedicated to illuminating
          the beauty, depth, and far-reaching applications of mathematics. We bridge
          the gap between rigorous mathematical research and accessible, beautifully
          crafted writing.
        </p>

        <h2>Our Mission</h2>
        <p>
          We believe that mathematics is not merely a tool for science and engineering
          but a profound human endeavor that reveals the deep structure of reality.
          Our mission is to make this beauty accessible to curious minds — from
          working mathematicians to students and enthusiasts.
        </p>

        <h2>What We Publish</h2>
        <p>
          Our articles span five editorial verticals, each curated by experts in their field:
        </p>
        <ul>
          <li>
            <strong>History</strong> — The stories behind mathematical breakthroughs,
            from ancient geometry to modern number theory.
          </li>
          <li>
            <strong>Research</strong> — Frontiers of mathematical discovery,
            explained with clarity and rigor.
          </li>
          <li>
            <strong>Applied</strong> — Mathematics in practice, from spectral methods
            and fluid dynamics to cryptography.
          </li>
          <li>
            <strong>AI &amp; ML</strong> — The mathematical foundations powering
            artificial intelligence and machine learning.
          </li>
          <li>
            <strong>Essays</strong> — Reflections on mathematical beauty, philosophy,
            and the human experience of discovery.
          </li>
        </ul>

        <h2>Our Standards</h2>
        <p>
          Every article published on MathLumen undergoes rigorous editorial review.
          We insist on mathematical accuracy, clear exposition, and beautiful
          typesetting. Our authors include university professors, research
          mathematicians, and science writers who share our passion for mathematical
          clarity.
        </p>

        <h2>Contact</h2>
        <p>
          We welcome submissions, corrections, and correspondence from readers.
          Reach us at <a href="mailto:editors@mathlumen.com">editors@mathlumen.com</a>.
        </p>
      </div>
    </div>
  );
}
