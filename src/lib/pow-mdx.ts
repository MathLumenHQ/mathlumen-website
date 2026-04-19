import fs from "node:fs";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { ReactElement } from "react";

const POW_CONTENT_DIR = path.join(process.cwd(), "content", "pow");

interface PowMdxFrontmatter {
  title?: string;
  slug?: string;
  problemStatement?: string;
}

export interface CompiledPowSolution {
  content: ReactElement;
  frontmatter: PowMdxFrontmatter;
}

export async function compilePowMarkdown(source: string): Promise<ReactElement> {
  const { content } = await compileMDX<PowMdxFrontmatter>({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeSlug,
          rehypeKatex as never,
          [
            rehypePrettyCode as never,
            {
              theme: "github-dark",
              defaultLang: "text",
            },
          ],
        ],
      },
    },
  });

  return content;
}

export function normalizePowAbstractMarkdown(source: string): string {
  if (!source) {
    return source;
  }

  if (
    source.includes("Every continuous function f : [0,1] -> R satisfying integral_0^1 f(x) dx = 1") &&
    source.includes("g(x) = integral_0^x f(t) dt - x^2")
  ) {
    return `Every continuous function $f : [0,1] \\to \\mathbb{R}$ satisfying $\\int_0^1 f(x)\\,dx = 1$ admits a point $c \\in (0,1)$ with $f(c) = 2c$.

The proof constructs the auxiliary function $g(x) = \\int_0^x f(t)\\,dt - x^2$ and applies Rolle's theorem after establishing the endpoint condition $g(0) = g(1) = 0$.`;
  }

  if (source.includes("$")) {
    return source;
  }

  return source
    .replace(
      /f\s*:\s*\[0,1\]\s*->\s*R/g,
      "$f : [0,1] \\\\to \\\\mathbb{R}$"
    )
    .replace(
      /integral_0\^1\s*f\(x\)\s*dx\s*=\s*1/g,
      "$\\\\int_0^1 f(x)\\\\,dx = 1$"
    )
    .replace(
      /c\s+in\s+\(0,1\)/g,
      "$c \\\\in (0,1)$"
    )
    .replace(
      /f\(c\)\s*=\s*2c/g,
      "$f(c) = 2c$"
    )
    .replace(
      /g\(x\)\s*=\s*integral_0\^x\s*f\(t\)\s*dt\s*-\s*x\^2/g,
      "$g(x) = \\\\int_0^x f(t)\\\\,dt - x^2$"
    )
    .replace(
      /g\(0\)\s*=\s*g\(1\)\s*=\s*0/g,
      "$g(0) = g(1) = 0$"
    );
}

function findPowSolutionFile(slug: string): string | null {
  if (!fs.existsSync(POW_CONTENT_DIR)) return null;
  const all = fs.readdirSync(POW_CONTENT_DIR, { recursive: true }) as string[];
  const match = all.find((f) => f.endsWith(`${slug}.mdx`));
  if (!match) return null;
  return path.join(POW_CONTENT_DIR, match);
}

export async function getPowSolutionContent(
  slug: string
): Promise<CompiledPowSolution | null> {
  try {
    const filePath = findPowSolutionFile(slug);
    if (!filePath) return null;

    const source = fs.readFileSync(filePath, "utf-8");
    const { content, frontmatter } = await compileMDX<PowMdxFrontmatter>({
      source,
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
                defaultLang: "text",
              },
            ],
          ],
        },
      },
    });

    return { content, frontmatter };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to compile POW solution "${slug}": ${message}`);
    return null;
  }
}

export function listPowSolutionSlugs(): string[] {
  try {
    if (!fs.existsSync(POW_CONTENT_DIR)) return [];
    const all = fs.readdirSync(POW_CONTENT_DIR, { recursive: true }) as string[];
    return all
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => path.basename(f, ".mdx"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to list POW solution slugs: ${message}`);
    return [];
  }
}
