"use server";

import { createSubscriber, checkSubscriberExists } from "@/lib/queries/subscribers";
import { subscribeRequestSchema } from "@/schema/validators";
import type { ApiResponse, Subscriber } from "@/schema/types";

/**
 * Server action to subscribe a user to the MathLumen newsletter.
 * Validates input, checks for duplicates, and creates the subscription.
 */
export async function subscribeAction(
  formData: FormData
): Promise<ApiResponse<Subscriber>> {
  try {
    const raw = {
      email: formData.get("email"),
      name: formData.get("name"),
    };

    const parsed = subscribeRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const { email, name } = parsed.data;

    const exists = await checkSubscriberExists(email);
    if (exists) {
      return {
        success: false,
        error: "This email is already subscribed",
      };
    }

    const subscriber = await createSubscriber(email, name);

    return {
      success: true,
      data: subscriber,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return {
      success: false,
      error: message,
    };
  }
}
