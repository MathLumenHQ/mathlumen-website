"use client";

import { useState, useRef, useActionState } from "react";
import { z } from "zod";
import { subscribeAction } from "@/actions/subscribe";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ApiResponse, Subscriber } from "@/schema/types";

const emailSchema = z.string().email("Please enter a valid email address");

const initialState: ApiResponse<Subscriber> = { success: false };

/**
 * Newsletter subscription form with client-side Zod validation,
 * server action integration, and animated success state.
 *
 * States: idle -> loading -> success | error
 */
export function NewsletterForm() {
  const [clientError, setClientError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (_prev: ApiResponse<Subscriber>, formData: FormData) => {
      // Client-side validation first
      const email = formData.get("email");
      const result = emailSchema.safeParse(email);
      if (!result.success) {
        setClientError(result.error.issues[0]?.message ?? "Invalid email");
        return { success: false, error: result.error.issues[0]?.message } as ApiResponse<Subscriber>;
      }

      setClientError(null);
      return subscribeAction(formData);
    },
    initialState
  );

  // Success state with animated checkmark
  if (state.success) {
    return (
      <div className="text-center py-6">
        {/* Animated checkmark */}
        <div className="inline-flex items-center justify-center w-14 h-14 mb-4">
          <svg
            className="w-14 h-14 text-gold"
            viewBox="0 0 52 52"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="check-circle"
              cx="26"
              cy="26"
              r="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              className="check-mark"
              d="M15 27l7 7 15-15"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <p className="text-gold-light font-display text-xl font-semibold">
          You&apos;re in!
        </p>
        <p className="text-muted text-sm mt-2">
          You&apos;ll receive our next issue straight to your inbox.
        </p>
      </div>
    );
  }

  const displayError = clientError ?? state.error;

  return (
    <form ref={formRef} action={formAction} className="space-y-4" noValidate>
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          aria-label="Email address"
          disabled={isPending}
          error={displayError ?? undefined}
          onChange={() => setClientError(null)}
        />
        <Button
          type="submit"
          variant="gold"
          loading={isPending}
          className="sm:w-auto w-full whitespace-nowrap shrink-0"
        >
          Subscribe
        </Button>
      </div>

      <p className="text-xs text-muted">
        No spam. Unsubscribe at any time. We respect your inbox.
      </p>
    </form>
  );
}
