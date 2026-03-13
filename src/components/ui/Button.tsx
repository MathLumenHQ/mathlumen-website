import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "gold" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Show loading spinner and disable interaction */
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-paper border border-gold/[0.18] hover:border-gold/60 active:bg-ink-2 font-semibold",
  secondary:
    "bg-ink-2 text-paper border border-gold/[0.18] hover:border-gold/40 hover:text-gold-light",
  ghost:
    "bg-transparent text-gold border border-transparent hover:border-gold/[0.18] active:bg-gold/5",
  gold:
    "bg-gold text-ink font-semibold hover:bg-gold-light active:bg-gold-dark",
  danger:
    "bg-red-900/30 text-red-300 border border-red-500/20 hover:border-red-500/50 hover:text-red-200",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-base gap-2",
  lg: "px-7 py-3 text-lg gap-2.5",
};

/**
 * Reusable button with variant, size, and loading state support.
 * Follows the MathLumen gold-on-ink design system.
 * Fully keyboard accessible with visible focus ring.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-none font-body transition-all duration-200",
          "focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
