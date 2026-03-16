import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { authors, articles, tags, articleTags, subscribers } from "../src/schema/tables";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const client = postgres(DATABASE_URL, { max: 1 });
const db = drizzle(client);


async function seed() {
  // Safety guard — prevents accidental runs
  if (process.env.NODE_ENV === "production") {
    console.error("ERROR: Seed script cannot run in production.");
    process.exit(1);
  }

  const confirmed = process.env.CONFIRM_SEED;
  if (confirmed !== "yes") {
    console.error(
      "ERROR: To run the seed, set CONFIRM_SEED=yes\n" +
      "Example: CONFIRM_SEED=yes pnpm run seed"
    );
    process.exit(1);
  }

  console.log("Seeding MathLumen database...\n");


  // ─── Clear existing data ──────────────────────────────────────────
  console.log("Clearing existing data...");
  await db.delete(articleTags);
  await db.delete(articles);
  await db.delete(tags);
  await db.delete(authors);
  await db.delete(subscribers);
  console.log("  Cleared all tables\n");

  // ─── Authors ────────────────────────────────────────────────────────
  console.log("Creating authors...");
  const [akhilesh] = await db
    .insert(authors)
    .values([
      {
        name: "Akhilesh Yadav",
        slug: "akhilesh-yadav",
        bio: "Applied mathematician and AI practitioner. Founder of MathLumen, exploring mathematics behind machine learning and scientific AI.",
        avatarUrl:
          "https://ik.imagekit.io/netrv2whci/mathlumen/avatars/akhilesh-yadav.png",
        email: "akhilesh@mathlumen.com",
        twitterHandle: "@AkhileshYa1408",
        linkedinUrl: "https://www.linkedin.com/in/akhileshyadav1598/",
        websiteUrl: "https://mlmathematics.com",
      },
    ])
    .returning();

  console.log(`  Created 1 author`);

  // ─── Tags ───────────────────────────────────────────────────────────
  console.log("Creating tags...");
  const tagData = [
    { name: "Complex Analysis", slug: "complex-analysis", description: "Study of functions of complex variables", color: "#8b5cf6" },
    { name: "Number Theory", slug: "number-theory", description: "Properties and relationships of numbers", color: "#f59e0b" },
    { name: "Linear Algebra", slug: "linear-algebra", description: "Vector spaces and linear transformations", color: "#3b82f6" },
    { name: "Deep Learning", slug: "deep-learning", description: "Neural networks and representation learning", color: "#ef4444" },
    { name: "Numerical Analysis", slug: "numerical-analysis", description: "Algorithms for numerical computation", color: "#10b981" },
    { name: "Topology", slug: "topology", description: "Properties preserved under continuous deformations", color: "#ec4899" },
    { name: "History of Mathematics", slug: "history-of-mathematics", description: "The evolution of mathematical ideas", color: "#c9a84c" },
    { name: "Mathematical Beauty", slug: "mathematical-beauty", description: "Aesthetics and elegance in mathematics", color: "#e8d08a" },
  ];

  const insertedTags = await db.insert(tags).values(tagData).returning();
  console.log(`  Created ${insertedTags.length} tags`);

  // Tag lookup by slug
  const tagMap = new Map(insertedTags.map((t) => [t.slug, t.id]));

  // ─── Articles ───────────────────────────────────────────────────────
  console.log("Creating articles...");

  const articleData = [
    // Essay (2)
    {
      slug: "euler-identity-beauty",
      title: "The Most Beautiful Equation: Why Euler's Identity Captivates Mathematicians",
      subtitle: "A meditation on e^{iπ} + 1 = 0",
      excerpt: "Euler's identity unites five fundamental constants in a single, breathtaking equation. We explore why mathematicians across centuries have called it the most beautiful result in all of mathematics.",
      category: "essay" as const,
      tags: ["complex-analysis", "euler", "beauty", "constants"],
      authorId: akhilesh.id,
      coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/euler-identity-beauty.png",
      publishedAt: new Date("2026-02-15"),
      isPublished: true,
      readTimeMinutes: 8,
      viewCount: 3420,
      featured: true,
    },
    {
      slug: "mathematics-and-music-harmony",
      title: "The Mathematics of Music: From Pythagoras to Fourier",
      subtitle: "How ratios, frequencies, and transforms create harmony",
      excerpt: "From Pythagorean tuning to the Fast Fourier Transform, mathematics and music have been intertwined for millennia. We explore the deep connections between these two universal languages.",
      category: "essay" as const,
      tags: ["fourier", "harmony", "history"],
      authorId: akhilesh.id,
      coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/mathematics-and-music-harmony.png",
      publishedAt: new Date("2026-01-10"),
      isPublished: true,
      readTimeMinutes: 6,
      viewCount: 1890,
      featured: false,
    },
    // Applied (2)
    {
      slug: "spectral-methods-pde",
      title: "Spectral Methods for Solving Partial Differential Equations",
      subtitle: "When Fourier meets computation",
      excerpt: "Spectral methods transform PDEs into algebraic systems using global basis functions. We survey how Fourier and Chebyshev expansions achieve exponential convergence where finite differences stall.",
      category: "applied" as const,
      tags: ["spectral-methods", "pde", "fourier", "numerical-analysis"],
      authorId: akhilesh.id,
      coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/spectral-methods-pde.png",
      publishedAt: new Date("2026-01-28"),
      isPublished: true,
      readTimeMinutes: 7,
      viewCount: 2150,
      featured: true,
    },
    {
      slug: "monte-carlo-methods-finance",
      title: "Monte Carlo Methods in Quantitative Finance",
      subtitle: "Random walks on Wall Street — literally",
      excerpt: "Monte Carlo simulation is the backbone of derivatives pricing. We explore the mathematics of random sampling, variance reduction, and how stochastic processes model financial markets.",
      category: "applied" as const,
      tags: ["monte-carlo", "probability", "finance", "stochastic"],
      authorId: akhilesh.id,
      coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/monte-carlo-methods-finance.png",
      publishedAt: new Date("2025-12-15"),
      isPublished: true,
      readTimeMinutes: 9,
      viewCount: 1650,
      featured: false,
    },
    // AI-ML (2)
    {
      slug: "attention-is-all-you-need-math",
      title: "The Mathematics of Self-Attention: Deconstructing the Transformer",
      subtitle: "Inside the equation that powers modern AI",
      excerpt: "The Transformer architecture revolutionized AI with a single mechanism: self-attention. We break down the linear algebra behind Attention(Q,K,V), explain why the √d_k scaling factor is essential, and trace how matrix multiplications create meaning.",
      category: "ai-ml" as const,
      tags: ["transformers", "attention", "linear-algebra", "deep-learning"],
      authorId: akhilesh.id,
      coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/attention-is-all-you-need-math.png",
      publishedAt: new Date("2026-03-01"),
      isPublished: true,
      readTimeMinutes: 9,
      viewCount: 5230,
      featured: true,
    },
    {
      slug: "gradient-descent-geometry",
      title: "The Geometry of Gradient Descent: Curvature, Saddle Points, and Loss Landscapes",
      subtitle: "Why optimization in deep learning is a geometric problem",
      excerpt: "Gradient descent navigates high-dimensional loss landscapes shaped by curvature and saddle points. We explore the Riemannian geometry underlying modern optimization in neural networks.",
      category: "ai-ml" as const,
      tags: ["optimization", "geometry", "deep-learning", "riemannian"],
      authorId: akhilesh.id,
      coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/gradient-descent-geometry.png",
      publishedAt: new Date("2026-02-10"),
      isPublished: true,
      readTimeMinutes: 10,
      viewCount: 3870,
      featured: false,
    },
    // History (2)
    {
      slug: "ramanujan-infinite-series",
      title: "Ramanujan's Infinite Series for 1/π: Genius Without Proof",
      subtitle: "The extraordinary formulas that arrived in letters from Madras",
      excerpt: "Srinivasa Ramanujan produced formulas for 1/π of staggering complexity and beauty — with no formal proofs. We trace the story of his correspondence with Hardy and examine the mathematics behind his most famous series.",
      category: "history" as const,
      tags: ["ramanujan", "pi", "infinite-series", "number-theory"],
      authorId: akhilesh.id,
      coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/ramanujan-infinite-series.png",
      publishedAt: new Date("2026-02-01"),
      isPublished: true,
      readTimeMinutes: 7,
      viewCount: 4100,
      featured: true,
    },
    {
      slug: "women-in-mathematics-noether",
      title: "Emmy Noether and the Theorem That Changed Physics",
      subtitle: "How an algebraist revealed the deepest structure of physical law",
      excerpt: "Emmy Noether's theorem connects symmetries to conservation laws, uniting mathematics and physics in a profound way. We trace her extraordinary contributions and the obstacles she overcame.",
      category: "history" as const,
      tags: ["noether", "symmetry", "algebra", "physics"],
      authorId: akhilesh.id,
      coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/women-in-mathematics-noether.png",
      publishedAt: new Date("2025-11-20"),
      isPublished: true,
      readTimeMinutes: 8,
      viewCount: 2780,
      featured: false,
    },
    // Research (2)
    {
      slug: "riemann-hypothesis-2026-status-report",
      title: "The Riemann Hypothesis: A 2026 Status Report",
      subtitle: "The greatest unsolved problem in mathematics",
      excerpt: "The Riemann Hypothesis, proposed in 1859, remains unproven. We survey recent progress, computational verification to trillions of zeros, and why this conjecture matters for the distribution of prime numbers.",
      category: "research" as const,
      tags: ["riemann", "prime-numbers", "number-theory", "millennium-problems"],
      authorId: akhilesh.id,
      coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/riemann-hypothesis-2026-status-report?updatedAt=1773645862642",
      publishedAt: new Date("2026-03-05"),
      isPublished: true,
      readTimeMinutes: 11,
      viewCount: 6200,
      featured: false,
    },
    {
      slug: "topological-data-analysis",
      title: "Topological Data Analysis: Finding Shape in Data",
      subtitle: "Persistent homology and the topology of point clouds",
      excerpt: "Topological data analysis uses algebraic topology to extract structural features from complex datasets. We explain persistent homology, Betti numbers, and how topology reveals hidden patterns in high-dimensional data.",
      category: "research" as const,
      tags: ["topology", "data-analysis", "homology", "applied-math"],
      authorId: akhilesh.id,
      coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/topological-data-analysis.png",
      publishedAt: new Date("2026-01-15"),
      isPublished: true,
      readTimeMinutes: 8,
      viewCount: 1920,
      featured: false,
    },
    // Extra articles for variety
    {
      slug: "cryptography-elliptic-curves",
      title: "Elliptic Curve Cryptography: The Mathematics Protecting the Internet",
      subtitle: "Why your online banking depends on abstract algebra",
      excerpt: "Elliptic curve cryptography provides the strongest security per bit of any known public-key system. We explore the algebraic geometry that makes modern encryption possible.",
      category: "applied" as const,
      tags: ["cryptography", "elliptic-curves", "algebra", "security"],
      authorId: akhilesh.id,
      coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/cryptography-elliptic-curves.png",
      publishedAt: new Date("2025-12-01"),
      isPublished: true,
      readTimeMinutes: 9,
      viewCount: 3450,
      featured: false,
    },
    {
      slug: "information-geometry-neural-networks",
      title: "Information Geometry and Neural Networks",
      subtitle: "The Riemannian manifold of probability distributions",
      excerpt: "Information geometry equips the space of probability distributions with a Riemannian metric — the Fisher information. We explore how this framework illuminates learning dynamics in neural networks.",
      category: "ai-ml" as const,
      tags: ["information-geometry", "fisher-metric", "neural-networks", "riemannian"],
      authorId: akhilesh.id,
      coverImageUrl: "https://ik.imagekit.io/netrv2whci/mathlumen/article-covers/information-geometry-neural-networks.png",
      publishedAt: new Date("2025-11-05"),
      isPublished: true,
      readTimeMinutes: 10,
      viewCount: 2100,
      featured: false,
    },
  ];

  const insertedArticles = await db.insert(articles).values(articleData).returning();
  console.log(`  Created ${insertedArticles.length} articles`);

  // ─── Article-Tag Junction ───────────────────────────────────────────
  console.log("Linking articles to tags...");

  const articleTagLinks: { articleId: string; tagId: string }[] = [];

  for (const article of insertedArticles) {
    const articleInput = articleData.find((a) => a.slug === article.slug);
    if (!articleInput) continue;

    // Map article tags to tag IDs where they exist in our tags table
    const tagSlugs: Record<string, string> = {
      "complex-analysis": "complex-analysis",
      "euler": "complex-analysis",
      "beauty": "mathematical-beauty",
      "constants": "number-theory",
      "fourier": "numerical-analysis",
      "harmony": "history-of-mathematics",
      "spectral-methods": "numerical-analysis",
      "pde": "numerical-analysis",
      "numerical-analysis": "numerical-analysis",
      "transformers": "deep-learning",
      "attention": "deep-learning",
      "linear-algebra": "linear-algebra",
      "deep-learning": "deep-learning",
      "optimization": "deep-learning",
      "geometry": "topology",
      "riemannian": "topology",
      "ramanujan": "number-theory",
      "pi": "number-theory",
      "infinite-series": "number-theory",
      "number-theory": "number-theory",
      "noether": "history-of-mathematics",
      "symmetry": "history-of-mathematics",
      "algebra": "linear-algebra",
      "physics": "numerical-analysis",
      "riemann": "number-theory",
      "prime-numbers": "number-theory",
      "millennium-problems": "number-theory",
      "topology": "topology",
      "data-analysis": "topology",
      "homology": "topology",
      "applied-math": "numerical-analysis",
      "monte-carlo": "numerical-analysis",
      "probability": "number-theory",
      "finance": "numerical-analysis",
      "stochastic": "numerical-analysis",
      "cryptography": "number-theory",
      "elliptic-curves": "number-theory",
      "security": "linear-algebra",
      "information-geometry": "topology",
      "fisher-metric": "topology",
      "neural-networks": "deep-learning",
    };

    const linkedTagIds = new Set<string>();
    for (const tag of articleInput.tags) {
      const mappedSlug = tagSlugs[tag];
      if (mappedSlug) {
        const tagId = tagMap.get(mappedSlug);
        if (tagId && !linkedTagIds.has(tagId)) {
          linkedTagIds.add(tagId);
          articleTagLinks.push({ articleId: article.id, tagId });
        }
      }
    }
  }

  if (articleTagLinks.length > 0) {
    await db.insert(articleTags).values(articleTagLinks);
  }
  console.log(`  Created ${articleTagLinks.length} article-tag links`);

  // ─── Summary ────────────────────────────────────────────────────────
  console.log("\nSeed complete!");
  console.log(`  Authors:      1`);
  console.log(`  Tags:         ${insertedTags.length}`);
  console.log(`  Articles:     ${insertedArticles.length}`);
  console.log(`  Tag links:    ${articleTagLinks.length}`);
  console.log(`  Featured:     ${articleData.filter((a) => a.featured).length}`);

  await client.end();
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
