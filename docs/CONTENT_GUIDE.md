# MathLumen Content Guide

How to write articles and add new authors to MathLumen.

---

## Table of Contents

1. [How Articles Work](#how-articles-work)
2. [The Article Helper Script](#the-article-helper-script)
3. [Writing an Article — Step by Step](#writing-an-article--step-by-step)
4. [News Articles — Special Guide](#news-articles--special-guide)
5. [MDX Formatting Reference](#mdx-formatting-reference)
6. [Uploading the Cover Image](#uploading-the-cover-image)
7. [Adding the Article to the Database](#adding-the-article-to-the-database)
8. [Applying Database Migrations](#applying-database-migrations)
9. [Adding a New Author](#adding-a-new-author)
10. [Publishing Checklist](#publishing-checklist)

---

## How Articles Work

Every article in MathLumen has two parts that must both exist:

| Part | Location | Purpose |
|------|----------|---------|
| **MDX file** | `content/articles/YYYY/MM/your-slug.mdx` | The full article text, LaTeX, code blocks |
| **Database row** | Supabase `articles` table | Metadata: title, excerpt, cover image, category, author, featured |

The MDX file holds the written content. The database holds everything the homepage, article cards, sitemap, and RSS feed need. **Both must be created** for an article to appear and render correctly.

**File organisation — year/month folders:**

```
content/
└── articles/
    ├── 2026/
    │   ├── 01/
    │   │   └── spectral-methods-pde.mdx
    │   ├── 02/
    │   │   └── ramanujan-infinite-series.mdx
    │   └── 03/
    │       ├── riemann-hypothesis-2026-status-report.mdx
    │       └── fields-medal-2026.mdx   ← your new article
    └── 2025/
        └── ...
```

The URL is always `/articles/your-slug` — the folder structure does **not** affect the URL.

---

## The Article Helper Script

The fastest way to create a new article file is the built-in scaffold script:

```bash
pnpm run new-article "Your Article Title" category
```

**Examples:**

```bash
pnpm run new-article "Fields Medal 2026 Announced" news
pnpm run new-article "Fourier Transform Deep Dive" applied
pnpm run new-article "Emmy Noether's Legacy" history
```

This will:
1. Slugify the title automatically (`fields-medal-2026-announced`)
2. Create the file at `content/articles/YYYY/MM/slug.mdx` using today's date
3. Pre-fill the frontmatter template
4. Print next-step instructions

Valid categories: `history` | `research` | `applied` | `ai-ml` | `essay` | `news`

---

## Writing an Article — Step by Step

### Step 1 — Choose a slug

The slug is the URL-friendly identifier. It must be:
- All lowercase
- Words separated by hyphens
- No spaces, no special characters
- Unique (no two articles can share a slug)

**Examples:**
```
fields-medal-2026-announced
fourier-transform-explained
calculus-of-variations
```

The article will be available at: `https://mathlumen.com/articles/your-slug`

---

### Step 2 — Create the MDX file

Use the helper script (recommended):
```bash
pnpm run new-article "Your Article Title" category
```

Or create the file manually at:
```
content/articles/YYYY/MM/your-slug.mdx
```

Start with the **frontmatter** (the section between `---` lines), then write the article below it.

**Complete frontmatter template:**

```yaml
---
title: "Your Full Article Title Here"
subtitle: "A short clarifying line below the title"
slug: your-slug
category: essay
excerpt: "A 1-2 sentence summary of the article. This appears on article cards, in RSS feeds, and in search results. Keep it under 200 characters."
publishedAt: "2026-03-20"
readTimeMinutes: 8
tags: [your-tag, another-tag, third-tag]
coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/your-slug.png"
---

Your article content starts here...
```

**Field reference:**

| Field | Required | Rules |
|-------|----------|-------|
| `title` | Yes | Full title in quotes. Can use special characters. |
| `subtitle` | No | Short italic line shown below the title |
| `slug` | Yes | Must exactly match the filename (without `.mdx`) |
| `category` | Yes | Must be one of: `history`, `research`, `applied`, `ai-ml`, `essay`, `news` |
| `excerpt` | Yes | 1–2 sentences. Used in cards, RSS, and SEO meta description |
| `publishedAt` | Yes | Format: `"YYYY-MM-DD"` |
| `readTimeMinutes` | Yes | Estimate: ~200 words per minute |
| `tags` | Yes | Array of lowercase slugs like `[number-theory, complex-analysis]` |
| `coverImageUrl` | Yes | Full ImageKit URL (see Step 3) |

**Category descriptions:**

| Category | Use for |
|----------|---------|
| `history` | Historical stories, mathematicians, evolution of ideas |
| `research` | Coverage of open problems, recent results, papers |
| `applied` | Numerical methods, scientific computing, engineering math |
| `ai-ml` | Machine learning theory, neural networks, AI mathematics |
| `essay` | Opinion, beauty, philosophy of mathematics |
| `news` | Prizes, awards, theorem announcements, recent breakthroughs |

---

### Step 3 — Write the article content

Below the closing `---` of the frontmatter, write your article in Markdown + LaTeX.

**Section headings** (use `##` for main sections, `###` for subsections):
```markdown
## Introduction

### Background
```

**Inline LaTeX** — wrap in single `$`:
```markdown
The function $f(x) = e^{-x^2}$ is the Gaussian.
```

**Display LaTeX** — wrap in double `$$` on its own line:
```markdown
$$\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}$$
```

**Code blocks** — specify the language for syntax highlighting:
````markdown
```python
import numpy as np
x = np.linspace(-3, 3, 100)
y = np.exp(-x**2)
```
````

**Bold and italic:**
```markdown
**bold text**
*italic text*
```

**Blockquotes** (for notable quotes):
```markdown
> "Mathematics is the queen of the sciences."
> — Carl Friedrich Gauss
```

**Images inside the article** (after uploading to ImageKit):
```markdown
![Description of the image](https://ik.imagekit.io/netrv2whci/mathlumen/article-images/your-image.png)
```

**Numbered and bulleted lists:**
```markdown
1. First item
2. Second item

- Bullet one
- Bullet two
```

---

## News Articles — Special Guide

The `news` category is for time-sensitive mathematics announcements. It has a dedicated page at `/news` and appears in the **"Latest News"** section on the homepage when articles exist.

### What belongs in `news`

| Type | Examples |
|------|---------|
| **Major prizes** | Fields Medal, Abel Prize, Wolf Prize, Breakthrough Prize announcements |
| **Proof announcements** | A major open problem resolved or major progress claimed |
| **Conference announcements** | ICM, major symposia, noteworthy talks |
| **Institutional news** | New math institutes, large research grants, notable appointments |
| **arXiv highlights** | A preprint that is generating significant buzz in the community |

### News article frontmatter template

```yaml
---
title: "Fields Medal 2026 Awarded to [Mathematician]"
subtitle: "Recognition for breakthrough work in [field]"
slug: fields-medal-2026-announced
category: news
excerpt: "The 2026 Fields Medal has been awarded to [name] for their groundbreaking contributions to [topic], announced at the International Congress of Mathematicians."
publishedAt: "2026-03-22"
readTimeMinutes: 3
tags: [fields-medal, prize, imo, number-theory]
coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/fields-medal-2026.png"
---
```

### News article structure

News articles should be shorter than regular articles (3–6 min read):

```markdown
## What Happened

One or two paragraphs stating the announcement clearly and factually.

## Why It Matters

2–3 paragraphs on the mathematical significance. What problem was solved?
What field does this advance? Why do mathematicians care?

## About the Recipient / Work

Brief background on the mathematician or the result. Link to the original paper
or official announcement if available.

## Further Reading

- [Official ICM announcement](https://...)
- [Preprint on arXiv](https://...)
```

### Quick-create a news article

```bash
pnpm run new-article "Fields Medal 2026 Awarded to [Name]" news
```

Then fill in the frontmatter and write the short announcement.

---

## MDX Formatting Reference

### LaTeX Quick Reference

| What you write | What it renders |
|---------------|-----------------|
| `$e^{i\pi} + 1 = 0$` | Euler's identity inline |
| `$\frac{a}{b}$` | Fraction |
| `$\sqrt{x}$` | Square root |
| `$\sum_{n=0}^{\infty}$` | Summation |
| `$\int_a^b f(x)\,dx$` | Integral |
| `$\lim_{x \to \infty}$` | Limit |
| `$\mathbb{R}$` | Real numbers |
| `$\nabla$` | Gradient/nabla |
| `$\partial$` | Partial derivative |
| `$\alpha, \beta, \gamma$` | Greek letters |

**Multi-line aligned equations** (use `align*` environment):
```latex
$$
\begin{align*}
  e^{i\theta} &= \cos\theta + i\sin\theta \\
  e^{i\pi}    &= -1 \\
  e^{i\pi} + 1 &= 0
\end{align*}
$$
```

**Matrix:**
```latex
$$
A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}
$$
```

---

## Uploading the Cover Image

Every article needs a cover image (1200×630 px recommended).

### Option A — Upload via CLI (recommended)

```bash
# From the project root
pnpm upload-image ./your-image.jpg article-covers
```

The script uploads to ImageKit at:
`https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/your-image.jpg`

Use that URL in your MDX frontmatter `coverImageUrl` and in the database row.

### Option B — Upload manually via ImageKit dashboard

1. Go to [imagekit.io](https://imagekit.io) → sign in
2. Navigate to **Media Library → mathlumen → article-covers**
3. Click **Upload** → select your image
4. Rename the file to match your article slug: `your-slug.png`
5. Copy the URL shown after upload

**Image guidelines:**
- Size: 1200 × 630 pixels (same as OG image ratio)
- Format: PNG or JPG
- File size: under 2 MB
- Content: relevant to the article topic — mathematical diagrams, abstract visuals, historical portraits

---

## Adding the Article to the Database

The MDX file alone does NOT make the article appear on the homepage or article listing. You must also add it to the database.

### Method A — Insert directly into Supabase (recommended for production)

This is the safe way to add an article to a running production database without wiping existing data.

1. Go to your **Supabase Dashboard → SQL Editor**
2. Run the queries below (replace all values):

```sql
-- Step 1: Get your author ID
SELECT id FROM authors WHERE slug = 'akhilesh-yadav';

-- Step 2: Insert the article (paste the ID from Step 1 into author_id)
INSERT INTO articles (
  slug,
  title,
  subtitle,
  excerpt,
  category,
  tags,
  author_id,
  cover_image_url,
  published_at,
  is_published,
  read_time_minutes,
  view_count,
  featured
) VALUES (
  'your-slug',
  'Your Full Article Title Here',
  'Your subtitle',
  'Your 1-2 sentence excerpt.',
  'essay',                          -- change to: history | research | applied | ai-ml | essay | news
  ARRAY['your-tag', 'another-tag'],
  '<paste-author-uuid-here>',
  'https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/your-slug.png',
  '2026-03-20 00:00:00+00',
  true,
  8,
  0,
  false                             -- set to true to show in the featured section
);
```

3. Verify it inserted:
```sql
SELECT slug, title, category, is_published FROM articles ORDER BY created_at DESC LIMIT 5;
```

**For a news article**, use `'news'` as the category value:
```sql
  category: 'news',
```

After inserting, the article will appear on the site within 1 hour (due to `revalidate = 3600`). To see it immediately, trigger a Vercel redeploy or run `pnpm run build` locally.

---

### Method B — Add to the seed file (for local + fresh deploys only)

Open `seed/index.ts` and add your article to the `articleData` array:

```typescript
{
  slug: "fields-medal-2026-announced",
  title: "Fields Medal 2026 Awarded to [Mathematician]",
  subtitle: "Recognition for breakthrough work in [field]",
  excerpt: "The 2026 Fields Medal has been awarded to [name] for contributions to [topic].",
  category: "news" as const,
  tags: ["fields-medal", "prize"],
  authorId: akhilesh.id,
  coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/fields-medal-2026.png",
  publishedAt: new Date("2026-03-22"),
  isPublished: true,
  readTimeMinutes: 3,
  viewCount: 0,
  featured: false,
},
```

Then run:
```bash
CONFIRM_SEED=yes pnpm run seed
```

> **Warning:** The seed script clears ALL existing data before inserting. Only use this for fresh local setups, never on production.

---

## Applying Database Migrations

When a new database feature is introduced (such as a new category enum value), a migration SQL file is created in `drizzle/`. These must be applied to your Supabase database before you can use the new feature.

### Current pending migration

**`drizzle/0001_add_news_category.sql`** — adds the `news` value to the category enum.

**You must run this before inserting any news articles.** Until it is applied, any attempt to insert a `news` article will fail with:
```
invalid input value for enum category: "news"
```

### How to apply a migration

**Option A — Supabase SQL Editor (recommended)**

1. Go to your **Supabase Dashboard → SQL Editor**
2. Paste and run the contents of the migration file:

```sql
ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'news';
```

3. Verify it worked:
```sql
SELECT enum_range(NULL::category);
-- should include: {history,research,applied,ai-ml,essay,news}
```

**Option B — drizzle-kit push**

```bash
pnpm run db:push
```

This applies all pending schema changes from your Drizzle schema to the database. It is safe to run at any time — it will not drop data.

**Option C — drizzle-kit migrate**

```bash
pnpm run db:migrate
```

Applies migration files from the `drizzle/` folder in order. Use this if you prefer explicit migration files over schema push.

### Migration history

| File | What it does | Status |
|------|-------------|--------|
| `drizzle/0000_initial.sql` | Creates all tables, enums, and tsvector search index | Applied at initial setup |
| `drizzle/0001_add_news_category.sql` | Adds `news` to the category enum | **Apply before using news category** |

---

## Adding a New Author

### Step 1 — Prepare the author's information

Collect:
- Full name
- Short bio (2–4 sentences)
- Profile photo (square, at least 400×400 px)
- Email address
- Twitter handle (optional)
- LinkedIn URL (optional)
- Personal website URL (optional)

### Step 2 — Upload the author's avatar

```bash
pnpm upload-image ./author-photo.jpg avatars
```

Or manually upload to ImageKit → `mathlumen/avatars/` → name the file `firstname-lastname.png`.

The URL will be:
`https://ik.imagekit.io/netrv2whci/mathlumen/avatars/firstname-lastname.png`

### Step 3 — Choose the author's slug

The slug is used in their profile URL: `mathlumen.com/authors/their-slug`

Format: `firstname-lastname` (all lowercase, hyphenated)

### Step 4 — Add the author to the database

**Option A — Via Supabase SQL Editor (recommended for production):**

```sql
INSERT INTO authors (
  name,
  slug,
  bio,
  avatar_url,
  email,
  twitter_handle,
  linkedin_url,
  website_url
) VALUES (
  'Dr. Jane Smith',
  'jane-smith',
  'Jane Smith is a number theorist at Princeton specializing in analytic methods and the Langlands program. She holds a PhD from Cambridge and has published research on L-functions and automorphic forms.',
  'https://ik.imagekit.io/netrv2whci/mathlumen/avatars/jane-smith.png',
  'jane@mathlumen.com',
  '@JaneSmithMath',
  'https://www.linkedin.com/in/janesmithmath/',
  'https://math.princeton.edu/janesmith'
);
```

Verify:
```sql
SELECT name, slug, email FROM authors ORDER BY created_at DESC LIMIT 5;
```

**Option B — Add to seed file (for local setup):**

In `seed/index.ts`, update the authors insert to add the new author:

```typescript
const [akhilesh, jane] = await db
  .insert(authors)
  .values([
    {
      name: "Akhilesh Yadav",
      slug: "akhilesh-yadav",
      // ... existing values
    },
    {
      name: "Dr. Jane Smith",
      slug: "jane-smith",
      bio: "Jane Smith is a number theorist ...",
      avatarUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/avatars/jane-smith.png",
      email: "jane@mathlumen.com",
      twitterHandle: "@JaneSmithMath",
      linkedinUrl: "https://www.linkedin.com/in/janesmithmath/",
      websiteUrl: "https://math.princeton.edu/janesmith",
    },
  ])
  .returning();
```

### Step 5 — Verify the author page

After adding, visit: `https://mathlumen.com/authors/jane-smith`

The page will show their name, bio, avatar, links, and all articles they have written.

---

## Publishing Checklist

Before marking an article `is_published: true`, verify:

**Content**
- [ ] Frontmatter is complete — all required fields filled
- [ ] Slug in frontmatter matches the MDX filename exactly
- [ ] No broken LaTeX (test locally with `pnpm run dev`)
- [ ] No broken code blocks
- [ ] All section headings use `##` or `###` (not `#`)
- [ ] Excerpt is under 200 characters
- [ ] Read time is accurate (~200 words per minute)

**Images**
- [ ] Cover image uploaded to ImageKit
- [ ] `coverImageUrl` in frontmatter and database both point to the ImageKit URL
- [ ] Cover image is 1200×630 px

**Database**
- [ ] If using `news` category: migration `0001_add_news_category.sql` has been applied
- [ ] Article row exists in the `articles` table
- [ ] `is_published` is `true`
- [ ] `published_at` date is set
- [ ] `author_id` points to a valid author
- [ ] `category` is one of the six valid values: `history`, `research`, `applied`, `ai-ml`, `essay`, `news`

**After publishing**
- [ ] Article appears on homepage (may take up to 1 hour, or trigger a redeploy)
- [ ] Article card shows the cover image
- [ ] Article page renders LaTeX correctly
- [ ] Article appears in `/api/rss`
- [ ] Article appears in `/sitemap.xml`
- [ ] If news: article appears on `/news` page
- [ ] If news: "Latest News" section visible on homepage (only shows when ≥1 news article exists)
