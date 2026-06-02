/**
 * Tokenize an experience summary (a `\n\n`-split string) into render blocks.
 *
 * Three kinds:
 *   - "para": regular prose paragraph.
 *   - "separator": short label paragraph that ends in `:` — rendered as a
 *     horizontal section divider in the themes.
 *   - "citation": a separator that mentions "Sobre mim" / "About" opens a
 *     pull-quote block that captures every following non-separator paragraph
 *     until the next separator (or the end). The themes render this with
 *     the same blockquote chrome the project case-study uses.
 *
 * The detection is intentionally string-based so we can keep authoring the
 * summaries as plain bilingual text in cv.ts (no markup, no metadata) and
 * still get richer rendering downstream.
 */

export type SummaryBlock =
  | { kind: "para"; text: string }
  | { kind: "separator"; text: string }
  | { kind: "citation"; from: "about"; paragraphs: string[] };

const ABOUT_RE = /\bsobre mim\b|\babout\b/i;

const isAside = (p: string) => p.trimEnd().endsWith(":");
const stripColon = (p: string) => p.replace(/:$/, "").trim();

export function parseExperienceSummary(text: string): SummaryBlock[] {
  const blocks: SummaryBlock[] = [];
  const paragraphs = text.split("\n\n");
  let i = 0;
  while (i < paragraphs.length) {
    const p = paragraphs[i];
    if (isAside(p) && ABOUT_RE.test(p)) {
      // Citation aside: take only the next single paragraph as the quoted
      // body (the intro recap). Everything after that flows as regular
      // technical prose, no nested separator needed.
      i++;
      if (i < paragraphs.length && !isAside(paragraphs[i])) {
        blocks.push({
          kind: "citation",
          from: "about",
          paragraphs: [paragraphs[i]],
        });
        i++;
      }
      continue;
    }
    if (isAside(p)) {
      blocks.push({ kind: "separator", text: stripColon(p) });
      i++;
      continue;
    }
    blocks.push({ kind: "para", text: p });
    i++;
  }
  return blocks;
}
