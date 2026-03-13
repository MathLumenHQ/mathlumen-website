import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Error message to display below the input */
  error?: string;
}

/**
 * Styled text input matching the MathLumen design system.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full bg-ink-2 border border-gold/20 rounded-sm px-4 py-2.5",
            "text-paper placeholder:text-muted font-body",
            "focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30",
            "transition-colors duration-200",
            error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/30",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
