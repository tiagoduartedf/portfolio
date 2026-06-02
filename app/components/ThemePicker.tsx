"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { TbArrowRight, TbStar, TbX } from "react-icons/tb";
import {
  THEME_GROUPS,
  THEME_META,
  pathForTheme,
  type ThemeGroup,
  type ThemeKey,
} from "../data/navigation";
import type { Lang } from "../data/cv";
import ThemePreview from "./ThemePreview";

type Props = {
  open: boolean;
  lang: Lang;
  onSelect: (theme: ThemeKey) => void;
  onClose: () => void;
};

type GroupSlug = ThemeGroup["slug"];

const GROUP_BADGE: Record<GroupSlug, string> =
  {
    hr: "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200",
    dev: "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200",
    stylish: "bg-purple-100 text-purple-800 ring-1 ring-inset ring-purple-200",
  };

const GROUP_DOT: Record<GroupSlug, string> = {
  hr: "bg-emerald-500",
  dev: "bg-blue-500",
  stylish: "bg-purple-500",
};

/** The HR theme is the primary one: it's what most recruiters see first.
 * Everything else is grouped under a smaller "secondary" column. */
const PRIMARY_THEME: ThemeKey = "notion";

export default function ThemePicker({
  open,
  lang,
  onSelect,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Split into the featured (HR) theme and the rest. Order of the rest follows
  // the THEME_GROUPS declaration order.
  const { featured, others } = useMemo(() => {
    const flat = THEME_GROUPS.flatMap((group) =>
      group.themes.map((key) => ({ key, group })),
    );
    return {
      featured: flat.find((e) => e.key === PRIMARY_THEME) ?? flat[0],
      others: flat.filter((e) => e.key !== PRIMARY_THEME),
    };
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === "en" ? "Choose a theme" : "Escolher um tema"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-3 backdrop-blur-sm [@media(min-height:820px)]:py-6 print:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="flex max-h-full w-full max-w-[1180px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white text-zinc-900 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.55)]"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-black/10 bg-gradient-to-b from-zinc-50 to-white px-7 py-3 sm:py-3.5 [@media(min-height:820px)]:sm:py-5">
          <div>
            <h2 className="font-sans text-[22px] font-bold tracking-tight">
              {lang === "en" ? "Pick a CV theme" : "Escolha um tema do currículo"}
            </h2>
            <p className="mt-1 text-[13.5px] text-zinc-600">
              {lang === "en"
                ? "Same CV, same content, presented differently."
                : "É o mesmo currículo, com as mesmas informações, apresentadas de formas diferentes."}
            </p>
            <Legend lang={lang} />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={lang === "en" ? "Close" : "Fechar"}
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <TbX size={18} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto px-5 py-3 sm:px-7 [@media(min-height:820px)]:sm:py-5">
          {/* lg+: side-by-side layout. Featured Notion left (~60%), three mini
           * cards stacked right (~40%). Everything fits above the fold on a
           * 1366×768 laptop.
           * `minmax(0,Xfr)` overrides CSS grid's default `min-width:auto` on
           * grid items — without it, wide content in one column forces the
           * other to collapse. `min-w-0` on the children belt-and-suspenders. */}
          <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-5">
            <div className="min-w-0">
              <FeaturedThemeCard
                themeKey={featured.key}
                lang={lang}
                groupSlug={featured.group.slug}
                groupBadge={featured.group.badge[lang]}
                orientation="vertical"
                onSelect={() => onSelect(featured.key)}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-3">
              {others.map(({ key, group }) => (
                <MiniThemeCard
                  key={key}
                  themeKey={key}
                  lang={lang}
                  groupSlug={group.slug}
                  groupBadge={group.badge[lang]}
                  onSelect={() => onSelect(key)}
                />
              ))}
            </div>
          </div>

          {/* Below lg: stacked layout. Featured on top (horizontal internal),
           * then a divider, then the secondaries in a 1/2-col grid. */}
          <div className="lg:hidden">
            <FeaturedThemeCard
              themeKey={featured.key}
              lang={lang}
              groupSlug={featured.group.slug}
              groupBadge={featured.group.badge[lang]}
              orientation="horizontal"
              onSelect={() => onSelect(featured.key)}
            />
            <div className="mt-5 flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                {lang === "en" ? "Other themes" : "Outros temas"}
              </span>
              <span className="h-px flex-1 bg-zinc-200" />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {others.map(({ key, group }) => (
                <ThemeCard
                  key={key}
                  themeKey={key}
                  lang={lang}
                  groupSlug={group.slug}
                  groupBadge={group.badge[lang]}
                  onSelect={() => onSelect(key)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ lang }: { lang: Lang }) {
  const items: { slug: GroupSlug; label: string }[] = THEME_GROUPS.map((g) => ({
    slug: g.slug,
    label: g.title[lang],
  }));
  return (
    <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-zinc-600">
      {items.map((it) => (
        <li key={it.slug} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${GROUP_DOT[it.slug]}`} />
          <span>{it.label}</span>
        </li>
      ))}
    </ul>
  );
}

function FeaturedThemeCard({
  themeKey,
  lang,
  groupSlug,
  groupBadge,
  orientation,
  onSelect,
}: {
  themeKey: ThemeKey;
  lang: Lang;
  groupSlug: GroupSlug;
  groupBadge: string;
  orientation: "horizontal" | "vertical";
  onSelect: () => void;
}) {
  const meta = THEME_META[themeKey];
  const primaryLabel = lang === "en" ? "Main theme" : "Tema principal";
  const reasonText =
    lang === "en"
      ? "This is the layout most recruiters and HR teams open first. Clean, scannable, written for someone reading 50 CVs in a row."
      : "É o layout que cai primeiro nas mãos do RH. Limpo, fácil de bater o olho, escrito pra quem está lendo 50 currículos seguidos.";
  const ctaLabel =
    lang === "en" ? "View CV in this theme" : "Ver o currículo neste tema";

  const isVertical = orientation === "vertical";

  return (
    <Link
      href={pathForTheme(themeKey)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        onSelect();
      }}
      className={`group relative grid cursor-pointer grid-cols-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-[0_8px_24px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_18px_40px_-14px_rgba(0,0,0,0.18)] ${
        isVertical ? "" : "md:grid-cols-[1.45fr_1fr]"
      }`}
    >
      {/* Preview */}
      <div
        className={
          isVertical
            ? "relative aspect-[2.4/1] overflow-hidden [@media(min-height:820px)]:aspect-[2/1] [@media(min-height:880px)]:aspect-[16/9]"
            : "relative aspect-[3/2] overflow-hidden md:aspect-auto md:min-h-[220px] [@media(min-height:880px)]:md:min-h-[300px]"
        }
      >
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          <ThemePreview theme={themeKey} />
        </div>

        {/* "Tema principal · Para RH" banner, top-right of the preview. Uses
         * the same soft emerald palette as the audience chip in the info
         * column so the visual language matches across both places. */}
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-emerald-800 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.18)] ring-1 ring-inset ring-emerald-200">
          <TbStar size={11} className="shrink-0" />
          {primaryLabel}
          <span aria-hidden className="text-emerald-500">·</span>
          {groupBadge}
        </span>
      </div>

      {/* Info column */}
      <div
        className={
          isVertical
            ? "relative flex flex-col gap-2 border-t border-zinc-100 px-5 py-3 text-zinc-900 transition-colors sm:px-6 [@media(min-height:820px)]:gap-2.5 [@media(min-height:820px)]:sm:py-5"
            : "relative flex flex-col gap-2.5 border-t border-zinc-100 px-5 py-4 text-zinc-900 transition-colors sm:px-6 sm:py-5 md:border-l md:border-t-0 [@media(min-height:880px)]:gap-3 [@media(min-height:880px)]:sm:py-6"
        }
      >
        {/* Title row: theme name + soft audience chip (same shape as mini cards) */}
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-sans text-[20px] font-bold leading-tight tracking-tight">
            {meta.label[lang]}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider ${GROUP_BADGE[groupSlug]}`}
          >
            {groupBadge}
          </span>
        </div>

        <p className="text-[13.5px] leading-relaxed text-zinc-700">
          {meta.description[lang]}
        </p>

        {/* Reason text is informative but costly vertically. Hide it on short
         * viewports so the Notion card fits on 1366×768 laptops. */}
        <p className="hidden text-[12.5px] leading-relaxed text-zinc-500 [@media(min-height:880px)]:block">
          {reasonText}
        </p>

        <span className="mt-auto inline-flex w-fit items-center gap-1.5 self-end whitespace-nowrap rounded-full border border-zinc-900 bg-white px-4 py-2 text-[13px] font-semibold text-zinc-900 transition-colors group-hover:bg-zinc-50">
          {ctaLabel}
          <TbArrowRight size={15} className="shrink-0" />
        </span>
      </div>
    </Link>
  );
}

/** Horizontal mini-card used in the lg+ right-hand stack. Preview on the left,
 * caption on the right, short and dense so three of them stack without
 * pushing past a 1366×768 viewport. */
function MiniThemeCard({
  themeKey,
  lang,
  groupSlug,
  groupBadge,
  onSelect,
}: {
  themeKey: ThemeKey;
  lang: Lang;
  groupSlug: GroupSlug;
  groupBadge: string;
  onSelect: () => void;
}) {
  const meta = THEME_META[themeKey];
  const ctaLabel =
    lang === "en" ? "View CV in this theme" : "Ver o currículo neste tema";
  return (
    <Link
      href={pathForTheme(themeKey)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        onSelect();
      }}
      className="group relative flex h-full min-h-0 flex-1 cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-white text-left shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.18)]"
    >
      {/* Preview on the left. h-full so it stretches to match the card height
       * (the right-hand column uses flex-1, so all three minis end up the same
       * tall regardless of their natural preview aspect). */}
      <div className="relative h-full w-[38%] shrink-0 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.06]">
          <ThemePreview theme={themeKey} />
        </div>
      </div>

      {/* Caption on the right */}
      <div className="flex min-w-0 flex-1 flex-col gap-1 px-3 py-2.5 [@media(min-height:880px)]:py-3">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate font-sans text-[13.5px] font-semibold leading-tight tracking-tight">
            {meta.label[lang]}
          </h3>
          <span
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${GROUP_BADGE[groupSlug]}`}
          >
            {groupBadge}
          </span>
        </div>
        <p className="line-clamp-2 text-[11.5px] leading-snug text-zinc-600 [@media(min-height:880px)]:line-clamp-3">
          {meta.description[lang]}
        </p>
        <span className="mt-auto inline-flex w-fit items-center gap-1 self-end whitespace-nowrap rounded-full border border-zinc-900 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-900 transition-colors group-hover:bg-zinc-50">
          {ctaLabel}
          <TbArrowRight size={12} className="shrink-0" />
        </span>
      </div>
    </Link>
  );
}

function ThemeCard({
  themeKey,
  lang,
  groupSlug,
  groupBadge,
  onSelect,
}: {
  themeKey: ThemeKey;
  lang: Lang;
  groupSlug: GroupSlug;
  groupBadge: string;
  onSelect: () => void;
}) {
  const meta = THEME_META[themeKey];
  const ctaLabel =
    lang === "en" ? "View CV in this theme" : "Ver o currículo neste tema";
  return (
    <Link
      href={pathForTheme(themeKey)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        onSelect();
      }}
      className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-left shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.18)]"
    >
      {/* Preview, faithful mini-mockup */}
      <div className="relative aspect-[3/2] shrink-0 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.06]">
          <ThemePreview theme={themeKey} />
        </div>

        {/* Audience chip, top-left */}
        <span
          className={`absolute left-2 top-2 z-10 rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider shadow-sm backdrop-blur-md ${GROUP_BADGE[groupSlug]}`}
        >
          {groupBadge}
        </span>
      </div>

      {/* Caption */}
      <div className="flex flex-1 flex-col gap-1.5 border-t border-zinc-100 px-3.5 py-3 text-zinc-900">
        <h3 className="font-sans text-[14px] font-semibold leading-tight tracking-tight">
          {meta.label[lang]}
        </h3>
        <p className="line-clamp-3 text-[12px] leading-snug text-zinc-600 [min-height:3em]">
          {meta.description[lang]}
        </p>
        <span className="mt-auto inline-flex w-fit items-center gap-1 self-end whitespace-nowrap rounded-full border border-zinc-900 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-900 transition-colors group-hover:bg-zinc-50">
          {ctaLabel}
          <TbArrowRight size={12} className="shrink-0" />
        </span>
      </div>
    </Link>
  );
}
