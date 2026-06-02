import type { Bilingual } from "../data/cv";

/* Parses experience periods like "Oct 2025 - Present" / "Nov 2024 - May 2025"
 * and returns a human-readable duration ("1 ano e 2 meses" / "1 year and 2
 * months"). Returns null for year-only entries ("2016") or anything we can't
 * confidently parse, so callers can render the original period untouched.
 */

const MONTHS_EN: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/** Open-ended end-of-period markers in both languages. */
const PRESENT = new Set(["present", "atual", "current", "now"]);

type Point = { year: number; month: number };

function parsePoint(raw: string, now: Date): Point | null {
  const t = raw.trim().toLowerCase();
  if (PRESENT.has(t)) {
    return { year: now.getFullYear(), month: now.getMonth() };
  }
  // "Jan 2020" — three-letter EN month, optional period separator, 4-digit year.
  const m = t.match(/^([a-z]{3})\.?\s+(\d{4})$/);
  if (m) {
    const mi = MONTHS_EN[m[1]];
    if (mi === undefined) return null;
    return { year: Number(m[2]), month: mi };
  }
  return null;
}

/** Duration in inclusive months (start month and end month both count).
 *  Mirrors how LinkedIn renders "Jan 2020 - Jan 2021" as "1 yr 1 mo". */
function inclusiveMonths(start: Point, end: Point): number {
  return (end.year - start.year) * 12 + (end.month - start.month) + 1;
}

function format(total: number, lang: "en" | "pt"): string {
  if (total <= 0) return "";
  const years = Math.floor(total / 12);
  const months = total % 12;

  const yearWord =
    lang === "en"
      ? years === 1
        ? "year"
        : "years"
      : years === 1
        ? "ano"
        : "anos";
  const monthWord =
    lang === "en"
      ? months === 1
        ? "month"
        : "months"
      : months === 1
        ? "mês"
        : "meses";
  const and = lang === "en" ? "and" : "e";

  if (years === 0) return `${months} ${monthWord}`;
  if (months === 0) return `${years} ${yearWord}`;
  return `${years} ${yearWord} ${and} ${months} ${monthWord}`;
}

/**
 * Compute a bilingual duration label for a period.
 *
 * We parse the EN spelling because both PT and EN share the same year numbers
 * and parallel 3-letter month abbreviations, but EN is the unambiguous one
 * (`Out` vs `Oct`, `Mai` vs `May`).
 */
export function experienceDuration(
  period: Bilingual,
  now: Date = new Date(),
): Bilingual | null {
  const en = period.en.trim();
  // Year-only entries ("2016") are too vague to put a duration on.
  if (/^\d{4}$/.test(en)) return null;

  // Either " - " (hyphen with spaces) or " – " (en dash, just in case).
  const parts = en.split(/\s+[-–]\s+/);
  if (parts.length !== 2) return null;

  const start = parsePoint(parts[0], now);
  const end = parsePoint(parts[1], now);
  if (!start || !end) return null;

  const months = inclusiveMonths(start, end);
  if (months <= 0) return null;

  return { en: format(months, "en"), pt: format(months, "pt") };
}
