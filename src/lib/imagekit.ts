import ImageKit from "imagekit";

/** Server-side ImageKit instance (NEVER import this in client components) */
export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

/** Get the ImageKit URL endpoint for use in client components. */
export function getUrlEndpoint(): string {
  return process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;
}

/**
 * Build an optimized ImageKit URL with transformations.
 * ImageKit uses URL params: ?tr=w-800,q-80,f-auto
 */
export function getImageUrl(
  path: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "avif" | "jpg" | "png";
    crop?: "maintain_ratio" | "force" | "at_max" | "at_least";
    focus?: "auto" | "face" | "center";
  },
): string {
  const {
    width,
    height,
    quality = 80,
    format = "auto",
    crop,
    focus,
  } = options ?? {};
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  const transforms: string[] = [];
  if (width) transforms.push(`w-${width}`);
  if (height) transforms.push(`h-${height}`);
  transforms.push(`q-${quality}`);
  if (format === "auto") transforms.push("f-auto");
  else transforms.push(`f-${format}`);
  if (crop) transforms.push(`c-${crop}`);
  if (focus) transforms.push(`fo-${focus}`);

  const tr = transforms.join(",");
  return `${endpoint}/${path}?tr=${tr}`;
}

/**
 * Build a tiny blur placeholder URL (20px wide, very low quality).
 * Used for blur-up loading effect.
 */
export function getBlurUrl(path: string): string {
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  return `${endpoint}/${path}?tr=w-20,q-10,bl-6,f-auto`;
}

/**
 * Generate authentication parameters for client-side uploads.
 * Called from a server action or API route.
 */
export function getAuthenticationParameters() {
  return imagekit.getAuthenticationParameters();
}
