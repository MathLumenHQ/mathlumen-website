# POW Editorial Workflow

## Purpose

This document explains the exact weekly process for publishing MathLumen
Problem of the Week issues under the current website architecture.

This workflow keeps:

- the live current problem at `/problem-of-the-week`
- the latest and archived published issues under `/pow/*`
- the full published issue page showing:
  - problem
  - solution
  - metadata
  - PDF

## Route Model

The site currently uses this structure:

- `/problem-of-the-week`
  - current live weekly problem
  - submission form

- `/pow/latest`
  - redirects to the newest published issue

- `/pow/archive`
  - published issue archive

- `/pow/[publicId]`
  - canonical published issue page
  - example: `/pow/ml.pow.2026.001`

- `/pow/[publicId].pdf`
  - branded PDF URL
  - example: `/pow/ml.pow.2026.001.pdf`

## What Lives Where

### 1. Current live problem

File:

- `src/lib/problem-of-the-week.ts`

The current live weekly problem is stored in:

- `currentProblem`

This powers:

- `/problem-of-the-week`
- homepage POW block

### 2. Previous and older published problems

File:

- `src/lib/problem-of-the-week.ts`

Published historical problem statements are stored in:

- `pastProblems`

This is important because the canonical published page uses `solutionSlug` to
find the original problem statement.

If an older problem is missing from `pastProblems`, its canonical published page
may show the solution but not the original problem.

### 3. Published issue metadata

Stored in Supabase tables:

- `pow_issues`
- `pow_issue_authors`
- `pow_issue_author_affiliations`
- `pow_issue_keywords`
- `pow_issue_solvers`

This metadata powers:

- `/pow/latest`
- `/pow/archive`
- `/pow/[publicId]`
- `/pow/[publicId].pdf`

### 4. Published solution body

Stored as local MDX files:

- `content/pow/YYYY/pow-NNN-solution.mdx`

Example:

- `content/pow/2026/pow-001-solution.mdx`

This file provides the full solution body shown on the canonical published page.

### 5. Final PDF

Stored in Supabase Storage.

Public branded website URL:

- `/pow/ml.pow.YYYY.NNN.pdf`

Internal file source:

- Supabase Storage `pdf_url` stored in `pow_issues`

## How One Published Issue Is Assembled

The canonical published issue page `/pow/[publicId]` is built from multiple sources:

### Problem

Source:

- `src/lib/problem-of-the-week.ts`
- specifically a matching item in `pastProblems`

Match rule:

- `pastProblems[].solutionSlug === pow_issues.slug`

### Solution

Source:

- `content/pow/YYYY/<slug>.mdx`

Match rule:

- MDX filename must match `pow_issues.slug`

Example:

- DB slug: `pow-001-solution`
- MDX file: `content/pow/2026/pow-001-solution.mdx`

### Metadata

Source:

- Supabase published POW tables

### PDF

Source:

- Supabase Storage
- mapped through `pow_issues.pdf_url`

## Weekly Publishing Process

Use this exact process every time.

## Step 1. Identify the current live problem

Before publishing the new week, the previous week is still inside:

- `currentProblem`

That previous problem must now be preserved as a historical record.

## Step 2. Move the previous problem into `pastProblems`

Open:

- `src/lib/problem-of-the-week.ts`

Take the old `currentProblem` object and add it into:

- `pastProblems`

Requirements:

- keep the full original `statement`
- keep the original `hint` if present
- keep the original `deadline`
- keep the original `difficulty`
- keep the original `topics`
- add `solutionSlug`

Example:

```ts
{
  number: 1,
  weekOf: "2026-04-07",
  difficulty: "undergraduate",
  statement: `...`,
  hint: `...`,
  deadline: "2026-04-13",
  topics: ["real-analysis", "continuity", "rolle-theorem", "ftc"],
  solutionSlug: "pow-001-solution",
}
```

This is the step that keeps the original problem visible on the canonical published page.

## Step 3. Update `currentProblem` to the new live week

Still in:

- `src/lib/problem-of-the-week.ts`

Replace `currentProblem` with the new problem.

For the new current problem:

- update `number`
- update `weekOf`
- update `deadline`
- update `difficulty`
- update `statement`
- update `hint`
- update `topics`
- set `previousSlug` to the previous issue’s solution slug if it exists

Example:

- current live problem becomes `Problem #002`
- `previousSlug` becomes `"pow-001-solution"`

## Step 4. Write the full solution in MDX

Create a new file in:

- `content/pow/YYYY/`

Example:

- `content/pow/2026/pow-002-solution.mdx`

Rules:

- filename must match the published issue slug exactly
- this file should contain the full solution body
- use markdown and LaTeX as needed
- this file is the source for the rendered solution section on `/pow/[publicId]`

Important:

- the problem statement does not come from this file in the current system
- the problem statement comes from `pastProblems`
- the solution comes from the MDX file

So yes: writing the solution MDX under `content/pow/2026/` is correct.

## Step 5. Build and upload the final PDF

Build the issue PDF from the POW publishing workflow.

Upload the final PDF to Supabase Storage.

Store:

- `pdf_url`
- `pdf_storage_path`

in the `pow_issues` row.

The site will expose it via:

- `/pow/[publicId].pdf`

Users should not see the raw Supabase Storage URL.

## Step 6. Insert or update the published issue metadata in Supabase

Use the SQL workflow already documented in:

- `docs/POW_PUBLISHING_MANUAL.md`
- `docs/POW_SQL_EDITOR_WORKFLOW.md`
- `docs/POW_SQL_TEMPLATE.sql`

Required data:

- issue metadata in `pow_issues`
- authors
- affiliations
- keywords
- solvers if any
- PDF URL

Important fields:

- `public_id`
- `slug`
- `title`
- `subtitle`
- `abstract`
- `publication_date`
- `difficulty`
- `topic`
- `pdf_url`

## Step 7. Verify the published issue page

Check:

- `/pow/[publicId]`

Example:

- `/pow/ml.pow.2026.001`

Make sure it shows:

- problem statement
- full solution
- metadata
- PDF buttons

If the problem statement is missing, check:

1. Is the older problem present in `pastProblems`?
2. Does that record have the correct `solutionSlug`?
3. Does the slug match the `pow_issues.slug` value exactly?

## Step 8. Verify archive behavior

Published issues appear in:

- `/pow/archive`

The archive is driven by Supabase published metadata.

That means:

- once the issue is inserted into `pow_issues` with `publication_status = published`
- and linked content exists

it should appear in the archive.

So yes:

- the newest published issue becomes available through `/pow/latest`
- older published issues remain in `/pow/archive`
- previous previous issues remain in the archive automatically if their DB metadata remains published

## Exact Mental Model

For every issue:

- current live problem = `currentProblem`
- historical published problem statement = `pastProblems`
- published metadata = Supabase
- full solution body = local MDX
- final PDF = Supabase Storage

Canonical published page `/pow/[publicId]` combines all of them.

## Minimal Checklist For Each New Issue

1. Move old `currentProblem` into `pastProblems`
2. Add `solutionSlug` to that historical problem
3. Replace `currentProblem` with the new live issue
4. Create `content/pow/YYYY/<slug>.mdx`
5. Upload final PDF to Supabase Storage
6. Insert/update published metadata in Supabase
7. Verify:
   - `/problem-of-the-week`
   - `/pow/latest`
   - `/pow/archive`
   - `/pow/[publicId]`
   - `/pow/[publicId].pdf`

## Common Mistakes To Avoid

### Mistake 1: Updating `currentProblem` but not preserving the old one

Effect:

- published issue page loses the original problem statement

Fix:

- move the old problem into `pastProblems`

### Mistake 2: Wrong `solutionSlug`

Effect:

- canonical issue page cannot match the historical problem to the published issue

Fix:

- `pastProblems[].solutionSlug` must exactly equal `pow_issues.slug`

### Mistake 3: MDX filename does not match the slug

Effect:

- canonical issue page cannot load the solution body

Fix:

- filename must match the published issue slug exactly

### Mistake 4: PDF uploaded but not linked in DB

Effect:

- `/pow/[publicId].pdf` will fail

Fix:

- update `pow_issues.pdf_url`

## Recommended Future Improvement

The current system is working, but for long-term robustness the cleanest future
model is:

- store published problem statements alongside published issue metadata

That would remove the dependency on `pastProblems` for historical issue pages.

For now, the required working method is:

- keep old published problems in `pastProblems`
- keep solutions in MDX
- keep metadata and PDF mapping in Supabase
