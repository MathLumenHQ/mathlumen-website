"use server";

import { imagekit, getAuthenticationParameters } from "@/lib/imagekit";
import { z } from "zod";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const uploadSchema = z.object({
  folder: z.enum([
    "mathlumen/article-covers",
    "mathlumen/avatars",
    "mathlumen/article-content",
  ]),
  fileName: z.string().min(1).max(200),
});

/**
 * Server action: Generate authentication params for client-side upload.
 * Client calls this, receives tokens, then uploads directly to ImageKit.
 */
export async function getUploadAuth() {
  const authParams = getAuthenticationParameters();
  return {
    ...authParams,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  };
}

/**
 * Server action: Upload an image to ImageKit from the server.
 * Accepts FormData with 'file', 'folder', and 'fileName' fields.
 */
export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  const folder = formData.get("folder") as string;
  const fileName = formData.get("fileName") as string;

  const parsed = uploadSchema.safeParse({ folder, fileName });
  if (!parsed.success) {
    return { success: false as const, error: "Invalid folder or filename" };
  }

  if (!file || file.size === 0) {
    return { success: false as const, error: "No file provided" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false as const,
      error: "Only JPEG, PNG, WebP, AVIF allowed",
    };
  }

  if (file.size > MAX_SIZE) {
    return { success: false as const, error: "File must be under 5 MB" };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    const result = await imagekit.upload({
      file: base64,
      fileName: sanitizeFilename(parsed.data.fileName),
      folder: parsed.data.folder,
      useUniqueFileName: false,
    });

    return {
      success: true as const,
      filePath: result.filePath,
      url: result.url,
      fileId: result.fileId,
      width: result.width,
      height: result.height,
      size: result.size,
    };
  } catch (error) {
    console.error("ImageKit upload failed:", error);
    return {
      success: false as const,
      error: "Upload failed. Please try again.",
    };
  }
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
