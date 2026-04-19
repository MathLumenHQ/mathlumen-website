import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  date,
  index,
  uniqueIndex,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { authors } from "./tables";

export const powDifficultyEnum = pgEnum("pow_difficulty", [
  "Undergraduate",
  "Graduate",
  "Competition",
  "Other",
]);

export const powPublicationStatusEnum = pgEnum("pow_publication_status", [
  "draft",
  "published",
  "archived",
]);

export const powSourceTypeEnum = pgEnum("pow_source_type", [
  "json",
  "manual",
  "imported",
]);

export const powIssues = pgTable(
  "pow_issues",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    problemId: text("problem_id").notNull(),
    seriesCode: text("series_code").notNull(),
    series: text("series").notNull(),
    year: integer("year").notNull(),
    volume: integer("volume"),
    issue: integer("issue"),
    sequence: text("sequence").notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    abstract: text("abstract"),
    publicationDate: date("publication_date"),
    acceptedDate: date("accepted_date"),
    receivedDate: date("received_date"),
    weekOf: date("week_of"),
    deadline: date("deadline"),
    difficulty: powDifficultyEnum("difficulty").notNull(),
    topic: text("topic"),
    version: integer("version").notNull().default(1),
    publicationStatus: powPublicationStatusEnum("publication_status")
      .notNull()
      .default("published"),
    url: text("url").notNull(),
    publicId: text("public_id").notNull(),
    contactEmail: text("contact_email"),
    sourceType: powSourceTypeEnum("source_type").notNull().default("json"),
    pdfUrl: text("pdf_url").notNull(),
    pdfStoragePath: text("pdf_storage_path").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("pow_issues_problem_id_uidx").on(table.problemId),
    uniqueIndex("pow_issues_public_id_uidx").on(table.publicId),
    uniqueIndex("pow_issues_slug_uidx").on(table.slug),
    uniqueIndex("pow_issues_url_uidx").on(table.url),
    index("pow_issues_year_idx").on(table.year),
    index("pow_issues_publication_date_idx").on(table.publicationDate),
    index("pow_issues_difficulty_idx").on(table.difficulty),
    index("pow_issues_topic_idx").on(table.topic),
    index("pow_issues_status_idx").on(table.publicationStatus),
  ]
);

export const powIssueAuthors = pgTable(
  "pow_issue_authors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    powIssueId: uuid("pow_issue_id")
      .notNull()
      .references(() => powIssues.id, { onDelete: "cascade" }),
    authorId: uuid("author_id").references(() => authors.id, {
      onDelete: "set null",
    }),
    givenName: text("given_name"),
    familyName: text("family_name"),
    name: text("name").notNull(),
    email: text("email"),
    orcid: text("orcid"),
    corresponding: boolean("corresponding").notNull().default(false),
    sequence: text("sequence"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("pow_issue_authors_issue_idx").on(table.powIssueId),
    index("pow_issue_authors_author_idx").on(table.authorId),
    index("pow_issue_authors_sort_idx").on(table.powIssueId, table.sortOrder),
  ]
);

export const powIssueAuthorAffiliations = pgTable(
  "pow_issue_author_affiliations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    powIssueAuthorId: uuid("pow_issue_author_id")
      .notNull()
      .references(() => powIssueAuthors.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("pow_issue_author_affiliations_author_idx").on(table.powIssueAuthorId),
    index("pow_issue_author_affiliations_sort_idx").on(
      table.powIssueAuthorId,
      table.sortOrder
    ),
  ]
);

export const powIssueKeywords = pgTable(
  "pow_issue_keywords",
  {
    powIssueId: uuid("pow_issue_id")
      .notNull()
      .references(() => powIssues.id, { onDelete: "cascade" }),
    keyword: text("keyword").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.powIssueId, table.keyword] }),
    index("pow_issue_keywords_issue_idx").on(table.powIssueId),
    index("pow_issue_keywords_sort_idx").on(table.powIssueId, table.sortOrder),
  ]
);

export const powIssueSolvers = pgTable(
  "pow_issue_solvers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    powIssueId: uuid("pow_issue_id")
      .notNull()
      .references(() => powIssues.id, { onDelete: "cascade" }),
    solverName: text("solver_name").notNull(),
    note: text("note"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("pow_issue_solvers_issue_idx").on(table.powIssueId),
    index("pow_issue_solvers_sort_idx").on(table.powIssueId, table.sortOrder),
  ]
);
