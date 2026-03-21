/**
 * CLI helper to scaffold a new MathLumen article.
 *
 * Usage:
 *   pnpm run new-article "My Article Title" ai-ml
 *
 * Categories: history | research | applied | ai-ml | essay
 */

import fs from "node:fs";
import path from "node:path";

const VALID_CATEGORIES = ["history", "research", "applied", "ai-ml", "essay"] as const;
type Category = (typeof VALID_CATEGORIES)[number];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

const [, , rawTitle, rawCategory] = process.argv;

if (!rawTitle || !rawCategory) {
  console.error("Usage: pnpm run new-article <title> <category>");
  console.error(`Categories: ${VALID_CATEGORIES.join(" | ")}`);
  process.exit(1);
}

const category = rawCategory.toLowerCase() as Category;
if (!VALID_CATEGORIES.includes(category)) {
  console.error(`Invalid category "${category}". Must be one of: ${VALID_CATEGORIES.join(", ")}`);
  process.exit(1);
}

const title = rawTitle.trim();
const slug = slugify(title);
const now = new Date();
const year = String(now.getFullYear());
const month = pad(now.getMonth() + 1);
const publishedAt = `${year}-${month}-${pad(now.getDate())}`;

const dir = path.join(process.cwd(), "content", "articles", year, month);
const filePath = path.join(dir, `${slug}.mdx`);

if (fs.existsSync(filePath)) {
  console.error(`File already exists: ${filePath}`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });

const template = `---
title: "${title}"
subtitle: ""
slug: ${slug}
category: ${category}
excerpt: "Write a 1–2 sentence summary of this article for search engines and social sharing."
publishedAt: "${publishedAt}"
readTimeMinutes: 10
tags: []
coverImageUrl: ""
---

## Introduction

Write your article here. LaTeX is fully supported inline ($E = mc^2$) and in display blocks:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}
$$

## Section Two

Continue writing...
`;

fs.writeFileSync(filePath, template, "utf-8");

console.log("");
console.log(`✓ Created: content/articles/${year}/${month}/${slug}.mdx`);
console.log("");
console.log("Next steps:");
console.log(`  1. Edit the file and fill in the frontmatter + content`);
console.log(`  2. Add a cover image: pnpm run upload-image <file> article-covers`);
console.log(`  3. Insert the article into the database via the seed or CMS`);
console.log(`  4. The article will be live at: /articles/${slug}`);
console.log("");
