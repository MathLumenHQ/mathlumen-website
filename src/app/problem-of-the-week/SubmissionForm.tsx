"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Client component — handles the problem submission form interaction.
 * Sends a POST to /api/problem-submissions and renders feedback inline.
 */
export function SubmissionForm({ problemNumber }: { problemNumber: number }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [solution, setSolution] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/problem-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, solution, problemNumber }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setErrorMsg(data.error ?? "Submission failed. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Network error. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-gold/[0.18] p-8 text-center">
        <p className="font-display text-xl font-semibold text-gold mb-2">
          Solution received — thank you!
        </p>
        <p className="text-muted text-sm font-body">
          We will review submissions and publish a solution article next week.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-mono text-paper/70">
            Full name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Leonhard Euler"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "submitting"}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-mono text-paper/70">
            Email address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="euler@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "submitting"}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="solution" className="block text-sm font-mono text-paper/70">
          Your solution
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
          <p className="text-xs text-muted font-mono">
            Paste your LaTeX proof below. Use{" "}
            <a
              href="/tools/mltex"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold/80 underline underline-offset-2 transition-colors duration-200"
            >
              MLTeX
            </a>{" "}
            to write and preview your proof before submitting.
          </p>
          <Link
            href="/problem-of-the-week/how-to-submit"
            className="text-xs font-mono text-paper/50 hover:text-gold transition-colors duration-200 whitespace-nowrap flex-shrink-0"
          >
            Submission guide →
          </Link>
        </div>
        <Textarea
          id="solution"
          name="solution"
          autoComplete="off"
          placeholder="Let g(x) = \int_0^x f(t) dt - x^2. Then g(0) = 0 and g(1) = 1 - 1 = 0. By the Mean Value Theorem..."
          required
          rows={12}
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          disabled={status === "submitting"}
          className="min-h-[280px] font-mono text-sm leading-relaxed"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400 font-mono" role="alert">
          {errorMsg}
        </p>
      )}

      <Button
        type="submit"
        variant="gold"
        size="md"
        loading={status === "submitting"}
        className="w-full sm:w-auto text-[#06080f]"
      >
        {status === "submitting" ? "Submitting…" : "Submit Solution"}
      </Button>
    </form>
  );
}
