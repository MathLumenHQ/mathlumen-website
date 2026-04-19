import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SITE_NAME } from "@/lib/constants";
import {
  getPowIssueHref,
  getPublishedPowIssueBySlug,
} from "@/lib/queries/pow";

interface PowSlugPageProps {
  params: Promise<{ slug: string }>;
}

function isPowSolutionSlug(slug: string) {
  return /^pow-\d{3}-solution$/.test(slug);
}

export async function generateMetadata({ params }: PowSlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isPowSolutionSlug(slug)) {
    return {};
  }

  const issue = await getPublishedPowIssueBySlug(slug);

  if (!issue) {
    return {
      title: `Problem of the Week Solution | ${SITE_NAME}`,
      description: "Legacy Problem of the Week route.",
    };
  }

  return {
    title: `Redirecting | ${SITE_NAME}`,
    description: `Redirecting to the canonical Problem of the Week issue page for ${issue.publicId}.`,
    alternates: {
      canonical: getPowIssueHref(issue.publicId),
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function PowSlugPage({ params }: PowSlugPageProps) {
  const { slug } = await params;

  if (!isPowSolutionSlug(slug)) {
    notFound();
  }

  const issue = await getPublishedPowIssueBySlug(slug);

  if (!issue) {
    notFound();
  }

  redirect(getPowIssueHref(issue.publicId));
}
