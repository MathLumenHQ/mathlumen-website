"use client";

import Image from "next/image";
import imagekitLoader from "@/lib/imagekit-loader";

interface MdxImageProps {
  src: string;
  /** Accessibility alt text — always describe the image content for screen readers */
  alt: string;
  /**
   * Display caption shown below the image.
   * In MDX, write:  ![Alt text](https://... "Caption text")
   *                              ↑ alt        ↑ title → caption
   */
  title?: string;
  /**
   * Deduplication guard — if src matches this URL the component renders nothing.
   * Set to coverImageUrl to prevent the cover image from appearing twice when
   * an author accidentally includes it in the MDX body.
   */
  skipUrl?: string;
}

/**
 * Inline image component used inside MDX article bodies.
 *
 * Caption syntax in MDX:
 *   ![Alt text describing image](https://ik.imagekit.io/.../image.jpg "Caption / credit line")
 *
 * The `alt` attribute is used for accessibility and SEO (never displayed visually).
 * The `title` attribute becomes the visible caption rendered below the image.
 */
export function MdxImage({ src, alt, title, skipUrl }: MdxImageProps) {
  // Deduplication guard — silently drop the image if it is the cover image.
  // This catches the case where an author places the cover image in the body.
  if (skipUrl && src === skipUrl) return null;

  const isImageKit =
    src.includes("ik.imagekit.io") || !src.startsWith("http");

  const resolvedSrc =
    isImageKit && !src.startsWith("http")
      ? `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${src}`
      : src;

  return (
    <figure className="my-10 not-prose">
      <div className="relative overflow-hidden border border-gold/[0.12]">
        <Image
          src={resolvedSrc}
          alt={alt || ""}
          width={800}
          height={450}
          sizes="(max-width: 768px) 100vw, 800px"
          className="w-full block"
          loader={isImageKit ? imagekitLoader : undefined}
          loading="lazy"
        />
      </div>
      {title && (
        <figcaption className="mt-2 text-center text-xs text-muted font-mono leading-relaxed">
          {title}
        </figcaption>
      )}
    </figure>
  );
}
