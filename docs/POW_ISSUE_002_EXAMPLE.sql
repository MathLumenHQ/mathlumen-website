begin;

-- Example SQL for the next published issue.
-- Replace placeholder content only where noted before running.

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
  'ML-POW-2026-002',
  'POW',
  'Problem of the Week Series',
  2026,
  1,
  2,
  '002',
  'pow-002-solution',
  'Problem of the Week #2 --- Solution',
  'REPLACE WITH THE REAL SUBTITLE',
  'REPLACE WITH THE REAL ABSTRACT',
  '2026-04-20',
  '2026-04-20',
  '2026-04-20',
  '2026-04-14',
  '2026-04-20',
  'Undergraduate',
  'Real Analysis',
  1,
  'published',
  'https://mathlumen.com/pow/ml.pow.2026.002',
  'ml.pow.2026.002',
  '',
  'json',
  'REPLACE_WITH_REAL_PUBLIC_PDF_URL',
  '2026/ml-pow-2026-002.pdf',
  '2026-04-20T00:00:00.000Z',
  '2026-04-20T00:00:00.000Z'
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
  select id from public.pow_issues where public_id = 'ml.pow.2026.002'
);

delete from public.pow_issue_solvers
where pow_issue_id = (
  select id from public.pow_issues where public_id = 'ml.pow.2026.002'
);

delete from public.pow_issue_author_affiliations
where pow_issue_author_id in (
  select pia.id
  from public.pow_issue_authors pia
  join public.pow_issues pi on pi.id = pia.pow_issue_id
  where pi.public_id = 'ml.pow.2026.002'
);

delete from public.pow_issue_authors
where pow_issue_id = (
  select id from public.pow_issues where public_id = 'ml.pow.2026.002'
);

-- 3. Insert author
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
  '',
  '',
  'Akhilesh Yadav',
  'editorial@mathlumen.com',
  '',
  true,
  'first',
  0
from public.pow_issues
where public_id = 'ml.pow.2026.002';

-- 4. Insert affiliation
insert into public.pow_issue_author_affiliations (
  pow_issue_author_id,
  name,
  sort_order
)
select
  pia.id,
  'MathLumen, New Delhi, India',
  0
from public.pow_issue_authors pia
join public.pow_issues pi on pi.id = pia.pow_issue_id
where pi.public_id = 'ml.pow.2026.002'
  and pia.name = 'Akhilesh Yadav';

-- 5. Insert keywords
-- Replace these placeholder keywords with the real issue keywords.
insert into public.pow_issue_keywords (pow_issue_id, keyword, sort_order)
select id, 'keyword 1', 0 from public.pow_issues where public_id = 'ml.pow.2026.002'
union all
select id, 'keyword 2', 1 from public.pow_issues where public_id = 'ml.pow.2026.002';

-- 6. Insert solvers
-- If there are no solvers, remove or skip this block.
-- Example:
-- insert into public.pow_issue_solvers (
--   pow_issue_id,
--   solver_name,
--   note,
--   sort_order
-- )
-- select
--   id,
--   'Solver Name',
--   '',
--   0
-- from public.pow_issues
-- where public_id = 'ml.pow.2026.002';

commit;
