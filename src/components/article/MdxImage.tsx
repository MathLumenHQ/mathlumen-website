"use client";

import Image from "next/image";
import imagekitLoader from "@/lib/imagekit-loader";

interface MdxImageProps {
  src: string;
  /**
   * Accessibility alt text — always describe the image content for screen readers.
   * In MDX: ![This is the alt](https://...)
   */
  alt: string;
  /**
   * Visible caption rendered below the image.
   * In MDX: ![Alt text](https://... "This becomes the caption")
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
 * Renders as a block-level <figure> — NOT wrapped in any inline element.
 * The parent mdx.ts deliberately strips the default <p> wrapper that MDX
 * adds around standalone images, so this component must never be used
 * inside a <p> or any other inline context.
 *
 * Caption syntax in MDX:
 *   ![Alt text](https://ik.imagekit.io/.../image.jpg "Caption / credit line")
 *
 * The `alt` attribute is used for accessibility and SEO (never displayed visually).
 * The `title` attribute becomes the visible caption rendered below the image.
 *
 * Overflow behaviour:
 *   Images can be any intrinsic size (e.g. 1792×1024 from AI generation).
 *   Three layers of CSS prevent them from ever escaping the article column:
 *     1. figure  — w-full max-w-full overflow-hidden  (outermost boundary)
 *     2. div     — w-full max-w-full overflow-hidden  (visual container)
 *     3. img     — w-full h-auto max-w-full           (element-level cap)
 */
export function MdxImage({ src, alt, title, skipUrl }: MdxImageProps) {
  // Deduplication guard — silently drop if this is the cover image.
  // Strip query strings (e.g. ?updatedAt=...) from both URLs before comparing
  // so ImageKit cache-busting parameters don't cause a false mismatch.
  const normalise = (url: string) => url.split("?")[0];
  if (skipUrl && normalise(src) === normalise(skipUrl)) return null;

  const isImageKit =
    src.includes("ik.imagekit.io") || !src.startsWith("http");

  const resolvedSrc =
    isImageKit && !src.startsWith("http")
      ? `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${src}`
      : src;

  return (
    // not-prose      — prevents Tailwind Typography overriding figure/img styles
    // w-full         — figure fills the article column, never wider
    // max-w-full     — hard cap: cannot overflow parent under any circumstance
    // overflow-hidden — clips anything that still escapes (belt-and-suspenders)
    <figure className="my-10 not-prose w-full max-w-[800px] mx-auto overflow-hidden">

      {/* Visual container — border + radius live here.
          w-full + max-w-full ensure it never exceeds the figure width. */}
      <div className="relative w-full overflow-hidden border border-gold/[0.12] rounded-md">
        <Image
          src={resolvedSrc}
          alt={alt || ""}
          // width/height represent the intrinsic source dimensions.
          // Next.js uses them only for aspect-ratio calculation —
          // the actual rendered size is controlled by the CSS classes below.
          // Set to 1792×1024 to correctly handle wide AI-generated images.
          width={1792}
          height={1024}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 800px"
          style={{ width: "100%", height: "auto" }} 
          // w-full     — fills container div horizontally
          // h-auto     — preserves aspect ratio, never distorts
          // block      — removes inline baseline gap beneath the image
          // max-w-full — explicit safety net at the img element level
          className="w-full h-auto block max-w-full"
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