import { notFound } from "next/navigation";
import { getArticles } from "@/lib/queries/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import { createMetadata } from "@/lib/metadata";
import { CATEGORIES } from "@/lib/constants";
import type { Category } from "@/schema/types";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.value === category);

  if (!cat) {
    return createMetadata({
      title: "Category Not Found",
      description: "This category does not exist.",
      path: `/category/${category}`,
    });
  }

  return createMetadata({
    title: cat.label,
    description: cat.description,
    path: `/category/${category}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.value === category);

  if (!cat) {
    notFound();
  }

  const result = await getArticles({
    category: category as Category,
    limit: 20,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-paper mb-3">
          {cat.label}
        </h1>
        <p className="text-muted text-lg">{cat.description}</p>
      </div>

      {result.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.data.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted text-lg">No articles in this category yet.</p>
        </div>
      )}
    </div>
  );
}
