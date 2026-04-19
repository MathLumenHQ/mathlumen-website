import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { PowIssueWithRelations } from "@/schema/types";
import { formatDate, truncate } from "@/lib/utils";
import { getPowIssueHref, getPowPdfHref } from "@/lib/queries/pow";

interface PowIssueCardProps {
  issue: PowIssueWithRelations;
}

export function PowIssueCard({ issue }: PowIssueCardProps) {
  const issueHref = getPowIssueHref(issue.publicId);

  return (
    <article className="border border-gold/[0.18] bg-ink-2 p-5 sm:p-6 transition-colors duration-200 hover:border-gold/35">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge size="sm">{issue.publicId}</Badge>
        <Badge size="sm">{issue.difficulty}</Badge>
        {issue.topic && <Badge size="sm">{issue.topic}</Badge>}
      </div>

      <h3 className="font-display text-xl font-bold text-paper mb-2 leading-snug">
        <Link href={issueHref} className="hover:text-gold-light transition-colors duration-200">
          {issue.title}
        </Link>
      </h3>

      {issue.subtitle && (
        <p className="text-sm text-gold-light/80 italic mb-3 leading-relaxed">
          {issue.subtitle}
        </p>
      )}

      {issue.abstract && (
        <p className="text-sm text-muted leading-relaxed mb-4">
          {truncate(issue.abstract, 180)}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted font-mono mb-5">
        {issue.publicationDate && <span>{formatDate(issue.publicationDate)}</span>}
        <span>{issue.problemId}</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <Link
          href={issueHref}
          className="text-paper hover:text-gold transition-colors duration-200 font-semibold"
        >
          Read Issue
        </Link>
        <a
          href={getPowPdfHref(issue.publicId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:text-gold-light transition-colors duration-200 font-mono text-xs uppercase tracking-[0.14em]"
        >
          View PDF
        </a>
      </div>
    </article>
  );
}
