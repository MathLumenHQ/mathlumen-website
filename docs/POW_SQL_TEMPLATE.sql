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
-- Duplicate this block once per author.
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
-- Duplicate this block once per affiliation for each author.
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
-- Duplicate this block once per keyword.
insert into public.pow_issue_keywords (pow_issue_id, keyword, sort_order)
select
  id,
  '<KEYWORD>',
  <KEYWORD_SORT_ORDER>
from public.pow_issues
where public_id = '<PUBLIC_ID>';

-- 6. Reinsert solvers
-- Duplicate this block once per solver.
-- If there are no solvers, skip this section.
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
