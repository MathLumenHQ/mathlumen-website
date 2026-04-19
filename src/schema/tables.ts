import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
  primaryKey,
  index,
  customType,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/** Custom tsvector type for PostgreSQL full-text search */
const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

/** Article category enum matching the publication's editorial verticals */
export const categoryEnum = pgEnum("category", [
  "history",
  "research",
  "applied",
  "ai-ml",
  "essay",
  "news",
]);

/** Authors who write for MathLumen */
export const authors = pgTable("authors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  bio: text("bio"),
  avatarUrl: varchar("avatar_url", { length: 512 }),
  email: varchar("email", { length: 256 }),
  twitterHandle: varchar("twitter_handle", { length: 64 }),
  linkedinUrl: varchar("linkedin_url", { length: 512 }),
  websiteUrl: varchar("website_url", { length: 512 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Published mathematical articles */
export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 512 }).unique().notNull(),
    title: varchar("title", { length: 512 }).notNull(),
    subtitle: varchar("subtitle", { length: 512 }),
    excerpt: text("excerpt").notNull(),
    category: categoryEnum("category").notNull(),
    tags: text("tags")
      .array()
      .default(sql`'{}'::text[]`),
    authorId: uuid("author_id")
      .references(() => authors.id)
      .notNull(),
    coverImageUrl: varchar("cover_image_url", { length: 512 }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    readTimeMinutes: integer("read_time_minutes"),
    viewCount: integer("view_count").default(0).notNull(),
    featured: boolean("featured").default(false).notNull(),
    searchVector: tsvector("search_vector"),
  },
  (table) => [
    index("articles_category_idx").on(table.category),
    index("articles_published_at_idx").on(table.publishedAt),
    index("articles_featured_idx").on(table.featured),
    index("articles_search_idx").using("gin", table.searchVector),
  ]
);

/** Newsletter subscribers */
export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  name: varchar("name", { length: 256 }),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true }).defaultNow().notNull(),
  confirmed: boolean("confirmed").default(true).notNull(),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  unsubscribeToken: uuid("unsubscribe_token").defaultRandom().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

/** Record of newsletter sends */
export const newsletterSends = pgTable("newsletter_sends", {
  id: uuid("id").primaryKey().defaultRandom(),
  subject: text("subject").notNull(),
  previewText: text("preview_text"),
  articleSlug: varchar("article_slug", { length: 512 }),
  sentAt: timestamp("sent_at", { withTimezone: true }).defaultNow().notNull(),
  recipientCount: integer("recipient_count").default(0).notNull(),
  status: varchar("status", { length: 32 }).default("sent").notNull(),
});

/** Curated content tags */
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 128 }).unique().notNull(),
  slug: varchar("slug", { length: 128 }).unique().notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Problem of the Week — reader solution submissions */
export const problemSubmissions = pgTable("problem_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  problemNumber: integer("problem_number").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  solutionText: text("solution_text").notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  reviewed: boolean("reviewed").default(false).notNull(),
  isCorrect: boolean("is_correct"),
  reviewerNote: text("reviewer_note"),
});

export const requestRateLimits = pgTable(
  "request_rate_limits",
  {
    key: text("key").primaryKey(),
    count: integer("count").notNull().default(0),
    resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("request_rate_limits_reset_at_idx").on(table.resetAt)]
);

/** Junction table linking articles to tags (many-to-many) */
export const articleTags = pgTable(
  "article_tags",
  {
    articleId: uuid("article_id")
      .references(() => articles.id, { onDelete: "cascade" })
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.articleId, table.tagId] })]
);
