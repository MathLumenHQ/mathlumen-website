import fs from "node:fs";
import path from "node:path";
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
  // readdirSync returns relative paths on Node 18.17+ — join with root
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
 * Compile MDX source string into a React element with full remark/rehype pipeline.
 */
const mdxComponents = {
  img: MdxImage as never,
};

async function compileMdxContent(source: string) {
  return compileMDX<ArticleFrontmatter>({
    source,
    components: mdxComponents,
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
 */
export async function getArticleContent(slug: string): Promise<CompiledArticle | null> {
  try {
    const filePath = findArticleFile(slug);

    if (!filePath) {
      return null;
    }

    const raw = fs.readFileSync(filePath, "utf-8");

    // Extract headings from the body (after frontmatter)
    const frontmatterEnd = raw.indexOf("---", 3);
    const body = frontmatterEnd !== -1 ? raw.slice(frontmatterEnd + 3).trim() : raw;
    const headings = extractHeadings(body);

    // Compile MDX
    const { content, frontmatter } = await compileMdxContent(raw);

    return { content, frontmatter, headings };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to compile article "${slug}": ${message}`);
    return null;
  }
}

/**
 * Read the raw MDX body (after frontmatter) for a given slug.
 * Returns null if the file is not found.
 * Used by faq-schema extraction without re-compiling MDX.
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
