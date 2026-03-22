import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { articles, authors, subscribers, tags, articleTags } from "./tables";

/* ─── Base Model Types ───────────────────────────────────────────────── */

export type Article = InferSelectModel<typeof articles>;
export type NewArticle = InferInsertModel<typeof articles>;

export type Author = InferSelectModel<typeof authors>;
export type NewAuthor = InferInsertModel<typeof authors>;

export type Subscriber = InferSelectModel<typeof subscribers>;
export type NewSubscriber = InferInsertModel<typeof subscribers>;

export type Tag = InferSelectModel<typeof tags>;
export type NewTag = InferInsertModel<typeof tags>;

export type ArticleTag = InferSelectModel<typeof articleTags>;
export type NewArticleTag = InferInsertModel<typeof articleTags>;

/* ─── Composite Types ────────────────────────────────────────────────── */

/** Article with its author data joined */
export type ArticleWithAuthor = Article & {
  author: Author;
};

/** Article with author and associated tags */
export type ArticleWithAuthorAndTags = ArticleWithAuthor & {
  tags: Tag[];
};

/* ─── Category Union Type ────────────────────────────────────────────── */

export type Category = "history" | "research" | "applied" | "ai-ml" | "essay" | "news";

/* ─── API Response Types ─────────────────────────────────────────────── */

/** Generic paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/** Standard API response envelope */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/* ─── Query Parameter Types ──────────────────────────────────────────── */

export interface ArticleQueryParams {
  category?: Category;
  tag?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
  sort?: "newest" | "oldest" | "popular";
}
