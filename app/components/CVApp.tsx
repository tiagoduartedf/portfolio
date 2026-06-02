"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CV, Lang } from "../data/cv";
import Dark from "../themes/Dark";
import Terminal from "../themes/Terminal";
import Notion from "../themes/Notion";
import StarWars from "../themes/StarWars";
import { useScrolled } from "../lib/useScrolled";
import { useStoredValue } from "../lib/useStoredValue";
import Topbar from "./Topbar";
import ThemePicker from "./ThemePicker";
import FloatingActions from "./FloatingActions";
import LanguagePicker from "./LanguagePicker";
import PdfNoticeDialog from "./PdfNoticeDialog";
import { printAsPdf } from "../lib/printPdf";
import { pathForBlog, pathForTheme, THEME_TO_SLUG, type ThemeKey } from "../data/navigation";

const LAST_THEME_KEY = "cv-last-theme";

const PAGE_BG: Record<ThemeKey, string> = {
  dark: "bg-[#1e1e1e]",
  terminal: "bg-black",
  notion: "bg-[#f7f6f3]",
  starwars: "bg-black",
};

export default function CVApp({
  cv,
  initialTheme,
  indexMode = false,
}: {
  cv: CV;
  initialTheme: ThemeKey;
  /** When mounted at the bare `/` index: opens the theme picker on mount,
   * and any close path (X, ESC, click-outside, "t") routes to `/notion` so
   * the URL settles on the main theme. */
  indexMode?: boolean;
}) {
  const router = useRouter();
  const theme = initialTheme;
  const goToTheme = (next: ThemeKey) => router.push(pathForTheme(next));
  const [lang, setLang] = useStoredValue<Lang>("cv-lang", "en", ["en", "pt"] as const);
  const [pickerOpen, setPickerOpen] = useState(indexMode);
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const [pdfNoticeOpen, setPdfNoticeOpen] = useState(false);

  const handlePdfClick = () => {
    if (theme === "notion") {
      printAsPdf(lang);
    } else {
      setPdfNoticeOpen(true);
    }
  };

  const handlePdfConfirm = () => {
    setPdfNoticeOpen(false);
    // Wait one frame so the dialog finishes its exit before the print
    // dialog steals focus; the hidden Notion is already mounted, the
    // user never sees a theme switch.
    window.setTimeout(() => printAsPdf(lang), 50);
  };

  const handleSelectTheme = (next: ThemeKey) => {
    setPickerOpen(false);
    // On the index route the URL is "/" while theme is "notion"; we want any
    // pick (including Notion itself) to land on a real /theme URL.
    if (indexMode || next !== theme) goToTheme(next);
  };

  const handlePickerClose = () => {
    setPickerOpen(false);
    if (indexMode) router.push(pathForTheme("notion"));
  };

  // Persist the most recently viewed theme so /blog's "Resume" tab returns here.
  useEffect(() => {
    window.localStorage.setItem(LAST_THEME_KEY, THEME_TO_SLUG[theme]);
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "l") setLang(lang === "en" ? "pt" : "en");
      else if (k === "b") router.push(pathForBlog());
      else if (k === "t") {
        if (pickerOpen) handlePickerClose();
        else setPickerOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // handlePickerClose is stable inside this render; explicit deps below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, setLang, router, theme, pickerOpen, indexMode]);

  const isDarkChrome =
    theme === "dark" || theme === "terminal" || theme === "starwars";

  const pageBg = PAGE_BG[theme];

  const scrolled = useScrolled(60);
  // Navbar is exactly h-12 (3rem) compact / h-20 (5rem) expanded; main padding mirrors it
  // so theme content sits flush below the topbar, no gap, no overlap.
  const mainPadTop = scrolled ? "pt-12" : "pt-20";

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 print:bg-white ${pageBg}`}>
      <Topbar
        lang={lang}
        setLang={setLang}
        view="resume"
        resumeHref={pathForTheme(theme)}
        blogHref={pathForBlog()}
        onPickTheme={() => setPickerOpen(true)}
        darkChrome={isDarkChrome}
        onPdfClick={handlePdfClick}
      />
      <FloatingActions
        lang={lang}
        onPickLang={() => setLangPickerOpen(true)}
        onPickTheme={() => setPickerOpen(true)}
        dark={isDarkChrome}
      />
      <main className={`transition-all duration-300 ${mainPadTop} ${theme !== "notion" ? "print:hidden" : ""}`}>
        {theme === "dark" ? (
          <Dark
            cv={cv}
            lang={lang}
            onOpenTerminal={() => goToTheme("terminal")}
            onOpenStarWars={() => goToTheme("starwars")}
            onOpenNotion={() => goToTheme("notion")}
            onPickTheme={() => setPickerOpen(true)}
            onCloseWindow={() => goToTheme("notion")}
          />
        ) : null}
        {theme === "terminal" ? (
          <Terminal
            cv={cv}
            lang={lang}
            onCloseWindow={() => goToTheme("dark")}
          />
        ) : null}
        {theme === "notion" ? <Notion cv={cv} lang={lang} /> : null}
        {theme === "starwars" ? <StarWars cv={cv} lang={lang} /> : null}
      </main>

      {/* Off-screen Notion kept mounted on every non-Notion theme so the PDF
       * action prints the formal/standardized layout without ever changing
       * the visible theme. `hidden print:block` keeps it out of layout on
       * screen and exposed only to the print media query. */}
      {theme !== "notion" ? (
        <div aria-hidden className="hidden print:block">
          <Notion cv={cv} lang={lang} />
        </div>
      ) : null}

      <ThemePicker
        open={pickerOpen}
        lang={lang}
        onSelect={handleSelectTheme}
        onClose={handlePickerClose}
      />

      <PdfNoticeDialog
        open={pdfNoticeOpen}
        lang={lang}
        onCancel={() => setPdfNoticeOpen(false)}
        onConfirm={handlePdfConfirm}
      />

      <LanguagePicker
        open={langPickerOpen}
        uiLang={lang}
        current={lang}
        dark={isDarkChrome}
        onSelect={(next) => {
          setLang(next);
          setLangPickerOpen(false);
        }}
        onClose={() => setLangPickerOpen(false)}
      />
    </div>
  );
}
