"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import imagekitLoader from "@/lib/imagekit-loader";

interface OptimizedImageProps extends Omit<ImageProps, "onError" | "loader"> {
  /** Use ImageKit loader for auto-optimization. Default: true */
  useImageKit?: boolean;
  /** Fallback image if src fails to load */
  fallbackSrc?: string;
}

export function OptimizedImage({
  useImageKit = true,
  fallbackSrc = "/images/placeholder-article.svg",
  alt,
  src,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  // Determine if we should use ImageKit loader
  const isImageKitUrl =
    typeof src === "string" &&
    (src.includes("ik.imagekit.io") || !src.startsWith("http"));

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-ink-2" />
      )}
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        loader={useImageKit && isImageKitUrl ? imagekitLoader : undefined}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
