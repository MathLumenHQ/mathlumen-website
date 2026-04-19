# POW SQL Editor Workflow

## Purpose

This document explains how to update a published Problem of the Week issue in
Supabase using the SQL Editor.

Use this workflow after:

1. the published POW tables already exist
2. the final PDF has been uploaded to Supabase Storage
3. the issue metadata has been finalized

This document is for:

- inserting a new published issue
- updating an existing published issue

This document is not for:

- creating the POW tables for the first time
- editing the live weekly submission flow

## Important Rule

Do not rerun the migration file every time.

Do not rerun:

- `drizzle/0003_pow_published.sql`

That file is only for creating the tables once.

For each new issue, you only run issue data SQL in Supabase SQL Editor.

## Tables Used In This Workflow

This workflow updates these tables:

- `pow_issues`
- `pow_issue_authors`
- `pow_issue_author_affiliations`
- `pow_issue_keywords`
- `pow_issue_solvers`

## Before Opening SQL Editor

Make sure all of the following are ready:

- final PDF is built
- final PDF is uploaded to Supabase Storage
- `pdf_url` is copied
- `pdf_storage_path` is known
- issue metadata JSON is final

## PDF Values You Need

Example:

- `pdf_storage_path`: `2026/ml-pow-2026-001.pdf`
- `pdf_url`: `https://YOUR_PROJECT.supabase.co/storage/v1/object/public/pow/2026/ml-pow-2026-001.pdf`

## SQL Editor Steps

### Step 1

Open Supabase Dashboard.

### Step 2

Go to:

- `SQL Editor`

### Step 3

Paste the issue upsert SQL template.

### Step 4

Replace every placeholder value with the current issue values.

### Step 5

Run the SQL.

### Step 6

Open `Table Editor` and verify:

- `pow_issues`
- `pow_issue_authors`
- `pow_issue_author_affiliations`
- `pow_issue_keywords`
- `pow_issue_solvers`

### Step 7

Verify the `pdf_url` opens in the browser.

## Standard Pattern

The workflow always follows this pattern:

1. upsert the main row in `pow_issues`
2. delete existing child rows for that issue
3. reinsert authors
4. reinsert affiliations
5. reinsert keywords
6. reinsert solvers

This keeps updates safe and predictable.

## Why Delete And Reinsert Child Rows

Authors, affiliations, keywords, and solvers may change between updates.

Instead of trying to diff them manually, the safer workflow is:

- keep the main issue row
- replace all child rows for that issue

That avoids duplicate rows and stale metadata.

## Reusable SQL Template

Use the template below.

Replace all values inside angle brackets.

```sql
begin;

-- 1. Upsert main issue row
insert into public.pow_issues (
  problem_id,
  series_code,
  series,
  year,
  volume,
  issue,
  sequence,
  slug,
  title,
  subtitle,
  abstract,
  publication_date,
  accepted_date,
  received_date,
  week_of,
  deadline,
  difficulty,
  topic,
  version,
  publication_status,
  url,
  public_id,
  contact_email,
  source_type,
  pdf_url,
  pdf_storage_path,
  created_at,
  updated_at
) values (
  '<PROBLEM_ID>',
  '<SERIES_CODE>',
  '<SERIES>',
  <YEAR_NUMBER>,
  <VOLUME_NUMBER>,
  <ISSUE_NUMBER>,
  '<SEQUENCE_3_DIGIT>',
  '<SLUG>',
  '<TITLE>',
  '<SUBTITLE>',
  '<ABSTRACT>',
  '<PUBLICATION_DATE>',
  '<ACCEPTED_DATE>',
  '<RECEIVED_DATE>',
  '<WEEK_OF>',
  '<DEADLINE>',
  '<DIFFICULTY>',
  '<TOPIC>',
  <VERSION_NUMBER>,
  '<PUBLICATION_STATUS>',
  '<CANONICAL_URL>',
  '<PUBLIC_ID>',
  '<CONTACT_EMAIL>',
  '<SOURCE_TYPE>',
  '<PDF_URL>',
  '<PDF_STORAGE_PATH>',
  '<CREATED_AT_ISO>',
  '<UPDATED_AT_ISO>'
)
on conflict (public_id)
do update set
  problem_id = excluded.problem_id,
  series_code = excluded.series_code,
  series = excluded.series,
  year = excluded.year,
  volume = excluded.volume,
  issue = excluded.issue,
  sequence = excluded.sequence,
  slug = excluded.slug,
  title = excluded.title,
  subtitle = excluded.subtitle,
  abstract = excluded.abstract,
  publication_date = excluded.publication_date,
  accepted_date = excluded.accepted_date,
  received_date = excluded.received_date,
  week_of = excluded.week_of,
  deadline = excluded.deadline,
  difficulty = excluded.difficulty,
  topic = excluded.topic,
  version = excluded.version,
  publication_status = excluded.publication_status,
  url = excluded.url,
  contact_email = excluded.contact_email,
  source_type = excluded.source_type,
  pdf_url = excluded.pdf_url,
  pdf_storage_path = excluded.pdf_storage_path,
  updated_at = excluded.updated_at;

-- 2. Remove old child rows
delete from public.pow_issue_keywords
where pow_issue_id = (
  select id from public.pow_issues where public_id = '<PUBLIC_ID>'
);

delete from public.pow_issue_solvers
where pow_issue_id = (
  select id from public.pow_issues where public_id = '<PUBLIC_ID>'
);

delete from public.pow_issue_author_affiliations
where pow_issue_author_id in (
  select pia.id
  from public.pow_issue_authors pia
  join public.pow_issues pi on pi.id = pia.pow_issue_id
  where pi.public_id = '<PUBLIC_ID>'
);

delete from public.pow_issue_authors
where pow_issue_id = (
  select id from public.pow_issues where public_id = '<PUBLIC_ID>'
);

-- 3. Reinsert authors
-- Repeat once per author, changing the author values and sort_order.
insert into public.pow_issue_authors (
  pow_issue_id,
  author_id,
  given_name,
  family_name,
  name,
  email,
  orcid,
  corresponding,
  sequence,
  sort_order
)
select
  id,
  null,
  '<AUTHOR_GIVEN_NAME>',
  '<AUTHOR_FAMILY_NAME>',
  '<AUTHOR_DISPLAY_NAME>',
  '<AUTHOR_EMAIL>',
  '<AUTHOR_ORCID>',
  <AUTHOR_CORRESPONDING_BOOLEAN>,
  '<AUTHOR_SEQUENCE>',
  <AUTHOR_SORT_ORDER>
from public.pow_issues
where public_id = '<PUBLIC_ID>';

-- 4. Reinsert affiliations
-- Repeat once per affiliation for each author.
insert into public.pow_issue_author_affiliations (
  pow_issue_author_id,
  name,
  sort_order
)
select
  pia.id,
  '<AFFILIATION_NAME>',
  <AFFILIATION_SORT_ORDER>
from public.pow_issue_authors pia
join public.pow_issues pi on pi.id = pia.pow_issue_id
where pi.public_id = '<PUBLIC_ID>'
  and pia.name = '<AUTHOR_DISPLAY_NAME>';

-- 5. Reinsert keywords
-- Repeat once per keyword, increasing sort_order.
insert into public.pow_issue_keywords (pow_issue_id, keyword, sort_order)
select
  id,
  '<KEYWORD>',
  <KEYWORD_SORT_ORDER>
from public.pow_issues
where public_id = '<PUBLIC_ID>';

-- 6. Reinsert solvers
-- Repeat once per solver if any exist. If none exist, skip this section.
insert into public.pow_issue_solvers (
  pow_issue_id,
  solver_name,
  note,
  sort_order
)
select
  id,
  '<SOLVER_NAME>',
  '<SOLVER_NOTE>',
  <SOLVER_SORT_ORDER>
from public.pow_issues
where public_id = '<PUBLIC_ID>';

commit;
```

## Placeholder Guide

Replace these placeholders:

- `<PROBLEM_ID>` example: `ML-POW-2026-002`
- `<SERIES_CODE>` example: `POW`
- `<SERIES>` example: `Problem of the Week Series`
- `<YEAR_NUMBER>` example: `2026`
- `<VOLUME_NUMBER>` example: `1`
- `<ISSUE_NUMBER>` example: `2`
- `<SEQUENCE_3_DIGIT>` example: `002`
- `<SLUG>` example: `pow-002-solution`
- `<TITLE>` example: `Problem of the Week #2 --- Solution`
- `<SUBTITLE>` example: actual subtitle
- `<ABSTRACT>` example: actual abstract
- `<PUBLICATION_DATE>` example: `2026-04-20`
- `<ACCEPTED_DATE>` example: `2026-04-20`
- `<RECEIVED_DATE>` example: `2026-04-20`
- `<WEEK_OF>` example: `2026-04-14`
- `<DEADLINE>` example: `2026-04-20`
- `<DIFFICULTY>` example: `Undergraduate`
- `<TOPIC>` example: `Real Analysis`
- `<VERSION_NUMBER>` example: `1`
- `<PUBLICATION_STATUS>` example: `published`
- `<CANONICAL_URL>` example: `https://mathlumen.com/pow/ml.pow.2026.002`
- `<PUBLIC_ID>` example: `ml.pow.2026.002`
- `<CONTACT_EMAIL>` example: empty string or contact email
- `<SOURCE_TYPE>` example: `json`
- `<PDF_URL>` example: full public Supabase URL
- `<PDF_STORAGE_PATH>` example: `2026/ml-pow-2026-002.pdf`
- `<CREATED_AT_ISO>` example: original creation timestamp
- `<UPDATED_AT_ISO>` example: current update timestamp

## Exact Rules To Follow

- `problem_id` must be `ML-POW-YYYY-NNN`
- `public_id` must be `ml.pow.YYYY.NNN`
- `sequence` must stay 3 digits
- `slug` should stay in solution format
- `pdf_url` must be the real public Supabase file URL
- `pdf_storage_path` must be the actual path inside the `pow` bucket
- `difficulty` must match one of:
  - `Undergraduate`
  - `Graduate`
  - `Competition`
  - `Other`

## Example For A Real Issue

If needed, use the existing issue 001 SQL from the team notes or from the chat
history as a concrete example.

## Common Mistakes

Do not make these mistakes:

- rerunning the table-creation migration
- forgetting to upload the PDF first
- storing only a local file path instead of a real public URL
- leaving old child rows in place when authors or keywords changed
- changing `public_id` after publication
- changing `url` after publication
- mixing published issue updates with the live weekly submission system

## Final Verification Checklist

After running SQL:

- issue row exists in `pow_issues`
- authors exist in `pow_issue_authors`
- affiliations exist in `pow_issue_author_affiliations`
- keywords exist in `pow_issue_keywords`
- solvers exist in `pow_issue_solvers` if applicable
- `pdf_url` opens
- issue is ready for website rendering
