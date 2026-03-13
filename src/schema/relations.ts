import { relations } from "drizzle-orm";
import { articles, authors, tags, articleTags, subscribers } from "./tables";

/** Author has many articles */
export const authorsRelations = relations(authors, ({ many }) => ({
  articles: many(articles),
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
