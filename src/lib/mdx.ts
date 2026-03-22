import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import type { ReactElement } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { toString } from "mdast-util-to-string";
import type { Heading, Root } from "mdast";
import { MdxImage } from "@/components/article/MdxImage";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");

/**
 * Recursively find an MDX file by slug anywhere under CONTENT_DIR.
 * The slug is always the filename (without .mdx), not the folder path.
 */
function findArticleFile(slug: string): string | null {
  if (!fs.existsSync(CONTENT_DIR)) return null;
  const all = fs.readdirSync(CONTENT_DIR, { recursive: true }) as string[];
  const match = all.find((f) => f.endsWith(`${slug}.mdx`));
  if (!match) return null;
  return path.join(CONTENT_DIR, match);
}

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
  /**
   * Photo credit or caption for the cover image.
   * Displayed below the hero image on the article page.
   * Example: "Photo: Peter Badge/Typos1/The Abel Prize 2026"
   */
  coverImageCaption?: string;
}

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

interface CompiledArticle {
  content: ReactElement;
  frontmatter: ArticleFrontmatter;
  headings: TocHeading[];
}

/**
 * Extract the coverImageUrl from a raw frontmatter string without a full YAML parse.
 * Handles both single-quoted and double-quoted values.
 */
function extractCoverUrl(frontmatterSection: string): string | undefined {
  const match = frontmatterSection.match(/coverImageUrl:\s*["']([^"']+)["']/);
  return match?.[1];
}

/**
 * Build the MDX component map.
 *
 * When coverUrl is provided, any <img> whose src matches it renders nothing —
 * this is the deduplication guard that prevents the cover image from appearing
 * a second time if an author accidentally includes it in the article body.
 */
function createMdxComponents(coverUrl?: string) {
  function ImageGuard(props: { src: string; alt: string; title?: string }) {
    return createElement(MdxImage, { ...props, skipUrl: coverUrl });
  }
  return { img: ImageGuard as never };
}

async function compileMdxContent(source: string, coverUrl?: string) {
  return compileMDX<ArticleFrontmatter>({
    source,
    components: createMdxComponents(coverUrl),
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeSlug,
          rehypeKatex as never,
          [
            rehypePrettyCode as never,
            {
              theme: "github-dark",
              defaultLang: "python",
            },
          ],
        ],
      },
    },
  });
}

/**
 * Extract h2 and h3 headings from raw MDX/markdown source for table of contents.
 */
export function extractHeadings(source: string): TocHeading[] {
  const tree = unified().use(remarkParse).parse(source);
  const headings: TocHeading[] = [];

  function visit(node: Root | Root["children"][number]) {
    if (node.type === "heading") {
      const heading = node as Heading;
      if (heading.depth === 2 || heading.depth === 3) {
        const text = toString(heading);
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        headings.push({ id, text, level: heading.depth });
      }
    }
    if ("children" in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        visit(child as Root["children"][number]);
      }
    }
  }

  visit(tree);
  return headings;
}

/**
 * Read and compile an MDX article file by slug.
 * Returns compiled React content, frontmatter, and extracted headings for ToC.
 *
 * The cover image URL is extracted from the frontmatter before compilation so
 * that the MdxImage deduplication guard can be wired in at compile time —
 * no React context required.
 */
export async function getArticleContent(slug: string): Promise<CompiledArticle | null> {
  try {
    const filePath = findArticleFile(slug);

    if (!filePath) {
      return null;
    }

    const raw = fs.readFileSync(filePath, "utf-8");

    // Locate the closing --- of the frontmatter block
    const frontmatterEnd = raw.indexOf("---", 3);
    const frontmatterSection = frontmatterEnd !== -1 ? raw.slice(4, frontmatterEnd) : "";
    const body = frontmatterEnd !== -1 ? raw.slice(frontmatterEnd + 3).trim() : raw;

    // Extract cover URL early so we can wire dedup into the img component
    const coverUrl = extractCoverUrl(frontmatterSection);

    const headings = extractHeadings(body);
    const { content, frontmatter } = await compileMdxContent(raw, coverUrl);

    return { content, frontmatter, headings };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to compile article "${slug}": ${message}`);
    return null;
  }
}

/**
 * Read the raw MDX body (after frontmatter) for a given slug.
 * Used by FAQ schema extraction without re-compiling MDX.
 */
export function getArticleRawBody(slug: string): string | null {
  try {
    const filePath = findArticleFile(slug);
    if (!filePath) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    const frontmatterEnd = raw.indexOf("---", 3);
    return frontmatterEnd !== -1 ? raw.slice(frontmatterEnd + 3).trim() : raw;
  } catch {
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

    const all = fs.readdirSync(CONTENT_DIR, { recursive: true }) as string[];
    return all
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => path.basename(f, ".mdx"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to list article slugs: ${message}`);
    return [];
  }
}
