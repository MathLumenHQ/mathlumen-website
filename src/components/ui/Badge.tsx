import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { Category } from "@/schema/types";

type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** The article category — determines color scheme */
  category?: Category;
  /** Size preset */
  size?: BadgeSize;
}

/** Category-specific color mapping */
const categoryStyles: Record<Category, string> = {
  history: "border-gold/40 text-gold bg-gold/8",
  research: "border-[#4a9eff]/40 text-[#4a9eff] bg-[#4a9eff]/8",
  applied: "border-[#4aff9e]/40 text-[#4aff9e] bg-[#4aff9e]/8",
  "ai-ml": "border-[#9e4aff]/40 text-[#9e4aff] bg-[#9e4aff]/8",
  essay: "border-paper/20 text-muted bg-paper/5",
  news: "border-[#ff8c42]/40 text-[#ff8c42] bg-[#ff8c42]/8",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-px text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
};

/**
 * Badge component for categories, tags, and labels.
 * When a `category` prop is provided, it uses the editorial color scheme.
 * Otherwise renders a neutral tag style.
 */
export function Badge({
  className,
  category,
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const colorStyle = category
    ? categoryStyles[category]
    : "border-gold/20 text-gold-light bg-gold/8";

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono uppercase tracking-wider rounded-none border leading-tight",
        sizeStyles[size],
        colorStyle,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
