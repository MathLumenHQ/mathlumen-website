import type { PowIssueSolver } from "@/schema/types";

interface PowSolverListProps {
  solvers: PowIssueSolver[];
}

export function PowSolverList({ solvers }: PowSolverListProps) {
  if (solvers.length === 0) {
    return (
      <p className="text-sm text-muted italic">
        Solver acknowledgements have not been published for this issue.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {solvers.map((solver) => (
        <li key={solver.id} className="text-sm text-paper">
          <span>{solver.solverName}</span>
          {solver.note && <span className="text-muted"> — {solver.note}</span>}
        </li>
      ))}
    </ul>
  );
}
