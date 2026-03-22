import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { getPlaceholderUrl } from "@/lib/image-utils";

interface CoverImageProps {
  src: string;
  /** Accessibility alt text — use the article title */
  alt: string;
  /** Photo credit or caption displayed below the image */
  caption?: string;
  /** Article category — used to pick the right placeholder on load error */
  category?: string;
}

/**
 * Hero cover image at the top of an article page.
 *
 * - Renders the image full-width with a fixed aspect ratio
 * - Shows an optional photo credit / caption below
 * - Uses priority loading (LCP element)
 * - Never placed inside the MDX body — always sourced from frontmatter/database
 */
export function CoverImage({ src, alt, caption, category }: CoverImageProps) {
  return (
    <figure className="mb-10 -mx-4 sm:mx-0">
      <div className="relative h-64 md:h-[420px]">
        <OptimizedImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px"
          fallbackSrc={category ? getPlaceholderUrl(category) : undefined}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted font-mono leading-relaxed px-4 sm:px-0">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
