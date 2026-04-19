import type { PowIssueWithRelations } from "@/schema/types";
import { PowIssueCard } from "./PowIssueCard";

interface PowArchiveYearSectionProps {
  year: number;
  issues: PowIssueWithRelations[];
}

export function PowArchiveYearSection({ year, issues }: PowArchiveYearSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-paper">
          {year}
        </h2>
        <div className="h-px flex-1 bg-gold/[0.18]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {issues.map((issue) => (
          <PowIssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </section>
  );
}
