import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Loading skeleton placeholder with a subtle shimmer animation.
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse bg-paper/5 rounded-sm",
        className
      )}
      {...props}
    />
  );
}
