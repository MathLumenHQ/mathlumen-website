import { db } from "@/lib/db";
import { subscribers } from "@/schema/tables";
import { eq } from "drizzle-orm";
import type { Subscriber } from "@/schema/types";

/**
 * Create a new newsletter subscriber.
 * Returns the created subscriber record.
 */
export async function createSubscriber(
  email: string,
  name?: string
): Promise<Subscriber> {
  try {
    const result = await db
      .insert(subscribers)
      .values({
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
      })
      .returning();

    if (!result[0]) {
      throw new Error("Insert returned no rows");
    }

    return result[0];
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("unique") || message.includes("duplicate")) {
      throw new Error("This email is already subscribed");
    }

    throw new Error(`Failed to create subscriber: ${message}`);
  }
}

/**
 * Check whether an email address is already subscribed and confirmed.
 */
export async function checkSubscriberExists(email: string): Promise<boolean> {
  try {
    const result = await db
      .select({ id: subscribers.id })
      .from(subscribers)
      .where(eq(subscribers.email, email.toLowerCase().trim()))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to check subscriber: ${message}`);
  }
}
