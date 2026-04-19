import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { problemSubmissions } from "@/schema/tables";
import { problemSubmissionRequestSchema } from "@/schema/validators";
import {
  buildJsonResponse,
  enforceRateLimit,
  enforceSameOrigin,
} from "@/lib/request-security";

/**
 * POST /api/problem-submissions
 * Validates and saves a Problem of the Week solution, then sends an
 * admin notification via Resend. Email failure does not fail the request.
 */
export async function POST(req: NextRequest) {
  const blockedByOrigin = enforceSameOrigin(req);
  if (blockedByOrigin) {
    return blockedByOrigin;
  }

  const blockedByRateLimit = await enforceRateLimit(
    req,
    "problem-submissions",
    10,
    15 * 60 * 1000
  );
  if (blockedByRateLimit) {
    return blockedByRateLimit;
  }

  try {
    const body: unknown = await req.json();
    const parsed = problemSubmissionRequestSchema.safeParse(body);

    if (!parsed.success) {
      return buildJsonResponse(
        { error: parsed.error.issues[0]?.message ?? "Invalid submission" },
        { status: 400 }
      );
    }

    const { name, email, solution, problemNumber } = parsed.data;

    await db.insert(problemSubmissions).values({
      problemNumber,
      name,
      email: email.toLowerCase(),
      solutionText: solution,
    });

    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "MathLumen <noreply@mathlumen.com>",
        to: process.env.ADMIN_EMAIL ?? "",
        subject: `POW #${problemNumber} - new submission from ${name}`,
        text: [
          `Problem of the Week #${problemNumber} - New Submission`,
          "",
          `Name:    ${name}`,
          `Email:   ${email.toLowerCase()}`,
          "",
          "Solution:",
          solution,
        ].join("\n"),
      });
    } catch (emailError) {
      console.error("[problem-submissions] Resend notification failed:", emailError);
    }

    return buildJsonResponse({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[problem-submissions] Unhandled error:", error);
    return buildJsonResponse({ error: "Internal server error" }, { status: 500 });
  }
}
