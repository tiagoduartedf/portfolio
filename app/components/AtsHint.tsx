import React from "react";

/** Tiny, visible-on-screen label that doubles as a structural marker for the
 *  print PDF. ATS parsers look for explicit section keywords ("Education",
 *  "Skills", "Languages") to know where each block starts; the Notion theme
 *  packs some of those into the visual chrome (e.g. education inside the
 *  contact strip), so this component reintroduces the heading as a small,
 *  muted label that doesn't fight the design.
 *
 *  Design choice: the label is NOT hidden. White-on-white / off-screen tricks
 *  get flagged as keyword stuffing by modern ATS and are reputationally
 *  risky. Instead we render it small + low-opacity, with a hover tooltip
 *  explaining its purpose. That keeps the page honest: nothing in the PDF
 *  text layer that the human reader can't also see.
 */
type Props = {
  children: React.ReactNode;
  /** HTML element to render. Default span; pass "h2" for section headings. */
  as?: "h2" | "h3" | "span" | "p" | "div";
  /** Override the default tooltip explanation. Auto-localized by `lang`. */
  tooltip?: string;
  /** Selects the default tooltip language when no `tooltip` is provided. */
  lang?: "pt" | "en";
  /** Optional extra Tailwind classes (e.g. to control spacing). */
  className?: string;
};

const DEFAULT_TOOLTIP: Record<"pt" | "en", string> = {
  pt: "Rótulo discreto pra ajudar sistemas de ATS (análise automática de currículo) a identificar essa seção. É estrutura real lida pelo parser do PDF, sem truques.",
  en: "Discreet label to help ATS (automated resume parsing) detect this section. Real structural text the PDF parser reads, no tricks involved.",
};

export function AtsHint({ children, as: Tag = "span", tooltip, lang = "pt", className = "" }: Props) {
  return (
    <Tag
      title={tooltip ?? DEFAULT_TOOLTIP[lang]}
      className={`ats-hint inline-flex cursor-help items-baseline text-[9px] font-semibold uppercase tracking-[0.18em] opacity-40 transition-opacity hover:opacity-80 ${className}`}
    >
      {children}
    </Tag>
  );
}
