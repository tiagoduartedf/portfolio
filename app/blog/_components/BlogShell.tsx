"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Topbar from "../../components/Topbar";
import FloatingActions from "../../components/FloatingActions";
import { blogUI } from "../../data/articles";
import { useScrolled } from "../../lib/useScrolled";
import { useStoredValue } from "../../lib/useStoredValue";
import {
  SLUG_TO_THEME,
  THEME_TO_SLUG,
  pathForBlog,
  pathForTheme,
  type ThemeKey,
} from "../../data/navigation";
import type { Lang } from "../../data/cv";
import BlogThemePicker, { type BlogThemeMode } from "./BlogThemePicker";
import LanguagePicker from "../../components/LanguagePicker";
import { chromeFor } from "./partHues";

type Ctx = {
  lang: Lang;
  dark: boolean;
  /** Mobile-only sidebar drawer state, lifted to the shell so the Topbar can
   * trigger it from the right-hand "tree" button. */
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
};

type Props = {
  /** When viewing an article, its slug. Used to scroll the active row into
   * view inside the sidebar. */
  slug?: string;
  children: (ctx: Ctx) => ReactNode;
};

const LAST_THEME_KEY = "cv-last-theme";
const BLOG_THEME_MODE_KEY = "blog-theme-mode";
const DEFAULT_THEME: ThemeKey = "notion";
const ALLOWED_THEME_SLUGS = Object.values(THEME_TO_SLUG);

/**
 * Chrome wrapper for /blog routes: Topbar + surface in the user-selected
 * light/dark mode. Mode is stored in a cookie + localStorage and read
 * client-side after hydration (static export can't read cookies at
 * build time). The inline script in app/blog/layout.tsx applies
 * `html.dark` BEFORE React paints so the wrapper surface is already
 * correct on first frame — CSS rules in globals.css scope the dark
 * surface to `.blog-shell` so the brief light → dark React transition
 * for inner widgets reads as a refinement, not a flash.
 */
export default function BlogShell({ slug, children }: Props) {
  const [lang, setLang] = useStoredValue<Lang>("cv-lang", "en", ["en", "pt"] as const);
  const [mode, setModeState] = useState<BlogThemeMode>("light");
  const dark = mode === "dark";
  const [pickerOpen, setPickerOpen] = useState(false);
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // Tree button only makes sense on the blog index (article roadmap) — article
  // pages don't render the sidebar, so we hide the trigger there.
  const isIndex = !slug;
  const [resumeThemeSlug] = useStoredValue<string>(
    LAST_THEME_KEY,
    THEME_TO_SLUG[DEFAULT_THEME],
    ALLOWED_THEME_SLUGS,
  );
  const resumeTheme: ThemeKey = SLUG_TO_THEME[resumeThemeSlug] ?? DEFAULT_THEME;
  const chrome = chromeFor(dark);

  const setMode = useCallback((next: BlogThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem(BLOG_THEME_MODE_KEY, next);
    } catch {
      // localStorage blocked (private mode, quota, etc.) — cookie still works.
    }
    // 1y cookie scoped to the blog so non-blog routes never see it. SameSite
    // lax is plenty for an appearance pref. The server reads this on next SSR.
    document.cookie = `${BLOG_THEME_MODE_KEY}=${next}; path=/blog; max-age=31536000; samesite=lax`;
  }, []);

  // Read the persisted mode after hydration. SSR can't see cookies in a
  // static export, so the server always renders with the light default;
  // this effect reconciles state from cookie (canonical) or
  // localStorage (fallback for users predating the cookie). Cookie
  // value reaches the surface immediately via the inline script in
  // app/blog/layout.tsx, so the React-state lag here only affects
  // inner widgets (Topbar surfaces, rows, etc.), not the page bg.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const cookieMatch = document.cookie.match(
      new RegExp(`(?:^|; )${BLOG_THEME_MODE_KEY}=([^;]+)`),
    );
    const fromCookie = cookieMatch?.[1];
    if (fromCookie === "dark" || fromCookie === "light") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode(fromCookie);
      return;
    }
    let ls: string | null = null;
    try {
      ls = localStorage.getItem(BLOG_THEME_MODE_KEY);
    } catch {
      return;
    }
    if (ls === "dark" || ls === "light") setMode(ls);
  }, [setMode]);

  // Keep `html.dark` aligned with state once React owns it. The inline
  // script applied the class on first paint (before hydration); after
  // hydration React state is the source of truth. Cleanup on unmount so
  // leaving /blog never bleeds the dark cascade into other routes.
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [dark]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "l") setLang(lang === "en" ? "pt" : "en");
      else if (k === "t") setPickerOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lang, setLang]);

  const scrolled = useScrolled(60);
  const mainPadTop = scrolled ? "pt-12" : "pt-20";

  const handleSelectMode = (next: BlogThemeMode) => {
    setMode(next);
    setPickerOpen(false);
  };

  return (
    <div
      // `blog-shell` is the no-flash anchor: app/globals.css scopes its
      // `html.dark` overrides to this class so they don't bleed into
      // other routes that happen to land on the dark cascade.
      className={`blog-shell min-h-screen w-full ${chrome.pageBg} ${chrome.textBody} transition-colors duration-300`}
    >
      <Topbar
        lang={lang}
        setLang={setLang}
        view="blog"
        resumeHref={pathForTheme(resumeTheme)}
        blogHref={pathForBlog(slug)}
        onPickTheme={() => setPickerOpen(true)}
        darkChrome={dark}
        onOpenTree={isIndex ? () => setMobileSidebarOpen(true) : undefined}
        openTreeLabel={blogUI.openTree[lang]}
      />
      <FloatingActions
        lang={lang}
        onPickLang={() => setLangPickerOpen(true)}
        onPickTheme={() => setPickerOpen(true)}
        dark={dark}
      />
      <main className={`transition-all duration-300 ${mainPadTop}`}>
        {children({ lang, dark, mobileSidebarOpen, setMobileSidebarOpen })}
      </main>
      <BlogThemePicker
        open={pickerOpen}
        lang={lang}
        current={mode}
        onSelect={handleSelectMode}
        onClose={() => setPickerOpen(false)}
      />
      <LanguagePicker
        open={langPickerOpen}
        uiLang={lang}
        current={lang}
        dark={dark}
        onSelect={(next) => {
          setLang(next);
          setLangPickerOpen(false);
        }}
        onClose={() => setLangPickerOpen(false)}
      />
    </div>
  );
}
