import { formatDate } from "@/lib/utils";
import type { PowIssueWithRelations } from "@/schema/types";

interface PowMetadataBlockProps {
  issue: PowIssueWithRelations;
}

function renderValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

export function PowMetadataBlock({ issue }: PowMetadataBlockProps) {
  const items = [
    ["Public ID", issue.publicId],
    ["Internal ID", issue.problemId],
    ["Series", issue.series],
    ["Series Code", issue.seriesCode],
    ["Volume", issue.volume],
    ["Issue", issue.issue],
    ["Sequence", issue.sequence],
    ["Topic", issue.topic],
    ["Difficulty", issue.difficulty],
    ["Publication Date", issue.publicationDate ? formatDate(issue.publicationDate) : null],
    ["Accepted", issue.acceptedDate ? formatDate(issue.acceptedDate) : null],
    ["Received", issue.receivedDate ? formatDate(issue.receivedDate) : null],
    ["Week Of", issue.weekOf ? formatDate(issue.weekOf) : null],
    ["Deadline", issue.deadline ? formatDate(issue.deadline) : null],
    ["Version", issue.version],
    ["Status", issue.publicationStatus],
  ] as const;

  return (
    <div className="border border-gold/[0.18] bg-ink-2 p-5 sm:p-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-4">
        Publication Metadata
      </p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted mb-1">
              {label}
            </dt>
            <dd className="text-sm text-paper">{renderValue(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
