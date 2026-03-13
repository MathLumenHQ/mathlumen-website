import Link from "next/link";
import { getArticles } from "@/lib/queries/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { CATEGORIES, SITE_DESCRIPTION } from "@/lib/constants";

export default async function HomePage() {
  const [featuredResult, latestResult] = await Promise.all([
    getArticles({ featured: true, limit: 4 }),
    getArticles({ limit: 8 }),
  ]);

  const featured = featuredResult.data;
  const latest = latestResult.data;

  return (
    <>
      {/* Hero Section */}
      <section className="relative noise-overlay">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <Badge variant="gold" className="mb-6">
              A Scholarly Mathematics Publication
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-paper leading-[1.1] mb-6">
              Illuminating the{" "}
              <span className="text-gold">beauty</span> of mathematics
            </h1>
            <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl">
              {SITE_DESCRIPTION}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/articles"
                className="inline-flex items-center px-6 py-3 bg-gold text-ink font-semibold rounded-sm hover:bg-gold-light transition-colors duration-200"
              >
                Read Articles
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 border border-gold/30 text-paper hover:border-gold hover:text-gold transition-colors duration-200 rounded-sm"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Separator gold />

      {/* Featured Articles */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-paper">
              Featured
            </h2>
            <Link
              href="/articles?featured=true"
              className="text-sm text-gold hover:text-gold-light transition-colors duration-200 font-mono"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((article, idx) => (
              <ArticleCard
                key={article.id}
                article={article}
                featured={idx === 0}
              />
            ))}
          </div>
        </section>
      )}

      <Separator gold />

      {/* Latest Articles */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-paper">
            Latest Articles
          </h2>
          <Link
            href="/articles"
            className="text-sm text-gold hover:text-gold-light transition-colors duration-200 font-mono"
          >
            Browse all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-ink-2 border-y border-gold/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-paper mb-10 text-center">
            Explore by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/category/${cat.value}`}
                className="group p-5 border border-gold/10 rounded-none hover:border-gold/30 transition-all duration-200"
              >
                <h3 className="font-display font-semibold text-gold-light group-hover:text-gold mb-1">
                  {cat.label}
                </h3>
                <p className="text-xs text-muted">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-paper mb-4">
            Stay illuminated
          </h2>
          <p className="text-muted mb-8">
            Join our newsletter for weekly dispatches on mathematical beauty, groundbreaking research, and deep dives into the equations that shape our world.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
