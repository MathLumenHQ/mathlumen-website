import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { articles, authors, subscribers, tags, articleTags } from "./tables";

/* ─── Article Schemas ────────────────────────────────────────────────── */

export const insertArticleSchema = createInsertSchema(articles, {
  title: z.string().min(1, "Title is required").max(512),
  slug: z.string().min(1, "Slug is required").max(512),
  excerpt: z.string().min(1, "Excerpt is required"),
});

export const selectArticleSchema = createSelectSchema(articles);

/* ─── Author Schemas ─────────────────────────────────────────────────── */

export const insertAuthorSchema = createInsertSchema(authors, {
  name: z.string().min(1, "Name is required").max(256),
  slug: z.string().min(1, "Slug is required").max(256),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

export const selectAuthorSchema = createSelectSchema(authors);

/* ─── Subscriber Schemas ─────────────────────────────────────────────── */

export const insertSubscriberSchema = createInsertSchema(subscribers, {
  email: z.string().email("Invalid email address"),
  name: z.string().max(256).optional(),
});

export const selectSubscriberSchema = createSelectSchema(subscribers);

/* ─── Tag Schemas ────────────────────────────────────────────────────── */

export const insertTagSchema = createInsertSchema(tags, {
  name: z.string().min(1, "Tag name is required").max(128),
  slug: z.string().min(1, "Tag slug is required").max(128),
});

export const selectTagSchema = createSelectSchema(tags);

/* ─── ArticleTag Schemas ─────────────────────────────────────────────── */

export const insertArticleTagSchema = createInsertSchema(articleTags);
export const selectArticleTagSchema = createSelectSchema(articleTags);

/* ─── API Request Validation ─────────────────────────────────────────── */

export const subscribeRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().max(256).optional(),
});

export const searchRequestSchema = z.object({
  query: z.string().min(1, "Search query is required").max(200),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const problemSubmissionRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Please enter a valid email address"),
  solution: z.string().trim().min(20, "Solution is too short").max(50000),
  problemNumber: z.number().int().positive("Problem number is required"),
});

export const articleQuerySchema = z.object({
  category: z.enum(["history", "research", "applied", "ai-ml", "essay", "news"]).optional(),
  tag: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  offset: z.coerce.number().int().min(0).default(0),
  featured: z.coerce.boolean().optional(),
  sort: z.enum(["newest", "oldest", "popular"]).default("newest"),
});
