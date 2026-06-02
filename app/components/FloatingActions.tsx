"use client";

import { TbLanguage, TbPalette } from "react-icons/tb";
import { useScrollBands } from "../lib/useScrollBands";
import type { Lang } from "../data/cv";

type Props = {
  lang: Lang;
  onPickLang: () => void;
  onPickTheme: () => void;
  /** When the page surface is dark (blog dark mode, a few resume themes), the
   * FABs nudge their shadow/border so they don't look hollow on near-black
   * surfaces. Defaults to light. */
  dark?: boolean;
};

/** Two floating action buttons (language picker + theme picker) pinned to the
 * bottom-right of the viewport. Mobile only — on sm+ these controls live in
 * the topbar so we hide the FABs entirely. */
export default function FloatingActions({
  lang,
  onPickLang,
  onPickTheme,
  dark = false,
}: Props) {
  const visible = useScrollBands();

  const langLabel = lang === "en" ? "Language" : "Idioma";
  const themeLabel = lang === "en" ? "Theme" : "Tema";

  const fabBase =
    "flex h-14 w-14 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95";
  // White FAB on every surface. The `dark` prop just tunes shadow/border
  // strength so the disc keeps presence on near-black backgrounds.
  const fabSurface = dark
    ? "border border-white/25 bg-white text-zinc-800 shadow-[0_12px_32px_-6px_rgba(0,0,0,0.65)]"
    : "border border-black/10 bg-white text-zinc-800 shadow-[0_12px_32px_-6px_rgba(0,0,0,0.28)]";
  // The label pill borrows the same white chip treatment so it never bleeds
  // into the page surface — both light and dark backgrounds get a legible
  // chip with a thin border and soft shadow.
  const labelPill = dark
    ? "bg-white/95 text-zinc-800 border border-white/30 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.6)]"
    : "bg-white/95 text-zinc-800 border border-black/10 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.25)]";

  return (
    <div
      aria-hidden={!visible}
      className={`fixed right-4 z-50 flex flex-col items-end gap-4 transition-all duration-300 ease-out print:hidden sm:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}
    >
      <FabAction
        label={langLabel}
        onClick={onPickLang}
        fabBase={fabBase}
        fabSurface={fabSurface}
        labelPill={labelPill}
        icon={<TbLanguage size={24} strokeWidth={2} />}
      />
      <FabAction
        label={themeLabel}
        onClick={onPickTheme}
        fabBase={fabBase}
        fabSurface={fabSurface}
        labelPill={labelPill}
        icon={<TbPalette size={22} />}
      />
    </div>
  );
}

/** One FAB + its caption pill, stacked. Caption clicks the same handler as
 * the disc so the whole column reads as a single tap target. */
function FabAction({
  label,
  onClick,
  fabBase,
  fabSurface,
  labelPill,
  icon,
}: {
  label: string;
  onClick: () => void;
  fabBase: string;
  fabSurface: string;
  labelPill: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      // Column width is pinned to the disc (w-14) so each FAB stack lines up
      // with its neighbours regardless of label length. `items-center` lets
      // labels longer than the disc overflow symmetrically left & right so
      // the pill stays visually centred under the disc — the previous
      // `relative left-1/2 + translate-x-1/2` combo was shifting the pill
      // off-centre when its intrinsic width exceeded the column.
      className="group flex w-14 cursor-pointer flex-col items-center"
    >
      <span className={`${fabBase} ${fabSurface}`}>{icon}</span>
      <span
        className={`mt-1.5 max-w-[88px] truncate rounded-full px-2 py-[2px] text-[9.5px] font-bold uppercase tracking-[0.1em] ${labelPill}`}
      >
        {label}
      </span>
    </button>
  );
}
