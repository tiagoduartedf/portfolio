"use client";

import { useEffect } from "react";
import { TbCheck, TbX } from "react-icons/tb";
import { Flag, type FlagCode } from "./icons/Flag";
import type { Lang } from "../data/cv";

type Props = {
  open: boolean;
  /** Language used for the modal chrome strings (title, footnote, close
   * label). The option labels are always rendered in their own language so
   * the picker reads naturally regardless of current state. */
  uiLang: Lang;
  /** Currently selected content language. Marks the active card. */
  current: Lang;
  /** When the page surface is dark (blog dark mode, dark/terminal/starwars
   * resume themes), the modal swaps to a dark shell. */
  dark?: boolean;
  onSelect: (lang: Lang) => void;
  onClose: () => void;
};

type Entry = {
  /** Selectable lang code (only when `available`). `es` is listed for intent
   * but the type widens at the card boundary; the host never sees it. */
  code: Lang | "es";
  /** Label written in its own language. */
  label: string;
  /** Subtitle shown beneath the label — region/native cue. */
  hint: string;
  flag: FlagCode;
  available: boolean;
};

// Order: PT first (project's primary author is Brazilian; CV defaults to PT
// in many sessions), then EN, then ES as "em breve". When ES content lands
// the only change is flipping `available` to true.
const ENTRIES: Entry[] = [
  { code: "pt", label: "Português", hint: "Brasil", flag: "br", available: true },
  { code: "en", label: "English", hint: "Global", flag: "us", available: true },
  { code: "es", label: "Español", hint: "Próximamente", flag: "es", available: false },
];

const MODAL_TITLE: Record<Lang, string> = {
  en: "Language",
  pt: "Idioma",
};
const MODAL_HINT: Record<Lang, string> = {
  en: "Pick the language used across the resume and blog.",
  pt: "Escolha o idioma usado no currículo e no blog.",
};
const CLOSE_LABEL: Record<Lang, string> = {
  en: "Close",
  pt: "Fechar",
};
const SOON_BADGE: Record<Lang, string> = {
  en: "soon",
  pt: "em breve",
};

/** Modal language picker. Reachable from the mobile FAB and (eventually) any
 * sm+ topbar trigger we wire up. Mirrors the BlogThemePicker visually so the
 * two picker surfaces feel like one family. */
export default function LanguagePicker({
  open,
  uiLang,
  current,
  dark = false,
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
      aria-label={MODAL_TITLE[uiLang]}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm print:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`flex w-full max-w-[460px] flex-col overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] ring-1 ${modalSurface}`}>
        <header className="flex items-start justify-between gap-4 px-6 pb-2 pt-5">
          <div className="min-w-0">
            <h2 className="font-sans text-[18px] font-bold tracking-tight">
              {MODAL_TITLE[uiLang]}
            </h2>
            <p className={`mt-0.5 text-[12.5px] leading-snug ${hintText}`}>
              {MODAL_HINT[uiLang]}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={CLOSE_LABEL[uiLang]}
            className={`-mr-1.5 -mt-1 grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full transition-colors ${closeBtn}`}
          >
            <TbX size={16} />
          </button>
        </header>

        <div className="flex flex-col gap-2 p-5 pt-3">
          {ENTRIES.map((entry) => (
            <LangCard
              key={entry.code}
              entry={entry}
              active={entry.available && entry.code === current}
              dark={dark}
              soonBadge={SOON_BADGE[uiLang]}
              onSelect={() => {
                if (!entry.available) return;
                onSelect(entry.code as Lang);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LangCard({
  entry,
  active,
  dark,
  soonBadge,
  onSelect,
}: {
  entry: Entry;
  active: boolean;
  dark: boolean;
  soonBadge: string;
  onSelect: () => void;
}) {
  const hintText = dark ? "text-zinc-400" : "text-zinc-500";
  const cardBase = dark ? "bg-white/[0.03]" : "bg-white";
  const idleBorder = dark
    ? "border-white/10 hover:border-white/20"
    : "border-zinc-200 hover:border-zinc-300";
  const activeBorder = "border-violet-500 ring-2 ring-violet-500/30";
  const disabled = !entry.available;
  const disabledClasses = disabled
    ? "cursor-not-allowed opacity-55"
    : "cursor-pointer";

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={active}
      aria-disabled={disabled}
      className={`group relative flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${cardBase} ${
        active ? activeBorder : idleBorder
      } ${disabledClasses}`}
    >
      <span className="shrink-0">
        <Flag code={entry.flag} size={28} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-sans text-[15px] font-bold tracking-tight">
          {entry.label}
        </span>
        <span className={`mt-0.5 block text-[12px] ${hintText}`}>
          {entry.hint}
        </span>
      </span>
      {disabled ? (
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] ${
            dark ? "bg-white/[0.08] text-zinc-300" : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {soonBadge}
        </span>
      ) : active ? (
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-600 text-white">
          <TbCheck size={13} strokeWidth={3} />
        </span>
      ) : null}
    </button>
  );
}
