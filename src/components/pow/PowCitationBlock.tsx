import type { PowIssueWithRelations } from "@/schema/types";
import { formatDate } from "@/lib/utils";

interface PowCitationBlockProps {
  issue: PowIssueWithRelations;
}

export function PowCitationBlock({ issue }: PowCitationBlockProps) {
  const authors = issue.authors.map((author) => author.name).join(", ");
  const date = issue.publicationDate ? formatDate(issue.publicationDate) : "n.d.";
  const citation = `${authors}. "${issue.title}." ${issue.series}, vol. ${issue.volume ?? "—"}, no. ${issue.issue ?? "—"} (${date}). ${issue.url}`;

  return (
    <div className="border border-gold/[0.18] bg-ink-2 p-5 sm:p-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-3">
        Suggested Citation
      </p>
      <p className="text-sm text-paper leading-relaxed">{citation}</p>
    </div>
  );
}
