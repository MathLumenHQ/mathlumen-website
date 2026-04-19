import { Badge } from "@/components/ui/Badge";
import type { PowIssueKeyword } from "@/schema/types";

interface PowKeywordListProps {
  keywords: PowIssueKeyword[];
}

export function PowKeywordList({ keywords }: PowKeywordListProps) {
  if (keywords.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword) => (
        <Badge key={`${keyword.powIssueId}-${keyword.keyword}`} className="normal-case tracking-normal">
          {keyword.keyword}
        </Badge>
      ))}
    </div>
  );
}
