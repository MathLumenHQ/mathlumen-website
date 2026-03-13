import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether to use the gold accent color at 18% opacity */
  gold?: boolean;
  /** Orientation of the separator */
  orientation?: "horizontal" | "vertical";
}

/**
 * Visual divider line. Supports horizontal (default) and vertical orientation.
 * Gold variant uses the brand accent at 18% opacity.
 */
export function Separator({
  className,
  gold = false,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        isHorizontal ? "h-px w-full" : "w-px h-full",
        gold
          ? "bg-gold/[0.18]"
          : "bg-paper/10",
        className
      )}
      {...props}
    />
  );
}
