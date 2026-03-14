/**
 * CLI tool to upload images to ImageKit.
 *
 * Usage:
 *   pnpm run upload-image ./my-photo.jpg article-covers
 *   pnpm run upload-image ./avatar.png avatars
 *   pnpm run upload-image ./diagram.png article-content
 */

import ImageKit from "imagekit";
import fs from "fs";
import path from "path";
import "dotenv/config";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

const VALID_FOLDERS = [
  "article-covers",
  "avatars",
  "article-content",
] as const;
type Folder = (typeof VALID_FOLDERS)[number];

async function main() {
  const [, , filePath, folder] = process.argv;

  if (!filePath || !folder) {
    console.error("\n  Usage: pnpm run upload-image <file-path> <folder>\n");
    console.error("  Folders:");
    console.error("    article-covers   — Article hero/cover images");
    console.error("    avatars          — Author profile photos");
    console.error("    article-content  — Images inside article body\n");
    process.exit(1);
  }

  if (!VALID_FOLDERS.includes(folder as Folder)) {
    console.error(`\n  Invalid folder "${folder}"`);
    console.error(`  Valid options: ${VALID_FOLDERS.join(", ")}\n`);
    process.exit(1);
  }

  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`\n  File not found: ${absolutePath}\n`);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  const fileName = path.basename(absolutePath);
  const fileSizeKB = (fileBuffer.length / 1024).toFixed(1);

  console.log(
    `\n  Uploading ${fileName} (${fileSizeKB} KB) to mathlumen/${folder}...`,
  );

  try {
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName.toLowerCase().replace(/[^a-z0-9.-]/g, "-"),
      folder: `mathlumen/${folder}`,
      useUniqueFileName: false,
    });

    const relativePath = result.filePath?.startsWith("/")
      ? result.filePath.slice(1)
      : result.filePath;

    console.log("\n  Upload successful!\n");
    console.log(`  Path:       ${result.filePath}`);
    console.log(`  URL:        ${result.url}`);
    console.log(`  Size:       ${(result.size / 1024).toFixed(1)} KB`);
    console.log(`  Dimensions: ${result.width}x${result.height}`);

    if (folder === "article-covers") {
      console.log(`\n  Use in MDX frontmatter:`);
      console.log(`     coverImage: "${relativePath}"\n`);
    } else if (folder === "article-content") {
      console.log(`\n  Use inside MDX article body:`);
      console.log(`     ![description](${relativePath})\n`);
    } else if (folder === "avatars") {
      console.log(`\n  Use as avatarUrl:`);
      console.log(`     "${result.url}"\n`);
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error);
    console.error(`\n  Upload failed: ${message}\n`);
    process.exit(1);
  }
}

main();
