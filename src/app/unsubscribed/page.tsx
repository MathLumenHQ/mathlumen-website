import Link from "next/link";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Unsubscribed",
  description: "You have been unsubscribed from the MathLumen newsletter.",
  path: "/unsubscribed",
});

interface UnsubscribedPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function UnsubscribedPage({ searchParams }: UnsubscribedPageProps) {
  const { status } = await searchParams;

  const isError = status === "error";
  const isInvalid = status === "invalid";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-lg mx-auto text-center">
        {isError || isInvalid ? (
          <>
            <p className="text-xs text-[#ff8c42] font-mono uppercase tracking-widest mb-4">
              Something went wrong
            </p>
            <h1 className="font-display text-4xl font-bold text-paper mb-4">
              {isInvalid ? "Invalid Link" : "Unsubscribe Failed"}
            </h1>
            <p className="text-muted text-lg mb-8">
              {isInvalid
                ? "This unsubscribe link is invalid or has already been used."
                : "We could not process your request. Please try again or contact us."}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs text-gold font-mono uppercase tracking-widest mb-4">
              Done
            </p>
            <h1 className="font-display text-4xl font-bold text-paper mb-4">
              You&apos;ve been unsubscribed
            </h1>
            <p className="text-muted text-lg mb-8">
              You will no longer receive newsletter emails from MathLumen.
              You can resubscribe at any time.
            </p>
          </>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 text-sm border border-gold/30 text-gold hover:border-gold/60 hover:bg-gold/[0.04] transition-colors duration-200"
          >
            Back to MathLumen
          </Link>
          <Link
            href="/newsletter"
            className="px-6 py-3 text-sm text-muted hover:text-paper transition-colors duration-200"
          >
            Resubscribe
          </Link>
        </div>
      </div>
    </div>
  );
}
