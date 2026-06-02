/* Per-Part accent palette for the blog, with both light and dark resolutions.
 * Three curriculum Parts rotate through violet / fuchsia / teal so the index
 * doesn't read as monochrome. The `rgba` triplet feeds inline-style tints
 * (border, background, watermark); `borderAlpha` and `watermarkAlpha` differ
 * between modes because the same alpha doesn't read the same on white vs.
 * near-black surfaces. Class strings stay literal for Tailwind v4 to pick up. */

export type PartHue = {
  text: string;
  textDeep: string;
  hoverBorder: string;
  hoverBg: string;
  cardGrad: string;
  rgba: string;
  borderAlpha: number;
  watermarkAlpha: number;
  pillBg: string;
  pillText: string;
};

type Slug = "base" | "stack" | "others";

const LIGHT: Record<Slug, PartHue> = {
  base: {
    text: "text-violet-600",
    textDeep: "text-violet-700",
    hoverBorder: "hover:border-violet-500/40",
    hoverBg: "hover:bg-violet-50",
    cardGrad: "from-white to-violet-50/35",
    rgba: "124,58,237",
    borderAlpha: 0.18,
    watermarkAlpha: 0.14,
    pillBg: "bg-violet-500/10",
    pillText: "text-violet-700",
  },
  stack: {
    text: "text-fuchsia-600",
    textDeep: "text-fuchsia-700",
    hoverBorder: "hover:border-fuchsia-500/40",
    hoverBg: "hover:bg-fuchsia-50",
    cardGrad: "from-white to-fuchsia-50/35",
    rgba: "217,70,239",
    borderAlpha: 0.18,
    watermarkAlpha: 0.14,
    pillBg: "bg-fuchsia-500/10",
    pillText: "text-fuchsia-700",
  },
  others: {
    text: "text-teal-600",
    textDeep: "text-teal-700",
    hoverBorder: "hover:border-teal-500/40",
    hoverBg: "hover:bg-teal-50",
    cardGrad: "from-white to-teal-50/35",
    rgba: "20,184,166",
    borderAlpha: 0.18,
    watermarkAlpha: 0.14,
    pillBg: "bg-teal-500/10",
    pillText: "text-teal-700",
  },
};

const DARK: Record<Slug, PartHue> = {
  base: {
    text: "text-violet-300",
    textDeep: "text-violet-200",
    hoverBorder: "hover:border-violet-400/60",
    hoverBg: "hover:bg-violet-500/10",
    cardGrad: "from-[#262333] to-violet-500/[0.12]",
    rgba: "167,139,250",
    borderAlpha: 0.28,
    watermarkAlpha: 0.16,
    pillBg: "bg-violet-500/15",
    pillText: "text-violet-200",
  },
  stack: {
    text: "text-fuchsia-300",
    textDeep: "text-fuchsia-200",
    hoverBorder: "hover:border-fuchsia-400/60",
    hoverBg: "hover:bg-fuchsia-500/10",
    cardGrad: "from-[#262333] to-fuchsia-500/[0.12]",
    rgba: "240,171,252",
    borderAlpha: 0.26,
    watermarkAlpha: 0.16,
    pillBg: "bg-fuchsia-500/15",
    pillText: "text-fuchsia-200",
  },
  others: {
    text: "text-teal-300",
    textDeep: "text-teal-200",
    hoverBorder: "hover:border-teal-400/60",
    hoverBg: "hover:bg-teal-500/10",
    cardGrad: "from-[#262333] to-teal-500/[0.12]",
    rgba: "94,234,212",
    borderAlpha: 0.30,
    watermarkAlpha: 0.18,
    pillBg: "bg-teal-500/15",
    pillText: "text-teal-200",
  },
};

export function hueFor(slug: string | undefined, dark = false): PartHue {
  const table = dark ? DARK : LIGHT;
  if (!slug) return table.base;
  return table[slug as Slug] ?? table.base;
}

/* ─────────── chrome (non-Part-specific) tokens ─────────── */

export type BlogChrome = {
  pageBg: string;          // class for the BlogShell root
  drawerBg: string;        // class for the mobile sidebar drawer
  cardBg: string;          // class for plain white cards (StationRow, search input)
  textBody: string;        // class for body text (was text-zinc-900)
  textMuted: string;       // class for muted captions (was text-zinc-600)
  textFaint: string;       // class for the faintest copy (was text-zinc-500)
  borderHairline: string;  // class for soft hairlines (was border-violet-900/[0.10])
  scrim: string;           // mobile drawer backdrop
};

export const CHROME_LIGHT: BlogChrome = {
  pageBg: "bg-white",
  drawerBg: "bg-white",
  cardBg: "bg-white",
  textBody: "text-zinc-900",
  textMuted: "text-zinc-600",
  textFaint: "text-zinc-500",
  borderHairline: "border-violet-900/[0.10]",
  scrim: "bg-black/40",
};

export const CHROME_DARK: BlogChrome = {
  pageBg: "bg-[#1c1923]",
  drawerBg: "bg-[#252232]",
  cardBg: "bg-white/[0.04]",
  textBody: "text-zinc-100",
  textMuted: "text-zinc-400",
  textFaint: "text-zinc-500",
  borderHairline: "border-white/10",
  scrim: "bg-black/55",
};

export function chromeFor(dark: boolean): BlogChrome {
  return dark ? CHROME_DARK : CHROME_LIGHT;
}
