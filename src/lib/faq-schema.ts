export interface FaqPair {
  question: string;
  answer: string;
}

/**
 * Headings that start with these words and end with "?" are treated as FAQ items.
 */
const QUESTION_RE = /^(What|How|Why|When|Where|Who|Is|Are|Can|Should|Does|Will|Do)\b/i;

/**
 * Strip inline math, backtick code spans, bold/italic markers from a string.
 * Used to produce clean answer text for structured data.
 */
function cleanText(text: string): string {
  return text
    .replace(/\$\$[\s\S]*?\$\$/g, "") // display math
    .replace(/\$[^$]+\$/g, "")         // inline math
    .replace(/`[^`]+`/g, "")           // inline code
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1") // bold/italic
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract FAQ pairs from raw MDX body text (after frontmatter).
 * Only ## and ### headings that look like questions trigger extraction.
 */
export function extractFaqPairs(mdxBody: string): FaqPair[] {
  const lines = mdxBody.split("\n");
  const pairs: FaqPair[] = [];

  let currentQuestion: string | null = null;
  let answerLines: string[] = [];

  const flush = () => {
    if (!currentQuestion || answerLines.length === 0) return;
    const answer = cleanText(answerLines.join(" "));
    if (answer.length > 30) {
      pairs.push({ question: currentQuestion, answer: answer.slice(0, 500) });
    }
    currentQuestion = null;
    answerLines = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(/^#{2,3}\s+(.+)$/);
    if (headingMatch) {
      flush();
      const text = headingMatch[1].trim();
      if (text.endsWith("?") && QUESTION_RE.test(text)) {
        currentQuestion = text;
      }
      continue;
    }

    if (!currentQuestion) continue;

    const trimmed = line.trim();
    // Skip code fences and display math blocks
    if (trimmed.startsWith("```") || trimmed.startsWith("$$")) continue;
    if (trimmed) answerLines.push(trimmed);
  }

  flush();
  return pairs;
}

/**
 * Build Schema.org FAQPage JSON-LD object from extracted pairs.
 * Pass this to <script type="application/ld+json">.
 */
export function buildFaqSchema(pairs: FaqPair[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map((pair) => ({
      "@type": "Question",
      name: pair.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: pair.answer,
      },
    })),
  };
}
