import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");

interface ArticleFrontmatter {
  title: string;
  subtitle?: string;
  slug: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  readTimeMinutes: number;
  tags: string[];
  coverImageUrl?: string;
}

interface MDXArticle {
  frontmatter: ArticleFrontmatter;
  content: string;
}

/**
 * Read and parse an MDX article file by slug.
 * Extracts frontmatter from the export const metadata block and returns raw content.
 */
export async function getArticleContent(slug: string): Promise<MDXArticle | null> {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const { frontmatter, content } = parseMDX(raw);

    return { frontmatter, content };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to read article "${slug}": ${message}`);
    return null;
  }
}

/**
 * List all available MDX article slugs from the content directory.
 */
export function listArticleSlugs(): string[] {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      return [];
    }

    return fs
      .readdirSync(CONTENT_DIR)
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to list article slugs: ${message}`);
    return [];
  }
}

/**
 * Parse MDX content, separating YAML-style frontmatter from body content.
 */
function parseMDX(raw: string): { frontmatter: ArticleFrontmatter; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = raw.match(frontmatterRegex);

  if (!match) {
    throw new Error("No frontmatter found in MDX file");
  }

  const frontmatterBlock = match[1];
  const content = raw.slice(match[0].length).trim();

  const frontmatter = parseYAMLFrontmatter(frontmatterBlock);

  return { frontmatter, content };
}

/**
 * Simple YAML frontmatter parser for article metadata.
 */
function parseYAMLFrontmatter(block: string): ArticleFrontmatter {
  const lines = block.split("\n");
  const data: Record<string, string | string[] | number> = {};

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parse arrays in bracket notation: [tag1, tag2]
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""));
    } else if (!isNaN(Number(value)) && value !== "") {
      data[key] = Number(value);
    } else {
      data[key] = value;
    }
  }

  return {
    title: String(data.title ?? ""),
    subtitle: data.subtitle ? String(data.subtitle) : undefined,
    slug: String(data.slug ?? ""),
    category: String(data.category ?? ""),
    excerpt: String(data.excerpt ?? ""),
    publishedAt: String(data.publishedAt ?? ""),
    readTimeMinutes: Number(data.readTimeMinutes ?? 5),
    tags: Array.isArray(data.tags) ? data.tags : [],
    coverImageUrl: data.coverImageUrl ? String(data.coverImageUrl) : undefined,
  };
}
