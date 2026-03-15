# MathLumen Content Guide

How to write articles and add new authors to MathLumen.

---

## Table of Contents

1. [How Articles Work](#how-articles-work)
2. [Writing an Article — Step by Step](#writing-an-article--step-by-step)
3. [MDX Formatting Reference](#mdx-formatting-reference)
4. [Uploading the Cover Image](#uploading-the-cover-image)
5. [Adding the Article to the Database](#adding-the-article-to-the-database)
6. [Adding a New Author](#adding-a-new-author)
7. [Publishing Checklist](#publishing-checklist)

---

## How Articles Work

Every article in MathLumen has two parts that must both exist:

| Part | Location | Purpose |
|------|----------|---------|
| **MDX file** | `content/articles/your-slug.mdx` | The full article text, LaTeX, code blocks |
| **Database row** | Supabase `articles` table | Metadata: title, excerpt, cover image, category, author, featured |

The MDX file holds the written content. The database holds everything the homepage, article cards, sitemap, and RSS feed need. **Both must be created** for an article to appear and render correctly.

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
riemann-hypothesis-2026
fourier-transform-explained
calculus-of-variations
```

The article will be available at: `https://mathlumen.com/articles/your-slug`

---

### Step 2 — Create the MDX file

Create a new file at:
```
content/articles/your-slug.mdx
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
| `category` | Yes | Must be one of: `history`, `research`, `applied`, `ai-ml`, `essay` |
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

```markdown
```javascript
const result = Math.PI * r ** 2;
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

### Method A — Add to the seed file (for local + fresh deploys)

Open `seed/index.ts` and add your article to the `articleData` array:

```typescript
{
  slug: "your-slug",
  title: "Your Full Article Title Here",
  subtitle: "Your subtitle",
  excerpt: "Your 1-2 sentence summary shown on cards.",
  category: "essay" as const,
  tags: ["your-tag", "another-tag"],
  authorId: akhilesh.id,
  coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/your-slug.png",
  publishedAt: new Date("2026-03-20"),
  isPublished: true,
  readTimeMinutes: 8,
  viewCount: 0,
  featured: false,  // set to true to show in the featured section
},
```

Then run:
```bash
pnpm run seed
```

> **Warning:** The seed script clears ALL existing data before inserting. Only use this when setting up fresh, or when you're OK resetting everything.

---

### Method B — Insert directly into Supabase (for live production sites)

This is the safe way to add an article to a running production database without wiping existing data.

1. Go to your **Supabase Dashboard → SQL Editor**
2. Run this query (replace all values in `< >`):

```sql
-- Step 1: Get your author ID
SELECT id FROM authors WHERE slug = 'akhilesh-yadav';

-- Step 2: Insert the article (paste the ID from Step 1)
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
  'essay',
  ARRAY['your-tag', 'another-tag'],
  '<paste-author-uuid-here>',
  'https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/your-slug.png',
  '2026-03-20 00:00:00+00',
  true,
  8,
  0,
  false
);
```

3. Verify it inserted:
```sql
SELECT slug, title, is_published FROM articles ORDER BY created_at DESC LIMIT 5;
```

After inserting, the article will appear on the site within 1 hour (due to `revalidate = 3600`). To see it immediately, trigger a Vercel redeploy.

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

Then update the summary log:
```typescript
console.log(`  Created 2 authors`);
```

### Step 5 — Assign articles to the new author

When adding articles written by the new author, use `jane.id` (seed file) or their UUID (SQL):

```sql
-- Find the new author's UUID
SELECT id FROM authors WHERE slug = 'jane-smith';

-- Use that UUID when inserting their articles
```

### Step 6 — Verify the author page

After adding, visit: `https://mathlumen.com/authors/jane-smith`

The page will show:
- Their name, bio, and avatar
- Links to Twitter, LinkedIn, and website
- All articles they have written

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
- [ ] Article row exists in the `articles` table
- [ ] `is_published` is `true`
- [ ] `published_at` date is set
- [ ] `author_id` points to a valid author
- [ ] `category` is one of the five valid values

**After publishing**
- [ ] Article appears on homepage (may take up to 1 hour, or trigger a redeploy)
- [ ] Article card shows the cover image
- [ ] Article page renders LaTeX correctly
- [ ] Article appears in `/api/rss`
- [ ] Article appears in `/sitemap.xml`
