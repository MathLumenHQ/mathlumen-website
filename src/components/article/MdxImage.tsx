"use client";

import Image from "next/image";
import imagekitLoader from "@/lib/imagekit-loader";

interface MdxImageProps {
  src: string;
  alt: string;
}

export function MdxImage({ src, alt }: MdxImageProps) {
  const isImageKit =
    src.includes("ik.imagekit.io") || !src.startsWith("http");

  return (
    <figure className="my-8">
      <Image
        src={
          isImageKit && !src.startsWith("http")
            ? `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${src}`
            : src
        }
        alt={alt || ""}
        width={800}
        height={450}
        sizes="(max-width: 768px) 100vw, 800px"
        className="w-full border border-gold/10"
        loader={isImageKit ? imagekitLoader : undefined}
      />
      {alt && (
        <figcaption className="mt-2 text-center text-sm text-muted font-mono">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}
