import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Error message displayed below the input */
  error?: string;
  /** Render a search variant with magnifying glass icon */
  variant?: "default" | "search";
  /** Slot for a leading icon inside the input */
  leadingIcon?: ReactNode;
}

/**
 * Styled text input for the MathLumen design system.
 * Sharp corners, DM Mono font, gold focus border.
 * Supports search variant with built-in magnifying glass.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, variant = "default", leadingIcon, ...props }, ref) => {
    const isSearch = variant === "search";
    const icon = isSearch ? <SearchIcon /> : leadingIcon;

    return (
      <div className="w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-ink-2 border border-gold/[0.18] rounded-none px-4 py-2.5",
              "text-paper placeholder:text-muted font-mono text-sm",
              "focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30",
              "transition-all duration-200",
              icon && "pl-10",
              error &&
                "border-red-500/50 focus:border-red-500 focus:ring-red-500/30",
              className
            )}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? `${props.id ?? props.name}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${props.id ?? props.name}-error`}
            className="mt-1.5 text-sm text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

/** Magnifying glass SVG for the search variant */
function SearchIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}
