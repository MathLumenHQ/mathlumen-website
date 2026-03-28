import fs from "node:fs";
import path from "node:path";
import {
  createElement,
  Children,
  isValidElement,
  Fragment,
} from "react";
import type { ReactElement, ReactNode } from "react";
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

// ─── File Lookup ────────────────────────────────────────────────────────────

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

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Frontmatter Helpers ─────────────────────────────────────────────────────

/**
 * Extract the coverImageUrl from a raw frontmatter string without a full YAML parse.
 * Strips any ImageKit query parameters (e.g. ?updatedAt=...) so that the
 * deduplication guard in MdxImage compares clean base URLs.
 * Handles both single-quoted and double-quoted values.
 */
function extractCoverUrl(frontmatterSection: string): string | undefined {
  const match = frontmatterSection.match(/coverImageUrl:\s*["']([^"']+)["']/);
  const raw = match?.[1];
  // Normalise: strip query string so ?updatedAt= params don't cause a mismatch
  return raw ? raw.split("?")[0] : undefined;
}

// ─── MDX Component Map ───────────────────────────────────────────────────────

/**
 * Build the MDX component map.
 *
 * Two overrides are registered:
 *
 * 1. `img` → ImageGuard / MdxImage
 *    Renders all inline images through MdxImage, which outputs a block-level
 *    <figure>. The skipUrl dedup guard prevents the cover image from appearing
 *    twice if an author accidentally includes it in the MDX body.
 *
 * 2. `p` → MdxParagraph
 *    MDX wraps standalone images in a <p> by default. Because MdxImage renders
 *    a <figure><div> — block-level elements — nesting them inside <p> is
 *    invalid HTML and causes a React hydration error. This custom renderer
 *    detects when a paragraph's sole child is an image element (identified by
 *    having a `src` prop) and renders the content without the <p> wrapper.
 *    All other paragraphs render normally.
 */
function createMdxComponents(coverUrl?: string) {
  // ── Image renderer ──────────────────────────────────────────────────────
  function ImageGuard(props: { src: string; alt: string; title?: string }) {
    return createElement(MdxImage, { ...props, skipUrl: coverUrl });
  }

  // ── Paragraph renderer ──────────────────────────────────────────────────
  function MdxParagraph({ children }: { children?: ReactNode }) {
    const childArray = Children.toArray(children);

    // An image-only paragraph has exactly one child that is a React element
    // with a `src` prop. This reliably identifies ImageGuard elements without
    // depending on displayName or component identity, both of which can be
    // unreliable across compilations.
    const isImageOnly =
      childArray.length === 1 &&
      isValidElement(childArray[0]) &&
      typeof (childArray[0] as ReactElement<{ src?: string }>).props?.src ===
        "string";

    if (isImageOnly) {
      // Drop the <p> wrapper — let the <figure> render at block level
      return createElement(Fragment, null, children);
    }

    return createElement("p", null, children);
  }

  return {
    img: ImageGuard as never,
    p: MdxParagraph as never,
  };
}

// ─── MDX Compiler ────────────────────────────────────────────────────────────

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

// ─── Heading Extractor ───────────────────────────────────────────────────────

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

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Read and compile an MDX article file by slug.
 * Returns compiled React content, frontmatter, and extracted headings for ToC.
 *
 * The cover image URL is extracted from the frontmatter before compilation so
 * that the MdxImage deduplication guard can be wired in at compile time —
 * no React context required.
 */
export async function getArticleContent(
  slug: string
): Promise<CompiledArticle | null> {
  try {
    const filePath = findArticleFile(slug);

    if (!filePath) {
      return null;
    }

    const raw = fs.readFileSync(filePath, "utf-8");

    // Locate the closing --- of the frontmatter block
    const frontmatterEnd = raw.indexOf("---", 3);
    const frontmatterSection =
      frontmatterEnd !== -1 ? raw.slice(4, frontmatterEnd) : "";
    const body =
      frontmatterEnd !== -1 ? raw.slice(frontmatterEnd + 3).trim() : raw;

    // Extract cover URL early so we can wire dedup into the img component.
    // Query params are stripped inside extractCoverUrl for clean comparison.
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