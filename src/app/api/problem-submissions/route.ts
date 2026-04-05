import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { problemSubmissions } from "@/schema/tables";
import { currentProblem } from "@/lib/problem-of-the-week";

interface SubmissionBody {
  name: unknown;
  email: unknown;
  solution: unknown;
}

/**
 * POST /api/problem-submissions
 * Record a reader's solution to the current Problem of the Week.
 *
 * Prerequisites: run the migration SQL from schema/tables.ts in Supabase
 * before this route can insert rows.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as SubmissionBody;
    const { name, email, solution } = body;

    if (
      typeof name !== "string" || name.trim().length === 0 ||
      typeof email !== "string" || email.trim().length === 0 ||
      typeof solution !== "string" || solution.trim().length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "name, email, and solution are required." },
        { status: 400 }
      );
    }

    // Basic email format check
    if (!email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    await db.insert(problemSubmissions).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      solution: solution.trim(),
      problemNumber: currentProblem.number,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
