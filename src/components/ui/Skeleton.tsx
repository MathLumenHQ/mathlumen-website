import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SkeletonVariant = "text" | "card" | "image" | "article";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Shape preset for common loading states */
  variant?: SkeletonVariant;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded-none",
  card: "h-48 w-full rounded-none",
  image: "h-64 w-full rounded-none",
  article: "h-80 w-full rounded-none",
};

/**
 * Loading skeleton placeholder with a gold shimmer animation.
 * Provides `text`, `card`, `image`, and `article` shape presets.
 */
export function Skeleton({
  className,
  variant = "text",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton-shimmer bg-paper/5 rounded-none",
        variantStyles[variant],
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
