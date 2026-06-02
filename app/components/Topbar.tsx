"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TbBook2, TbFileCv, TbList, TbPalette } from "react-icons/tb";
import { FaFilePdf } from "react-icons/fa6";
import {
  CV_NAVIGATE_EVENT,
  SECTIONS_NAV,
  type CvNavigateDetail,
  type SectionId,
  dispatchCvNavigate,
} from "../data/navigation";

/** Strip the `cv-` prefix so URL params read like `?section=experience` rather
 *  than the raw anchor id `cv-experience`. */
const sectionToParam = (id: SectionId): string => id.replace(/^cv-/, "");
const paramToSection = (slug: string): SectionId | null => {
  const id = `cv-${slug}` as SectionId;
  return SECTIONS_NAV.some((s) => s.id === id) ? id : null;
};
import { Flag } from "./icons/Flag";
import type { Lang } from "../data/cv";
import { ARTICLES, blogUI } from "../data/articles";
import { ui } from "../data/cv";
import { useScrolled } from "../lib/useScrolled";



type View = "resume" | "blog";

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  view: View;
  resumeHref: string;
  blogHref: string;
  onPickTheme: () => void;
  darkChrome: boolean;
  /** Invoked when the user clicks the PDF action. The host decides whether
   * to print directly (already on Notion) or surface the cross-theme notice
   * that redirects to /notion before printing. Required for resume view. */
  onPdfClick?: () => void;
  /** Optional blog-only "open article tree" trigger. Mirrors the resume PDF
   * action: visible at all widths, icon-only on mobile to dodge the clipping
   * issue the labelled version had. */
  onOpenTree?: () => void;
  openTreeLabel?: string;
};

const SCROLL_THRESHOLD = 60;

export default function Topbar({
  lang,
  setLang,
  view,
  resumeHref,
  blogHref,
  onPickTheme,
  darkChrome,
  onPdfClick,
  onOpenTree,
  openTreeLabel,
}: Props) {
  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const scrolled = useScrolled(SCROLL_THRESHOLD);
  /** Big & opaque at top, slim & translucent after scroll. */
  const expanded = !scrolled;

  const router = useRouter();
  const pathname = usePathname();

  /** Click handler for a section pill: keep the URL shareable by reflecting
   *  the active section as `?section=experience`, then dispatch the global
   *  navigation event so themes scroll, switch tab, or run their command. */
  const navigateToSection = (id: SectionId) => {
    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : "",
    );
    params.set("section", sectionToParam(id));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    dispatchCvNavigate(id);
  };

  /** On mount, if the URL already carries `?section=…` (optionally with
   *  `?company=…` for a specific experience entry), replay the navigation so
   *  the page lands on that section/entry. Defer one frame so theme
   *  listeners (Dark intercepts to switch tab, Terminal to run a command)
   *  are mounted before the event fires. Runs once. */
  useEffect(() => {
    if (view !== "resume") return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("section");
    if (!slug) return;
    const id = paramToSection(slug);
    if (!id) return;
    const sub = params.get("company") ?? undefined;
    const raf = requestAnimationFrame(() => dispatchCvNavigate(id, sub));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track which section is most visible.
  useEffect(() => {
    if (view !== "resume") return;
    const observed: HTMLElement[] = [];
    const ids = SECTIONS_NAV.map((s) => s.id);
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observed.push(el);
    }
    if (observed.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id as SectionId);
        }
      },
      { rootMargin: "-100px 0px -65% 0px", threshold: [0, 0.2, 0.6] },
    );
    observed.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [view]);

  // Keep the active pill in view inside the scroll row.
  useEffect(() => {
    if (!activeId) return;
    const row = sectionsRef.current;
    if (!row) return;
    const pill = row.querySelector(`[data-section="${activeId}"]`) as HTMLElement | null;
    if (!pill) return;
    const left = pill.offsetLeft - row.offsetLeft - row.clientWidth / 2 + pill.clientWidth / 2;
    row.scrollTo({ left, behavior: "smooth" });
  }, [activeId]);

  // Default navigate handler: scroll to id (VS Code intercepts in capture phase).
  // "About" scrolls to the top of the page, since the header strip (name,
  // contacts, headline, tagline) is conceptually part of "about me", not just
  // the summary paragraph that the `cv-about` anchor wraps.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CvNavigateDetail>).detail;
      if (!detail?.id) return;
      if (detail.id === "cv-about") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      // `sub` carries a per-entry slug for experiences. If we can find the
      // matching anchor (cv-experience-<slug>), scroll there directly;
      // otherwise fall back to the section-level scroll.
      if (detail.id === "cv-experience" && detail.sub) {
        const subEl = document.getElementById(`cv-experience-${detail.sub}`);
        if (subEl) {
          subEl.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
      const el = document.getElementById(detail.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener(CV_NAVIGATE_EVENT, handler);
    return () => window.removeEventListener(CV_NAVIGATE_EVENT, handler);
  }, []);

  // At the top the bar is translucent (lets the hero/title breathe through);
  // once the user scrolls past SCROLL_THRESHOLD the bar locks to (near) full
  // opacity and gains a soft drop shadow so it visibly detaches from the
  // content scrolling underneath.
  const barBg = darkChrome
    ? expanded
      ? "border-b border-white/10 bg-black/45"
      : "border-b border-white/15 bg-black/95 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]"
    : expanded
      ? "border-b border-black/10 bg-white/55"
      : "border-b border-black/15 bg-white/95 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]";
  const text = darkChrome ? "text-white" : "text-black";
  const dim = darkChrome ? "text-white/80" : "text-black/70";
  const ghostHover = darkChrome ? "hover:bg-white/10 hover:text-white" : "hover:bg-black/10 hover:text-black";
  const segBg = darkChrome ? "bg-white/[0.10]" : "bg-black/[0.06]";
  const segActive = darkChrome ? "bg-white text-black shadow-sm" : "bg-black text-white shadow-sm";

  // Sizes change between expanded and compact
  const headerHeight = expanded ? "h-20" : "h-12";
  const tabPad = expanded ? "px-3.5 py-2" : "px-2.5 py-1";
  const tabFont = expanded ? "text-[13px]" : "text-[11.5px]";
  const tabIcon = expanded ? 16 : 13;
  const navFont = expanded ? "text-[13.5px]" : "text-[12px]";
  const navPad = expanded ? "px-3 py-1.5" : "px-2.5 py-1";
  const utilsGap = expanded ? "gap-2.5" : "gap-1.5";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 backdrop-blur-md transition-all duration-150 print:hidden ${barBg} ${text}`}
    >
      <div
        className={`mx-auto flex w-full max-w-[1480px] items-center gap-2 px-3 transition-all duration-150 sm:gap-5 sm:px-6 ${headerHeight}`}
      >
        {/* Resume / Blog tabs */}
        <div className={`flex shrink-0 items-center rounded-full p-0.5 ${segBg}`}>
          <Link
            href={resumeHref}
            aria-pressed={view === "resume"}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full font-semibold transition ${tabPad} ${tabFont} ${
              view === "resume" ? segActive : `${dim} hover:opacity-100`
            }`}
          >
            <TbFileCv size={tabIcon} />
            {/* Phones: short "CV" — keeps the tabs labelled without eating the
             * room the right-hand "trilha-menu" pill needs. sm+: full label
             * ("Resume" / "Currículo"). */}
            <span className="sm:hidden">CV</span>
            <span className="hidden sm:inline">{blogUI.views[lang]}</span>
          </Link>
          <Link
            href={blogHref}
            aria-pressed={view === "blog"}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full font-semibold transition ${tabPad} ${tabFont} ${
              view === "blog" ? segActive : `${dim} hover:opacity-100`
            }`}
          >
            <TbBook2 size={tabIcon} />
            <span>{blogUI.blogTab[lang]}</span>
            <span
              className="rounded-full px-1.5 py-[1px] font-mono text-[9.5px] font-bold leading-none"
              style={{
                backgroundColor:
                  view === "blog"
                    ? "rgba(0,0,0,0.18)"
                    : darkChrome
                      ? "rgba(255,232,31,0.22)"
                      : "rgba(217,119,6,0.18)",
                color:
                  view === "blog"
                    ? "currentColor"
                    : darkChrome
                      ? "#ffe81f"
                      : "#a16207",
              }}
            >
              {ARTICLES.length}
            </span>
          </Link>
        </div>

        {/* Section nav, hidden below md; mobile users scroll the page */}
        <div className="flex min-w-0 flex-1">
          {view === "resume" ? (
            <nav
              ref={sectionsRef}
              aria-label="Sections"
              className="no-scrollbar hidden min-w-0 flex-1 items-center gap-0.5 overflow-x-auto overflow-y-hidden scroll-smooth md:flex"
            >
              {SECTIONS_NAV.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  data-section={s.id}
                  onClick={() => navigateToSection(s.id)}
                  className={`group relative shrink-0 cursor-pointer rounded-full font-medium transition ${navPad} ${navFont} ${
                    activeId === s.id
                      ? darkChrome
                        ? "text-white"
                        : "text-black"
                      : `${dim} ${ghostHover}`
                  }`}
                >
                  {s.title[lang]}
                  <span
                    aria-hidden
                    className={`absolute inset-x-3 -bottom-0.5 h-[2px] rounded-t transition-opacity ${
                      activeId === s.id ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ backgroundColor: darkChrome ? "#fff" : "#000" }}
                  />
                </button>
              ))}
            </nav>
          ) : null}
        </div>

        {/* Utilities. On sm+ the language + theme controls live here; on mobile
         * they're moved to FloatingActions (FABs at bottom-right that hide on
         * scroll), so we only render PDF on mobile here. */}
        <div className={`flex shrink-0 items-center ${utilsGap}`}>
          {/* sm+: language segmented control */}
          <div className={`hidden items-center rounded-full p-0.5 sm:flex ${segBg}`}>
            {(["en", "pt"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-label={l === "en" ? "English" : "Português"}
                className={`flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 font-bold uppercase tracking-wider transition ${
                  expanded ? "text-[11px]" : "text-[10px]"
                } ${lang === l ? segActive : dim}`}
              >
                <Flag lang={l} size={expanded ? 15 : 13} />
                <span>{l}</span>
              </button>
            ))}
          </div>

          {/* sm+: theme picker trigger */}
          <button
            type="button"
            onClick={onPickTheme}
            title={ui.meta.theme[lang]}
            className={`hidden cursor-pointer items-center gap-1.5 rounded-full font-semibold transition sm:flex ${tabPad} ${tabFont} ${dim} ${ghostHover}`}
          >
            <TbPalette size={tabIcon} />
            <span>{ui.meta.theme[lang]}</span>
          </button>

          {/* All sizes: PDF download (resume view only) */}
          {view === "resume" && onPdfClick ? (
            <button
              type="button"
              onClick={onPdfClick}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full bg-[#e23334] font-semibold text-white shadow-sm transition hover:bg-[#c21f20] ${tabPad} ${tabFont}`}
              title={lang === "en" ? "Download or print as PDF (Ctrl+P)" : "Baixar ou imprimir como PDF (Ctrl+P)"}
            >
              <FaFilePdf size={tabIcon} />
              <span className="hidden sm:inline">{ui.meta.pdfDownload[lang]}</span>
              <span className="sm:hidden">PDF</span>
            </button>
          ) : null}

          {/* All sizes: blog tree (blog list only). Mirrors PDF placement so
           * the right-hand slot of the topbar always carries a primary action
           * with a written label. Text fits on mobile because BlogList now
           * `overflow-x-clip`s the hero gradient that used to push the body
           * wider than the viewport. */}
          {view === "blog" && onOpenTree ? (
            <button
              type="button"
              onClick={onOpenTree}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full bg-[#2383e2] font-semibold text-white shadow-sm transition hover:bg-[#1e6dc3] ${tabPad} ${tabFont}`}
              title={openTreeLabel}
              aria-label={openTreeLabel}
            >
              <TbList size={tabIcon} strokeWidth={2.4} />
              <span>{openTreeLabel}</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
