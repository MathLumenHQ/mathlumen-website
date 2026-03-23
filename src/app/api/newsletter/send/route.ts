import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getResendClient, FROM_ADDRESS, buildNewsletterHtml } from "@/lib/newsletter";
import { SITE_URL } from "@/lib/constants";
import { db } from "@/lib/db";
import { newsletterSends } from "@/schema/tables";

const sendRequestSchema = z.object({
  subject: z.string().min(1).max(200),
  previewText: z.string().max(150).optional(),
  article: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    excerpt: z.string().min(1),
    slug: z.string().min(1),
    category: z.string().min(1),
    authorName: z.string().min(1),
    coverImageUrl: z.string().url().optional(),
    readTimeMinutes: z.number().int().positive().optional(),
  }),
});

export async function POST(request: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const secret = process.env.NEWSLETTER_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Newsletter not configured" }, { status: 503 });
  }

  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse body ──────────────────────────────────────────────────────────
  const body = await request.json().catch(() => null);
  const parsed = sendRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }
  const { subject, previewText, article } = parsed.data;

  // ── Fetch active subscribers via service role ───────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Supabase service role not configured" }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const { data: subs, error: subsError } = await supabase
    .from("subscribers")
    .select("email, name, unsubscribe_token")
    .eq("is_active", true)
    .eq("confirmed", true);

  if (subsError) {
    return NextResponse.json({ error: "Failed to load subscribers", detail: subsError.message }, { status: 500 });
  }

  if (!subs || subs.length === 0) {
    return NextResponse.json({ sent: 0, message: "No active subscribers" });
  }

  // ── Send in batches of 50 (Resend batch limit) ──────────────────────────
  const BATCH_SIZE = 50;
  let sentCount = 0;
  const errors: string[] = [];

  for (let i = 0; i < subs.length; i += BATCH_SIZE) {
    const batch = subs.slice(i, i + BATCH_SIZE);

    const emails = batch.map((sub) => {
      const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?token=${sub.unsubscribe_token}`;
      const html = buildNewsletterHtml(article, unsubscribeUrl);

      return {
        from: FROM_ADDRESS,
        to: sub.email,
        subject,
        html,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      };
    });

    const { data: batchResult, error: batchError } = await getResendClient().batch.send(emails);
    if (batchError) {
      errors.push(`Batch ${i / BATCH_SIZE + 1}: ${batchError.message}`);
    } else {
      sentCount += batchResult?.data?.length ?? batch.length;
    }
  }

  // ── Log the send ────────────────────────────────────────────────────────
  await db.insert(newsletterSends).values({
    subject,
    previewText: previewText ?? null,
    articleSlug: article.slug,
    recipientCount: sentCount,
    status: errors.length > 0 ? "partial" : "sent",
  });

  return NextResponse.json({
    sent: sentCount,
    total: subs.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
