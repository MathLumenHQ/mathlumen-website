"use client";

import { useState } from "react";

type Props = {
  articleTitle: string;
  slug: string;
  publishedAt: string; // ISO date string
};

const PRINT_CSS = `
@media print {
  body {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 11pt;
    line-height: 1.65;
    color: #000;
    background: #fff;
    max-width: 680px;
    margin: 0 auto;
    padding: 0;
  }
  h1 { font-size: 18pt; font-weight: bold; margin-bottom: 4pt; }
  h2 { font-size: 13pt; font-weight: bold; margin-top: 18pt; }
  h3 { font-size: 11pt; font-weight: bold; }
  .katex-display { margin: 12pt 0; }
  .katex { font-size: 10.5pt; }
  .footer { margin-top: 32pt; font-size: 9pt; color: #555; border-top: 1px solid #ccc; padding-top: 8pt; }
  a { color: #000; text-decoration: none; }
}
`;

export function PowSolutionDownload({ articleTitle, slug, publishedAt }: Props) {
  const [label, setLabel] = useState("Download PDF");

  function handleClick() {
    try {
      setLabel("Preparing…");

      const proseEl = document.querySelector(".prose");
      const bodyHTML = proseEl ? proseEl.innerHTML : "";

      const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const downloadedDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "display:none;position:absolute;width:0;height:0";
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument;
      if (!doc) {
        setLabel("Download PDF");
        return;
      }

      doc.open();
      doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"/>
  <style>${PRINT_CSS}</style>
</head>
<body>
  <h1>${articleTitle}</h1>
  <p style="font-size:9pt;color:#555;margin-bottom:24pt">
    MathLumen Problem of the Week &middot; ${formattedDate}
  </p>
  ${bodyHTML}
  <div class="footer">
    mathlumen.com/articles/${slug} &middot; Downloaded ${downloadedDate}
  </div>
</body>
</html>`);
      doc.close();

      iframe.onload = () => {
        iframe.contentWindow?.print();
        setLabel("Download PDF");
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 3000);
      };
    } catch (err) {
      console.error("[PowSolutionDownload] print failed:", err);
      setLabel("Download PDF");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="font-mono text-xs text-gold/70 hover:text-gold border border-gold/[0.18] hover:border-gold/40 px-3 py-1.5 transition-colors duration-200"
    >
      ↓ {label}
    </button>
  );
}
