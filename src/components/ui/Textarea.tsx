import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error message displayed below the textarea */
  error?: string;
}

/**
 * Styled textarea for the MathLumen design system.
 * Matches the Input component styling with sharp corners and gold focus.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-ink-2 border border-gold/[0.18] rounded-none px-4 py-3",
            "text-paper placeholder:text-muted font-mono text-sm",
            "focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30",
            "transition-all duration-200 resize-y min-h-[120px]",
            error &&
              "border-red-500/50 focus:border-red-500 focus:ring-red-500/30",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${props.id ?? props.name}-error` : undefined}
          {...props}
        />
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

Textarea.displayName = "Textarea";
