import { relations } from "drizzle-orm";
import { articles, authors, tags, articleTags, subscribers } from "./tables";
import {
  powIssues,
  powIssueAuthors,
  powIssueAuthorAffiliations,
  powIssueKeywords,
  powIssueSolvers,
} from "./pow-tables";

/** Author has many articles */
export const authorsRelations = relations(authors, ({ many }) => ({
  articles: many(articles),
  powIssueAuthors: many(powIssueAuthors),
}));

/** Article belongs to one author and has many tags via junction */
export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(authors, {
    fields: [articles.authorId],
    references: [authors.id],
  }),
  articleTags: many(articleTags),
}));

/** Tag has many articles via junction */
export const tagsRelations = relations(tags, ({ many }) => ({
  articleTags: many(articleTags),
}));

/** Junction: article_tags belongs to both article and tag */
export const articleTagsRelations = relations(articleTags, ({ one }) => ({
  article: one(articles, {
    fields: [articleTags.articleId],
    references: [articles.id],
  }),
  tag: one(tags, {
    fields: [articleTags.tagId],
    references: [tags.id],
  }),
}));

/** Subscribers (standalone, no relations needed) */
export const subscribersRelations = relations(subscribers, () => ({}));

/** Published POW issue has many authors, keywords, and solvers */
export const powIssuesRelations = relations(powIssues, ({ many }) => ({
  issueAuthors: many(powIssueAuthors),
  keywords: many(powIssueKeywords),
  solvers: many(powIssueSolvers),
}));

/** Published POW issue author optionally links to an existing site author */
export const powIssueAuthorsRelations = relations(powIssueAuthors, ({ one, many }) => ({
  issue: one(powIssues, {
    fields: [powIssueAuthors.powIssueId],
    references: [powIssues.id],
  }),
  siteAuthor: one(authors, {
    fields: [powIssueAuthors.authorId],
    references: [authors.id],
  }),
  affiliations: many(powIssueAuthorAffiliations),
}));

/** Issue-author has many affiliations */
export const powIssueAuthorAffiliationsRelations = relations(
  powIssueAuthorAffiliations,
  ({ one }) => ({
    issueAuthor: one(powIssueAuthors, {
      fields: [powIssueAuthorAffiliations.powIssueAuthorId],
      references: [powIssueAuthors.id],
    }),
  })
);

/** Keyword belongs to one published POW issue */
export const powIssueKeywordsRelations = relations(powIssueKeywords, ({ one }) => ({
  issue: one(powIssues, {
    fields: [powIssueKeywords.powIssueId],
    references: [powIssues.id],
  }),
}));

/** Solver acknowledgement belongs to one published POW issue */
export const powIssueSolversRelations = relations(powIssueSolvers, ({ one }) => ({
  issue: one(powIssues, {
    fields: [powIssueSolvers.powIssueId],
    references: [powIssues.id],
  }),
}));
