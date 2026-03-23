-- Migration: add unsubscribe_token + is_active to subscribers; add newsletter_sends table
-- Run in Supabase Dashboard → SQL Editor

ALTER TABLE subscribers
  ADD COLUMN IF NOT EXISTS unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

CREATE UNIQUE INDEX IF NOT EXISTS subscribers_unsubscribe_token_idx ON subscribers (unsubscribe_token);

CREATE TABLE IF NOT EXISTS newsletter_sends (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject      TEXT NOT NULL,
  preview_text TEXT,
  article_slug VARCHAR(512),
  sent_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  recipient_count INTEGER NOT NULL DEFAULT 0,
  status       VARCHAR(32) NOT NULL DEFAULT 'sent'
);
