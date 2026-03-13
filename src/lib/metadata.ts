import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, TWITTER_HANDLE } from "./constants";

interface CreateMetadataOptions {
  /** Page title (will be appended with site name) */
  title: string;
  /** Page description for SEO */
  description: string;
  /** OpenGraph image URL */
  image?: string;
  /** Page path (e.g., "/articles/euler-identity") */
  path: string;
  /** OpenGraph type */
  type?: "website" | "article";
}

/**
 * Create a complete Next.js Metadata object with OpenGraph, Twitter,
 * canonical URL, and RSS alternate link.
 */
export function createMetadata({
  title,
  description,
  image,
  path,
  type = "website",
}: CreateMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? `${SITE_URL}/og-default.png`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    robots: {
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
      title: `${title} | ${SITE_NAME}`,
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
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
      creator: TWITTER_HANDLE,
    },
  };
}
