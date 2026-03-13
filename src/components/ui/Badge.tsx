import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "gold" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-paper/10 text-paper/70",
  gold: "bg-gold/15 text-gold-light border border-gold/20",
  outline: "border border-paper/20 text-paper/60",
};

/**
 * Small badge/tag component for categories and labels.
 */
export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider rounded-sm",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
