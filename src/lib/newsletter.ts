import { Resend } from "resend";
import { SITE_NAME, SITE_URL } from "./constants";

/** Lazy getter — instantiated at request time, not at build time. */
export function getResendClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

export const FROM_ADDRESS = `${SITE_NAME} <newsletter@mathlumen.com>`;

export interface NewsletterPayload {
  subject: string;
  previewText?: string;
  /** HTML body for the email */
  htmlBody: string;
}

export interface ArticleEmailData {
  title: string;
  subtitle?: string;
  excerpt: string;
  slug: string;
  category: string;
  authorName: string;
  coverImageUrl?: string;
  readTimeMinutes?: number;
}

/** Build the full newsletter HTML email for a single article announcement. */
export function buildNewsletterHtml(
  article: ArticleEmailData,
  unsubscribeUrl: string
): string {
  const articleUrl = `${SITE_URL}/articles/${article.slug}`;
  const categoryLabel = article.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${article.title}</title>
</head>
<body style="margin:0;padding:0;background-color:#06080f;font-family:'Georgia',serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#06080f;">
  <tr>
    <td align="center" style="padding:40px 16px;">

      <!-- Container -->
      <table role="presentation" width="600" cellpadding="0" cellspacing="0"
             style="max-width:600px;width:100%;background-color:#0d1018;border:1px solid rgba(201,168,76,0.15);">

        <!-- Header -->
        <tr>
          <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(201,168,76,0.12);">
            <a href="${SITE_URL}" style="text-decoration:none;">
              <span style="font-family:'Georgia',serif;font-size:22px;font-weight:bold;color:#c9a84c;letter-spacing:0.05em;">
                ${SITE_NAME}
              </span>
            </a>
          </td>
        </tr>

        <!-- Category badge -->
        <tr>
          <td style="padding:32px 40px 0;">
            <span style="font-family:'DM Mono','Courier New',monospace;font-size:10px;color:#ff8c42;text-transform:uppercase;letter-spacing:0.15em;">
              ${categoryLabel}
            </span>
          </td>
        </tr>

        <!-- Cover image -->
        ${article.coverImageUrl ? `
        <tr>
          <td style="padding:16px 40px 0;">
            <a href="${articleUrl}">
              <img src="${article.coverImageUrl}" alt="${article.title}"
                   width="520" style="max-width:100%;display:block;border:1px solid rgba(201,168,76,0.1);" />
            </a>
          </td>
        </tr>` : ""}

        <!-- Title -->
        <tr>
          <td style="padding:24px 40px 0;">
            <a href="${articleUrl}" style="text-decoration:none;">
              <h1 style="margin:0;font-family:'Georgia',serif;font-size:28px;font-weight:bold;
                         color:#f5f0e8;line-height:1.2;">
                ${article.title}
              </h1>
            </a>
          </td>
        </tr>

        <!-- Subtitle -->
        ${article.subtitle ? `
        <tr>
          <td style="padding:8px 40px 0;">
            <p style="margin:0;font-size:16px;color:rgba(201,168,76,0.7);font-style:italic;line-height:1.5;">
              ${article.subtitle}
            </p>
          </td>
        </tr>` : ""}

        <!-- Meta -->
        <tr>
          <td style="padding:12px 40px 0;">
            <span style="font-family:'DM Mono','Courier New',monospace;font-size:11px;color:#6b6560;">
              By ${article.authorName}
              ${article.readTimeMinutes ? `&nbsp;&middot;&nbsp;${article.readTimeMinutes} min read` : ""}
            </span>
          </td>
        </tr>

        <!-- Excerpt -->
        <tr>
          <td style="padding:16px 40px 0;">
            <p style="margin:0;font-size:15px;line-height:1.7;color:#a09890;">
              ${article.excerpt}
            </p>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:28px 40px 0;">
            <a href="${articleUrl}"
               style="display:inline-block;padding:12px 28px;background-color:transparent;
                      border:1px solid rgba(201,168,76,0.5);color:#c9a84c;
                      font-family:'DM Mono','Courier New',monospace;font-size:12px;
                      text-decoration:none;letter-spacing:0.08em;text-transform:uppercase;">
              Read Article &rarr;
            </a>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:40px 40px 0;">
            <hr style="border:none;border-top:1px solid rgba(201,168,76,0.1);margin:0;" />
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px 32px;">
            <p style="margin:0 0 8px;font-family:'DM Mono','Courier New',monospace;font-size:10px;color:#6b6560;">
              You are receiving this because you subscribed to ${SITE_NAME}.
            </p>
            <p style="margin:0;font-family:'DM Mono','Courier New',monospace;font-size:10px;color:#6b6560;">
              <a href="${unsubscribeUrl}" style="color:#6b6560;text-decoration:underline;">
                Unsubscribe
              </a>
              &nbsp;&middot;&nbsp;
              <a href="${SITE_URL}" style="color:#6b6560;text-decoration:underline;">
                Visit ${SITE_NAME}
              </a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;
}
