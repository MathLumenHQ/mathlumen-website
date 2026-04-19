import { relations } from "drizzle-orm";
import { authors } from "./tables";
import {
  powIssues,
  powIssueAuthors,
  powIssueAuthorAffiliations,
  powIssueKeywords,
  powIssueSolvers,
} from "./pow-tables";

export const powIssuesRelations = relations(powIssues, ({ many }) => ({
  issueAuthors: many(powIssueAuthors),
  keywords: many(powIssueKeywords),
  solvers: many(powIssueSolvers),
}));

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

export const powIssueAuthorAffiliationsRelations = relations(
  powIssueAuthorAffiliations,
  ({ one }) => ({
    issueAuthor: one(powIssueAuthors, {
      fields: [powIssueAuthorAffiliations.powIssueAuthorId],
      references: [powIssueAuthors.id],
    }),
  })
);

export const powIssueKeywordsRelations = relations(powIssueKeywords, ({ one }) => ({
  issue: one(powIssues, {
    fields: [powIssueKeywords.powIssueId],
    references: [powIssues.id],
  }),
}));

export const powIssueSolversRelations = relations(powIssueSolvers, ({ one }) => ({
  issue: one(powIssues, {
    fields: [powIssueSolvers.powIssueId],
    references: [powIssues.id],
  }),
}));
