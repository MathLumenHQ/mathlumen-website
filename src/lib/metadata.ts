import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, TWITTER_HANDLE } from "./constants";

interface CreateMetadataOptions {
  /** Page title; the root layout appends the site name once. */
  title: string;
  /** Page description for SEO */
  description: string;
  /** OpenGraph image URL */
  image?: string;
  /** Page path (e.g., "/articles/euler-identity"). Use "/" for the homepage. */
  path: string;
  /** OpenGraph type */
  type?: "website" | "article";
  /** Search engine indexing directives */
  robots?: Metadata["robots"];
  /** Publication date for article Open Graph metadata. */
  publishedTime?: string;
  /** Last substantive modification date for article Open Graph metadata. */
  modifiedTime?: string;
  /** Author page URLs for article Open Graph metadata. */
  authors?: string[];
}

/**
 * Create a complete Next.js Metadata object with OpenGraph, Twitter,
 * canonical URL, and RSS alternate link.
 *
 * `SITE_URL` (https://www.mathlumen.com) is the single source of truth for
 * every absolute URL emitted here.
 */
export function createMetadata({
  title,
  description,
  image,
  path,
  type = "website",
  robots,
  publishedTime,
  modifiedTime,
  authors,
}: CreateMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? `${SITE_URL}/opengraph-image`;

  // Social titles are not covered by the layout title template, so add the
  // suffix here, but never twice (e.g. the homepage title is the site name).
  const socialTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    // The root layout owns the title template, so child titles must not
    // append the site name here or it appears twice in the document title.
    title,
    description,
    robots: robots ?? {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": `${SITE_URL}/api/rss`,
      },
    },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage],
      creator: TWITTER_HANDLE,
    },
  };
}