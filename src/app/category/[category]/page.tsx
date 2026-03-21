import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticles } from "@/lib/queries/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { createMetadata } from "@/lib/metadata";
import type { Category } from "@/schema/types";
import type { Metadata } from "next";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  history:
    "Trace mathematics' 4,000-year story: from Babylonian algebra and Greek geometry to Euler's identities, Ramanujan's notebooks, and 21st-century computer-verified proofs.",
  research:
    "In-depth coverage of new theorems, open problems, and proof techniques across algebra, analysis, topology, number theory, and the frontiers of pure mathematics.",
  applied:
    "Differential equations, optimization, numerical methods, and signal processing — the mathematics that powers engineering, physics, finance, and the modern world.",
  "ai-ml":
    "Explore the linear algebra, calculus, probability, and information theory that power transformers, neural networks, gradient descent, and the ongoing AI revolution.",
  essay:
    "Long-form essays on mathematical beauty, philosophy, and culture — exploring why mathematics matters and how it shapes our understanding of the universe.",
};

const CATEGORY_LABELS: Record<string, string> = {
  history: "History",
  research: "Research",
  applied: "Applied Math",
  "ai-ml": "AI & ML",
  essay: "Essays",
};

const VALID_CATEGORIES = Object.keys(CATEGORY_DESCRIPTIONS);
const ARTICLES_PER_PAGE = 6;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const label = CATEGORY_LABELS[category];
  const description = CATEGORY_DESCRIPTIONS[category];

  if (!label) {
    return createMetadata({
      title: "Category Not Found",
      description: "This category does not exist.",
      path: `/category/${category}`,
    });
  }

  return createMetadata({
    title: label,
    description,
    path: `/category/${category}`,
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const sp = await searchParams;

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  const label = CATEGORY_LABELS[category]!;
  const description = CATEGORY_DESCRIPTIONS[category]!;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * limit;

  const result = await getArticles({
    category: category as Category,
    limit,
    offset,
  });

  const totalPages = Math.ceil(result.total / limit);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: label },
        ]}
      />

      {/* Hero */}
      <div className="mb-12 pb-8 border-b border-gold/[0.18]">
        <p className="text-xs text-gold font-mono uppercase tracking-widest mb-3">
          Category
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-paper mb-4">
          {label}
        </h1>
        <p className="text-muted text-lg max-w-2xl mb-4">{description}</p>
        <p className="text-sm text-muted font-mono">
          {result.total} article{result.total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Articles grid */}
      {result.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.data.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="font-display text-xl text-paper mb-2">
            No articles in this category yet.
          </p>
          <p className="text-muted text-lg mb-8">Explore other topics:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {VALID_CATEGORIES.filter((c) => c !== category).map((c) => (
              <Link
                key={c}
                href={`/category/${c}`}
                className="px-4 py-2 text-sm border border-gold/20 text-gold hover:border-gold/40 hover:bg-gold/[0.03] transition-colors duration-200"
              >
                {CATEGORY_LABELS[c]}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          {page > 1 && (
            <Link
              href={`/category/${category}${page > 2 ? `?page=${page - 1}` : ""}`}
              className="px-4 py-2 text-sm text-gold border border-gold/20 hover:border-gold/40 transition-colors duration-200"
            >
              &larr; Previous
            </Link>
          )}
          <span className="text-sm text-muted font-mono">
            Page {page} of {totalPages}
          </span>
          {result.hasMore && (
            <Link
              href={`/category/${category}?page=${page + 1}`}
              className="px-4 py-2 text-sm text-gold border border-gold/20 hover:border-gold/40 transition-colors duration-200"
            >
              Next &rarr;
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
