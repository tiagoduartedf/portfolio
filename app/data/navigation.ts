import type { Bilingual } from "./cv";

/* ─────────── Section anchors used across themes ─────────── */

export type SectionId =
  | "cv-about"
  | "cv-experience"
  | "cv-skills"
  | "cv-projects"
  | "cv-languages"
  | "cv-education"
  | "cv-contact";

export type SectionNav = {
  id: SectionId;
  title: Bilingual;
};

/** Education and contact live in the header strip on every theme; they don't
 * earn a nav slot. (Plus `cv-contact` doesn't even exist as an anchor in most
 * themes, so the link was a no-op.) The `SectionId` union still lists them so
 * VS Code's file map can keep its education.md / contact.md tabs.
 *
 * Projects is currently hidden pending DLOA authorization for product
 * screenshots; the entry stays in `SectionId` so the VS Code file map keeps
 * its projects.md tab, but it doesn't earn a navbar slot. */
export const SECTIONS_NAV: SectionNav[] = [
  { id: "cv-about", title: { en: "About", pt: "Sobre mim" } },
  { id: "cv-experience", title: { en: "Experience", pt: "Experiência" } },
  { id: "cv-skills", title: { en: "Stack", pt: "Stack" } },
  { id: "cv-languages", title: { en: "Languages", pt: "Idiomas" } },
];

/* ─────────── Theme picker, groups + metadata ─────────── */

export type ThemeKey =
  | "dark"
  | "terminal"
  | "notion"
  | "starwars";

/** URL-friendly slug for each theme. The "dark" theme is exposed as /vscode. */
export const THEME_TO_SLUG: Record<ThemeKey, string> = {
  dark: "vscode",
  terminal: "terminal",
  notion: "notion",
  starwars: "starwars",
};

export const SLUG_TO_THEME: Record<string, ThemeKey> = {
  vscode: "dark",
  terminal: "terminal",
  notion: "notion",
  starwars: "starwars",
};

/** Path to navigate to for a given theme. Always /<slug>; the bare `/` index
 * is reserved for the dedicated theme gallery. */
export function pathForTheme(key: ThemeKey): string {
  return `/${THEME_TO_SLUG[key]}`;
}

/** Path inside the blog. `/blog` for the index, `/blog/<slug>` for an article.
 * The blog has a single look, independent of the CV theme. */
export function pathForBlog(articleSlug?: string): string {
  return articleSlug ? `/blog/${articleSlug}` : "/blog";
}

export type ThemeMeta = {
  label: Bilingual;
  /** One-line pitch shown in the picker card. */
  description: Bilingual;
  /** Colour palette previewed in the card. */
  preview: {
    bg: string;
    fg: string;
    accent: string;
    style?: "serif" | "sans" | "mono";
  };
};

export const THEME_META: Record<ThemeKey, ThemeMeta> = {
  notion: {
    label: { en: "Notion", pt: "Notion" },
    description: {
      en: "A Notion docs page, with emoji headings, callouts and tables. Easy to skim.",
      pt: "Uma página estilo Notion, com títulos com emoji, callouts e tabelas. Fácil de bater o olho.",
    },
    preview: { bg: "#ffffff", fg: "#37352f", accent: "#2383e2", style: "sans" },
  },
  dark: {
    label: { en: "VS Code", pt: "VS Code" },
    description: {
      en: "A VS Code window with sidebar, tabs and a markdown preview. The CV as code.",
      pt: "Uma janela do VS Code com sidebar, tabs e preview de markdown. O CV em forma de código.",
    },
    preview: { bg: "#1e1e1e", fg: "#d4d4d4", accent: "#569cd6", style: "mono" },
  },
  terminal: {
    label: { en: "Terminal", pt: "Terminal" },
    description: {
      en: "A GNOME terminal: type a command, read the answer. Minimal and nostalgic.",
      pt: "Um terminal GNOME: digita um comando, lê a resposta. Mínimo e nostálgico.",
    },
    preview: { bg: "#300A24", fg: "#d3d7cf", accent: "#8ae234", style: "mono" },
  },
  starwars: {
    label: { en: "Star Wars", pt: "Star Wars" },
    description: {
      en: "A Star Wars opening crawl, lightsabers and an X-wing flying past. Pure homage.",
      pt: "Crawl de abertura de Star Wars, sabres-de-luz e uma X-wing passando. Pura homenagem.",
    },
    preview: { bg: "#000000", fg: "#ffe81f", accent: "#ffe81f", style: "sans" },
  },
};

export type ThemeGroup = {
  slug: "hr" | "dev" | "stylish";
  title: Bilingual;
  description: Bilingual;
  badge: Bilingual;
  themes: ThemeKey[];
};

export const THEME_GROUPS: ThemeGroup[] = [
  {
    slug: "hr",
    title: { en: "For Recruiters & HR", pt: "Para Recrutadores & RH" },
    description: {
      en: "Clean, easy to read at a glance. Best for the first contact.",
      pt: "Limpos, fáceis de ler de relance. Ideal pro primeiro contato.",
    },
    badge: { en: "For HR", pt: "Para RH" },
    themes: ["notion"],
  },
  {
    slug: "dev",
    title: { en: "For Developers", pt: "Para Devs" },
    description: {
      en: "Code-shaped layouts that speak to engineers.",
      pt: "Layouts em forma de código que conversam com engenheiros.",
    },
    badge: { en: "For Devs", pt: "Para Devs" },
    themes: ["dark", "terminal"],
  },
  {
    slug: "stylish",
    title: { en: "Playful", pt: "Divertidos" },
    description: {
      en: "A themed layout, just because.",
      pt: "Um layout temático, só pela brincadeira.",
    },
    badge: { en: "Fun", pt: "Diversão" },
    themes: ["starwars"],
  },
];

/* ─────────── Navigation event helper ─────────── */

export const CV_NAVIGATE_EVENT = "cv:navigate";

/**
 * Fired by the topbar to ask the active theme to navigate to a section.
 * Default behavior (handled in CVApp): smooth-scroll to `#${id}` if the element exists.
 * VS Code intercepts the event to switch the active markdown file instead.
 */
/** Optional `sub` carries a finer target inside the section (currently used
 *  for individual experience entries, where the value is the company slug —
 *  see `experienceSlug` in cv.ts). */
export type CvNavigateDetail = { id: SectionId; sub?: string };

export function dispatchCvNavigate(id: SectionId, sub?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<CvNavigateDetail>(CV_NAVIGATE_EVENT, { detail: { id, sub } }),
  );
}
