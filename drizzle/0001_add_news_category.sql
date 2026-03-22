-- Add 'news' value to the category enum
-- PostgreSQL only allows adding (not removing) enum values without a full type rebuild.
-- Run: pnpm run db:push  OR  execute this file directly against your Supabase database.

ALTER TYPE "category" ADD VALUE IF NOT EXISTS 'news';
