import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether to show a gold left border accent */
  accent?: boolean;
}

/**
 * Card container with the MathLumen dark ink aesthetic.
 * Zero border-radius is an intentional design choice.
 */
export function Card({ className, accent = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-ink-2 border border-gold/10 rounded-none p-6 transition-colors duration-200",
        "hover:border-gold/25",
        accent && "border-l-2 border-l-gold",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card header section with title styling.
 */
export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card body content section.
 */
export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-paper/80", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card footer section.
 */
export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-gold/10", className)} {...props}>
      {children}
    </div>
  );
}
