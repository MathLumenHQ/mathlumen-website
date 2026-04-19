import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import {
  getPowIssueHref,
  getPublishedPowIssueByPublicId,
  getPublishedPowIssues,
} from "@/lib/queries/pow";
import { getProblemBySolutionSlug } from "@/lib/problem-of-the-week";
import {
  compilePowMarkdown,
  getPowSolutionContent,
  normalizePowAbstractMarkdown,
} from "@/lib/pow-mdx";
import { PowIssueDetailPage } from "@/components/pow/PowIssueDetailPage";

interface PowIssuePageProps {
  params: Promise<{ publicId: string }>;
}

export async function generateStaticParams() {
  const issues = await getPublishedPowIssues({ limit: 1000 });
  return issues.map((issue) => ({ publicId: issue.publicId }));
}

export async function generateMetadata({ params }: PowIssuePageProps): Promise<Metadata> {
  const { publicId } = await params;
  const issue = await getPublishedPowIssueByPublicId(publicId);

  if (!issue) {
    return {
      title: `Published Issue Not Found | ${SITE_NAME}`,
      description: "The requested Problem of the Week solution could not be found.",
    };
  }

  const canonicalUrl = issue.url || `${SITE_URL}${getPowIssueHref(issue.publicId)}`;

  return {
    title: `${issue.title} | ${SITE_NAME}`,
    description: issue.abstract ?? `Published Problem of the Week solution ${issue.publicId}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title: `${issue.title} | ${SITE_NAME}`,
      description: issue.abstract ?? undefined,
      url: canonicalUrl,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: `${issue.title} | ${SITE_NAME}`,
      description: issue.abstract ?? undefined,
    },
  };
}

export default async function PowIssuePage({ params }: PowIssuePageProps) {
  const { publicId } = await params;
  const issue = await getPublishedPowIssueByPublicId(publicId);

  if (!issue) {
    notFound();
  }

  const [solution, linkedProblem] = await Promise.all([
    getPowSolutionContent(issue.slug),
    Promise.resolve(getProblemBySolutionSlug(issue.slug)),
  ]);

  const problemMarkdown = solution?.frontmatter.problemStatement ?? linkedProblem?.statement;
  const problemContent = problemMarkdown
    ? await compilePowMarkdown(problemMarkdown)
    : null;
  const abstractContent = issue.abstract
    ? await compilePowMarkdown(normalizePowAbstractMarkdown(issue.abstract))
    : null;

  return (
    <PowIssueDetailPage
      issue={issue}
      solution={solution}
      problemContent={problemContent}
      abstractContent={abstractContent}
    />
  );
}
