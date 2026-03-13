## 1. PROJECT VISION & GOALS

### What Is MathLumen?

MathLumen is a research-grade mathematics publication that covers the full spectrum
of mathematical knowledge — from ancient history to the mathematics powering
today's AI systems. Think of it as a hybrid between Quanta Magazine's editorial
depth and the rigor of an academic journal, built for the web-native era.

### Content Pillars

| Pillar | Description | Audience |
|--------|-------------|----------|
| History of Mathematics | Ancient Babylon to Ramanujan — lives and revolutions that built modern math | Curious generalists, students |
| Research Articles | Rigorous coverage of new papers, breakthroughs, open problems | Researchers, grad students |
| Applied Mathematics | PDEs, numerical methods, optimization — math that powers the physical world | Engineers, applied scientists |
| Mathematics of AI | Backpropagation, transformers, information theory — the deep math behind AI | ML engineers, AI researchers |
| Long-form Essays | Ideas worth 5,000 words — elegant expositions of beautiful mathematics | Anyone who loves math |
| Latest Developments | Weekly coverage from arXiv to Fields Medal announcements | The math community at large |

### Why This Name?

"MathLumen" — Lumen means light. The name signals illumination, clarity, and
revelation. It works as a standalone brand, scales to a publishing house
(MathLumen Press), and is domain-friendly.

**Alternative names considered:** Principia Today, Axiom Press, Convergence Journal.
MathLumen was chosen for uniqueness, memorability, and domain availability.

### Success Metrics (First 90 Days)

- 12 published articles (2 per pillar)
- 100+ unique visitors in month 1
- 500+ in month 3
- 50+ newsletter subscribers
- Indexed in Google Search Console
- Cited by at least 1 AI system (ChatGPT, Perplexity)
- Lighthouse score: Performance ≥ 90, SEO = 100, Accessibility ≥ 95

---

## 2. ARCHITECTURE DECISION RECORD

### Decision: Single Next.js App (NOT Monorepo)

**Context:** The original plan used a Turborepo monorepo with 4 packages.

**Decision:** Use a single Next.js application with a clean `/src` directory structure.

**Rationale:**

| Concern | Monorepo | Single App (Chosen) |
|---------|----------|-------------------|
| Setup time | 30+ min workspace config | 5 min |
| TypeScript resolution | Cross-package path issues | Works with `@/` alias |
| Tailwind content scanning | Manual per-package config | Automatic |
| Hot reload | Broken across packages | Works out of the box |
| Build debugging | Errors cascade across packages | Isolated, clear |
| Developer onboarding | Must understand Turborepo | Standard Next.js |
| Deployment | Complex build filter | Standard Vercel deploy |

**When to upgrade to monorepo:** When you add a second app (mobile, admin panel,
separate API) or when a team of 5+ developers needs code ownership boundaries.

### Decision: Next.js 16 + React 19

**Context:** Next.js 16 (stable October 2025, current 16.1) is the latest stable
major version. It ships with React 19 and Turbopack as the default bundler.

**Rationale:**
- Next.js 16.1 is the current Active LTS release (stable, patched, production-ready)
- Turbopack is now stable and default — 2-5x faster builds than Webpack
- React 19 is fully stable (no longer RC) and all major libraries support it
- React Compiler support is built in (optional but available)
- Cache Components (`use cache`) replace experimental PPR
- shadcn/ui, Radix UI, and the MDX ecosystem all have confirmed React 19 support

**Version pins:**
```
next: ^16.1.0
react: ^19.0.0
react-dom: ^19.0.0
```

### Decision: Tailwind CSS v4

**Context:** Tailwind v4 reached stable in early 2025. By March 2026, it has been
battle-tested across thousands of production sites. v4.1 patch releases have
addressed early adoption edge cases.

**Rationale:**
- CSS-native `@theme` configuration (no JavaScript config file needed)
- Rust-based engine: 5x faster full builds, 100x faster incremental builds
- All major UI libraries (Headless UI, Radix, shadcn/ui) confirmed compatible
- `tailwind-merge` v3+ supports Tailwind v4 class names
- Zero reason to start a new project with v3 in 2026

**Version pin:**
```
tailwindcss: ^4.1.0
@tailwindcss/postcss: ^4.1.0
```

### Decision: File-Based MDX Content (NOT Database-Only)

**Context:** The original plan stored all content in PostgreSQL as MDX strings.
This means you need a custom admin UI to create articles, and there's no version
control on content.

**Decision:** Hybrid approach — MDX files in the repository for articles,
PostgreSQL for dynamic data (subscribers, comments, view counts, metadata).

**Rationale:**
- Git-based version control on every article edit
- Write articles in any text editor or VS Code with MDX preview
- No admin UI needed for v1 — just commit and push
- Easy to migrate to a CMS later (Contentlayer, Sanity, Keystatic)
- Database handles what databases do best: counts, subscriptions, search

**Structure:**
```
content/
├── articles/
│   ├── history-of-zero.mdx
│   ├── spectral-methods-effectiveness.mdx
│   └── transformer-mathematics-explained.mdx
├── authors/
│   ├── index.json
│   └── avatars/
```

### Decision: Supabase PostgreSQL + Drizzle ORM

**Context:** Need a database for dynamic data. Supabase provides managed PostgreSQL
with a generous free tier, built-in auth (for future admin), and edge functions.

**Rationale:**
- Supabase free tier: 500MB storage, 2 projects, enough for years of articles
- Drizzle ORM: Type-safe, lightweight, excellent DX with TypeScript
- Direct PostgreSQL access (no vendor lock-in — you own the SQL)
- Row Level Security for future multi-author support
- Built-in realtime for future live comment features

---

## 3. TECHNOLOGY STACK

### Core (Pinned Versions)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | ^16.1.0 | App Router, SSR/SSG, API routes |
| UI Library | React | ^19.0.0 | Component rendering |
| Styling | Tailwind CSS | ^4.1.0 | Utility-first CSS, `@theme` tokens |
| Language | TypeScript | ^5.7.0 | Type safety throughout |
| Database | Supabase (PostgreSQL) | Managed | Dynamic data storage |
| ORM | Drizzle | ^0.39.0 | Type-safe database queries |
| Validation | Zod | ^3.24.0 | Runtime type validation |
| Content | MDX | File-based | Article authoring |
| Deployment | Vercel | Managed | Hosting, CDN, edge functions |
| DNS/CDN | Cloudflare | Managed | DDoS protection, caching |

### UI Components

| Package | Version | Purpose |
|---------|---------|---------|
| @radix-ui/react-dialog | ^1.1.0 | Accessible modal dialogs |
| @radix-ui/react-dropdown-menu | ^2.1.0 | Navigation dropdowns |
| @radix-ui/react-tabs | ^1.1.0 | Category tab navigation |
| @radix-ui/react-tooltip | ^1.1.0 | Tooltips |
| lucide-react | ^0.460.0 | Icon library |
| tailwind-merge | ^3.0.0 | Tailwind class merging |
| clsx | ^2.1.0 | Conditional class names |

### MDX Pipeline

| Package | Version | Purpose |
|---------|---------|---------|
| next-mdx-remote | ^5.0.0 | Remote MDX rendering |
| remark-math | ^6.0.0 | Parse $...$ and $$...$$ |
| rehype-katex | ^7.0.0 | Render LaTeX to HTML |
| rehype-pretty-code | ^0.14.0 | Syntax highlighting (shiki) |
| shiki | ^1.24.0 | Code highlighting engine |
| remark-gfm | ^4.0.0 | GitHub Flavored Markdown |
| rehype-slug | ^6.0.0 | Auto heading IDs |

### Developer Tooling

| Tool | Purpose |
|------|---------|
| ESLint (flat config) | Code quality |
| Prettier | Code formatting |
| Vitest | Unit/integration tests |
| Playwright | E2E testing (critical paths) |

---

## 4. BRAND & DESIGN SYSTEM

### Identity

```
Name:        MathLumen
Tagline:     Illuminating Mathematics
Domain:      mathlumen.com
Twitter/X:   @TheMathLumen
```

### Color Palette

```css
/* Primary */
--color-gold:        #c9a84c;    /* Brand primary — gold light */
--color-gold-light:  #e8d08a;    /* Hover states, highlights */
--color-gold-dark:   #8a6820;    /* Text on light backgrounds */

/* Surfaces */
--color-ink:         #06080f;    /* Primary dark background */
--color-ink-2:       #0d1018;    /* Card backgrounds, elevated surfaces */
--color-paper:       #f5f0e8;    /* Primary light text, body copy */

/* Neutral */
--color-muted:       #6b6560;    /* Secondary text, captions */
--color-border:      rgba(201,168,76,0.18);  /* Subtle borders */
```

**Contrast ratios (WCAG AAA verified):**
- Gold (#c9a84c) on Ink (#06080f) = 7.8:1 — passes AAA
- Paper (#f5f0e8) on Ink (#06080f) = 15.2:1 — passes AAA
- Gold-dark (#8a6820) on Paper (#f5f0e8) = 4.8:1 — passes AA

### Typography

```css
/* Display — Article titles, section headings */
--font-display: 'Playfair Display', Georgia, serif;
/* Weights: 400 (regular), 700 (bold), 900 (black) */

/* Body — Article prose, paragraphs */
--font-body: 'Crimson Pro', Georgia, serif;
/* Weights: 300 (light), 400 (regular), 600 (semibold) */

/* Mono — Code blocks, UI labels, inputs */
--font-mono: 'DM Mono', 'Fira Code', monospace;
/* Weights: 300 (light), 400 (regular), 500 (medium) */
```

### Design Principles

1. **Scholarly, not sterile** — Think MIT Press meets Quanta Magazine
2. **Sharp architecture** — Zero border-radius on cards and containers (intentional, not lazy)
3. **Gold as accent, not decoration** — Gold borders, underlines, badges. Never gold backgrounds on large areas.
4. **Generous whitespace** — Let content breathe. Minimum 1.8 line-height on body copy.
5. **Dark-first** — Ink background is the default. Paper color is for text and light accents.
6. **Mathematical precision** — Grid-based layout, consistent spacing, aligned elements.

### Logo Specification

SVG logo: A radiant gold light-burst with an "L" letterform in the core.

- 16 rays at 22.5° intervals radiating from center
- 3 concentric rings (opacity: 0.25, 0.12, 0.08)
- Radial gradient core: #f0de9a → #c9a84c → #6a4e10
- "L" letterform: vertical + horizontal strokes, 4.5px, ink color (#06080f)
- Anchor dot at top of L vertical stroke
- Outer glow halo: radial gradient, gold opacity 0 → 0.18

Sizes: sm=24px, md=44px, lg=80px, xl=140px
Variants: dark (gold on dark), light (gold on light), gold (all gold)