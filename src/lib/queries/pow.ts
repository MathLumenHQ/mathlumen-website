import { and, desc, eq, inArray, sql, ilike, or } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  powIssues,
  powIssueAuthors,
  powIssueAuthorAffiliations,
  powIssueKeywords,
  powIssueSolvers,
} from "@/schema/pow-tables";
import type {
  PowIssue,
  PowIssueQueryParams,
  PowIssueWithRelations,
  PowAuthorWithAffiliations,
  PowSearchResult,
} from "@/schema/types";

export function getPowIssueHref(publicId: string): string {
  return `/pow/${publicId}`;
}

export function getPowPdfHref(publicId: string, download = false): string {
  const base = `/pow/${publicId}.pdf`;
  return download ? `${base}?download=1` : base;
}

function buildPublishedIssueConditions(params: PowIssueQueryParams = {}) {
  const conditions = [eq(powIssues.publicationStatus, "published")];

  if (params.year !== undefined) {
    conditions.push(eq(powIssues.year, params.year));
  }

  if (params.topic) {
    conditions.push(eq(powIssues.topic, params.topic));
  }

  if (params.difficulty) {
    conditions.push(eq(powIssues.difficulty, params.difficulty));
  }

  return and(...conditions);
}

async function hydratePowIssues(issues: PowIssue[]): Promise<PowIssueWithRelations[]> {
  if (issues.length === 0) {
    return [];
  }

  const issueIds = issues.map((issue) => issue.id);

  const [authors, affiliations, keywords, solvers] = await Promise.all([
    db
      .select()
      .from(powIssueAuthors)
      .where(inArray(powIssueAuthors.powIssueId, issueIds))
      .orderBy(powIssueAuthors.powIssueId, powIssueAuthors.sortOrder, powIssueAuthors.name),
    db
      .select()
      .from(powIssueAuthorAffiliations)
      .where(
        inArray(
          powIssueAuthorAffiliations.powIssueAuthorId,
          db
            .select({ id: powIssueAuthors.id })
            .from(powIssueAuthors)
            .where(inArray(powIssueAuthors.powIssueId, issueIds))
        )
      )
      .orderBy(
        powIssueAuthorAffiliations.powIssueAuthorId,
        powIssueAuthorAffiliations.sortOrder,
        powIssueAuthorAffiliations.name
      ),
    db
      .select()
      .from(powIssueKeywords)
      .where(inArray(powIssueKeywords.powIssueId, issueIds))
      .orderBy(powIssueKeywords.powIssueId, powIssueKeywords.sortOrder, powIssueKeywords.keyword),
    db
      .select()
      .from(powIssueSolvers)
      .where(inArray(powIssueSolvers.powIssueId, issueIds))
      .orderBy(powIssueSolvers.powIssueId, powIssueSolvers.sortOrder, powIssueSolvers.solverName),
  ]);

  const affiliationsByAuthor = new Map<string, typeof affiliations>();
  for (const affiliation of affiliations) {
    const current = affiliationsByAuthor.get(affiliation.powIssueAuthorId) ?? [];
    current.push(affiliation);
    affiliationsByAuthor.set(affiliation.powIssueAuthorId, current);
  }

  const authorsByIssue = new Map<string, PowAuthorWithAffiliations[]>();
  for (const author of authors) {
    const current = authorsByIssue.get(author.powIssueId) ?? [];
    current.push({
      ...author,
      affiliations: affiliationsByAuthor.get(author.id) ?? [],
      siteAuthor: null,
    });
    authorsByIssue.set(author.powIssueId, current);
  }

  const keywordsByIssue = new Map<string, typeof keywords>();
  for (const keyword of keywords) {
    const current = keywordsByIssue.get(keyword.powIssueId) ?? [];
    current.push(keyword);
    keywordsByIssue.set(keyword.powIssueId, current);
  }

  const solversByIssue = new Map<string, typeof solvers>();
  for (const solver of solvers) {
    const current = solversByIssue.get(solver.powIssueId) ?? [];
    current.push(solver);
    solversByIssue.set(solver.powIssueId, current);
  }

  return issues.map((issue) => ({
    ...issue,
    authors: authorsByIssue.get(issue.id) ?? [],
    keywords: keywordsByIssue.get(issue.id) ?? [],
    solvers: solversByIssue.get(issue.id) ?? [],
  }));
}

export async function getPublishedPowIssues(
  params: PowIssueQueryParams = {}
): Promise<PowIssueWithRelations[]> {
  const {
    limit,
    offset = 0,
  } = params;

  const query = db
    .select()
    .from(powIssues)
    .where(buildPublishedIssueConditions(params))
    .orderBy(
      desc(powIssues.publicationDate),
      desc(powIssues.year),
      desc(powIssues.issue),
      desc(powIssues.sequence)
    )
    .$dynamic();

  const pagedQuery =
    limit !== undefined ? query.limit(limit).offset(offset) : query.offset(offset);

  const issues = await pagedQuery;
  return hydratePowIssues(issues);
}

export async function getLatestPublishedPowIssue(): Promise<PowIssueWithRelations | null> {
  const issues = await getPublishedPowIssues({ limit: 1 });
  return issues[0] ?? null;
}

export async function getLatestPublishedIssue(): Promise<PowIssueWithRelations | null> {
  return getLatestPublishedPowIssue();
}

export async function getPublishedPowIssueByPublicId(
  publicId: string
): Promise<PowIssueWithRelations | null> {
  const issues = await db
    .select()
    .from(powIssues)
    .where(and(eq(powIssues.publicId, publicId), eq(powIssues.publicationStatus, "published")))
    .limit(1);

  if (issues.length === 0) {
    return null;
  }

  const hydrated = await hydratePowIssues(issues);
  return hydrated[0] ?? null;
}

export async function getPublishedPowIssueBySlug(
  slug: string
): Promise<PowIssueWithRelations | null> {
  const issues = await db
    .select()
    .from(powIssues)
    .where(and(eq(powIssues.slug, slug), eq(powIssues.publicationStatus, "published")))
    .limit(1);

  if (issues.length === 0) {
    return null;
  }

  const hydrated = await hydratePowIssues(issues);
  return hydrated[0] ?? null;
}

export async function getPublishedPowIssuesByYear(
  year: number
): Promise<PowIssueWithRelations[]> {
  return getPublishedPowIssues({ year });
}

export async function getPowArchiveYears(): Promise<number[]> {
  const rows = await db
    .selectDistinct({ year: powIssues.year })
    .from(powIssues)
    .where(eq(powIssues.publicationStatus, "published"))
    .orderBy(desc(powIssues.year));

  return rows.map((row) => row.year);
}

export async function getPublishedPowIssueCount(): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(powIssues)
    .where(eq(powIssues.publicationStatus, "published"));

  return result[0]?.count ?? 0;
}

export async function searchPowResults(
  query: string,
  limit: number = 10
): Promise<PowSearchResult[]> {
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const keywordMatches = db
    .selectDistinct({ powIssueId: powIssueKeywords.powIssueId })
    .from(powIssueKeywords)
    .where(ilike(powIssueKeywords.keyword, `%${trimmed}%`));

  const rows = await db
    .select()
    .from(powIssues)
    .where(
      and(
        eq(powIssues.publicationStatus, "published"),
        or(
          ilike(powIssues.title, `%${trimmed}%`),
          ilike(powIssues.subtitle, `%${trimmed}%`),
          ilike(powIssues.abstract, `%${trimmed}%`),
          ilike(powIssues.topic, `%${trimmed}%`),
          ilike(powIssues.problemId, `%${trimmed}%`),
          ilike(powIssues.publicId, `%${trimmed}%`),
          inArray(
            powIssues.id,
            keywordMatches
          )
        )
      )
    )
    .orderBy(desc(powIssues.publicationDate), desc(powIssues.year), desc(powIssues.issue))
    .limit(limit);

  return rows.map((issue) => ({
    id: issue.id,
    resultType: "pow",
    href: getPowIssueHref(issue.publicId),
    title: issue.title,
    subtitle: issue.subtitle,
    excerpt: issue.abstract ?? `Published Problem of the Week solution ${issue.publicId}.`,
    publishedAt: issue.publicationDate,
    publicId: issue.publicId,
    difficulty: issue.difficulty,
    topic: issue.topic,
  }));
}
