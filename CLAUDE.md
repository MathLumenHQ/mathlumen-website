# MathLumen — Claude Instructions

This file tells Claude how to work in this codebase. Read it fully before doing anything.

---

## What This Project Is

MathLumen is a scholarly mathematics publication built with Next.js 16 (App Router), Tailwind CSS v4, Drizzle ORM, and Supabase PostgreSQL. It publishes long-form articles on pure and applied mathematics, history of math, and the mathematics powering AI.

The two main tasks Claude is asked to do here:
1. **Write articles** — MDX files + the matching SQL to insert them into Supabase
2. **Build features** — Next.js components, API routes, database queries

---

## Tech Stack (read before touching code)

- **Next.js 16.1** App Router — server components by default, `"use client"` only when required
- **Tailwind CSS v4** — configured in `src/styles/globals.css` using `@theme {}` (no `tailwind.config.js`)
- **Drizzle ORM** + **Supabase PostgreSQL**
- **MDX** rendered with `next-mdx-remote/rsc` + `remark-math` + `rehype-katex`
- **TypeScript 5.7** — strict mode, named exports everywhere (no default exports except page/layout files)
- **pnpm** — always use `pnpm`, never `npm` or `yarn`

Key files:
- `src/lib/constants.ts` — categories, nav links, site metadata
- `src/schema/tables.ts` — Drizzle table definitions
- `src/schema/types.ts` — TypeScript types
- `src/lib/queries/articles.ts` — all article DB queries
- `content/articles/YYYY/MM/slug.mdx` — article content files

---

## ARTICLE WRITING INSTRUCTIONS

When asked to write an article, produce **two things**:
1. The complete MDX file
2. The Supabase SQL `INSERT` statement

Never produce one without the other.

---

### Article File Location

```
content/articles/YYYY/MM/slug.mdx
```

Use the current year and month. The URL is always `/articles/slug` — the folder path is irrelevant to the URL.

---

### Frontmatter — Required Fields

```yaml
---
title: "Full Title in Title Case"
subtitle: "One clarifying line in sentence case"
slug: kebab-case-slug-matching-filename
category: essay
excerpt: "One or two sentences. Max 200 characters. Used in cards, RSS, and meta description. No LaTeX."
publishedAt: "YYYY-MM-DD"
readTimeMinutes: 8
tags: [tag-one, tag-two, tag-three]
coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/slug.png"
---
```

**Category must be exactly one of:**
| Value | Use when |
|-------|----------|
| `history` | Stories of mathematicians, history of ideas, evolution of a concept |
| `research` | Open problems, new proofs, frontier mathematics |
| `applied` | PDEs, numerical methods, optimization, engineering math |
| `ai-ml` | ML theory, neural networks, transformers, information theory |
| `essay` | Philosophy of math, beauty, opinion, reflections |
| `news` | Prizes (Fields Medal, Abel Prize), major announcements, proof claims |

**Tags:** lowercase, hyphenated, specific. Good: `number-theory`, `riemann-zeta`, `prime-gaps`. Bad: `math`, `article`, `interesting`.

**readTimeMinutes:** count words ÷ 200, round to nearest integer.

**excerpt:** Must work as a standalone sentence. No LaTeX. No "In this article...". State the core idea directly.

---

### Writing Style

Study the existing articles before writing. The house style is:

- **Voice:** Third person or authoritative first-person plural ("We show that...", "Consider the function..."). Not conversational ("Hey, have you ever wondered...").
- **Precision over simplicity:** Do not dumb down the mathematics. The audience is people who have studied mathematics at university level or are genuinely curious about rigorous mathematics.
- **Show the derivation:** Do not just state results. Walk through the key steps. Explain *why* things work, not just *what* they are.
- **Concrete before abstract:** Introduce the idea with a specific example or equation before stating the general principle.
- **No filler:** Every paragraph should carry information. No "In conclusion, we have seen that..." summaries. No "Mathematics is fascinating because..." openers.
- **Quotes sparingly:** One memorable quote per article at most. Attributed precisely.
- **Active voice:** "Euler proved..." not "It was proved by Euler..."

**Opening paragraph:** Start with the central equation, the historical moment, or the core problem. Never start with a rhetorical question or a generic statement about mathematics being important.

**Section headings:** Use `##` for main sections (4–7 per article), `###` for subsections. Headings should be informative, not cute. "The Softmax: From Scores to Probabilities" is good. "Getting Into It" is not.

---

### Image Rules

**Two completely separate systems — never mix them:**

| System | Where | Purpose |
|--------|-------|---------|
| **Cover image** | Frontmatter fields | Hero image at top of article page — rendered by `CoverImage` component |
| **Body images** | MDX body syntax | Diagrams, charts, portraits inside the article text — rendered by `MdxImage` component |

#### Cover image (frontmatter)

```yaml
coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/slug.jpg"
coverImageCaption: "Photo: Peter Badge/Typos1/The Abel Prize 2026"
```

- `coverImageUrl` → the hero image rendered at the top of the article
- `coverImageCaption` → photo credit displayed below the hero image
- **Never repeat the cover image inside the MDX body.** The page renders it automatically from the database. Writing it again in the body causes a duplicate.

#### Inline body images (MDX body)

Use standard markdown image syntax with a **title attribute** for the caption:

```markdown
![Alt text describing the image content](https://ik.imagekit.io/.../image.jpg "Caption / photo credit")
```

- `alt` (inside `[]`) → screen reader text + SEO. Describe what the image shows.
- `title` (inside `""` after the URL) → displayed as a caption below the image.
- These are separate: a diagram may need a detailed alt but no caption; a photo may need a short alt and a credit line.

**Examples:**

```markdown
![Graph of the Riemann zeta function on the critical strip Re(s) ∈ (0,1)](https://ik.imagekit.io/.../zeta.png "Figure 1: Computed using the Riemann-Siegel formula for |Im(s)| ≤ 40")

![Portrait of Emmy Noether, circa 1930](https://ik.imagekit.io/.../noether.jpg "Photo: Unknown photographer, 1930. Public domain via Wikimedia Commons.")

![Attention weight matrix for a 6-token sequence](https://ik.imagekit.io/.../attn-weights.png)
```

The third example has no caption — omit the `"title"` part entirely when no caption is needed.

#### Deduplication safeguard

The `MdxImage` component receives the article's `coverImageUrl` at compile time and silently drops any body image whose `src` exactly matches it. This is a safety net, not a license to write the cover image in the body.

---

### LaTeX Rules

- **Inline math:** `$...$` — use for variables, short expressions, and notation within sentences
- **Display math:** `$$...$$` on its own line — use for any equation worth its own visual space
- **Align environment:** for multi-step derivations

```latex
$$
\begin{align*}
  \nabla_\theta \mathcal{L} &= \frac{1}{n}\sum_{i=1}^n \nabla_\theta \ell(f_\theta(x_i), y_i) \\
                             &= \frac{1}{n} X^\top (f_\theta(X) - y)
\end{align*}
$$
```

- Never use `\( \)` or `\[ \]` — always `$ $` and `$$ $$`
- Always escape backslashes in display math: `\\` not `\`
- Define notation when first introduced: "Let $\mathcal{H}$ denote the Hilbert space of..."
- Dimension annotations help readers: "$W \in \mathbb{R}^{d \times k}$"

---

### Code Blocks

Include code only when it adds genuine value (numerical verification, a non-obvious algorithm, a concrete implementation). Specify the language on every block.

```python
import numpy as np

# Numerical verification of the central limit theorem
samples = [np.mean(np.random.exponential(scale=1, size=30)) for _ in range(10000)]
print(f"Sample mean: {np.mean(samples):.4f}")   # ≈ 1.0
print(f"Sample std:  {np.std(samples):.4f}")    # ≈ 1/√30 ≈ 0.183
```

---

### Article Length by Category

| Category | Target length | Section count |
|----------|--------------|---------------|
| `history` | 1,200–2,000 words | 5–7 sections |
| `research` | 1,500–2,500 words | 6–8 sections |
| `applied` | 1,200–2,000 words | 5–7 sections |
| `ai-ml` | 1,200–2,000 words | 6–8 sections |
| `essay` | 1,000–1,800 words | 4–6 sections |
| `news` | 400–800 words | 3–4 sections |

---

### News Article Structure

News articles must be factual, timely, and short. Structure:

```markdown
## What Was Announced

State the news in 1–2 paragraphs. Who, what, when, where. No hype.

## The Mathematics

2–3 paragraphs explaining the mathematical significance. What field?
What problem? Why do mathematicians care about this result?

## About the Work / Recipient

Brief background. If a prize: what the recipient is known for.
If a proof: what the conjecture said and how long it stood.

## Further Reading

- [Official source](https://...)
- [Paper or preprint](https://arxiv.org/...)
```

---

### SQL Output Format

After the MDX, always output the ready-to-run Supabase SQL:

```sql
-- Run in Supabase Dashboard → SQL Editor
-- Step 1: Get author ID
SELECT id FROM authors WHERE slug = 'akhilesh-yadav';

-- Step 2: Insert article (replace <AUTHOR_UUID> with the ID from Step 1)
INSERT INTO articles (
  slug, title, subtitle, excerpt, category, tags,
  author_id, cover_image_url, published_at,
  is_published, read_time_minutes, view_count, featured
) VALUES (
  'your-slug',
  'Your Full Title',
  'Your subtitle',
  'Your excerpt.',
  'essay',                    -- ← category value
  ARRAY['tag-one', 'tag-two'],
  '<AUTHOR_UUID>',
  'https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/your-slug.png',
  '2026-03-22 00:00:00+00',
  true,
  8,     -- read_time_minutes
  0,     -- view_count
  false  -- featured: set true to show in homepage featured section
);
```

If the article is a `news` category, add a note reminding the user to apply the migration first:
```
NOTE: Before inserting, ensure migration has been applied:
  ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'news';
```

---

### What to Check Before Outputting an Article

- [ ] Frontmatter `slug` exactly matches the filename you suggest
- [ ] `excerpt` is under 200 characters and contains no LaTeX
- [ ] `readTimeMinutes` is calculated (word count ÷ 200)
- [ ] `publishedAt` uses today's date unless told otherwise
- [ ] All display equations are on their own line with `$$`
- [ ] No section uses heading level `#` (only `##` and `###`)
- [ ] The article opens with the core idea, not a rhetorical question
- [ ] SQL uses the correct category string value

---

## CODE CHANGES INSTRUCTIONS

When modifying the codebase (not writing articles):

- **Read files before editing** — never modify code you have not read
- **Named exports everywhere** — `export function Foo()`, never `export default function Foo()` in component files
- **Server components by default** — only add `"use client"` when the component uses state, effects, or browser APIs
- **Tailwind v4** — all custom values go in `src/styles/globals.css` inside `@theme {}`. Do not create a `tailwind.config.js`
- **No `any` types** — use `unknown` and narrow with type guards
- **Run `pnpm run build`** after significant changes to verify the build passes
- **No new dependencies** without asking first — check if an existing library already does the job

### Category enum

The valid category values in the database are: `history`, `research`, `applied`, `ai-ml`, `essay`, `news`

When casting a category string in TypeScript, include all six:
```typescript
category as "history" | "research" | "applied" | "ai-ml" | "essay" | "news"
```

### Database migration reminder

If adding a new enum value or changing the schema, create a migration file in `drizzle/` and add it to the migration table in `docs/CONTENT_GUIDE.md`.

---

## FILE STRUCTURE REFERENCE

```
mathlumenV4/
├── content/articles/YYYY/MM/   ← MDX article files
├── docs/
│   ├── CONTENT_GUIDE.md        ← full human guide for publishing
│   └── DEPLOYMENT.md
├── drizzle/                    ← SQL migration files
├── scripts/new-article.ts      ← CLI scaffold helper
├── seed/index.ts               ← dev-only seed script
├── src/
│   ├── app/                    ← Next.js App Router pages
│   │   ├── page.tsx            ← homepage
│   │   ├── articles/[slug]/    ← article detail page
│   │   ├── category/[category]/
│   │   ├── news/               ← news timeline page
│   │   └── topics/             ← topic hub page
│   ├── components/
│   │   ├── article/            ← ArticleCard, ShareButtons, PopularArticles, etc.
│   │   ├── sidebar/            ← SidebarNewsletter, ToolsPromo, AdSlot
│   │   ├── seo/                ← Breadcrumbs
│   │   └── ui/                 ← Badge, Button, Skeleton, etc.
│   ├── lib/
│   │   ├── constants.ts        ← CATEGORIES, NAV_LINKS, SITE_URL, etc.
│   │   ├── queries/articles.ts ← getArticles, getArticleBySlug, etc.
│   │   ├── mdx.ts              ← MDX file reader (recursive search)
│   │   ├── internal-links.ts   ← "Also on MathLumen" suggestions
│   │   └── faq-schema.ts       ← FAQ structured data extraction
│   └── schema/
│       ├── tables.ts           ← Drizzle table + enum definitions
│       └── types.ts            ← TypeScript types
└── CLAUDE.md                   ← this file
```

---

## COMMON COMMANDS

```bash
pnpm run dev          # start dev server on localhost:3000
pnpm run build        # production build (run this to verify changes)
pnpm run new-article "Title" category   # scaffold a new article file
CONFIRM_SEED=yes pnpm run seed          # reset and reseed local database
pnpm run db:push      # push schema changes to Supabase
pnpm run db:migrate   # apply migration files to Supabase
```
