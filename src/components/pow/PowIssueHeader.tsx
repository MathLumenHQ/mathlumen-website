import type { PowIssueWithRelations } from "@/schema/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface PowIssueHeaderProps {
  issue: PowIssueWithRelations;
}

export function PowIssueHeader({ issue }: PowIssueHeaderProps) {
  return (
    <header className="mb-10">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge size="sm">{issue.publicId}</Badge>
        <Badge size="sm">{issue.difficulty}</Badge>
        {issue.topic && <Badge size="sm">{issue.topic}</Badge>}
      </div>

      <h1 className="font-display text-[2rem] sm:text-5xl font-black text-paper leading-[1.08] mb-4">
        {issue.title}
      </h1>

      {issue.subtitle && (
        <p className="max-w-3xl text-lg sm:text-xl text-gold-light/80 font-body italic leading-relaxed mb-6">
          {issue.subtitle}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted font-mono">
        {issue.publicationDate && (
          <span>Published {formatDate(issue.publicationDate)}</span>
        )}
        {issue.issue && <span>Issue {issue.issue}</span>}
        {issue.volume && <span>Volume {issue.volume}</span>}
        {issue.sequence && <span>Sequence {issue.sequence}</span>}
      </div>
    </header>
  );
}
