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
  fill,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  // Determine if we should use ImageKit loader
  const isImageKitUrl =
    typeof src === "string" &&
    (src.includes("ik.imagekit.io") || !src.startsWith("http"));

  // When `fill` is used, the wrapper must stretch to fill the positioned parent
  // (outer container is `relative h-X`). An extra `relative` wrapper collapses
  // to 0 height because fill children are `position: absolute`.
  const wrapperClass = fill
    ? "absolute inset-0 overflow-hidden"
    : "relative overflow-hidden";

  return (
    <div className={wrapperClass}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-ink-2" />
      )}
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        fill={fill}
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
