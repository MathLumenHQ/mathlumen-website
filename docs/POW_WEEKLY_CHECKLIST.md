# POW Weekly Checklist

Use this checklist every time you publish a new Problem of the Week issue.

For full explanation, see:

- `docs/POW_EDITORIAL_WORKFLOW.md`

## Weekly Publishing Checklist

### 1. Preserve the previous live problem

Open:

- `src/lib/problem-of-the-week.ts`

Move the old `currentProblem` into:

- `pastProblems`

Required:

- keep the full `statement`
- keep the `hint` if present
- keep the `deadline`
- keep the `difficulty`
- keep `topics`
- add `solutionSlug`

Example:

- `solutionSlug: "pow-001-solution"`

If you skip this step, the published issue page may lose the problem statement.

### 2. Update the current live problem

Still in:

- `src/lib/problem-of-the-week.ts`

Replace `currentProblem` with the new week’s problem.

Update:

- `number`
- `weekOf`
- `deadline`
- `difficulty`
- `statement`
- `hint`
- `topics`
- `previousSlug`

Example:

- new week is `Problem #002`
- `previousSlug` should be `"pow-001-solution"`

### 3. Write the published solution MDX

Create the solution file in:

- `content/pow/YYYY/`

Example:

- `content/pow/2026/pow-001-solution.mdx`

Rules:

- filename must match the issue slug exactly
- this file contains the full solution body

### 4. Build and upload the PDF

Upload the final PDF to Supabase Storage.

Store:

- `pdf_url`
- `pdf_storage_path`

in the published issue metadata.

### 5. Insert or update Supabase published metadata

Update:

- `pow_issues`
- `pow_issue_authors`
- `pow_issue_author_affiliations`
- `pow_issue_keywords`
- `pow_issue_solvers`

Use:

- `docs/POW_PUBLISHING_MANUAL.md`
- `docs/POW_SQL_EDITOR_WORKFLOW.md`
- `docs/POW_SQL_TEMPLATE.sql`

### 6. Check slug consistency

These must match:

- `pastProblems[].solutionSlug`
- `pow_issues.slug`
- MDX filename

Example:

- `pow-001-solution`

### 7. Verify the published page

Check:

- `/pow/latest`
- `/pow/archive`
- `/pow/[publicId]`
- `/pow/[publicId].pdf`

Example:

- `/pow/ml.pow.2026.001`
- `/pow/ml.pow.2026.001.pdf`

Make sure the page shows:

- problem
- solution
- metadata
- PDF buttons

### 8. Verify the live page

Check:

- `/problem-of-the-week`

Make sure it shows:

- new problem
- correct week
- correct deadline
- correct link to the previous published solution

## Quick Failure Checks

If the problem is missing on `/pow/[publicId]`, check:

1. Was the old problem moved into `pastProblems`?
2. Does it have the correct `solutionSlug`?
3. Does that slug match the DB slug exactly?

If the solution is missing, check:

1. Does the MDX file exist?
2. Does the filename exactly match the slug?

If the PDF is missing, check:

1. Was the PDF uploaded to Supabase Storage?
2. Is `pdf_url` correct in `pow_issues`?

## One-Line Rule

For every new issue:

- old live problem -> `pastProblems`
- new live problem -> `currentProblem`
- published solution -> MDX
- published metadata -> Supabase
- published PDF -> Supabase Storage
