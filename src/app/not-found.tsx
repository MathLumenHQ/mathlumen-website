import Link from "next/link";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  path: "/404",
});

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <p className="text-gold font-mono text-lg mb-4">404</p>
      <h1 className="font-display text-4xl md:text-5xl font-bold text-paper mb-6">
        Page not found
      </h1>
      <p className="text-muted text-lg mb-10 max-w-md mx-auto">
        Like an unsolved conjecture, this page remains elusive.
        Perhaps the solution lies elsewhere.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 bg-gold text-ink font-semibold rounded-sm hover:bg-gold-light transition-colors duration-200"
      >
        Return home
      </Link>
    </div>
  );
}
