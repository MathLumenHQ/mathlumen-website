-- MathLumen Initial Database Migration
-- Creates all tables, indexes, and constraints

-- Category enum
DO $$ BEGIN
  CREATE TYPE category AS ENUM ('history', 'research', 'applied', 'ai-ml', 'essay');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(256) NOT NULL,
  slug VARCHAR(256) UNIQUE NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(512),
  email VARCHAR(256),
  twitter_handle VARCHAR(64),
  website_url VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(512) UNIQUE NOT NULL,
  title VARCHAR(512) NOT NULL,
  subtitle VARCHAR(512),
  excerpt TEXT NOT NULL,
  category category NOT NULL,
  tags TEXT[] DEFAULT '{}'::text[],
  author_id UUID NOT NULL REFERENCES authors(id),
  cover_image_url VARCHAR(512),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_published BOOLEAN NOT NULL DEFAULT false,
  read_time_minutes INTEGER,
  view_count INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  search_vector TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B')
  ) STORED
);

-- Article indexes
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles (category);
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles (published_at);
CREATE INDEX IF NOT EXISTS articles_featured_idx ON articles (featured);
CREATE INDEX IF NOT EXISTS articles_search_idx ON articles USING GIN (search_vector);

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(256) UNIQUE NOT NULL,
  name VARCHAR(256),
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed BOOLEAN NOT NULL DEFAULT true,
  unsubscribed_at TIMESTAMPTZ
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(128) UNIQUE NOT NULL,
  slug VARCHAR(128) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Article-Tags junction table
CREATE TABLE IF NOT EXISTS article_tags (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for articles updated_at
DROP TRIGGER IF EXISTS articles_updated_at ON articles;
CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
