# Published POW Manual

## Purpose

This document is the step-by-step manual for publishing a MathLumen Problem of
the Week solution when using:

- the POW LaTeX repository as the source of truth for issue metadata
- Supabase Storage for the final PDF
- Supabase Postgres for published POW metadata used by the website

This manual is for the published issue workflow.

It is separate from the live weekly submission flow at:

- `/problem-of-the-week`

The published issue section should use:

- `/pow`
- `/pow/archive`
- `/pow/[publicId]`

## Source Of Truth

The source of truth for a published POW issue is the metadata generated from the
POW LaTeX repository.

The website should not hardcode published issues in TypeScript.

The website should not generate the official PDF in the browser.

The official PDF must be:

1. built in the POW LaTeX repo
2. uploaded to Supabase Storage
3. linked from website metadata using `pdf_url`

## Required IDs And Naming Rules

Every published issue must follow these naming rules exactly.

- internal issue ID: `ML-POW-YYYY-NNN`
- public issue ID: `ml.pow.YYYY.NNN`
- solution slug: `pow-NNN-solution`
- PDF filename: `ml-pow-YYYY-NNN.pdf`

Example for issue 1 in 2026:

- `problem_id`: `ML-POW-2026-001`
- `public_id`: `ml.pow.2026.001`
- `slug`: `pow-001-solution`
- PDF filename: `ml-pow-2026-001.pdf`
- canonical URL: `https://mathlumen.com/pow/ml.pow.2026.001`

Do not change `problem_id`, `public_id`, or canonical URL after publication.

## Repo Metadata Format

The POW LaTeX repo metadata should keep this structure.

Example:

```json
{
  "problem_id": "ML-POW-2026-001",
  "series_code": "POW",
  "series": "Problem of the Week Series",
  "year": "2026",
  "volume": "1",
  "issue": "1",
  "sequence": "001",
  "slug": "pow-001-solution",
  "title": "Problem of the Week #1 --- Solution",
  "subtitle": "A Rolle's theorem argument via an antiderivative construction",
  "abstract": "Every continuous function f : [0,1] -> R satisfying integral_0^1 f(x) dx = 1 admits a point c in (0,1) with f(c) = 2c. The proof constructs the auxiliary function g(x) = integral_0^x f(t) dt - x^2 and applies Rolle's theorem after establishing the endpoint condition g(0) = g(1) = 0.",
  "publication_date": "2026-04-13",
  "accepted_date": "2026-04-13",
  "received_date": "2026-04-13",
  "week_of": "2026-04-07",
  "deadline": "2026-04-13",
  "difficulty": "Undergraduate",
  "topic": "Real Analysis",
  "version": 1,
  "publication_status": "published",
  "url": "https://mathlumen.com/pow/ml.pow.2026.001",
  "public_id": "ml.pow.2026.001",
  "email": "",
  "authors": [
    {
      "given_name": "",
      "family_name": "",
      "name": "Akhilesh Yadav",
      "email": "editorial@mathlumen.com",
      "orcid": "",
      "corresponding": true,
      "sequence": "first",
      "affiliations": [
        {
          "name": "MathLumen, New Delhi, India"
        }
      ]
    }
  ],
  "keywords": [
    "real analysis",
    "Rolle's theorem",
    "fundamental theorem of calculus",
    "auxiliary function",
    "continuity"
  ],
  "solvers": [],
  "source_type": "json",
  "created_at": "2026-04-18T11:19:43.689Z",
  "updated_at": "2026-04-18T11:19:43.690Z"
}
```

## Website-Required PDF Fields

The POW repo metadata above does not include the actual Supabase Storage PDF
location by default.

For the website, also keep these two values:

- `pdf_storage_path`
- `pdf_url`

Recommended values:

- `pdf_storage_path`: `2026/ml-pow-2026-001.pdf`
- `pdf_url`: full public Supabase URL

Example:

```json
{
  "pdf_storage_path": "2026/ml-pow-2026-001.pdf",
  "pdf_url": "https://YOUR_PROJECT.supabase.co/storage/v1/object/public/pow/2026/ml-pow-2026-001.pdf"
}
```

## Supabase Storage Setup

### Bucket

Create a public Supabase Storage bucket named:

- `pow`

### Folder Structure

Store files by year.

Recommended file path inside the `pow` bucket:

- `2026/ml-pow-2026-001.pdf`
- `2026/ml-pow-2026-002.pdf`

The full public URL will look like:

```text
https://YOUR_PROJECT.supabase.co/storage/v1/object/public/pow/2026/ml-pow-2026-001.pdf
```

## Which Database Tables Are Used

Published POW issue data should be stored in these tables:

- `pow_issues`
- `pow_issue_authors`
- `pow_issue_author_affiliations`
- `pow_issue_keywords`
- `pow_issue_solvers`

### Table: `pow_issues`

One row per published issue.

Important fields:

- `problem_id`
- `series_code`
- `series`
- `year`
- `volume`
- `issue`
- `sequence`
- `slug`
- `title`
- `subtitle`
- `abstract`
- `publication_date`
- `accepted_date`
- `received_date`
- `week_of`
- `deadline`
- `difficulty`
- `topic`
- `version`
- `publication_status`
- `url`
- `public_id`
- `contact_email`
- `source_type`
- `pdf_url`
- `pdf_storage_path`
- `created_at`
- `updated_at`

This is the main table the website uses for:

- `/pow`
- `/pow/archive`
- `/pow/[publicId]`

### Table: `pow_issue_authors`

Stores issue authors exactly as imported from the repo metadata.

Important fields:

- `pow_issue_id`
- `author_id` optional link to the main `authors` table
- `given_name`
- `family_name`
- `name`
- `email`
- `orcid`
- `corresponding`
- `sequence`
- `sort_order`

### Table: `pow_issue_author_affiliations`

Stores affiliations for each issue author.

Important fields:

- `pow_issue_author_id`
- `name`
- `sort_order`

### Table: `pow_issue_keywords`

Stores one keyword per row.

Important fields:

- `pow_issue_id`
- `keyword`
- `sort_order`

### Table: `pow_issue_solvers`

Stores one solver acknowledgement per row.

Important fields:

- `pow_issue_id`
- `solver_name`
- `note`
- `sort_order`

## Manual PDF Upload To Supabase

This section explains the exact manual upload process.

### Before Upload

Make sure you already have:

1. the final PDF generated from the POW LaTeX repo
2. the correct metadata JSON for the same issue
3. the correct file name

Example final file:

- `ml-pow-2026-001.pdf`

### Upload Steps In Supabase Dashboard

1. Open the Supabase project dashboard.
2. Go to `Storage`.
3. Open the `pow` bucket.
4. Open the year folder, or create it if it does not exist.
   Example:
   - `2026`
5. Click `Upload file`.
6. Select the final PDF.
7. Confirm the uploaded path is exactly:
   - `2026/ml-pow-2026-001.pdf`
8. Confirm the bucket is public, or confirm your public file URL works.
9. Copy the public URL for the file.

### After Upload

Save these two values:

- `pdf_storage_path`
- `pdf_url`

Example:

- `pdf_storage_path`: `2026/ml-pow-2026-001.pdf`
- `pdf_url`: `https://YOUR_PROJECT.supabase.co/storage/v1/object/public/pow/2026/ml-pow-2026-001.pdf`

Do not store only a relative path like `/pow/2026/ml-pow-2026-001.pdf` unless
the website has an explicit proxy route that serves it. The safer default is
the full public Supabase URL.

## Step-By-Step Publishing Workflow

Follow these steps in order every time.

### Step 1: Prepare The Next Issue In The POW LaTeX Repo

Create the next issue from the previous one.

Update:

- `problem_id`
- `issue`
- `sequence`
- `slug`
- `title`
- `subtitle`
- `abstract`
- `publication_date`
- `accepted_date`
- `received_date`
- `week_of`
- `deadline`
- `difficulty`
- `topic`
- `url`
- `public_id`
- `authors`
- `keywords`
- `solvers`
- `updated_at`

### Step 2: Validate The Identity Fields

Before you continue, verify:

- `problem_id` matches `ML-POW-YYYY-NNN`
- `public_id` matches `ml.pow.YYYY.NNN`
- `sequence` is 3 digits like `001`
- `slug` matches the issue number
- `url` matches the public route you want on the website

### Step 3: Build The Final PDF

Build the final PDF from the POW LaTeX repo.

Make sure the file name matches the issue:

- `ml-pow-2026-001.pdf`

### Step 4: Upload The PDF To Supabase Storage

Use the manual upload process described above.

Store:

- `pdf_storage_path`
- `pdf_url`

### Step 5: Insert Or Update The Main Issue Row

Insert or update one row in `pow_issues`.

That row must include:

- all main metadata fields from the repo
- `pdf_storage_path`
- `pdf_url`

### Step 6: Insert Or Update Related Rows

For the same issue:

- insert authors into `pow_issue_authors`
- insert affiliations into `pow_issue_author_affiliations`
- insert keywords into `pow_issue_keywords`
- insert solvers into `pow_issue_solvers`

### Step 7: Verify The Website

Check:

- `/pow`
- `/pow/archive`
- `/pow/ml.pow.YYYY.NNN`

Verify:

- the issue appears in archive
- title and subtitle are correct
- dates are correct
- topic and difficulty are correct
- authors render correctly
- PDF buttons open the correct file
- canonical URL is correct

## How To Update Metadata For The Next Issue

Use the exact same JSON structure every time.

Only change values, not the shape.

### Example For Issue 2

```json
{
  "problem_id": "ML-POW-2026-002",
  "series_code": "POW",
  "series": "Problem of the Week Series",
  "year": "2026",
  "volume": "1",
  "issue": "2",
  "sequence": "002",
  "slug": "pow-002-solution",
  "title": "Problem of the Week #2 --- Solution",
  "subtitle": "Replace with the actual subtitle",
  "abstract": "Replace with the actual abstract",
  "publication_date": "2026-04-20",
  "accepted_date": "2026-04-20",
  "received_date": "2026-04-20",
  "week_of": "2026-04-14",
  "deadline": "2026-04-20",
  "difficulty": "Undergraduate",
  "topic": "Real Analysis",
  "version": 1,
  "publication_status": "published",
  "url": "https://mathlumen.com/pow/ml.pow.2026.002",
  "public_id": "ml.pow.2026.002",
  "email": "",
  "authors": [
    {
      "given_name": "",
      "family_name": "",
      "name": "Akhilesh Yadav",
      "email": "editorial@mathlumen.com",
      "orcid": "",
      "corresponding": true,
      "sequence": "first",
      "affiliations": [
        {
          "name": "MathLumen, New Delhi, India"
        }
      ]
    }
  ],
  "keywords": [
    "keyword 1",
    "keyword 2"
  ],
  "solvers": [],
  "source_type": "json",
  "created_at": "2026-04-20T00:00:00.000Z",
  "updated_at": "2026-04-20T00:00:00.000Z"
}
```

### Fields That Must Change For Each New Issue

- `problem_id`
- `issue`
- `sequence`
- `slug`
- `title`
- `subtitle`
- `abstract`
- `publication_date`
- `accepted_date`
- `received_date`
- `week_of`
- `deadline`
- `topic` if different
- `difficulty` if different
- `url`
- `public_id`
- `keywords`
- `solvers`
- `updated_at`

### Fields That Usually Stay The Same

- `series_code`
- `series`
- `year` within the same year
- `volume` within the same volume
- `source_type`

## Common Mistakes To Avoid

Do not make these mistakes.

- do not hardcode published issues in `src/lib/problem-of-the-week.ts`
- do not use `/problem-of-the-week` as the archive source for published issues
- do not forget to upload the PDF before publishing the issue page
- do not save only the local file path of the PDF
- do not change `public_id` after publication
- do not change canonical URL after publication
- do not mix live weekly submission data with published issue archive data
- do not use browser print for the official PDF
- do not rename the PDF in a way that breaks the issue numbering convention

## Final Checklist

Before marking an issue published, confirm all of the following:

- metadata JSON is complete
- `problem_id` is correct
- `public_id` is correct
- `url` is correct
- final PDF was built successfully
- PDF uploaded to Supabase Storage
- `pdf_storage_path` saved
- `pdf_url` saved
- row inserted or updated in `pow_issues`
- authors inserted
- affiliations inserted
- keywords inserted
- solvers inserted if any
- issue appears correctly on the website
- PDF opens and downloads correctly

## Team Summary

Use this workflow every time:

1. update POW repo metadata
2. build final PDF
3. upload PDF to Supabase Storage
4. store `pdf_url` and `pdf_storage_path`
5. insert metadata into published POW tables
6. verify website routes

If a team member follows this document exactly, the published POW workflow
should remain consistent and safe.
