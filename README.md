# MathLumen

![CI](https://github.com/YOUR_USERNAME/mathlumen/actions/workflows/ci.yml/badge.svg)

Illuminating Mathematics — a research-grade mathematics publication covering
history, pure math, applied math, AI, and long-form essays.

Built with Next.js 16, Tailwind CSS v4, Drizzle ORM, and Supabase.

## Quick Start

1. Clone the repo: `git clone https://github.com/your-username/mathlumen.git`
2. Install dependencies: `pnpm install`
3. Copy environment variables: `cp .env.example .env`
4. Fill in your Supabase credentials in `.env`
5. Run database migration: paste `drizzle/0000_initial.sql` in Supabase SQL Editor
6. Seed the database: `pnpm run seed`
7. Start dev server: `pnpm run dev`
8. Open http://localhost:3000

## Tech Stack

- **Framework:** Next.js 16.1 (App Router, webpack)
- **Styling:** Tailwind CSS v4 (CSS-native config)
- **Database:** Supabase (PostgreSQL) + Drizzle ORM
- **Content:** MDX files with LaTeX (KaTeX) + syntax highlighting
- **Images:** ImageKit CDN
- **Deployment:** Vercel

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server (webpack) |
| `pnpm run build` | Production build |
| `pnpm run start` | Start production server |
| `pnpm run check-types` | TypeScript type checking |
| `pnpm run seed` | Seed database with articles and author |

## Project Structure

```
src/
  app/           # Next.js App Router pages
  components/    # React components (ui/, article/, layout/, forms/, brand/, seo/)
  lib/           # Utilities, queries, metadata, MDX pipeline
  schema/        # Drizzle schema, types, validators
  actions/       # Server actions (subscribe, search, view-count)
  styles/        # Tailwind v4 globals.css
content/
  articles/      # MDX article files
seed/            # Database seed script
drizzle/         # SQL migrations
```

## Adding New Articles

1. Create `content/articles/your-slug.mdx` with frontmatter
2. Run `pnpm run seed` (or insert directly into the database)
3. Commit and push — Vercel auto-deploys

## Key URLs

| URL | Description |
|-----|-------------|
| `/` | Homepage with featured articles |
| `/articles` | All articles |
| `/category/[cat]` | Category pages (history, research, applied, ai-ml, essay) |
| `/authors/akhilesh-yadav` | Author profile |
| `/api/rss` | RSS 2.0 feed |
| `/sitemap.xml` | XML sitemap |
| `/robots.txt` | Robots rules |

## License

MIT
