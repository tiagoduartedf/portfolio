"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  CURRICULUM,
  blogUI,
  walkCurriculum,
  type CurriculumPart,
  type CurriculumSection,
  type CurriculumStep,
} from "../../../data/articles";
import { pathForBlog } from "../../../data/navigation";
import {
  CloseIcon,
  RoadmapIcon,
  SearchIcon,
  StarFilledIcon,
} from "../icons";
import { useScrolled } from "../../../lib/useScrolled";
import type { Lang } from "../../../data/cv";
import { chromeFor } from "../partHues";

type Props = {
  lang: Lang;
  dark: boolean;
  /** Slug of the article currently viewed, if any. Drives the highlighted row
   * and the auto-scroll on mount inside the sidebar. */
  activeSlug?: string;
  query: string;
  onQueryChange: (q: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
};

/**
 * Docs-style sidebar inspired by Vercel/Stripe docs: caps section headings,
 * compact article rows, a violet left-bar marking the active row. No
 * decorative rail or disc; hierarchy is conveyed by typography and spacing.
 */
export default function RoadmapSidebar({
  lang,
  dark,
  activeSlug,
  query,
  onQueryChange,
  mobileOpen,
  onMobileClose,
}: Props) {
  const chrome = chromeFor(dark);
  // The topbar shrinks from h-20 to h-12 once scrolled past 60px. The sticky
  // sidebar mirrors that so its top never separates from the topbar.
  const scrolled = useScrolled(60);
  const stickyTop = scrolled ? "top-12" : "top-20";
  const maxH = scrolled
    ? "max-h-[calc(100vh-3.5rem)]"
    : "max-h-[calc(100vh-5.5rem)]";
  const steps = useMemo(() => walkCurriculum(), []);
  const stepByPath = useMemo(() => {
    const m = new Map<string, CurriculumStep>();
    for (const s of steps) m.set(s.article.path, s);
    return m;
  }, [steps]);

  const activeStep = useMemo(() => {
    if (!activeSlug) return undefined;
    return steps.find((s) => s.article.slug === activeSlug);
  }, [steps, activeSlug]);

  const activeRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (!activeSlug || !activeRef.current) return;
    activeRef.current.scrollIntoView({ block: "center" });
  }, [activeSlug]);

  const q = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!q) return null;
    const set = new Set<string>();
    for (const s of steps) {
      const a = s.article;
      const hit =
        a.title.toLowerCase().includes(q) ||
        a.path.toLowerCase().includes(q) ||
        (a.blurb?.[lang] ?? "").toLowerCase().includes(q) ||
        s.sectionTitle[lang].toLowerCase().includes(q) ||
        s.partTitle[lang].toLowerCase().includes(q);
      if (hit) set.add(a.path);
    }
    return set;
  }, [q, steps, lang]);

  const activeText = dark ? "text-violet-200" : "text-violet-700";
  const activeNum = dark ? "text-violet-300" : "text-violet-700";
  const starInactive = dark ? "text-violet-400" : "text-violet-400";
  const rowIdle = dark
    ? "border-transparent text-zinc-300 hover:border-white/15 hover:bg-white/[0.04]"
    : "border-transparent text-zinc-700 hover:border-violet-900/[0.12] hover:bg-violet-500/[0.06]";
  const rowDimmed = dark ? "border-transparent text-zinc-600" : "border-transparent text-zinc-400";
  const rowActive = dark
    ? "border-violet-400 bg-violet-500/[0.14] text-violet-200 font-semibold"
    : "border-violet-500 bg-violet-500/[0.10] text-violet-700 font-semibold";

  const content = (
    <>
      <header className="mb-5">
        <div className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] ${chrome.textFaint}`}>
          <RoadmapIcon size={13} className={dark ? "text-violet-300" : "text-violet-600"} />
          <span>{blogUI.sidebarTitle[lang]}</span>
        </div>
        <p className={`mt-2 text-[12.5px] leading-snug ${chrome.textMuted}`}>
          {blogUI.sidebarHint[lang]}
        </p>
      </header>

      <div className="mb-5">
        <label className={`flex items-center gap-2 rounded-md border ${chrome.borderHairline} ${chrome.cardBg} px-2.5 py-1.5 focus-within:border-violet-500/50`}>
          <SearchIcon size={13} className={chrome.textFaint} />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={blogUI.searchPlaceholder[lang]}
            className={`w-full bg-transparent text-[12.5px] outline-none ${chrome.textBody} ${dark ? "placeholder:text-zinc-500" : "placeholder:text-zinc-400"}`}
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className={`${chrome.textFaint} hover:${dark ? "text-zinc-200" : "text-zinc-700"}`}
              aria-label="Clear search"
            >
              <CloseIcon size={12} />
            </button>
          ) : null}
        </label>
      </div>

      <nav aria-label={blogUI.sidebarTitle[lang]}>
        {CURRICULUM.map((part) => {
          if (matches !== null && !partHasMatch(part, matches)) return null;
          return (
            <div
              key={part.slug}
              className={`mt-10 border-t ${chrome.borderHairline} pt-6 first:mt-0 first:border-t-0 first:pt-0`}
            >
              <PartHeader part={part} lang={lang} chrome={chrome} />
              <div className="mt-5 space-y-5">
                {part.sections.map((section) => {
                  if (matches !== null && !sectionHasMatch(section, matches)) return null;
                  return (
                    <SectionBlock
                      key={section.slug}
                      section={section}
                      stepByPath={stepByPath}
                      matches={matches}
                      activePath={activeStep?.article.path}
                      activeRef={activeRef}
                      lang={lang}
                      dark={dark}
                      activeText={activeText}
                      activeNum={activeNum}
                      starInactive={starInactive}
                      rowIdle={rowIdle}
                      rowDimmed={rowDimmed}
                      rowActive={rowActive}
                      faintText={chrome.textFaint}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <aside
        className={`hidden md:block sticky ${stickyTop} ${maxH} overflow-y-auto themed-scrollbar pr-2 ${chrome.textBody} transition-all duration-300`}
        style={{ scrollbarGutter: "stable" }}
      >
        {content}
      </aside>

      <div
        className={`md:hidden fixed inset-0 transition ${
          mobileOpen
            ? "z-40 pointer-events-auto"
            : "-z-10 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={onMobileClose}
          className={`absolute inset-0 ${chrome.scrim} transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-y-0 left-0 w-[88%] max-w-[340px] overflow-y-auto px-4 py-6 shadow-2xl transition-transform ${chrome.drawerBg} ${chrome.textBody} ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer navheader: was an almost-invisible 10px mono eyebrow before
           * — bumped to a real title row so the panel reads as a labelled
           * surface, not a blank slide-out. Icon mirrors the topbar's tree
           * button so the user can tell at a glance "this is the same thing,
           * opened". */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className={`flex items-center gap-2 text-[15px] font-extrabold tracking-tight ${chrome.textBody}`}>
              <RoadmapIcon size={16} className={dark ? "text-violet-300" : "text-violet-600"} />
              {blogUI.sidebarTitle[lang]}
            </span>
            <button
              type="button"
              onClick={onMobileClose}
              className={`shrink-0 rounded-full p-2 ${dark ? "hover:bg-white/[0.06]" : "hover:bg-black/[0.04]"}`}
              aria-label={blogUI.closeTree[lang]}
            >
              <CloseIcon size={16} />
            </button>
          </div>
          {content}
        </div>
      </div>
    </>
  );
}

/* ─────────── part header ─────────── */
function PartHeader({
  part,
  lang,
  chrome,
}: {
  part: CurriculumPart;
  lang: "en" | "pt";
  chrome: ReturnType<typeof chromeFor>;
}) {
  return (
    <div className="flex items-baseline gap-2.5">
      <span className="text-[18px] leading-none">{part.emoji}</span>
      <div className="min-w-0">
        <p className={`font-mono text-[9.5px] font-semibold uppercase tracking-[0.32em] ${chrome.textFaint}`}>
          {blogUI.partLabel[lang]} {part.number}
        </p>
        <h3 className={`mt-1 font-sans text-[16px] font-extrabold leading-tight tracking-tight ${chrome.textBody}`}>
          {part.title[lang]}
        </h3>
      </div>
    </div>
  );
}

/* ─────────── section block ─────────── */
function SectionBlock({
  section,
  stepByPath,
  matches,
  activePath,
  activeRef,
  lang,
  dark,
  activeText,
  activeNum,
  starInactive,
  rowIdle,
  rowDimmed,
  rowActive,
  faintText,
}: {
  section: CurriculumSection;
  stepByPath: Map<string, CurriculumStep>;
  matches: Set<string> | null;
  activePath?: string;
  activeRef: React.RefObject<HTMLAnchorElement | null>;
  lang: "en" | "pt";
  dark: boolean;
  activeText: string;
  activeNum: string;
  starInactive: string;
  rowIdle: string;
  rowDimmed: string;
  rowActive: string;
  faintText: string;
}) {
  return (
    <div>
      {section.number || section.title ? (
        <h4 className={`mb-1.5 flex items-baseline gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] ${faintText}`}>
          {section.number ? (
            <span className={activeText}>{section.number}</span>
          ) : null}
          <span>{section.title[lang]}</span>
        </h4>
      ) : null}

      <ul className="space-y-px">
        {section.articles.map((a) => (
          <NodeRow
            key={a.path}
            step={stepByPath.get(a.path)!}
            isActive={a.path === activePath}
            isMatch={matches ? matches.has(a.path) : null}
            ref={a.path === activePath ? activeRef : undefined}
            dark={dark}
            activeNum={activeNum}
            starInactive={starInactive}
            rowIdle={rowIdle}
            rowDimmed={rowDimmed}
            rowActive={rowActive}
          />
        ))}
      </ul>

      {section.subSections?.map((sub) => {
        const subMatches =
          matches === null || sub.articles.some((a) => matches.has(a.path));
        if (!subMatches) return null;
        return (
          <div key={sub.slug} className="mt-3">
            <h5 className={`mb-1 pl-2 font-sans text-[11px] font-semibold tracking-tight ${faintText}`}>
              {sub.title[lang]}
            </h5>
            <ul className="space-y-px">
              {sub.articles.map((a) => (
                <NodeRow
                  key={a.path}
                  step={stepByPath.get(a.path)!}
                  isActive={a.path === activePath}
                  isMatch={matches ? matches.has(a.path) : null}
                  ref={a.path === activePath ? activeRef : undefined}
                  dark={dark}
                  activeNum={activeNum}
                  starInactive={starInactive}
                  rowIdle={rowIdle}
                  rowDimmed={rowDimmed}
                  rowActive={rowActive}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────── article row ─────────── */
function NodeRow({
  step,
  isActive,
  isMatch,
  ref,
  dark,
  activeNum,
  starInactive,
  rowIdle,
  rowDimmed,
  rowActive,
}: {
  step: CurriculumStep;
  isActive: boolean;
  isMatch: boolean | null;
  ref?: React.Ref<HTMLAnchorElement>;
  dark: boolean;
  activeNum: string;
  starInactive: string;
  rowIdle: string;
  rowDimmed: string;
  rowActive: string;
}) {
  const a = step.article;
  const dimmed = isMatch === false;
  const numIdle = dark ? "text-zinc-500" : "text-zinc-400";

  return (
    <li>
      <Link
        ref={ref}
        href={pathForBlog(a.slug)}
        className={`group flex items-baseline gap-2.5 rounded-md border-l-2 py-1 pl-2.5 pr-2 text-[13px] leading-tight transition ${
          isActive ? rowActive : dimmed ? rowDimmed : rowIdle
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        <span
          className={`shrink-0 font-mono text-[10px] tabular-nums ${
            isActive ? activeNum : numIdle
          }`}
        >
          {String(step.number).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1 truncate">{a.title}</span>
        {a.featured ? (
          <StarFilledIcon
            size={9}
            className={`shrink-0 ${isActive ? activeNum : starInactive}`}
          />
        ) : null}
      </Link>
    </li>
  );
}

/* ─────────── search helpers ─────────── */
function sectionHasMatch(section: CurriculumSection, matches: Set<string>): boolean {
  for (const a of section.articles) if (matches.has(a.path)) return true;
  for (const sub of section.subSections ?? [])
    for (const a of sub.articles) if (matches.has(a.path)) return true;
  return false;
}

function partHasMatch(part: CurriculumPart, matches: Set<string>): boolean {
  return part.sections.some((s) => sectionHasMatch(s, matches));
}
