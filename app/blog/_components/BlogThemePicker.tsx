"use client";

import { useEffect } from "react";
import { TbCheck, TbMoonStars, TbSun, TbX } from "react-icons/tb";
import { blogUI } from "../../data/articles";
import type { Lang } from "../../data/cv";

export type BlogThemeMode = "light" | "dark";

type Props = {
  open: boolean;
  lang: Lang;
  current: BlogThemeMode;
  onSelect: (mode: BlogThemeMode) => void;
  onClose: () => void;
};

/** Lightweight light/dark chooser shown when the user opens "Trocar tema"
 * inside the blog. The modal itself adopts the currently-selected mode so it
 * stays consistent with the page underneath. Each option renders a miniature
 * of the actual blog page so the choice is visually grounded. */
export default function BlogThemePicker({
  open,
  lang,
  current,
  onSelect,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const dark = current === "dark";
  const modalSurface = dark
    ? "bg-[#252232] text-zinc-100 ring-white/10"
    : "bg-white text-zinc-900 ring-black/5";
  const hintText = dark ? "text-zinc-400" : "text-zinc-500";
  const closeBtn = dark
    ? "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
    : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={blogUI.themePickerTitle[lang]}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm print:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`flex w-full max-w-[520px] flex-col overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] ring-1 ${modalSurface}`}>
        <header className="flex items-start justify-between gap-4 px-6 pb-2 pt-5">
          <div className="min-w-0">
            <h2 className="font-sans text-[18px] font-bold tracking-tight">
              {blogUI.themePickerTitle[lang]}
            </h2>
            <p className={`mt-0.5 text-[12.5px] leading-snug ${hintText}`}>
              {blogUI.themePickerHint[lang]}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={blogUI.closeTree[lang]}
            className={`-mr-1.5 -mt-1 grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full transition-colors ${closeBtn}`}
          >
            <TbX size={16} />
          </button>
        </header>

        <div className="grid gap-3 p-5 sm:grid-cols-2">
          <ModeCard
            mode="light"
            active={current === "light"}
            dark={dark}
            onSelect={() => onSelect("light")}
            title={blogUI.themeLight[lang]}
            hint={blogUI.themeLightHint[lang]}
          />
          <ModeCard
            mode="dark"
            active={current === "dark"}
            dark={dark}
            onSelect={() => onSelect("dark")}
            title={blogUI.themeDark[lang]}
            hint={blogUI.themeDarkHint[lang]}
          />
        </div>
      </div>
    </div>
  );
}

/** Single mode tile: a miniature of the blog page above, label + check below.
 * The card chrome follows the modal mode (dark surface around dark modal),
 * not the option's mode — that distinction lives entirely in the miniature. */
function ModeCard({
  mode,
  active,
  dark,
  onSelect,
  title,
  hint,
}: {
  mode: BlogThemeMode;
  active: boolean;
  dark: boolean;
  onSelect: () => void;
  title: string;
  hint: string;
}) {
  const isLight = mode === "light";
  const cardBase = dark ? "bg-white/[0.03]" : "bg-white";
  const idleBorder = dark
    ? "border-white/10 hover:border-white/20"
    : "border-zinc-200 hover:border-zinc-300";
  const activeBorder = "border-violet-500 ring-2 ring-violet-500/30";
  const hintText = dark ? "text-zinc-400" : "text-zinc-500";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border p-2.5 text-left transition ${cardBase} ${
        active ? activeBorder : idleBorder
      }`}
    >
      <MiniPreview mode={mode} />

      <div className="mt-3 flex items-center gap-2 px-1">
        {isLight ? (
          <TbSun size={16} className="shrink-0 text-amber-500" />
        ) : (
          <TbMoonStars size={16} className="shrink-0 text-violet-400" />
        )}
        <span className="font-sans text-[14px] font-bold tracking-tight">{title}</span>
        {active ? (
          <span className="ml-auto grid h-5 w-5 place-items-center rounded-full bg-violet-600 text-white">
            <TbCheck size={12} strokeWidth={3} />
          </span>
        ) : null}
      </div>
      <p className={`mt-1 px-1 pb-0.5 text-[11.5px] leading-snug ${hintText}`}>
        {hint}
      </p>
    </button>
  );
}

/** Faux mini blog: page surface + a topbar line + heading bar + three Part
 * tiles (violet / fuchsia / teal). Mirrors the real index layout in
 * miniature so the preview reads as "this is what your blog will look like". */
function MiniPreview({ mode }: { mode: BlogThemeMode }) {
  const isLight = mode === "light";
  const surface = isLight ? "bg-white" : "bg-[#1c1923]";
  const surfaceRing = isLight ? "ring-zinc-200" : "ring-white/10";
  const topbarBg = isLight ? "bg-zinc-100" : "bg-white/[0.05]";
  const dotIdle = isLight ? "bg-zinc-300" : "bg-white/15";
  const dotActive = isLight ? "bg-violet-500" : "bg-violet-400";
  const headingBar = isLight ? "bg-zinc-800" : "bg-zinc-200";
  const subBar = isLight ? "bg-zinc-300" : "bg-white/15";

  const tiles = isLight
    ? [
        { grad: "from-white to-violet-100", border: "border-violet-300/60", dot: "bg-violet-500" },
        { grad: "from-white to-fuchsia-100", border: "border-fuchsia-300/60", dot: "bg-fuchsia-500" },
        { grad: "from-white to-teal-100", border: "border-teal-300/60", dot: "bg-teal-500" },
      ]
    : [
        { grad: "from-[#262333] to-violet-500/30", border: "border-violet-400/30", dot: "bg-violet-300" },
        { grad: "from-[#262333] to-fuchsia-500/30", border: "border-fuchsia-400/30", dot: "bg-fuchsia-300" },
        { grad: "from-[#262333] to-teal-500/30", border: "border-teal-400/30", dot: "bg-teal-300" },
      ];

  return (
    <div
      className={`relative aspect-[5/3] w-full overflow-hidden rounded-lg ring-1 ${surface} ${surfaceRing}`}
    >
      {/* Topbar */}
      <div className={`flex h-4 items-center gap-1 px-2 ${topbarBg}`}>
        <span className={`h-1 w-1 rounded-full ${dotActive}`} />
        <span className={`h-1 w-3 rounded-full ${dotIdle}`} />
        <span className={`ml-auto h-1 w-2 rounded-full ${dotIdle}`} />
      </div>

      {/* Heading + subline */}
      <div className="px-2.5 pt-2">
        <span className={`block h-2 w-16 rounded-full ${headingBar}`} />
        <span className={`mt-1 block h-1 w-10 rounded-full ${subBar}`} />
      </div>

      {/* Three Part tiles */}
      <div className="absolute inset-x-2 bottom-2 flex gap-1.5">
        {tiles.map((t, i) => (
          <div
            key={i}
            className={`flex-1 rounded-md border bg-gradient-to-br p-1 ${t.grad} ${t.border}`}
          >
            <span className={`block h-1 w-3 rounded-full ${t.dot}`} />
            <span className={`mt-1 block h-1 w-5 rounded-full ${isLight ? "bg-zinc-300" : "bg-white/20"}`} />
            <span className={`mt-0.5 block h-1 w-4 rounded-full ${isLight ? "bg-zinc-200" : "bg-white/10"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
