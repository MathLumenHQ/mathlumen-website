import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { articles, authors, subscribers, tags, articleTags, problemSubmissions } from "./tables";
import type {
  powIssues,
  powIssueAuthors,
  powIssueAuthorAffiliations,
  powIssueKeywords,
  powIssueSolvers,
} from "./pow-tables";

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

export type ProblemSubmission = typeof problemSubmissions.$inferSelect;
export type NewProblemSubmission = typeof problemSubmissions.$inferInsert;

export type PowIssue = InferSelectModel<typeof powIssues>;
export type NewPowIssue = InferInsertModel<typeof powIssues>;

export type PowIssueAuthor = InferSelectModel<typeof powIssueAuthors>;
export type NewPowIssueAuthor = InferInsertModel<typeof powIssueAuthors>;

export type PowIssueAuthorAffiliation = InferSelectModel<typeof powIssueAuthorAffiliations>;
export type NewPowIssueAuthorAffiliation = InferInsertModel<typeof powIssueAuthorAffiliations>;

export type PowIssueKeyword = InferSelectModel<typeof powIssueKeywords>;
export type NewPowIssueKeyword = InferInsertModel<typeof powIssueKeywords>;

export type PowIssueSolver = InferSelectModel<typeof powIssueSolvers>;
export type NewPowIssueSolver = InferInsertModel<typeof powIssueSolvers>;

/* ─── Composite Types ────────────────────────────────────────────────── */

/** Article with its author data joined */
export type ArticleWithAuthor = Article & {
  author: Author;
};

/** Article with author and associated tags */
export type ArticleWithAuthorAndTags = ArticleWithAuthor & {
  tags: Tag[];
};

export type PowAuthorWithAffiliations = PowIssueAuthor & {
  affiliations: PowIssueAuthorAffiliation[];
  siteAuthor?: Author | null;
};

export type PowIssueWithRelations = PowIssue & {
  authors: PowAuthorWithAffiliations[];
  keywords: PowIssueKeyword[];
  solvers: PowIssueSolver[];
};

export type PowArchiveItem = Pick<
  PowIssue,
  | "id"
  | "problemId"
  | "publicId"
  | "slug"
  | "title"
  | "subtitle"
  | "publicationDate"
  | "difficulty"
  | "topic"
  | "year"
  | "issue"
  | "sequence"
  | "pdfUrl"
>;

export interface PowArchiveYearGroup {
  year: number;
  issues: PowIssueWithRelations[];
}

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

export interface PowIssueQueryParams {
  year?: number;
  topic?: string;
  difficulty?: PowIssue["difficulty"];
  limit?: number;
  offset?: number;
}

export interface SearchResultBase {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  resultType: "article" | "pow";
  publishedAt?: Date | string | null;
}

export type ArticleSearchResult = SearchResultBase & {
  resultType: "article";
  category: Category;
  subtitle?: string | null;
  authorName: string;
};

export type PowSearchResult = SearchResultBase & {
  resultType: "pow";
  publicId: string;
  difficulty: PowIssue["difficulty"];
  topic?: string | null;
  subtitle?: string | null;
};

export type SearchResult = ArticleSearchResult | PowSearchResult;
