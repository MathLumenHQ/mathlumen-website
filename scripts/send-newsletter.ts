/**
 * CLI tool to send a newsletter email to all active subscribers.
 *
 * Usage:
 *   pnpm run send-newsletter --slug=<article-slug>
 *
 * Requires:
 *   RESEND_API_KEY, NEWSLETTER_SECRET, SUPABASE_SERVICE_ROLE_KEY in .env
 *   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_APP_URL in .env
 *
 * The script reads article metadata from the database, builds the email,
 * and calls the /api/newsletter/send endpoint with the NEWSLETTER_SECRET.
 */

import "dotenv/config";
import postgres from "postgres";

// ── Parse CLI args ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const slugArg = args.find((a) => a.startsWith("--slug="));
const slug = slugArg?.split("=")[1];

if (!slug) {
  console.error("Usage: pnpm run send-newsletter --slug=<article-slug>");
  process.exit(1);
}

// ── Env check ───────────────────────────────────────────────────────────────
const required = ["DATABASE_URL", "NEWSLETTER_SECRET", "NEXT_PUBLIC_APP_URL"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing env var: ${key}`);
    process.exit(1);
  }
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;
const SECRET = process.env.NEWSLETTER_SECRET!;

// ── Fetch article from DB ───────────────────────────────────────────────────
const sql = postgres(process.env.DATABASE_URL!);

type ArticleRow = {
  title: string;
  subtitle: string | null;
  excerpt: string;
  slug: string;
  category: string;
  cover_image_url: string | null;
  read_time_minutes: number | null;
  name: string; // author name
};

let article: ArticleRow;
try {
  const rows = await sql<ArticleRow[]>`
    SELECT a.title, a.subtitle, a.excerpt, a.slug, a.category,
           a.cover_image_url, a.read_time_minutes,
           au.name
    FROM articles a
    JOIN authors au ON au.id = a.author_id
    WHERE a.slug = ${slug}
      AND a.is_published = true
    LIMIT 1
  `;

  if (rows.length === 0) {
    console.error(`No published article found with slug: ${slug}`);
    await sql.end();
    process.exit(1);
  }

  article = rows[0];
} catch (err) {
  console.error("DB error:", err);
  await sql.end();
  process.exit(1);
}

await sql.end();

// ── Build payload ───────────────────────────────────────────────────────────
const subject = article.title;
const previewText = article.excerpt.slice(0, 140);

const payload = {
  subject,
  previewText,
  article: {
    title: article.title,
    subtitle: article.subtitle ?? undefined,
    excerpt: article.excerpt,
    slug: article.slug,
    category: article.category,
    authorName: article.name,
    coverImageUrl: article.cover_image_url ?? undefined,
    readTimeMinutes: article.read_time_minutes ?? undefined,
  },
};

// ── Call send endpoint ──────────────────────────────────────────────────────
console.log(`\nSending newsletter for article: "${article.title}"`);
console.log(`Subject: ${subject}\n`);

const response = await fetch(`${APP_URL}/api/newsletter/send`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${SECRET}`,
  },
  body: JSON.stringify(payload),
});

const result = await response.json() as { sent?: number; total?: number; errors?: string[]; error?: string };

if (!response.ok) {
  console.error("Send failed:", result.error ?? response.statusText);
  process.exit(1);
}

console.log(`Sent to ${result.sent ?? 0} of ${result.total ?? 0} subscribers.`);

if (result.errors && result.errors.length > 0) {
  console.warn("Partial errors:");
  for (const e of result.errors) {
    console.warn("  -", e);
  }
}
