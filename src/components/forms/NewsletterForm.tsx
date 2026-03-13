"use client";

import { useActionState } from "react";
import { subscribeAction } from "@/actions/subscribe";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ApiResponse, Subscriber } from "@/schema/types";

const initialState: ApiResponse<Subscriber> = {
  success: false,
};

/**
 * Newsletter subscription form with server action integration.
 */
export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: ApiResponse<Subscriber>, formData: FormData) => {
      return subscribeAction(formData);
    },
    initialState
  );

  if (state.success) {
    return (
      <div className="text-center py-4">
        <p className="text-gold-light font-display text-lg">Welcome aboard.</p>
        <p className="text-muted text-sm mt-2">
          You&apos;ll receive our next issue straight to your inbox.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          aria-label="Email address"
          disabled={isPending}
        />
        <Button type="submit" variant="primary" disabled={isPending} className="sm:w-auto w-full whitespace-nowrap">
          {isPending ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>

      {state.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}

      <p className="text-xs text-muted">
        No spam. Unsubscribe at any time. We respect your inbox.
      </p>
    </form>
  );
}
