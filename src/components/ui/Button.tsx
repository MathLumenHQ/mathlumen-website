import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-ink hover:bg-gold-light active:bg-gold-dark font-semibold",
  secondary:
    "bg-ink-2 text-paper border border-gold/20 hover:border-gold/50 hover:text-gold-light",
  ghost:
    "text-muted hover:text-paper hover:bg-paper/5",
  outline:
    "border border-gold text-gold hover:bg-gold/10 hover:text-gold-light",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3 text-lg",
};

/**
 * Reusable button component with variant and size options.
 * Follows the MathLumen gold-on-ink design system.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-body rounded-sm transition-colors duration-200",
          "focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
