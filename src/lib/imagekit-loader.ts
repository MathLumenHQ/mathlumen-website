"use client";

/**
 * Custom loader for Next.js Image component.
 * Generates ImageKit transformation URLs automatically.
 *
 * Usage per-image via loader prop:
 *   <Image loader={imagekitLoader} src="/path/to/image.jpg" ... />
 */
export default function imagekitLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const q = quality ?? 80;
  const transforms = `w-${width},q-${q},f-auto`;

  // Non-ImageKit absolute URLs (Unsplash, etc.) — serve as-is
  if (src.startsWith("http") && !src.includes("ik.imagekit.io")) {
    return src;
  }

  // Full ImageKit URL — append transforms
  if (src.startsWith("http") && src.includes("ik.imagekit.io")) {
    if (src.includes("?tr=")) {
      // URL already has ImageKit transforms — append to existing chain
      return `${src},${transforms}`;
    }
    // No existing transforms — start a new tr= param
    const separator = src.includes("?") ? "&tr=" : "?tr=";
    return `${src}${separator}${transforms}`;
  }

  // Relative path — construct full ImageKit URL from env endpoint
  const cleanSrc = src.startsWith("/") ? src.slice(1) : src;
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  return `${endpoint}/${cleanSrc}?tr=${transforms}`;
}
