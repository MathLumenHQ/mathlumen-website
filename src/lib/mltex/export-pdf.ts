/**
 * Exports the MLTeX preview pane to PDF via window.print() in the SAME document.
 *
 * Same-document approach is necessary because MathJax SVG uses:
 *  • <mjx-container> custom elements (lose registration when serialised to iframe)
 *  • <use href="#MJX-…"> fragment references into a hidden font-cache SVG
 *    that lives in document.body — not inside the preview pane
 *  • SVG dimensions in `ex` units calibrated to the document font at render-time
 *
 * Cloning into the same document preserves all three. Cleanup is deferred to
 * the "afterprint" event so the container is removed after the dialog closes.
 */
export async function exportToPdf(
  previewElement: HTMLElement,
  filename: string
): Promise<void> {
  // Clone the live, already-typeset DOM.
  // cloneNode(true) preserves SVG namespaces and mjx-container registration;
  // innerHTML/outerHTML serialisation loses both.
  const clone = previewElement.cloneNode(true) as HTMLElement;
  clone.removeAttribute("class");
  clone.removeAttribute("style");

  const printContainer = document.createElement("div");
  printContainer.id = "mltex-print-root";
  printContainer.appendChild(clone);
  document.body.appendChild(printContainer);

  const printStyle = document.createElement("style");
  printStyle.id = "mltex-print-style";
  printStyle.textContent = `
    /* Screen: keep the container invisible so there is no layout flash */
    #mltex-print-root { display: none; }

    @media print {
      /* ── Page shell ─────────────────────────────────────────────── */
      body > *:not(#mltex-print-root) { display: none !important; }
      body { background: #ffffff !important; margin: 0 !important; padding: 0 !important; }

      /* ── Print root ─────────────────────────────────────────────── */
      /*
       * font-family is intentionally NOT overridden here.
       *
       * MathJax measures the document's x-height to size SVG glyphs in "ex"
       * units. At render-time the preview uses Crimson Pro (already loaded).
       * Switching to Georgia or any other font at print-time changes 1ex,
       * causing every SVG to scale to a new size — typically rendering math
       * noticeably larger and therefore appearing "bolder" than the text.
       *
       * Keeping the original Crimson Pro in scope (it is still loaded in the
       * document) means SVG dimensions remain exactly what MathJax computed.
       *
       * font-size: 12pt = 16 px at 96 dpi, matching the preview's 1 rem base.
       * Any other value shifts the ex→px ratio and mis-sizes inline math.
       */
      #mltex-print-root {
        display: block !important;
        position: static !important;
        width: 100% !important;
        padding: 2.5cm !important;
        box-sizing: border-box !important;
        background: #ffffff !important;
        color: #000000 !important;
        font-size: 12pt !important;
        line-height: 1.5 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* ── Colour reset ───────────────────────────────────────────── */
      /*
       * EDITOR_STYLES uses CSS custom properties that resolve to dark-theme
       * values (cream paper, gold accents) and opacity tricks designed for
       * a dark background. Each is explicitly overridden below.
       */

      /* Paragraphs — uniform line-height overrides .mltex-block { line-height: 1.8 } */
      #mltex-print-root .mltex-block {
        color: #000000 !important;
        line-height: 1.5 !important;
        margin-bottom: 0.85em !important;
        text-align: justify;
        orphans: 3;
        widows: 3;
      }
      #mltex-print-root .mltex-block:last-child { margin-bottom: 0 !important; }

      /* Headings — strip gold colour, replace color-mix border with a grey rule */
      #mltex-print-root .mltex-heading {
        color: #000000 !important;
        font-weight: 700 !important;
        line-height: 1.25 !important;
        margin: 1.8em 0 0.5em !important;
        page-break-after: avoid;
      }
      #mltex-print-root .mltex-heading:first-child { margin-top: 0 !important; }

      #mltex-print-root .mltex-h1 {
        font-size: 1.6em !important;
        border-bottom: 1px solid #cccccc !important; /* replaces color-mix(gold) */
        padding-bottom: 0.25em !important;
      }
      #mltex-print-root .mltex-h2 { font-size: 1.3em !important; }
      #mltex-print-root .mltex-h3 { font-size: 1.1em !important; }
      #mltex-print-root .mltex-h4,
      #mltex-print-root .mltex-h5,
      #mltex-print-root .mltex-h6 { font-size: 1em !important; }

      /* Lists — replace gold markers (var(--color-gold)) with black */
      #mltex-print-root .mltex-list {
        color: #000000 !important;
        line-height: 1.5 !important;
        margin: 0.5em 0 0.85em !important;
      }
      #mltex-print-root .mltex-list li { margin-bottom: 0.2em !important; }
      #mltex-print-root .mltex-list li::marker { color: #000000 !important; }

      /* Blockquote — remove opacity:0.85 (designed for dark bg) and gold border */
      #mltex-print-root .mltex-blockquote {
        border-left: 3px solid #888888 !important;
        color: #333333 !important;
        opacity: 1 !important;
        padding-left: 1em !important;
        margin: 1em 0 !important;
      }

      /* HR — replace color-mix(gold) with a neutral rule */
      #mltex-print-root .mltex-hr {
        border: none !important;
        border-top: 1px solid #cccccc !important;
        margin: 1.5em 0 !important;
      }

      /* ── MathJax SVG ────────────────────────────────────────────── */

      /*
       * Inline containers: replicate the EDITOR_STYLES inline behaviour that
       * scoped to .mltex-preview (now absent from the clone's ancestor chain).
       */
      #mltex-print-root mjx-container:not([display]):not([display="true"]) {
        display: inline !important;
        color: #000000 !important;
        margin: 0 1px !important;
        padding: 0 !important;
        white-space: normal !important;
      }
      #mltex-print-root mjx-container:not([display]):not([display="true"]) > svg {
        display: inline !important;
        vertical-align: -0.25ex !important;
        overflow: visible !important;
      }

      /* Display containers */
      #mltex-print-root mjx-container[display="true"],
      #mltex-print-root mjx-container[display] {
        display: block !important;
        color: #000000 !important;
        text-align: center !important;
        margin: 1.2em 0 !important;
        page-break-inside: avoid;
      }
      #mltex-print-root mjx-container[display="true"] > svg,
      #mltex-print-root mjx-container[display] > svg {
        display: inline-block !important;
        overflow: visible !important;
      }

      /*
       * Glyph paths: pure black fill via currentColor, zero stroke.
       *
       * MathJax paths use fill="currentColor". Setting color:#000000 on the
       * container cascades down so currentColor resolves to pure black.
       *
       * stroke:none prevents any inherited stroke from widening the filled
       * path outlines — the primary cause of math appearing "overly bold"
       * when printing from a browser that applies default SVG stroke styles.
       */
      #mltex-print-root mjx-container svg {
        color: #000000 !important;
        overflow: visible !important;
      }
      #mltex-print-root mjx-container svg path,
      #mltex-print-root mjx-container svg rect,
      #mltex-print-root mjx-container svg use {
        fill: currentColor !important;
        stroke: none !important;
      }

      /* ── Code blocks ────────────────────────────────────────────── */
      #mltex-print-root pre {
        background: #f7f7f7 !important;
        border: 1px solid #e0e0e0 !important;
        color: #000000 !important;
        font-size: 0.85em !important;
        line-height: 1.45 !important;
        padding: 0.75em 1em !important;
        white-space: pre-wrap !important;
        overflow-x: visible !important;
        page-break-inside: avoid;
      }
      /* Reset rehype-pretty-code's per-token inline colour styles */
      #mltex-print-root pre * {
        color: #000000 !important;
        background: transparent !important;
      }
      #mltex-print-root code:not(pre code) {
        background: #f0f0f0 !important;
        color: #000000 !important;
        padding: 0.1em 0.3em !important;
        font-size: 0.87em !important;
      }
    }
  `;
  document.head.appendChild(printStyle);

  const originalTitle = document.title;
  document.title = filename;

  await new Promise<void>((resolve) => {
    let done = false;

    function cleanup() {
      if (done) return;
      done = true;
      window.removeEventListener("afterprint", cleanup);
      document.title = originalTitle;
      if (printContainer.parentNode) document.body.removeChild(printContainer);
      if (printStyle.parentNode) document.head.removeChild(printStyle);
      resolve();
    }

    window.addEventListener("afterprint", cleanup);
    window.print();
    setTimeout(cleanup, 60_000);
  });
}
