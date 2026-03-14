# MathLumen Deployment Guide

## Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A [Supabase](https://supabase.com) account
- A [Vercel](https://vercel.com) account
- A [GitHub](https://github.com) account (for Vercel integration)
- (Optional) A [Cloudflare](https://cloudflare.com) account for DNS/CDN

---

## Section 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click **New project** — choose a name and the region closest to your users (US East recommended)
3. Wait 2–3 minutes for the project to initialize
4. Go to **SQL Editor** → paste the contents of `drizzle/0000_initial.sql` → click **Run**
   - This creates all tables: `authors`, `articles`, `tags`, `article_tags`, `subscribers`
   - Includes the `tsvector` full-text search index
5. Go to **Settings → API** → copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Go to **Settings → Database** → scroll to **Connection string** → select **URI** format → copy:
   - Use for both `DATABASE_URL` and `DIRECT_URL`
7. Configure your local `.env` file with these values
8. Seed the database:
   ```bash
   pnpm run seed
   ```

---

## Section 2: Vercel Deployment

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → **Import Git Repository**
3. Select your `mathlumen` repository
4. Vercel auto-detects Next.js — confirm:
   - **Framework Preset:** Next.js
   - **Build Command:** `pnpm run build` (auto-detected)
   - **Root Directory:** `./` (default)
5. Add **Environment Variables** (Settings → Environment Variables):

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | From Supabase Settings → Database |
   | `DIRECT_URL` | Same as `DATABASE_URL` |
   | `NEXT_PUBLIC_SUPABASE_URL` | From Supabase Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase Settings → API |
   | `NEXT_PUBLIC_APP_URL` | `https://mathlumen.com` |
   | `NEXT_PUBLIC_SITE_NAME` | `MathLumen` |
   | `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | From ImageKit Settings → API Keys |
   | `IMAGEKIT_PUBLIC_KEY` | From ImageKit Settings → API Keys |
   | `IMAGEKIT_PRIVATE_KEY` | From ImageKit Settings → API Keys |

6. Click **Deploy**
7. Wait for the build to complete (~2 minutes)
8. Visit the generated `.vercel.app` URL to verify everything works

---

## Section 3: Custom Domain

### Vercel

1. In your Vercel project → **Settings → Domains**
2. Add `mathlumen.com` and `www.mathlumen.com`
3. Vercel will show you the DNS records needed

### Cloudflare DNS (recommended)

If using Cloudflare as your DNS provider:

1. In Cloudflare → your domain → **DNS → Records**:

   | Type | Name | Content | Proxy |
   |------|------|---------|-------|
   | A | `@` | `76.76.21.21` | Proxied (orange cloud) |
   | CNAME | `www` | `cname.vercel-dns.com` | Proxied (orange cloud) |

2. **SSL/TLS** settings:
   - Encryption mode: **Full (Strict)**
   - **Always Use HTTPS:** ON
   - **HSTS:** ON (max-age: 6 months, include subdomains)

3. **Speed → Optimization:**
   - Auto Minify: ON (HTML, CSS, JS)

> **Note:** If NOT using Cloudflare, use Vercel's nameservers or add the A/CNAME records directly in your DNS provider without proxying.

---

## Section 4: Post-Deploy Checklist

Run through this checklist after every deployment:

### Core Functionality
- [ ] `https://mathlumen.com` loads correctly
- [ ] HTTPS works (`http://` redirects to `https://`)
- [ ] `www.mathlumen.com` redirects to `mathlumen.com`
- [ ] Homepage renders hero, featured articles, and latest section
- [ ] Article page renders with LaTeX equations (KaTeX)
- [ ] Article page renders with code syntax highlighting
- [ ] Cover images load from ImageKit CDN
- [ ] Author avatar loads from ImageKit CDN

### Navigation
- [ ] Category pages load (history, research, applied, ai-ml, essay)
- [ ] Author profile page loads
- [ ] About page loads
- [ ] Archive page loads
- [ ] Newsletter page loads

### Features
- [ ] Newsletter form submits successfully
- [ ] Search dialog opens on `Cmd+K` / `Ctrl+K`
- [ ] Search returns results for "euler"
- [ ] View count increments on article visit

### SEO & Feeds
- [ ] `/api/rss` returns valid XML with `Content-Type: application/rss+xml`
- [ ] `/sitemap.xml` returns all article, category, and author URLs
- [ ] `/robots.txt` contains `Allow: /` and `Disallow: /api/`
- [ ] Article pages show OG image when shared on social media
- [ ] `/feed` and `/rss` redirect to `/api/rss`

### Performance
- [ ] Lighthouse score > 90 on homepage
- [ ] Images load via CDN (check network tab for `ik.imagekit.io`)
- [ ] Mobile layout works on 375px viewport

### Search Console
- [ ] Add property in [Google Search Console](https://search.google.com/search-console)
- [ ] Submit sitemap: `https://mathlumen.com/sitemap.xml`
- [ ] Add site to [Bing Webmaster Tools](https://www.bing.com/webmasters)

---

## Redeployment

Vercel auto-deploys on every push to `main`. To trigger a manual redeploy:

```bash
# Via Vercel CLI
npx vercel --prod

# Or just push a commit
git commit --allow-empty -m "trigger redeploy"
git push
```

## Re-seeding in Production

To update the database with new seed data:

```bash
# Set DATABASE_URL to your Supabase production URL
DATABASE_URL=postgresql://... pnpm run seed
```

> Warning: The seed script **clears all existing data** before inserting. Do not run in production unless you intend to reset.
