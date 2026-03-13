import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error message to display below the textarea */
  error?: string;
}

/**
 * Styled textarea matching the MathLumen design system.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-ink-2 border border-gold/20 rounded-sm px-4 py-3",
            "text-paper placeholder:text-muted font-body",
            "focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30",
            "transition-colors duration-200 resize-y min-h-[120px]",
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

Textarea.displayName = "Textarea";
