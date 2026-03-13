import { NextRequest, NextResponse } from "next/server";
import { createSubscriber, checkSubscriberExists } from "@/lib/queries/subscribers";
import { subscribeRequestSchema } from "@/schema/validators";
import type { ApiResponse, Subscriber } from "@/schema/types";

/**
 * POST /api/subscribe
 * Subscribe an email address to the MathLumen newsletter.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Subscriber>>> {
  try {
    const body: unknown = await request.json();
    const parsed = subscribeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { email, name } = parsed.data;

    const exists = await checkSubscriberExists(email);
    if (exists) {
      return NextResponse.json(
        { success: false, error: "This email is already subscribed" },
        { status: 409 }
      );
    }

    const subscriber = await createSubscriber(email, name);

    return NextResponse.json(
      { success: true, data: subscriber },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
