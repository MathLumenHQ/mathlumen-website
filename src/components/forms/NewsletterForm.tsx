"use client";

import { useId, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const emailSchema = z.string().email("Please enter a valid email address");

/**
 * Newsletter subscription form with client-side validation and API submission.
 * This avoids server-action coupling in globally rendered UI while keeping
 * subscription behavior centralized in /api/subscribe.
 */
export function NewsletterForm() {
  const uid = useId();
  const emailId = `${uid}-email`;
  const [email, setEmail] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setClientError(parsed.error.issues[0]?.message ?? "Invalid email");
      setServerError(null);
      return;
    }

    setClientError(null);
    setServerError(null);
    setIsPending(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: parsed.data }),
      });

      const payload = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !payload.success) {
        setServerError(payload.error ?? "Subscription failed. Please try again.");
        return;
      }

      setIsSuccess(true);
      setEmail("");
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-6">
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
        <p className="text-gold-light font-display text-xl font-semibold">You&apos;re in!</p>
        <p className="text-muted text-sm mt-2">
          You&apos;ll receive our next issue straight to your inbox.
        </p>
      </div>
    );
  }

  const displayError = clientError ?? serverError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          id={emailId}
          name="email"
          autoComplete="email"
          placeholder="your@email.com"
          required
          aria-label="Email address"
          disabled={isPending}
          value={email}
          error={displayError ?? undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            setClientError(null);
            setServerError(null);
          }}
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
