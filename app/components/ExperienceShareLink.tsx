"use client";

import { useState } from "react";
import { TbLink, TbCheck } from "react-icons/tb";
import { experienceSlug } from "../data/cv";
import type { Lang } from "../data/cv";

type Props = {
  /** Company name from `cv.experience[].company`. Slugified into the URL
   *  param the topbar reads on mount to scroll to this entry. */
  company: string;
  lang: Lang;
  /** Optional className for layout / color (themes pass their own muted
   *  text color). The button styling itself is intentionally minimal so it
   *  blends with the surrounding header. */
  className?: string;
  size?: number;
};

/** Tiny inline icon button next to an experience header. On click, builds a
 *  URL pointing at this entry (`?section=experience&company=<slug>`) and
 *  copies it to the clipboard. Shows a brief check-mark confirmation. */
export default function ExperienceShareLink({
  company,
  lang,
  className,
  size = 13,
}: Props) {
  const [copied, setCopied] = useState(false);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("section", "experience");
    url.searchParams.set("company", experienceSlug(company));
    // Drop other params so the link is canonical for this entry.
    for (const key of Array.from(url.searchParams.keys())) {
      if (key !== "section" && key !== "company") url.searchParams.delete(key);
    }
    navigator.clipboard
      ?.writeText(url.toString())
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {
        // Older browsers / non-https: nothing useful to do.
      });
  };

  const label = copied
    ? lang === "en"
      ? "Link copied"
      : "Link copiado"
    : lang === "en"
      ? "Copy link to this entry"
      : "Copiar link desta experiência";

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded transition-opacity hover:opacity-100 print:hidden ${className ?? ""}`}
      style={{ opacity: copied ? 1 : 0.55 }}
    >
      {copied ? <TbCheck size={size} /> : <TbLink size={size} />}
    </button>
  );
}
