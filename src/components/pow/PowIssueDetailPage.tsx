import Link from "next/link";
import { SITE_URL } from "@/lib/constants";
import { getPowIssueHref } from "@/lib/queries/pow";
import { formatDate } from "@/lib/utils";
import type { PowIssueWithRelations } from "@/schema/types";
import type { CompiledPowSolution } from "@/lib/pow-mdx";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PowAuthorList } from "@/components/pow/PowAuthorList";
import { PowCitationBlock } from "@/components/pow/PowCitationBlock";
import { PowIssueHeader } from "@/components/pow/PowIssueHeader";
import { PowKeywordList } from "@/components/pow/PowKeywordList";
import { PowMetadataBlock } from "@/components/pow/PowMetadataBlock";
import { PowPdfPanel } from "@/components/pow/PowPdfPanel";
import { PowSolverList } from "@/components/pow/PowSolverList";
import type { ReactElement } from "react";

interface PowIssueDetailPageProps {
  issue: PowIssueWithRelations;
  solution: CompiledPowSolution | null;
  problemContent: ReactElement | null;
  abstractContent: ReactElement | null;
}

export function PowIssueDetailPage({
  issue,
  solution,
  problemContent,
  abstractContent,
}: PowIssueDetailPageProps) {
  const canonicalUrl = issue.url || `${SITE_URL}${getPowIssueHref(issue.publicId)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: issue.title,
    description: issue.abstract,
    identifier: issue.publicId,
    datePublished: issue.publicationDate,
    dateCreated: issue.createdAt,
    dateModified: issue.updatedAt,
    url: canonicalUrl,
    author: issue.authors.map((author) => ({
      "@type": "Person",
      name: author.name,
      affiliation: author.affiliations.map((affiliation) => ({
        "@type": "Organization",
        name: affiliation.name,
      })),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Problem Solutions", href: "/pow/archive" },
            { name: issue.title },
          ]}
        />

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-8">
          <article className="min-w-0">
            <PowIssueHeader issue={issue} />

            {problemContent && (
              <section className="mb-10 border border-gold/[0.18] bg-ink-2 p-5 sm:p-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-3">
                  Problem
                </p>
                <div className="prose">{problemContent}</div>
              </section>
            )}

            {solution && (
              <section className="mb-10 border border-gold/[0.18] bg-ink-2 p-5 sm:p-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-4">
                  Solution
                </p>
                <div className="prose">{solution.content}</div>
              </section>
            )}

            {abstractContent && (
              <section className="mb-10">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-3">
                  Abstract
                </p>
                <div className="prose">{abstractContent}</div>
              </section>
            )}

            <div className="space-y-8">
              <PowMetadataBlock issue={issue} />

              <section className="border border-gold/[0.18] bg-ink-2 p-5 sm:p-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-4">
                  Authors
                </p>
                <PowAuthorList authors={issue.authors} />
              </section>

              <section className="border border-gold/[0.18] bg-ink-2 p-5 sm:p-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-4">
                  Keywords
                </p>
                <PowKeywordList keywords={issue.keywords} />
              </section>

              <section className="border border-gold/[0.18] bg-ink-2 p-5 sm:p-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-4">
                  Solver Acknowledgements
                </p>
                <PowSolverList solvers={issue.solvers} />
              </section>

              <PowCitationBlock issue={issue} />
            </div>
          </article>

          <aside className="space-y-6">
            <PowPdfPanel pdfUrl={issue.pdfUrl} publicId={issue.publicId} />

            <div className="border border-gold/[0.18] bg-ink-2 p-5 sm:p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-3">
                Canonical URL
              </p>
              <a
                href={canonicalUrl}
                className="break-all text-sm text-paper hover:text-gold-light transition-colors duration-200"
              >
                {canonicalUrl}
              </a>
            </div>

            <div className="border border-gold/[0.18] bg-ink-2 p-5 sm:p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-3">
                Publication Notes
              </p>
              <ul className="space-y-2 text-sm text-muted">
                {issue.publicationDate && (
                  <li>Released {formatDate(issue.publicationDate)}</li>
                )}
                {issue.weekOf && <li>Week of {formatDate(issue.weekOf)}</li>}
                {issue.deadline && <li>Submission deadline {formatDate(issue.deadline)}</li>}
                <li>Status {issue.publicationStatus}</li>
                {solution ? <li>Solution body synced from local MDX</li> : <li>Solution MDX file not found</li>}
              </ul>
              <div className="mt-4 pt-4 border-t border-gold/[0.10]">
                <Link
                  href="/pow/archive"
                  className="text-sm text-gold hover:text-gold-light transition-colors duration-200 font-mono"
                >
                  Back to archive &rarr;
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
