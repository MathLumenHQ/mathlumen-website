import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "elevated" | "bordered" | "article";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: CardVariant;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-ink-2 border border-gold/[0.18]",
  elevated: "bg-ink-2 border border-gold/[0.18] shadow-lg shadow-black/20",
  bordered: "bg-transparent border border-gold/[0.18]",
  article:
    "bg-ink-2 border border-gold/[0.18] border-l-2 border-l-gold hover:shadow-lg hover:shadow-gold/5",
};

/**
 * Card container with the MathLumen dark ink aesthetic.
 * Zero border-radius is an intentional design choice.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-none transition-all duration-200",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

/**
 * Card header section. Typically contains title and description.
 */
export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 pt-6 pb-2", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card body / main content area.
 */
export function CardBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-4 text-paper/80", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card footer section. Separated by a gold-tinted top border.
 */
export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 pb-6 pt-4 border-t border-gold/[0.10]", className)}
      {...props}
    >
      {children}
    </div>
  );
}
