"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { createScrollSyncHandlers } from "@/lib/mltex/scroll-sync";
import { exportToPdf } from "@/lib/mltex/export-pdf";

/* ═══════════════════════════════════════════════════════════════════════
   MATHJAX TYPES
   ═══════════════════════════════════════════════════════════════════════ */

interface MathJaxInstance {
  typesetPromise: (elements?: (HTMLElement | null)[]) => Promise<void>;
  typesetClear: (elements?: (HTMLElement | null)[]) => void;
  startup?: { promise: Promise<void> };
}

/* ═══════════════════════════════════════════════════════════════════════
   SCOPED CSS
   ═══════════════════════════════════════════════════════════════════════ */

const EDITOR_STYLES = `
/* ── MathJax inline fix ───────────────────────────────────────────── */
.mltex-preview mjx-container:not([display]),
.mltex-preview mjx-container:not([display="true"]) {
  display: inline !important;
  white-space: normal !important;
  margin: 0 1px !important;
  padding: 0 !important;
}
.mltex-preview mjx-container:not([display]) > svg,
.mltex-preview mjx-container:not([display="true"]) > svg {
  display: inline !important;
  vertical-align: -0.25ex !important;
  overflow: visible !important;
}

/* ── MathJax display math ─────────────────────────────────────────── */
.mltex-preview mjx-container[display="true"],
.mltex-preview mjx-container[display] {
  display: block !important;
  margin: 1.2em 0 !important;
  text-align: center !important;
  overflow-x: auto;
}
.mltex-preview mjx-container[display="true"] > svg,
.mltex-preview mjx-container[display] > svg {
  display: inline-block !important;
}

/* ── Content blocks ───────────────────────────────────────────────── */
.mltex-block {
  margin-bottom: 0.75em;
  white-space: normal;
  line-height: 1.8;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.mltex-block:last-child { margin-bottom: 0; }

.mltex-heading {
  font-family: var(--font-display);
  font-weight: 700;
  margin: 1.2em 0 0.5em 0;
  line-height: 1.3;
}
.mltex-heading:first-child { margin-top: 0; }

[data-mltex-theme="dark"] .mltex-heading { color: var(--color-gold-light); }
[data-mltex-theme="light"] .mltex-heading { color: #2a2520; }

.mltex-h1 { font-size: 1.75em; border-bottom: 1px solid color-mix(in srgb, var(--color-gold) 30%, transparent); padding-bottom: 0.3em; }
.mltex-h2 { font-size: 1.4em; }
.mltex-h3 { font-size: 1.15em; }
.mltex-h4, .mltex-h5, .mltex-h6 { font-size: 1em; }

.mltex-list {
  margin: 0.5em 0 0.75em 0;
  padding-left: 1.5em;
  line-height: 1.7;
}
.mltex-list li { margin-bottom: 0.25em; }
.mltex-list li::marker { color: var(--color-gold); }

.mltex-hr {
  border: none;
  border-top: 1px solid color-mix(in srgb, var(--color-gold) 25%, transparent);
  margin: 1.5em 0;
}

.mltex-blockquote {
  border-left: 3px solid var(--color-gold);
  padding-left: 1em;
  margin: 0.75em 0;
  font-style: italic;
  opacity: 0.85;
}

/* ── Draggable split handle ───────────────────────────────────────── */
@media (min-width: 1024px) {
  .mltex-split > .mltex-editor-pane {
    flex: 0 0 var(--split-pos) !important;
    max-width: var(--split-pos) !important;
    min-width: 0;
  }
  .mltex-split > .mltex-preview-pane {
    flex: 1 1 0% !important;
    min-width: 0;
  }
}

/* ── Light theme SVG color ────────────────────────────────────────── */
[data-mltex-theme="light"] mjx-container svg {
  color: #1e1e2e !important;
}
`;

/* ═══════════════════════════════════════════════════════════════════════
   TEMPLATES
   ═══════════════════════════════════════════════════════════════════════ */

const TEMPLATES = [
  {
    name: "Euler's Identity",
    code: "## Euler's Identity\n\nThe most beautiful equation connects five constants: $e$, $i$, $\\pi$, $1$, and $0$.\n\n$$e^{i\\pi} + 1 = 0$$",
  },
  {
    name: "Quadratic Formula",
    code: "## Quadratic Formula\n\nThe roots of $ax^2 + bx + c = 0$:\n\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$",
  },
  {
    name: "Matrix & Determinant",
    code: "## Matrix\n\nA $2 \\times 2$ matrix and its determinant:\n\n$$A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}, \\quad \\det(A) = ad - bc$$\n\nThe identity matrix:\n\n$$I = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}$$",
  },
  {
    name: "Calculus",
    code: "## Fundamental Theorem of Calculus\n\nIf $F$ is an antiderivative of $f$ on $[a, b]$, then:\n\n$$\\int_a^b f(x) \\, dx = F(b) - F(a)$$\n\nThe Gaussian integral:\n\n$$\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}$$",
  },
  {
    name: "Taylor Series",
    code: "## Taylor Expansion\n\nThe Taylor expansion of $f(x)$ around $a$:\n\n$$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x - a)^n$$\n\nFor $e^x$ around $0$:\n\n$$e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots$$",
  },
  {
    name: "Linear Algebra",
    code: "## Eigenvalue Problem\n\nFor a matrix $A$ and eigenvalue $\\lambda$:\n\n$$A\\mathbf{v} = \\lambda \\mathbf{v}$$\n\n$$\\det(A - \\lambda I) = 0$$\n\nThe matrix exponential:\n\n$$e^{At} = \\sum_{k=0}^{\\infty} \\frac{(At)^k}{k!}$$",
  },
  {
    name: "Maxwell's Equations",
    code: "## Maxwell's Equations\n\nThe four equations of electromagnetism:\n\n$$\\begin{aligned}\n\\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\epsilon_0} \\\\\n\\nabla \\cdot \\mathbf{B} &= 0 \\\\\n\\nabla \\times \\mathbf{E} &= -\\frac{\\partial \\mathbf{B}}{\\partial t} \\\\\n\\nabla \\times \\mathbf{B} &= \\mu_0 \\mathbf{J} + \\mu_0 \\epsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}\n\\end{aligned}$$",
  },
  {
    name: "Probability & Statistics",
    code: "## Bayes' Theorem\n\n$$P(A \\mid B) = \\frac{P(B \\mid A) \\, P(A)}{P(B)}$$\n\nThe normal distribution with mean $\\mu$ and variance $\\sigma^2$:\n\n$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)$$",
  },
];

const DEFAULT_CONTENT = `# MLTeX Editor

Write LaTeX with real-time preview. Supports inline math, display equations, matrices, and more.

## Inline Math

Euler's identity connects five constants: $e$, $i$, $\\pi$, $1$, and $0$ in one elegant equation: $e^{i\\pi} + 1 = 0$.

## Display Equations

The quadratic formula gives roots of $ax^2 + bx + c = 0$:

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

## Matrices

$$A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}, \\quad \\det(A) = -2$$

## Eigenvalues

For eigenvalue $\\lambda$ of matrix $A$:

$$\\det(A - \\lambda I) = 0$$

## Aligned Equations

$$\\begin{aligned}
\\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\epsilon_0} \\\\
\\nabla \\times \\mathbf{B} &= \\mu_0 \\mathbf{J} + \\mu_0 \\epsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}
\\end{aligned}$$`;

/* ═══════════════════════════════════════════════════════════════════════
   CONTENT RENDERER — Markdown headings + LaTeX-safe HTML
   Protects math regions, applies Markdown structure, then restores math.
   ═══════════════════════════════════════════════════════════════════════ */

function escapeHtmlChars(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderContent(text: string): string {
  if (!text.trim()) return "";

  // Step 1 — Protect math regions with placeholders
  const mathStore: string[] = [];
  let safe = text;

  // Display math: $$...$$
  safe = safe.replace(/\$\$[\s\S]*?\$\$/g, (m) => {
    mathStore.push(m);
    return `\x00M${mathStore.length - 1}\x00`;
  });
  // Display math: \[...\]
  safe = safe.replace(/\\\[[\s\S]*?\\\]/g, (m) => {
    mathStore.push(m);
    return `\x00M${mathStore.length - 1}\x00`;
  });
  // Environments: \begin{...}...\end{...}
  safe = safe.replace(/\\begin\{([^}]+)\}[\s\S]*?\\end\{\1\}/g, (m) => {
    mathStore.push(m);
    return `\x00M${mathStore.length - 1}\x00`;
  });
  // Inline math: \(...\)
  safe = safe.replace(/\\\([\s\S]*?\\\)/g, (m) => {
    mathStore.push(m);
    return `\x00M${mathStore.length - 1}\x00`;
  });
  // Inline math: $...$  (non-greedy, single line)
  safe = safe.replace(/\$([^\n$]+?)\$/g, (m) => {
    mathStore.push(m);
    return `\x00M${mathStore.length - 1}\x00`;
  });

  // Step 2 — Split into blocks by double newline
  const blocks = safe.split(/\n{2,}/);
  const htmlBlocks = blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";

    // Horizontal rule
    if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
      return '<hr class="mltex-hr">';
    }

    // Heading: # ... through ######
    const hMatch = trimmed.match(/^(#{1,6})\s+(.+)$/m);
    if (hMatch) {
      const lvl = hMatch[1].length;
      return `<h${lvl} class="mltex-heading mltex-h${lvl}">${escapeHtmlChars(hMatch[2])}</h${lvl}>`;
    }

    // Blockquote: > ...
    if (trimmed.startsWith("> ")) {
      const inner = trimmed
        .split("\n")
        .map((l) => escapeHtmlChars(l.replace(/^>\s?/, "")))
        .join("<br>");
      return `<div class="mltex-blockquote">${inner}</div>`;
    }

    // Unordered list: lines starting with - or *
    if (/^[-*]\s/.test(trimmed)) {
      const items = trimmed
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => `<li>${escapeHtmlChars(l.replace(/^[-*]\s+/, ""))}</li>`)
        .join("");
      return `<ul class="mltex-list">${items}</ul>`;
    }

    // Ordered list: lines starting with 1. 2. etc
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => `<li>${escapeHtmlChars(l.replace(/^\d+\.\s+/, ""))}</li>`)
        .join("");
      return `<ol class="mltex-list">${items}</ol>`;
    }

    // Regular paragraph — single \n → <br>
    const lines = trimmed.split("\n").map((l) => escapeHtmlChars(l)).join("<br>");
    return `<div class="mltex-block">${lines}</div>`;
  });

  let html = htmlBlocks.join("");

  // Step 3 — Restore math regions (HTML-escaped for safe innerHTML)
  html = html.replace(/\x00M(\d+)\x00/g, (_, idx) => {
    return escapeHtmlChars(mathStore[parseInt(idx)]);
  });

  return html;
}

/* ═══════════════════════════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════════════════════════ */

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m11.25-5.25v4.5m0-4.5h-4.5m4.5 0L15 9m-11.25 11.25v-4.5m0 4.5h4.5m-4.5 0L9 15m11.25 5.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
    </svg>
  );
}

function ShrinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function FileDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   TOOLBAR BUTTON
   ═══════════════════════════════════════════════════════════════════════ */

function ToolbarButton({
  onClick,
  children,
  title,
  isDark,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  isDark: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono border transition-colors duration-200",
        isDark
          ? "text-muted hover:text-paper border-gold/10 hover:border-gold/30 bg-ink hover:bg-gold/[0.03]"
          : "text-[#6b6560] hover:text-[#1a1a2e] border-[#ddd8ce] hover:border-gold/40 bg-white hover:bg-[#f5f3ee]"
      )}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SYMBOL GROUPS — for the collapsible Math Toolbar (Feature A)
   ═══════════════════════════════════════════════════════════════════════ */

interface SymbolItem { display: string; insert: string }
interface SymbolGroup { label: string; symbols: SymbolItem[] }

const SYMBOL_GROUPS: SymbolGroup[] = [
  {
    label: "Greek",
    symbols: [
      { display: "α", insert: "\\alpha" },
      { display: "β", insert: "\\beta" },
      { display: "γ", insert: "\\gamma" },
      { display: "δ", insert: "\\delta" },
      { display: "θ", insert: "\\theta" },
      { display: "λ", insert: "\\lambda" },
      { display: "μ", insert: "\\mu" },
      { display: "π", insert: "\\pi" },
      { display: "σ", insert: "\\sigma" },
      { display: "φ", insert: "\\phi" },
      { display: "ψ", insert: "\\psi" },
      { display: "ω", insert: "\\omega" },
      { display: "Σ", insert: "\\Sigma" },
      { display: "Δ", insert: "\\Delta" },
      { display: "Ω", insert: "\\Omega" },
    ],
  },
  {
    label: "Ops",
    symbols: [
      { display: "∫", insert: "\\int_{}^{}" },
      { display: "∬", insert: "\\iint" },
      { display: "∑", insert: "\\sum_{n=0}^{\\infty}" },
      { display: "∏", insert: "\\prod_{}^{}" },
      { display: "√", insert: "\\sqrt{}" },
      { display: "∂", insert: "\\partial" },
      { display: "∇", insert: "\\nabla" },
      { display: "lim", insert: "\\lim_{x \\to \\infty}" },
      { display: "→", insert: "\\to" },
      { display: "⇒", insert: "\\Rightarrow" },
      { display: "∞", insert: "\\infty" },
    ],
  },
  {
    label: "Struct",
    symbols: [
      { display: "frac", insert: "\\frac{}{}" },
      { display: "^{}", insert: "^{}" },
      { display: "_{}", insert: "_{}" },
      { display: "\\mathbf", insert: "\\mathbf{}" },
      { display: "\\mathcal", insert: "\\mathcal{}" },
      { display: "\\mathbb", insert: "\\mathbb{R}" },
      { display: "align", insert: "\\begin{aligned}\n  \n\\end{aligned}" },
      { display: "cases", insert: "\\begin{cases}\n  \n\\end{cases}" },
      { display: "matrix", insert: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}" },
      { display: "pmatrix", insert: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
    ],
  },
  {
    label: "Common",
    symbols: [
      { display: "$$ block", insert: "$$\n\n$$" },
      { display: "$ inline", insert: "$ $" },
      { display: "≤", insert: "\\leq" },
      { display: "≥", insert: "\\geq" },
      { display: "≠", insert: "\\neq" },
      { display: "≈", insert: "\\approx" },
      { display: "∈", insert: "\\in" },
      { display: "∉", insert: "\\notin" },
      { display: "⊂", insert: "\\subset" },
      { display: "∩", insert: "\\cap" },
      { display: "∪", insert: "\\cup" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   MAIN EDITOR COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export function MltexEditor() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [mathJaxReady, setMathJaxReady] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [splitPos, setSplitPos] = useState(50);
  const previewRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Feature A — Symbol bar
  const [showSymbols, setShowSymbols] = useState(false);

  // Feature 1 — Scroll sync
  const [syncEnabled, setSyncEnabled] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      return localStorage.getItem("mathlumen-mltex-sync-scroll") === "true";
    } catch {
      return false;
    }
  });

  // Feature 2 — PDF export
  const [exportState, setExportState] = useState<"idle" | "exporting" | "error">("idle");

  // Feature B — Search & Replace
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const matchCount = useMemo(() => {
    if (!searchTerm) {
      return 0;
    }

    return content.split(searchTerm).length - 1;
  }, [content, searchTerm]);

  // Feature C — IndexedDB save status
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const lastSaveRef = useRef<number>(0);

  const isDark = theme === "dark";

  /* ─── Load MathJax ──────────────────────────────────────────────────── */

  useEffect(() => {
    if (typeof window === "undefined") return;

    (window as unknown as Record<string, unknown>).MathJax = {
      tex: {
        inlineMath: [["$", "$"], ["\\(", "\\)"]],
        displayMath: [["$$", "$$"], ["\\[", "\\]"]],
        processEscapes: true,
        processEnvironments: true,
        tags: "ams",
        packages: { "[+]": ["ams", "noerrors", "noundefined", "boldsymbol", "newcommand"] },
      },
      svg: { fontCache: "global" },
      startup: { typeset: false },
    };

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
    script.async = true;
    script.id = "mathjax-script";
    script.onload = () => {
      const mjx = (window as unknown as Record<string, unknown>).MathJax as MathJaxInstance | undefined;
      if (mjx?.startup?.promise) {
        mjx.startup.promise.then(() => setMathJaxReady(true));
      } else {
        setMathJaxReady(true);
      }
    };
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("mathjax-script");
      if (existing) existing.remove();
    };
  }, []);

  /* ─── Render preview (debounced) ────────────────────────────────────── */

  useEffect(() => {
    if (!mathJaxReady || !previewRef.current) return;

    const timer = setTimeout(() => {
      const el = previewRef.current;
      if (!el) return;

      const mjx = (window as unknown as Record<string, unknown>).MathJax as MathJaxInstance;
      mjx.typesetClear([el]);
      el.innerHTML = renderContent(content);
      mjx.typesetPromise([el]).catch(() => {});
    }, 250);

    return () => clearTimeout(timer);
  }, [content, mathJaxReady]);

  /* ─── Draggable split pane ──────────────────────────────────────────── */

  const onDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const ratio = ((clientX - rect.left) / rect.width) * 100;
      setSplitPos(Math.max(20, Math.min(80, ratio)));
    };

    const onEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };
  }, []);

  /* ─── Actions ───────────────────────────────────────────────────────── */

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  const handleClear = useCallback(() => {
    setContent("");
    textareaRef.current?.focus();
  }, []);

  const handleTemplate = useCallback((code: string) => {
    setContent(code);
    setShowTemplates(false);
    textareaRef.current?.focus();
  }, []);

  const toggleFullscreen = useCallback(() => setFullscreen((p) => !p), []);
  const toggleTheme = useCallback(() => setTheme((p) => (p === "dark" ? "light" : "dark")), []);

  /* ─── Feature A: insert snippet at cursor ───────────────────────────── */

  const insertAtCursor = useCallback((snippet: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newContent = content.slice(0, start) + snippet + content.slice(end);
    setContent(newContent);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = start + snippet.length;
      ta.selectionEnd = start + snippet.length;
    });
  }, [content]);

  /* ─── Feature B: replace handlers ───────────────────────────────────── */

  const handleReplaceFirst = useCallback(() => {
    if (!searchTerm) return;
    setContent(content.replace(searchTerm, replaceTerm));
  }, [content, searchTerm, replaceTerm]);

  const handleReplaceAll = useCallback(() => {
    if (!searchTerm) return;
    setContent(content.replaceAll(searchTerm, replaceTerm));
  }, [content, searchTerm, replaceTerm]);

  /* ─── Tab key ───────────────────────────────────────────────────────── */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        setContent(content.slice(0, start) + "  " + content.slice(end));
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
    },
    [content]
  );

  /* ─── Close dropdown on outside click ───────────────────────────────── */

  useEffect(() => {
    if (!showTemplates) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowTemplates(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showTemplates]);

  /* ─── Global keyboard shortcuts (Escape + Ctrl/Cmd+H) ───────────────── */

  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (showSearch) { setShowSearch(false); return; }
        if (fullscreen) setFullscreen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        setShowSearch((p) => !p);
      }
    }
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, [fullscreen, showSearch]);

  /* ─── Feature B: match count ─────────────────────────────────────────── */

  /* ─── Feature C: IndexedDB helpers ──────────────────────────────────── */

  const DB_NAME = "MLTeXDB";
  const STORE = "documents";
  const DOC_KEY = "mltex_v1";

  const openDB = (): Promise<IDBDatabase> =>
    new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE))
          db.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

  const saveDoc = useCallback(async (text: string) => {
    try {
      setSaveStatus("saving");
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(text, DOC_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      lastSaveRef.current = Date.now();
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }, []);

  const loadDoc = useCallback(async (): Promise<string | null> => {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const req = db
          .transaction(STORE, "readonly")
          .objectStore(STORE)
          .get(DOC_KEY);
        req.onsuccess = () => resolve((req.result as string | undefined) ?? null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }, []);

  /* ─── Feature C: load on mount ───────────────────────────────────────── */

  useEffect(() => {
    loadDoc().then((saved) => {
      if (saved !== null) setContent(saved);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Feature C: debounced auto-save (1500ms) ────────────────────────── */

  useEffect(() => {
    const timer = setTimeout(() => saveDoc(content), 1500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  /* ─── Feature C: interval auto-save backup (5s) ─────────────────────── */

  useEffect(() => {
    const interval = setInterval(() => saveDoc(content), 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  /* ─── Feature 1: load scroll sync preference from localStorage ───────── */

  /* ─── Feature 1: scroll sync listeners ──────────────────────────────── */

  useEffect(() => {
    if (!syncEnabled) return;
    const write = textareaRef.current;
    const preview = previewRef.current;
    if (!write || !preview) return;

    const { syncFromWrite, syncFromPreview } = createScrollSyncHandlers({
      writeRef: textareaRef as React.RefObject<HTMLElement>,
      previewRef: previewRef as React.RefObject<HTMLElement>,
    });

    write.addEventListener("scroll", syncFromWrite, { passive: true });
    preview.addEventListener("scroll", syncFromPreview, { passive: true });

    return () => {
      write.removeEventListener("scroll", syncFromWrite);
      preview.removeEventListener("scroll", syncFromPreview);
    };
  }, [syncEnabled]);

  /* ─── Feature 1: toggle sync + persist ──────────────────────────────── */

  const toggleSync = useCallback(() => {
    setSyncEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("mathlumen-mltex-sync-scroll", String(next));
      } catch {}
      return next;
    });
  }, []);

  /* ─── Feature 2: export PDF ──────────────────────────────────────────── */

  const handleExportPdf = useCallback(async () => {
    if (!previewRef.current || exportState === "exporting") return;
    setExportState("exporting");
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      await exportToPdf(previewRef.current, `mltex-export-${timestamp}`);
      setExportState("idle");
    } catch {
      setExportState("error");
      setTimeout(() => setExportState("idle"), 3000);
    }
  }, [exportState]);

  /* ─── Theme tokens ──────────────────────────────────────────────────── */

  const panelBg = isDark ? "bg-ink" : "bg-white";
  const panelText = isDark ? "text-paper" : "text-[#1e1e2e]";
  const chromeBg = isDark ? "bg-ink-2" : "bg-[#f5f3ee]";
  const chromeBorder = isDark ? "border-gold/[0.18]" : "border-[#ddd8ce]";
  const chromeText = isDark ? "text-muted/60" : "text-[#8a8580]";
  const labelBorder = isDark ? "border-gold/10" : "border-[#e8e5de]";
  const splitBorder = isDark ? "border-gold/[0.18]" : "border-[#ddd8ce]";
  const dropdownBg = isDark ? "bg-ink-2 border-gold/[0.18]" : "bg-white border-[#ddd8ce]";
  const dropdownItem = isDark
    ? "text-paper/70 hover:text-paper hover:bg-gold/[0.05] border-gold/5"
    : "text-[#4a4540] hover:text-[#1a1a2e] hover:bg-[#f5f3ee] border-[#f0ede6]";
  const templateBtn = isDark
    ? "text-muted hover:text-paper border-gold/10 hover:border-gold/30"
    : "text-[#6b6560] hover:text-[#1a1a2e] border-[#ddd8ce] hover:border-gold/40";
  const dividerColor = isDark ? "bg-gold/20 group-hover:bg-gold/50" : "bg-[#ccc5b8] group-hover:bg-gold";

  /* ─── Render ────────────────────────────────────────────────────────── */

  return (
    <div
      data-mltex-theme={theme}
      className={cn(
        "flex flex-col",
        fullscreen ? "fixed inset-0 z-[100]" : "min-h-[calc(100vh-6.5rem)]",
        panelBg
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: EDITOR_STYLES }} />

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div className={cn("flex items-center justify-between px-3 sm:px-4 h-12 border-b shrink-0", panelBg, chromeBorder)}>
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-gold text-sm tracking-wide select-none">
            ML<span className={panelText}>T</span><span className="text-gold-light">e</span>X
          </span>

          <div className={cn("h-4 w-px", isDark ? "bg-gold/20" : "bg-[#ddd8ce]")} />

          {/* Templates */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className={cn("flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono border transition-colors duration-200", templateBtn)}
            >
              Templates
              <ChevronIcon className={cn("w-3 h-3 transition-transform duration-200", showTemplates && "rotate-180")} />
            </button>

            {showTemplates && (
              <div className={cn("absolute top-full left-0 mt-1 w-56 border shadow-xl z-50 max-h-80 overflow-y-auto", dropdownBg)}>
                {TEMPLATES.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => handleTemplate(t.code)}
                    className={cn("block w-full text-left px-4 py-2.5 text-sm font-body transition-colors duration-200 border-b last:border-b-0", dropdownItem)}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <ToolbarButton onClick={toggleTheme} title={isDark ? "Light mode" : "Dark mode"} isDark={isDark}>
            {isDark ? <SunIcon className="w-3.5 h-3.5" /> : <MoonIcon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
          </ToolbarButton>

          <div className={cn("h-4 w-px mx-0.5", isDark ? "bg-gold/20" : "bg-[#ddd8ce]")} />

          <ToolbarButton onClick={handleCopy} title="Copy LaTeX" isDark={isDark}>
            {copied ? (
              <><CheckIcon className="w-3.5 h-3.5 text-green-500" /><span className="hidden sm:inline text-green-500">Copied</span></>
            ) : (
              <><CopyIcon className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copy</span></>
            )}
          </ToolbarButton>

          <ToolbarButton onClick={handleClear} title="Clear" isDark={isDark}>
            <TrashIcon className="w-3.5 h-3.5" /><span className="hidden sm:inline">Clear</span>
          </ToolbarButton>

          <div className={cn("h-4 w-px mx-0.5", isDark ? "bg-gold/20" : "bg-[#ddd8ce]")} />

          <ToolbarButton
            onClick={toggleSync}
            title={syncEnabled ? "Disable scroll sync" : "Enable scroll sync"}
            isDark={isDark}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", syncEnabled ? "bg-green-500" : isDark ? "bg-gold/30" : "bg-[#ccc5b8]")} />
            <span className="hidden sm:inline">Sync</span>
          </ToolbarButton>

          <ToolbarButton
            onClick={handleExportPdf}
            title="Export to PDF"
            isDark={isDark}
          >
            {exportState === "exporting" ? (
              <><SpinnerIcon className="w-3.5 h-3.5" /><span className="hidden sm:inline">Generating...</span></>
            ) : exportState === "error" ? (
              <><FileDownIcon className="w-3.5 h-3.5 text-red-400" /><span className="hidden sm:inline text-red-400">Failed</span></>
            ) : (
              <><FileDownIcon className="w-3.5 h-3.5" /><span className="hidden sm:inline">Export PDF</span></>
            )}
          </ToolbarButton>

          <ToolbarButton onClick={toggleFullscreen} title={fullscreen ? "Exit (Esc)" : "Fullscreen"} isDark={isDark}>
            {fullscreen ? (
              <><ShrinkIcon className="w-3.5 h-3.5" /><span className="hidden sm:inline">Exit</span></>
            ) : (
              <><ExpandIcon className="w-3.5 h-3.5" /><span className="hidden sm:inline">Expand</span></>
            )}
          </ToolbarButton>

          <div className={cn("h-4 w-px mx-0.5", isDark ? "bg-gold/20" : "bg-[#ddd8ce]")} />

          <ToolbarButton onClick={() => setShowSymbols((p) => !p)} title="Toggle symbol bar" isDark={isDark}>
            <span>Symbols</span>
            <ChevronIcon className={cn("w-3 h-3 transition-transform duration-200", showSymbols && "rotate-180")} />
          </ToolbarButton>
        </div>
      </div>

      {/* ── Symbol bar (Feature A) ───────────────────────────────────── */}
      {showSymbols && (
        <div className={cn(
          "flex items-center gap-1 px-3 py-1.5 overflow-x-auto border-b shrink-0 flex-wrap",
          chromeBg, chromeBorder
        )}>
          {SYMBOL_GROUPS.map((group, gi) => (
            <div key={group.label} className="flex items-center gap-1 shrink-0">
              {gi > 0 && (
                <div className={cn("h-4 w-px mx-1 shrink-0", isDark ? "bg-gold/20" : "bg-[#ddd8ce]")} />
              )}
              <span className="text-[10px] uppercase tracking-wider opacity-40 mr-1 font-mono shrink-0">
                {group.label}
              </span>
              {group.symbols.map((sym) => (
                <button
                  key={sym.display}
                  type="button"
                  title={sym.insert}
                  onClick={() => insertAtCursor(sym.insert)}
                  className={cn(
                    "h-6 px-1.5 text-xs font-mono border transition-colors duration-150 shrink-0",
                    isDark
                      ? "text-muted hover:text-paper border-gold/10 hover:border-gold/30 bg-ink hover:bg-gold/[0.03]"
                      : "text-[#6b6560] hover:text-[#1a1a2e] border-[#ddd8ce] hover:border-gold/40 bg-white hover:bg-[#f5f3ee]"
                  )}
                >
                  {sym.display}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── Split pane ───────────────────────────────────────────────── */}
      <div
        ref={splitRef}
        className="mltex-split flex-1 flex flex-col lg:flex-row min-h-0"
        style={{ "--split-pos": `${splitPos}%` } as React.CSSProperties}
      >
        {/* Editor pane */}
        <div className={cn("mltex-editor-pane flex-1 flex flex-col min-h-0 min-w-0 relative")}>
          <div className={cn("px-4 py-1.5 text-[11px] font-mono border-b shrink-0 uppercase tracking-wider", chromeBg, chromeText, labelBorder)}>
            Editor
          </div>

          {/* Feature B — Search & Replace panel */}
          {showSearch && (
            <div className={cn(
              "absolute top-2 right-2 z-50 w-72 p-3 border shadow-2xl",
              isDark
                ? "bg-ink-2 border-gold/20 text-paper"
                : "bg-white border-[#ddd8ce] text-[#1e1e2e]"
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider opacity-60">
                  Search &amp; Replace
                </span>
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="opacity-40 hover:opacity-100 text-sm leading-none"
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full px-2 py-1.5 text-xs font-mono border mb-1.5 focus:outline-none",
                  isDark
                    ? "bg-ink border-gold/20 text-paper placeholder:text-muted/40"
                    : "bg-[#f5f3ee] border-[#ddd8ce] text-[#1e1e2e] placeholder:text-[#bbb5a8]"
                )}
              />
              <input
                type="text"
                placeholder="Replace with..."
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                className={cn(
                  "w-full px-2 py-1.5 text-xs font-mono border mb-2 focus:outline-none",
                  isDark
                    ? "bg-ink border-gold/20 text-paper placeholder:text-muted/40"
                    : "bg-[#f5f3ee] border-[#ddd8ce] text-[#1e1e2e] placeholder:text-[#bbb5a8]"
                )}
              />
              <div className="text-[10px] font-mono opacity-50 mb-2">
                {searchTerm
                  ? matchCount === 0
                    ? "No matches"
                    : `${matchCount} match${matchCount === 1 ? "" : "es"}`
                  : "Type to search"}
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={handleReplaceFirst}
                  disabled={!searchTerm || matchCount === 0}
                  className={cn(
                    "flex-1 py-1 text-xs font-mono border transition-colors",
                    isDark
                      ? "border-gold/20 hover:border-gold/40 hover:bg-gold/5 disabled:opacity-30"
                      : "border-[#ddd8ce] hover:border-gold/40 hover:bg-[#f5f3ee] disabled:opacity-30"
                  )}
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleReplaceAll}
                  disabled={!searchTerm || matchCount === 0}
                  className={cn(
                    "flex-1 py-1 text-xs font-mono border transition-colors",
                    isDark
                      ? "border-gold/20 hover:border-gold/40 hover:bg-gold/5 disabled:opacity-30"
                      : "border-[#ddd8ce] hover:border-gold/40 hover:bg-[#f5f3ee] disabled:opacity-30"
                  )}
                >
                  Replace All
                </button>
              </div>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "flex-1 w-full p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none min-h-[40vh] lg:min-h-0",
              panelBg, panelText,
              isDark ? "placeholder:text-muted/40" : "placeholder:text-[#bbb5a8]"
            )}
            placeholder="Type LaTeX here..."
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>

        {/* Drag handle — desktop only */}
        <div
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
          className={cn(
            "hidden lg:flex items-center justify-center w-[6px] cursor-col-resize shrink-0 group transition-colors duration-150",
            isDark ? "bg-ink-2 hover:bg-gold/10" : "bg-[#eae7e0] hover:bg-gold/10"
          )}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
        >
          <div className={cn("w-[2px] h-10 rounded-full transition-colors duration-150", dividerColor)} />
        </div>

        {/* Mobile divider */}
        <div className={cn("lg:hidden h-px shrink-0", splitBorder, isDark ? "border-t" : "border-t")} />

        {/* Preview pane */}
        <div className={cn("mltex-preview-pane flex-1 flex flex-col min-h-0 min-w-0")}>
          <div className={cn("px-4 py-1.5 text-[11px] font-mono border-b shrink-0 uppercase tracking-wider flex items-center gap-2", chromeBg, labelBorder)}>
            <span className={chromeText}>Preview</span>
            {!mathJaxReady && <span className="text-gold/60 animate-pulse">Loading MathJax...</span>}
          </div>
          <div
            ref={previewRef}
            className={cn(
              "mltex-preview flex-1 p-6 overflow-y-auto font-body text-base min-h-[40vh] lg:min-h-0",
              isDark ? "bg-ink text-paper" : "bg-[#fefdfb] text-[#1e1e2e]"
            )}
          />
        </div>
      </div>

      {/* ── Status bar ───────────────────────────────────────────────── */}
      <div className={cn("px-4 py-1.5 text-[11px] font-mono border-t shrink-0 flex items-center justify-between gap-4", chromeBg, chromeBorder, isDark ? "text-muted/50" : "text-[#a09a90]")}>
        {/* Left: save status */}
        <span className="flex items-center gap-3 shrink-0">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
              <span>Saving...</span>
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Saved locally</span>
            </span>
          )}
          {saveStatus === "error" && (
            <span className="flex items-center gap-1.5 shrink-0 text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Save failed</span>
            </span>
          )}
          {saveStatus === "idle" && (
            <span className="opacity-40">Your data never leaves this browser</span>
          )}
        </span>

        {/* Center: editor hints */}
        <span className="truncate hidden sm:block text-center">
          <span className="text-gold/40">$...$</span> inline
          <span className={cn("mx-2", isDark ? "text-gold/20" : "text-[#ddd8ce]")}>&middot;</span>
          <span className="text-gold/40">$$...$$</span> display
          <span className={cn("mx-2", isDark ? "text-gold/20" : "text-[#ddd8ce]")}>&middot;</span>
          <span className="text-gold/40">## </span>headings
          <span className={cn("mx-2", isDark ? "text-gold/20" : "text-[#ddd8ce]")}>&middot;</span>
          <kbd className={cn("px-1 py-px border text-[10px]", isDark ? "border-gold/10" : "border-[#ddd8ce]")}>Tab</kbd> indent
          {fullscreen && (
            <>
              <span className={cn("mx-2", isDark ? "text-gold/20" : "text-[#ddd8ce]")}>&middot;</span>
              <kbd className={cn("px-1 py-px border text-[10px]", isDark ? "border-gold/10" : "border-[#ddd8ce]")}>Esc</kbd> exit
            </>
          )}
        </span>

        {/* Right: char count */}
        <span className="shrink-0 tabular-nums">{content.length} chars</span>
      </div>
    </div>
  );
}
