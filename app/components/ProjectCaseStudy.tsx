"use client";

import { useEffect, useRef, useState } from "react";
import {
  TbArrowUpRight,
  TbChevronLeft,
  TbChevronRight,
} from "react-icons/tb";
import type { Bilingual, Experience, Lang, Project, ProjectStackGroup } from "../data/cv";
import { isGroupedStack, experienceSlug } from "../data/cv";
import { dispatchCvNavigate } from "../data/navigation";
import ProjectMockup, {
  getShotCount,
  getSlotAspectClass,
  projectVariantFromName,
} from "./ProjectMockup";
import { TechIcon, getTechLabel } from "./icons/TechIcon";

export type CaseStudyTheme = {
  /** Background of the outer card. */
  surface: string;
  /** Background of the bottom step pane (where the screen + caption live). */
  surfaceMuted: string;
  /** Subtle border between sections / chips. */
  border: string;
  /** Stronger outer border of the card. */
  borderStrong: string;
  /** Primary text color. */
  text: string;
  /** Secondary text color (descriptions, captions). */
  textMuted: string;
  /** Small-caps label color (kicker). */
  kicker: string;
  /** Active accent (selected tab background, dot, link icon). */
  accent: string;
  /** Text color used on top of the accent (e.g. selected tab label). */
  accentText: string;
  /** rgba color used to render the deep drop shadow under the screenshot. */
  shadow: string;
  /** Background for stack chips. */
  chipBg: string;
  /** Border for stack chips. */
  chipBorder: string;
};

export type CaseStudyLabels = {
  /** Step counter prefix, e.g. "Step" / "Passo". */
  step: string;
  /** Aria label for previous-screen button. */
  prev: string;
  /** Aria label for next-screen button. */
  next: string;
  /** Fallback heading when a screen has no title. */
  screen: string;
};

type Props = {
  projects: Project[];
  /** Optional experience list so the case study can quote the matching
   *  experience entry's summary when `project.experienceCompany` is set,
   *  instead of repeating the same long text in `project.description`. */
  experiences?: Experience[];
  lang: Lang;
  theme: CaseStudyTheme;
  labels: CaseStudyLabels;
  className?: string;
  /**
   * Ignore each project's own brand accent and always render with the
   * theme's accent. Star Wars uses this so the project showcase keeps the
   * hologram cyan even for projects that ship their own brand color, which
   * would otherwise fight the cyan light cone projected over the frame.
   */
  lockAccent?: boolean;
  /** Disabled placeholder tabs appended after the real projects. Pure
   *  placeholders (e.g. "Outro 1") so the visitor sees that more is
   *  coming; the "coming soon" message lives in the hover tooltip only. */
  comingSoon?: Bilingual[];
};

/**
 * Case-study layout for the Featured Projects section. Shows one project at a
 * time with: an intro pane (tagline, name, description, stack chips) and a
 * paged screen pane underneath where each "page" is a screenshot rendered with
 * a deep drop shadow alongside its own title + body explanation.
 */
export default function ProjectCaseStudy({
  projects,
  experiences,
  lang,
  theme: baseTheme,
  labels,
  className = "",
  lockAccent = false,
  comingSoon,
}: Props) {
  const [pIdx, setPIdx] = useState(0);
  const project = projects[pIdx];
  const variant = projectVariantFromName(project.name);
  const total = project.screens?.length ?? getShotCount(variant);
  const [shot, setShot] = useState(0);
  // Per-project accent override: when a project ships its own brand color
  // (e.g. DLOA.AI's red), it takes over the navigation so the tabs, chapter
  // rail and step counters echo the screenshots instead of the theme.
  // `lockAccent` opts out of this: Star Wars needs the hologram cyan to win
  // over project brand colors so the showcase stays consistent with the
  // cyan light cone the droid is casting onto it.
  const theme: CaseStudyTheme = {
    ...baseTheme,
    accent: lockAccent ? baseTheme.accent : project.accent ?? baseTheme.accent,
    accentText: lockAccent
      ? baseTheme.accentText
      : project.accentText ?? baseTheme.accentText,
  };
  const mobileRailRef = useRef<HTMLDivElement>(null);
  const desktopRailRef = useRef<HTMLElement>(null);
  // Edge-of-scroll affordances: hide the left chevron/fade at the start
  // and the right ones at the end so the swipe hint is directional.
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const selectProject = (i: number) => {
    setPIdx(i);
    setShot(0);
  };

  // Arrow keys page through screens when the case study has focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = document.activeElement as HTMLElement | null;
      if (!t || !t.closest("[data-cs-root]")) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setShot((i) => (i + 1) % total);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setShot((i) => (i - 1 + total) % total);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  // Center the active chapter card in the mobile rail when shot/project
  // changes (so chevron taps and project switches don't leave the active
  // card off-screen). Uses scrollTo on the rail itself rather than
  // scrollIntoView, which would also scroll the page vertically.
  // Also pushes the edge state directly: smooth scrolls don't reliably
  // fire `scroll` events in every browser, so without this the left
  // chevron stayed visible after auto-centering back to the first card.
  useEffect(() => {
    const rail = mobileRailRef.current;
    if (!rail) return;
    const active = rail.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;
    const target = active.offsetLeft - (rail.clientWidth - active.clientWidth) / 2;
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const left = Math.max(0, Math.min(target, maxScroll));
    rail.scrollTo({ left, behavior: "smooth" });
    setAtStart(left <= 1);
    setAtEnd(left >= maxScroll - 1);
  }, [shot, pIdx]);

  // Same idea on the desktop chapter rail: keep the active step in view
  // as the user pages through screenshots in either direction. Long
  // chapter lists otherwise let the active card drift above or below the
  // viewport with no visual feedback that the rail is scrollable.
  useEffect(() => {
    const rail = desktopRailRef.current;
    if (!rail) return;
    const active = rail.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;
    const target =
      active.offsetTop - (rail.clientHeight - active.clientHeight) / 2;
    const maxScroll = Math.max(0, rail.scrollHeight - rail.clientHeight);
    const top = Math.max(0, Math.min(target, maxScroll));
    rail.scrollTo({ top, behavior: "smooth" });
  }, [shot, pIdx]);

  // Track scroll edges on the mobile rail so the directional fades + chevrons
  // hide whichever side has nothing left to scroll into. Manual swipes are
  // covered here; auto-center handles the programmatic case above.
  useEffect(() => {
    const rail = mobileRailRef.current;
    if (!rail) return;
    const update = () => {
      const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
      setAtStart(rail.scrollLeft <= 1);
      setAtEnd(rail.scrollLeft >= maxScroll - 1);
    };
    update();
    rail.addEventListener("scroll", update, { passive: true });
    return () => rail.removeEventListener("scroll", update);
  }, [pIdx, total]);

  const screen = project.screens?.[shot];

  return (
    <div
      data-cs-root
      tabIndex={0}
      className={`overflow-hidden rounded-xl border outline-none ${className}`}
      style={{ borderColor: theme.borderStrong, background: theme.surface }}
    >
      {/* ── Intro: title shares the top row with the tab list (aligned with
          the H3, top-right), while the description and stack chips below
          take the full card width and aren't squeezed by the tabs. ────── */}
      <div
        className="px-5 py-3 md:px-6 md:py-3.5"
        key={`intro-${project.name}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <h3
            className="min-w-0 text-[19px] font-extrabold leading-tight tracking-tight md:text-[22px]"
            style={{ color: theme.text }}
          >
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-baseline gap-1.5 hover:underline"
              >
                {project.name}
                <TbArrowUpRight size={14} style={{ color: theme.accent }} />
              </a>
            ) : (
              project.name
            )}
          </h3>

          {/* Project tabs, baseline-aligned with the H3 in the same row.
              `flex-wrap` on the parent lets the whole tab strip drop to a
              second line on narrow viewports without pushing the title. */}
          <div role="tablist" aria-label="Projects" className="flex shrink-0 flex-wrap items-center gap-1.5">
            {projects.map((p, i) => {
              const active = i === pIdx;
              return (
                <button
                  key={p.name}
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectProject(i)}
                  style={
                    {
                      "--tab-bg": active ? theme.accent : "transparent",
                      "--tab-bg-hover": active ? theme.accent : theme.chipBg,
                      "--tab-border": active ? theme.accent : theme.border,
                      "--tab-fg": active ? theme.accentText : theme.textMuted,
                      "--tab-fg-hover": active ? theme.accentText : theme.text,
                    } as React.CSSProperties
                  }
                  className="cursor-pointer rounded-md border px-2.5 py-1 text-[11.5px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 bg-[var(--tab-bg)] hover:bg-[var(--tab-bg-hover)] border-[var(--tab-border)] text-[var(--tab-fg)] hover:text-[var(--tab-fg-hover)]"
                >
                  {p.name}
                </button>
              );
            })}
            {/* Coming-soon placeholders. Same shape as the real tabs but
                inert; the "coming soon" copy lives in the hover tooltip
                only, not in the visible chrome. */}
            {comingSoon?.map((name, i) => (
              <span
                key={`soon-${i}`}
                role="tab"
                aria-disabled="true"
                aria-selected="false"
                title={lang === "en" ? "Coming soon" : "Em breve"}
                style={
                  {
                    "--tab-border": theme.border,
                    "--tab-fg": theme.textMuted,
                  } as React.CSSProperties
                }
                className="inline-flex cursor-not-allowed items-center rounded-md border border-dashed px-2.5 py-1 text-[11.5px] font-semibold opacity-60 bg-transparent border-[var(--tab-border)] text-[var(--tab-fg)]"
              >
                {name[lang]}
              </span>
            ))}
          </div>
        </div>

        {/* Description body. Either quoted from the linked experience
            entry (preferred — avoids duplicating the same text in two
            places) or pulled from `project.description` as a fallback. */}
        {(() => {
          const linkedExperience =
            project.experienceCompany && experiences
              ? experiences.find((x) => x.company === project.experienceCompany)
              : null;
          const body: string | null = linkedExperience
            ? linkedExperience.summary[lang]
            : project.description
              ? project.description[lang]
              : null;
          if (!body) return null;
          // Pull-quote layout, classic magazine/blog pattern: rounded
          // card with a left accent rail, a large decorative serif " in
          // the top-left to anchor it as a quotation, the body inside a
          // <blockquote>, and the source as a clickable <cite> at the
          // foot ("citação da experiência em <Company> ↑"). When the
          // body is just `project.description` (no linked experience),
          // the same paragraph splitter runs without the citation chrome.
          if (!linkedExperience) {
            return (
              <div className="mt-3 space-y-2">
                {body.split("\n\n").map((p, i) => (
                  <p
                    key={i}
                    className="text-[12.5px] leading-snug"
                    style={{ color: theme.textMuted }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            );
          }
          // Drop asides (paragraph labels ending with `:`) so the case
          // study citation flows as a single inline-quoted block, with no
          // section separators inside it.
          const paragraphs = body
            .split("\n\n")
            .map((p) => p.trim())
            .filter((p) => p && !p.endsWith(":"));
          return (
            <figure className="mt-3">
              <blockquote
                className="space-y-2 text-[12.5px] leading-snug"
                style={{ color: theme.textMuted }}
              >
                {paragraphs.map((p, i) => (
                  <p key={i}>
                    {i === 0 && (
                      <span
                        aria-hidden
                        className="font-serif"
                        style={{
                          fontSize: "36px",
                          lineHeight: 0,
                          verticalAlign: "-0.35em",
                          marginRight: "0.1em",
                        }}
                      >
                        {"“"}
                      </span>
                    )}
                    {p}
                    {i === paragraphs.length - 1 && (
                      <span
                        aria-hidden
                        className="font-serif"
                        style={{
                          fontSize: "36px",
                          lineHeight: 0,
                          verticalAlign: "-0.35em",
                          marginLeft: "0.05em",
                        }}
                      >
                        {"”"}
                      </span>
                    )}
                  </p>
                ))}
              </blockquote>
              <figcaption className="mt-1 text-[11px]" style={{ color: theme.textMuted }}>
                <a
                  href={`?section=experience&company=${experienceSlug(linkedExperience.company)}`}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                    e.preventDefault();
                    dispatchCvNavigate(
                      "cv-experience",
                      experienceSlug(linkedExperience.company),
                    );
                  }}
                  className="hover:underline"
                >
                  <cite className="not-italic">
                    {lang === "en"
                      ? `Description of the project, taken and repeated from the experience at ${linkedExperience.company}`
                      : `Descrição do projeto, retirada e repetida da experiência em ${linkedExperience.company}`}
                  </cite>
                  <span aria-hidden> ↑</span>
                </a>
              </figcaption>
            </figure>
          );
        })()}
        <div className="mt-3 flex flex-col gap-1.5">
          {(isGroupedStack(project.stack)
            ? project.stack
            : [
                {
                  label: { en: "", pt: "" },
                  items: project.stack,
                } satisfies ProjectStackGroup,
              ]
          ).map((group, gi) => (
            <div
              key={`${group.label.en}-${gi}`}
              className="flex flex-wrap items-center gap-1"
            >
              {group.label[lang] ? (
                <span
                  className="mr-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: theme.accent }}
                >
                  {group.label[lang]}
                </span>
              ) : null}
              {group.items.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                  style={{
                    background: theme.chipBg,
                    borderColor: theme.chipBorder,
                    color: theme.textMuted,
                  }}
                >
                  <TechIcon name={s} size={10} />
                  {getTechLabel(s)}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Body: chapter rail (left, md+) + viewer (right) ───────── */}
      <div
        className="grid grid-cols-1 border-t md:grid-cols-[260px_1fr]"
        style={{ borderColor: theme.border }}
      >
        {/* Chapter rail, bordered rounded cards, one per chapter.
            Wrapper is relative + grid-stretched; the nav is absolute inside,
            so a long list scrolls instead of growing the row past the image. */}
        <div className="relative hidden md:block">
        <nav
          ref={desktopRailRef}
          aria-label="Screens"
          role="tablist"
          className="themed-scrollbar absolute inset-0 flex flex-col overflow-y-auto py-6 pl-6 pr-5"
          style={
            {
              "--sb-thumb": theme.borderStrong,
              "--sb-thumb-hover": theme.accent,
            } as React.CSSProperties
          }
        >
          <ol className="flex flex-col gap-2">
            {(project.screens ?? Array.from({ length: total })).map((_, i) => {
              const active = i === shot;
              const t =
                project.screens?.[i]?.title[lang] ?? `${labels.screen} ${i + 1}`;
              return (
                <li key={i}>
                  <button
                    type="button"
                    role="tab"
                    data-active={active}
                    aria-selected={active}
                    tabIndex={active ? 0 : -1}
                    onClick={() => setShot(i)}
                    style={
                      {
                        "--card-bg": active ? theme.accent : "transparent",
                        "--card-bg-hover": active ? theme.accent : theme.chipBg,
                        "--card-border": active ? theme.accent : theme.border,
                        "--card-border-hover": active
                          ? theme.accent
                          : theme.borderStrong,
                        "--card-fg": active ? theme.accentText : theme.textMuted,
                        "--card-fg-hover": active ? theme.accentText : theme.text,
                        "--card-num": active
                          ? theme.accentText
                          : theme.accent,
                      } as React.CSSProperties
                    }
                    className="group/card flex w-full cursor-pointer flex-col gap-1 rounded-xl border px-3.5 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] border-[var(--card-border)] hover:border-[var(--card-border-hover)] text-[var(--card-fg)] hover:text-[var(--card-fg-hover)]"
                  >
                    <span
                      className="font-mono text-[10px] font-extrabold uppercase tracking-[0.25em] tabular-nums"
                      style={{ color: "var(--card-num)" }}
                    >
                      {labels.step} {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[13px] font-semibold leading-snug">
                      {t}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
        </div>

        {/* Viewer column: image + caption */}
        <div className="flex flex-col">
          <div className="relative overflow-hidden bg-black">
            <ProjectMockup
              key={`shot-${project.name}-${shot}`}
              variant={variant}
              shotIndex={shot}
              className={`block ${getSlotAspectClass(variant)} max-h-[55vh] w-full`}
            />

            {total > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => setShot((i) => (i - 1 + total) % total)}
                  aria-label={labels.prev}
                  className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-white shadow-lg backdrop-blur-md transition focus:outline-none md:left-5 md:h-11 md:w-11 bg-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.95)] hover:scale-110 active:scale-95"
                >
                  <TbChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => setShot((i) => (i + 1) % total)}
                  aria-label={labels.next}
                  className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-white shadow-lg backdrop-blur-md transition focus:outline-none md:right-5 md:h-11 md:w-11 bg-[rgba(0,0,0,0.7)] hover:bg-[rgba(0,0,0,0.95)] hover:scale-110 active:scale-95"
                >
                  <TbChevronRight size={22} />
                </button>
              </>
            ) : null}
          </div>

          {/* Caption strip below the image */}
          <div className="border-t border-white/10 bg-black">
            <div
              key={`cap-${project.name}-${shot}`}
              className="px-5 py-3 md:px-6 md:py-3.5"
            >
              <p
                className="font-mono text-[9.5px] font-bold uppercase tracking-[0.35em] tabular-nums"
                style={{ color: theme.accent }}
              >
                {labels.step} {String(shot + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </p>
              <h4 className="mt-1 text-[15px] font-extrabold leading-tight text-white md:text-[17px]">
                {screen?.title[lang] ?? labels.screen}
              </h4>
              <p className="mt-1 text-[12.5px] leading-snug text-white/85">
                {screen?.body[lang] ?? ""}
              </p>

              {/* Chapter rail, mobile only; rail handles desktop.
                  Horizontal snap-scroll of compact cards. The active card
                  auto-centers via the effect on shot/pIdx, so chevron
                  navigation keeps the upcoming chapters in view.
                  Directional fade + chevron overlays telegraph the swipe
                  affordance and hide on whichever edge is already at the
                  end of scroll. */}
              <div className="relative -mx-5 mt-3 md:hidden">
              <div
                ref={mobileRailRef}
                // `scroll-pl-5`/`scroll-pr-5` mirror the px-5 gutter so
                // snap-start aligns to scrollLeft 0 on the first card (and
                // the last card snaps cleanly to the right edge). Without
                // these the snapport ignored the gutter and parked card 1
                // at scrollLeft 20, so `atStart` (≤1) never tripped and the
                // left chevron stayed visible at the start of the rail.
                className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-1 scroll-pl-5 scroll-pr-5"
                role="tablist"
                aria-label="Screens"
              >
                {(project.screens ?? Array.from({ length: total })).map((_, i) => {
                  const active = i === shot;
                  const t =
                    project.screens?.[i]?.title[lang] ?? `${labels.screen} ${i + 1}`;
                  return (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      data-active={active}
                      aria-selected={active}
                      tabIndex={active ? 0 : -1}
                      onClick={() => setShot(i)}
                      style={
                        {
                          "--card-bg": active ? theme.accent : "rgba(255,255,255,0.05)",
                          "--card-border": active ? theme.accent : "rgba(255,255,255,0.18)",
                          "--card-fg": active ? theme.accentText : "rgba(255,255,255,0.9)",
                          "--card-num": active ? theme.accentText : theme.accent,
                        } as React.CSSProperties
                      }
                      className="flex w-[150px] shrink-0 cursor-pointer snap-start flex-col gap-0.5 rounded-lg border px-2.5 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--card-fg)]"
                    >
                      <span
                        className="font-mono text-[9px] font-extrabold uppercase tracking-[0.3em] tabular-nums"
                        style={{ color: "var(--card-num)" }}
                      >
                        {labels.step} {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="line-clamp-2 text-[11.5px] font-semibold leading-snug">
                        {t}
                      </span>
                    </button>
                  );
                })}
              </div>
              {/* Left edge fade + chevron, hidden when at start */}
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-start bg-gradient-to-r from-black to-transparent transition-opacity duration-150 ${atStart ? "opacity-0" : "opacity-100"}`}
              >
                <div className="ml-1 rounded-full bg-black/55 p-1 backdrop-blur-sm">
                  <TbChevronLeft size={14} className="text-white/90" />
                </div>
              </div>
              {/* Right edge fade + chevron, hidden when at end */}
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-end bg-gradient-to-l from-black to-transparent transition-opacity duration-150 ${atEnd ? "opacity-0" : "opacity-100"}`}
              >
                <div className="mr-1 rounded-full bg-black/55 p-1 backdrop-blur-sm">
                  <TbChevronRight size={14} className="text-white/90" />
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
