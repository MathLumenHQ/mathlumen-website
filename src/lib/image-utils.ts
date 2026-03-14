/** Get a category-specific placeholder image path. */
export function getPlaceholderUrl(category?: string): string {
  const placeholders: Record<string, string> = {
    history: "/images/placeholder-history.svg",
    research: "/images/placeholder-research.svg",
    applied: "/images/placeholder-applied.svg",
    "ai-ml": "/images/placeholder-ai-ml.svg",
    essay: "/images/placeholder-essay.svg",
  };
  return placeholders[category ?? ""] ?? "/images/placeholder-article.svg";
}

/** Sanitize a filename for safe upload. */
export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Convert an ImageKit path to a full URL. */
export function toImageKitUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${endpoint}/${cleanPath}`;
}

/** Generate a thumbnail URL with ImageKit transforms. */
export function getThumbnailUrl(path: string, width = 400): string {
  const fullUrl = toImageKitUrl(path);
  const separator = fullUrl.includes("?") ? "&" : "?";
  return `${fullUrl}${separator}tr=w-${width},q-75,f-auto`;
}
