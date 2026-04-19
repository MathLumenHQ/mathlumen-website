import { createMetadata } from "@/lib/metadata";
import { getPowArchiveYears, getPublishedPowIssuesByYear } from "@/lib/queries/pow";
import { PowArchiveYearSection } from "@/components/pow/PowArchiveYearSection";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata = createMetadata({
  title: "Problem of the Week Archive",
  description:
    "Browse published Problem of the Week issues by year, with archival metadata and final PDF links.",
  path: "/pow/archive",
});

export default async function PowArchivePage() {
  const years = await getPowArchiveYears();
  const groupedIssues = await Promise.all(
    years.map(async (year) => ({
      year,
      issues: await getPublishedPowIssuesByYear(year),
    }))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Problem Solutions" },
          { name: "Archive" },
        ]}
      />

      <header className="mb-12">
        <p className="font-mono text-gold uppercase tracking-[0.2em] text-xs mb-4">
          Published Archive
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-black text-paper leading-tight mb-4">
          Problem of the Week Archive
        </h1>
        <p className="max-w-3xl text-lg text-muted leading-relaxed">
          A year-indexed archive of final Problem of the Week solution issues, each
          preserved with its publication metadata and official PDF.
        </p>
      </header>

      {groupedIssues.length === 0 ? (
        <div className="border border-gold/[0.18] bg-ink-2 p-10 text-center">
          <p className="font-display text-xl text-muted italic">
            No published issues are available yet.
          </p>
        </div>
      ) : (
        <div className="space-y-14">
          {groupedIssues.map(({ year, issues }) => (
            <div key={year} id={`year-${year}`}>
              <PowArchiveYearSection year={year} issues={issues} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
