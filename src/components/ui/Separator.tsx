import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  /** Whether to use the gold accent color */
  gold?: boolean;
}

/**
 * Horizontal separator line.
 */
export function Separator({ className, gold = false, ...props }: SeparatorProps) {
  return (
    <hr
      className={cn(
        "border-0 border-t",
        gold ? "border-gold/30" : "border-paper/10",
        className
      )}
      {...props}
    />
  );
}
