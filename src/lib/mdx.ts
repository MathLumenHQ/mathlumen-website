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
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
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
