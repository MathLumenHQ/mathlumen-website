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
  // If src is already a full URL (Unsplash, etc.), return as-is
  if (src.startsWith("http") && !src.includes("ik.imagekit.io")) {
    return src;
  }

  // If src is already a full ImageKit URL, add transforms
  if (src.startsWith("http") && src.includes("ik.imagekit.io")) {
    const separator = src.includes("?") ? "," : "?tr=";
    return `${src}${separator}w-${width},q-${quality || 80},f-auto`;
  }

  // Otherwise, treat src as a relative path
  const cleanSrc = src.startsWith("/") ? src.slice(1) : src;
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  const params = [`w-${width}`, `q-${quality || 80}`, "f-auto"];
  return `${endpoint}/${cleanSrc}?tr=${params.join(",")}`;
}
