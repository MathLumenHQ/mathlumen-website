-- Published POW tables
-- Creates normalized tables for Problem of the Week published issues.
-- Run in Supabase SQL Editor or through the repo's migration workflow.

-- Enums
DO $$ BEGIN
  CREATE TYPE pow_difficulty AS ENUM ('Undergraduate', 'Graduate', 'Competition', 'Other');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE pow_publication_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE pow_source_type AS ENUM ('json', 'manual', 'imported');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Main published issue table
CREATE TABLE IF NOT EXISTS pow_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  problem_id TEXT NOT NULL,
  series_code TEXT NOT NULL,
  series TEXT NOT NULL,

  year INTEGER NOT NULL,
  volume INTEGER,
  issue INTEGER,
  sequence TEXT NOT NULL,

  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  abstract TEXT,

  publication_date DATE,
  accepted_date DATE,
  received_date DATE,
  week_of DATE,
  deadline DATE,

  difficulty pow_difficulty NOT NULL,
  topic TEXT,

  version INTEGER NOT NULL DEFAULT 1,
  publication_status pow_publication_status NOT NULL DEFAULT 'published',

  url TEXT NOT NULL,
  public_id TEXT NOT NULL,
  contact_email TEXT,

  source_type pow_source_type NOT NULL DEFAULT 'json',

  pdf_url TEXT NOT NULL,
  pdf_storage_path TEXT NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS pow_issues_problem_id_uidx ON pow_issues (problem_id);
CREATE UNIQUE INDEX IF NOT EXISTS pow_issues_public_id_uidx ON pow_issues (public_id);
CREATE UNIQUE INDEX IF NOT EXISTS pow_issues_slug_uidx ON pow_issues (slug);
CREATE UNIQUE INDEX IF NOT EXISTS pow_issues_url_uidx ON pow_issues (url);
CREATE INDEX IF NOT EXISTS pow_issues_year_idx ON pow_issues (year);
CREATE INDEX IF NOT EXISTS pow_issues_publication_date_idx ON pow_issues (publication_date);
CREATE INDEX IF NOT EXISTS pow_issues_difficulty_idx ON pow_issues (difficulty);
CREATE INDEX IF NOT EXISTS pow_issues_topic_idx ON pow_issues (topic);
CREATE INDEX IF NOT EXISTS pow_issues_status_idx ON pow_issues (publication_status);

-- Published issue authors
CREATE TABLE IF NOT EXISTS pow_issue_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  pow_issue_id UUID NOT NULL REFERENCES pow_issues(id) ON DELETE CASCADE,
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,

  given_name TEXT,
  family_name TEXT,
  name TEXT NOT NULL,
  email TEXT,
  orcid TEXT,
  corresponding BOOLEAN NOT NULL DEFAULT FALSE,
  sequence TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS pow_issue_authors_issue_idx ON pow_issue_authors (pow_issue_id);
CREATE INDEX IF NOT EXISTS pow_issue_authors_author_idx ON pow_issue_authors (author_id);
CREATE INDEX IF NOT EXISTS pow_issue_authors_sort_idx ON pow_issue_authors (pow_issue_id, sort_order);

-- Author affiliations per issue-author
CREATE TABLE IF NOT EXISTS pow_issue_author_affiliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  pow_issue_author_id UUID NOT NULL REFERENCES pow_issue_authors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS pow_issue_author_affiliations_author_idx
  ON pow_issue_author_affiliations (pow_issue_author_id);
CREATE INDEX IF NOT EXISTS pow_issue_author_affiliations_sort_idx
  ON pow_issue_author_affiliations (pow_issue_author_id, sort_order);

-- Keywords
CREATE TABLE IF NOT EXISTS pow_issue_keywords (
  pow_issue_id UUID NOT NULL REFERENCES pow_issues(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (pow_issue_id, keyword)
);

CREATE INDEX IF NOT EXISTS pow_issue_keywords_issue_idx ON pow_issue_keywords (pow_issue_id);
CREATE INDEX IF NOT EXISTS pow_issue_keywords_sort_idx ON pow_issue_keywords (pow_issue_id, sort_order);

-- Solver acknowledgements
CREATE TABLE IF NOT EXISTS pow_issue_solvers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  pow_issue_id UUID NOT NULL REFERENCES pow_issues(id) ON DELETE CASCADE,
  solver_name TEXT NOT NULL,
  note TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS pow_issue_solvers_issue_idx ON pow_issue_solvers (pow_issue_id);
CREATE INDEX IF NOT EXISTS pow_issue_solvers_sort_idx ON pow_issue_solvers (pow_issue_id, sort_order);

-- Reuse the existing updated_at trigger helper from the initial migration.
DROP TRIGGER IF EXISTS pow_issues_updated_at ON pow_issues;
CREATE TRIGGER pow_issues_updated_at
  BEFORE UPDATE ON pow_issues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
