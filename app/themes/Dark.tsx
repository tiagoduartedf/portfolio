"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CV, Lang } from "../data/cv";
import { experienceAnchorId } from "../data/cv";
import ExperienceShareLink from "../components/ExperienceShareLink";
import { TechIcon, getTechLabel } from "../components/icons/TechIcon";
import { Flag } from "../components/icons/Flag";
import { CV_NAVIGATE_EVENT, type CvNavigateDetail, type SectionId, dispatchCvNavigate } from "../data/navigation";
import { parseExperienceSummary } from "../lib/summaryBlocks";
import { linkifyBlog } from "../lib/linkifyBlog";
import { useScrolled } from "../lib/useScrolled";
import { groupBullets, isBulletIntro } from "../lib/bullets";
import { experienceDuration } from "../lib/period";
import {
  VscAccount,
  VscBell,
  VscChevronDown,
  VscChevronRight,
  VscCode,
  VscError,
  VscEye,
  VscFile,
  VscFolder,
  VscFolderOpened,
  VscGitCommit,
  VscMarkdown,
  VscMenu,
  VscOpenPreview,
  VscSearch,
  VscSettingsGear,
  VscSplitHorizontal,
  VscSync,
  VscTerminal,
  VscWarning,
} from "react-icons/vsc";
import { SiTypescript } from "react-icons/si";

function JediOrderIcon({ size = 22 }: { size?: number }) {
  // Hand-drawn Jedi Order crest: outer ring, central pillar, swept wings.
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="3" />
      <ellipse cx="50" cy="20" rx="5" ry="7" />
      <rect x="47.5" y="24" width="5" height="48" rx="1" />
      <path d="M48 38 C 30 38, 16 48, 10 60 C 20 56, 28 56, 34 60 C 38 62, 42 64, 46 66 L 48 56 Z" />
      <path d="M52 38 C 70 38, 84 48, 90 60 C 80 56, 72 56, 66 60 C 62 62, 58 64, 54 66 L 52 56 Z" />
      <path d="M44 72 L 50 84 L 56 72 Z" />
    </svg>
  );
}

type Props = {
  cv: CV;
  lang: Lang;
  /** Click on the red ✕ in the title bar; caller switches to a fallback theme. */
  onCloseWindow?: () => void;
  /** Click on the terminal icon in the activity bar. */
  onOpenTerminal?: () => void;
  /** Click on the Jedi icon in the activity bar; opens the Star Wars theme. */
  onOpenStarWars?: () => void;
  /** Click on the profile (account) icon; opens the Notion theme. */
  onOpenNotion?: () => void;
  /** Click on the gear icon; opens the theme picker. */
  onPickTheme?: () => void;
};

type ActivityView = "files" | "search";

const C = {
  bg: "#1e1e1e",
  bg2: "#252526",
  bg3: "#2d2d2d",
  activity: "#333333",
  border: "#3c3c3c",
  status: "#007acc",
  text: "#d4d4d4",
  textDim: "#9a9a9a",
  comment: "#6a9955",
  keyword: "#569cd6",
  string: "#ce9178",
  variable: "#9cdcfe",
  type: "#4ec9b0",
  func: "#dcdcaa",
  number: "#b5cea8",
  muted: "#858585",
  hl: "#264f78",
};

type FileKey =
  | "README.md"
  | "about.md"
  | "experience.md"
  | "skills.md"
  | "languages.md"
  | "education.md"
  | "contact.md";

/** Sidebar/tab order. */
const FILE_ORDER: FileKey[] = [
  "README.md",
  "about.md",
  "experience.md",
  "skills.md",
  "languages.md",
  "education.md",
  "contact.md",
];

type ViewMode = "preview" | "source" | "split";

/** Partial: the `cv-iveg` and `cv-axcode` placeholders never map to a file —
 *  their pills are disabled in the topbar and clicks are suppressed there. */
const SECTION_TO_FILE: Partial<Record<SectionId, FileKey>> = {
  "cv-about": "about.md",
  "cv-experience": "experience.md",
  "cv-skills": "skills.md",
  "cv-languages": "languages.md",
  "cv-education": "education.md",
  "cv-contact": "contact.md",
};

export default function Dark({
  cv,
  lang,
  onCloseWindow,
  onOpenTerminal,
  onOpenStarWars,
  onOpenNotion,
  onPickTheme,
}: Props) {
  const [active, setActive] = useState<FileKey>("README.md");
  const [openTabs, setOpenTabs] = useState<FileKey[]>(["README.md"]);
  const [mode, setMode] = useState<ViewMode>("preview");
  const [activityView, setActivityView] = useState<ActivityView>("files");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const scrolled = useScrolled(60);
  // Fit the editor inside one viewport so only the inner panes scroll, no nested scrolls.
  // Topbar in CVApp is h-20 expanded / h-12 compact.
  const containerHeight = scrolled ? "calc(100dvh - 3rem)" : "calc(100dvh - 5rem)";

  const openFile = (f: FileKey) => {
    setActive(f);
    if (!openTabs.includes(f)) setOpenTabs((t) => [...t, f]);
    setDrawerOpen(false);
  };

  const switchActivityView = (v: ActivityView) => {
    // VSCode behaviour: clicking the icon of the currently visible panel hides it;
    // clicking another switches to that view and opens the sidebar.
    if (activityView === v && sidebarOpen) {
      setSidebarOpen(false);
    } else {
      setActivityView(v);
      setSidebarOpen(true);
    }
  };

  const closeTab = (f: FileKey) => {
    setOpenTabs((tabs) => {
      // README is pinned: blocked from closing when it's the only tab.
      if (f === "README.md" && tabs.length === 1) return tabs;
      const next = tabs.filter((t) => t !== f);
      if (next.length === 0) {
        setActive("README.md");
        return ["README.md"];
      }
      if (active === f) setActive(next[next.length - 1]);
      return next;
    });
  };

  // Listen for global navigation requests, opening the matching file instead of scrolling.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CvNavigateDetail>).detail;
      if (!detail?.id) return;
      const file = SECTION_TO_FILE[detail.id];
      if (!file) return;
      setActive(file);
      setOpenTabs((tabs) => (tabs.includes(file) ? tabs : [...tabs, file]));
      // `sub` (e.g. company slug) means "scroll to that entry once the file
      // is rendered". The tab swap is a state update, so defer the scroll
      // a couple of frames so the new preview is in the DOM.
      if (detail.id === "cv-experience" && detail.sub) {
        const targetId = `cv-experience-${detail.sub}`;
        const tryScroll = (attemptsLeft: number) => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
          }
          if (attemptsLeft > 0) {
            requestAnimationFrame(() => tryScroll(attemptsLeft - 1));
          }
        };
        requestAnimationFrame(() => tryScroll(10));
      }
      // Stop the default scroll-to-id behaviour from firing.
      e.stopImmediatePropagation();
    };
    // capture phase so we run before the Topbar's default scroll handler
    window.addEventListener(CV_NAVIGATE_EVENT, handler, true);
    return () => window.removeEventListener(CV_NAVIGATE_EVENT, handler, true);
  }, []);

  // Ctrl/Cmd+B toggles the sidebar, matching VSCode.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
      if (e.key.toLowerCase() !== "b") return;
      const target = e.target as HTMLElement | null;
      if (target && (["INPUT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable)) return;
      e.preventDefault();
      setSidebarOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="theme-dark flex w-full flex-col overflow-hidden border-y border-black/40 font-mono text-[13px] print:h-auto print:rounded-none print:border-0 print:shadow-none"
      style={{ height: containerHeight }}
    >
      {/* Title bar */}
      <div
        className="flex shrink-0 items-center justify-between border-b px-3 py-1.5"
        style={{ backgroundColor: "#3c3c3c", borderColor: C.border }}
      >
        <button
          type="button"
          onClick={onCloseWindow}
          aria-label={lang === "en" ? "Close window" : "Fechar janela"}
          className="group flex cursor-pointer items-center gap-2"
          title={lang === "en" ? "Close · back to Notion" : "Fechar · volta pro Notion"}
        >
          <span className="h-3 w-3 rounded-full bg-[#ff5f56] transition group-hover:brightness-110" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </button>
        <div className="font-sans text-[12px] text-white/65">
          {active} · tiago-duarte-cv
        </div>
        <div className="flex items-center text-[12px] text-white/55">
          <button
            type="button"
            onClick={onCloseWindow}
            aria-label={lang === "en" ? "Minimize · back to Notion" : "Minimizar · volta pro Notion"}
            title={lang === "en" ? "Minimize · back to Notion" : "Minimizar · volta pro Notion"}
            className="grid h-6 w-9 cursor-pointer place-items-center transition hover:bg-white/10 hover:text-white"
          >
            −
          </button>
          <span className="grid h-6 w-9 cursor-default place-items-center" aria-hidden>
            □
          </span>
          <button
            type="button"
            onClick={onCloseWindow}
            aria-label={lang === "en" ? "Close window" : "Fechar janela"}
            title={lang === "en" ? "Close · back to Notion" : "Fechar · volta pro Notion"}
            className="grid h-6 w-9 cursor-pointer place-items-center transition hover:bg-[#e81123] hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>

      <div
        className="relative flex min-h-0 flex-1 print:h-auto"
        style={{ backgroundColor: C.bg }}
      >
        {/* Backdrop, only on mobile when drawer is open */}
        {drawerOpen ? (
          <button
            type="button"
            aria-label={lang === "en" ? "Close menu" : "Fechar menu"}
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 z-40 cursor-pointer bg-black/50 md:hidden"
          />
        ) : null}

        {/* Activity bar + file/search panel.
            Mobile: slides in from the left as an overlay drawer.
            md+: lives in normal flow as two fixed-width columns. */}
        <div
          className={`absolute inset-y-0 left-0 z-50 flex shrink-0 transition-transform duration-200 md:static md:z-auto md:translate-x-0 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
          style={{ backgroundColor: C.bg }}
        >
          <ActivityBar
            activityView={activityView}
            sidebarOpen={sidebarOpen}
            setActivityView={switchActivityView}
            onOpenTerminal={onOpenTerminal}
            onOpenStarWars={onOpenStarWars}
            onOpenNotion={onOpenNotion}
            onPickTheme={onPickTheme}
            lang={lang}
          />
          {sidebarOpen ? (
            activityView === "files" ? (
              <Sidebar active={active} onOpen={openFile} lang={lang} />
            ) : (
              <SearchPanel
                cv={cv}
                lang={lang}
                query={searchQuery}
                setQuery={setSearchQuery}
                onOpen={openFile}
              />
            )
          ) : null}
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <TabBar
            tabs={openTabs}
            active={active}
            onSwitch={setActive}
            onClose={closeTab}
            mode={mode}
            onModeChange={setMode}
            onMenuClick={() => setDrawerOpen((v) => !v)}
            lang={lang}
          />
          <Breadcrumb active={active} mode={mode} />
          <FileEditor file={active} cv={cv} lang={lang} mode={mode} onJumpToFile={openFile} />
        </div>
      </div>

      <StatusBar lang={lang} cv={cv} active={active} />
    </div>
  );
}

/* ─────────── Activity bar ─────────── */
function ActivityBar({
  activityView,
  sidebarOpen,
  setActivityView,
  onOpenTerminal,
  onOpenStarWars,
  onOpenNotion,
  onPickTheme,
  lang,
}: {
  activityView: ActivityView;
  sidebarOpen: boolean;
  setActivityView: (v: ActivityView) => void;
  onOpenTerminal?: () => void;
  onOpenStarWars?: () => void;
  onOpenNotion?: () => void;
  onPickTheme?: () => void;
  lang: Lang;
}) {
  const t = (en: string, pt: string) => (lang === "en" ? en : pt);
  return (
    <div
      className="flex w-12 shrink-0 flex-col items-center justify-between border-r py-2"
      style={{ backgroundColor: C.activity, borderColor: C.border }}
    >
      <div className="flex flex-col items-center gap-1.5">
        <ActivityButton
          Icon={VscFile}
          label={t("Files", "Arquivos")}
          active={activityView === "files" && sidebarOpen}
          onClick={() => setActivityView("files")}
        />
        <ActivityButton
          Icon={VscSearch}
          label={t("Search", "Buscar")}
          active={activityView === "search" && sidebarOpen}
          onClick={() => setActivityView("search")}
        />
        <ActivityButton
          Icon={VscTerminal}
          label={t("Open terminal", "Abrir terminal")}
          onClick={onOpenTerminal}
        />
        <ActivityButton
          Icon={JediOrderIcon}
          label={t("Jedi · open Star Wars theme", "Jedi · abrir tema Star Wars")}
          onClick={onOpenStarWars}
        />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={onOpenNotion}
          title={t("Profile · open Notion theme", "Perfil · abrir tema Notion")}
          aria-label={t("Open Notion theme", "Abrir tema Notion")}
          className="grid h-10 w-10 cursor-pointer place-items-center text-white/50 hover:text-white"
        >
          <VscAccount size={22} />
        </button>
        <button
          type="button"
          onClick={onPickTheme}
          title={t("Settings · change theme", "Configurações · trocar tema")}
          aria-label={t("Change theme", "Trocar tema")}
          className="grid h-10 w-10 cursor-pointer place-items-center text-white/50 hover:text-white"
        >
          <VscSettingsGear size={22} />
        </button>
      </div>
    </div>
  );
}

function ActivityButton({
  Icon,
  label,
  active,
  onClick,
}: {
  Icon: React.ComponentType<{ size?: number }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`relative grid h-10 w-10 cursor-pointer place-items-center transition ${
        active ? "text-white" : "text-white/50 hover:text-white"
      }`}
    >
      {active ? (
        <span aria-hidden className="absolute left-0 top-2 h-6 w-[2px] bg-white" />
      ) : null}
      <Icon size={22} />
    </button>
  );
}

/* ─────────── Sidebar (scrollable + clickable) ─────────── */
/* ─────────── Search panel ─────────── */

type SearchEntry = { file: FileKey; section: string; text: string };
type SearchHit = { entry: SearchEntry; index: number };

function buildSearchIndex(cv: CV, lang: Lang): SearchEntry[] {
  const list: SearchEntry[] = [];
  const push = (file: FileKey, section: string, text: string) => {
    if (text && text.trim().length > 0) list.push({ file, section, text });
  };

  // README, overview surface
  push("README.md", "Name", cv.name);
  push("README.md", "Headline", cv.headline[lang]);
  push("README.md", "Tagline", cv.tagline[lang]);
  push("README.md", "Disciplines", cv.disciplines.join(" · "));

  // About
  push("about.md", "Summary", cv.summary[lang]);

  // Experience
  for (const exp of cv.experience) {
    const role = `${exp.role[lang]} @ ${exp.company}`;
    push("experience.md", role, role);
    push("experience.md", role, exp.summary[lang]);
    if (exp.location) push("experience.md", role, exp.location[lang]);
    push("experience.md", role, exp.period[lang]);
    for (const b of exp.bullets[lang]) push("experience.md", role, b);
    for (const s of exp.stack) push("experience.md", role, s);
  }

  // Skills
  for (const g of cv.skills) {
    const label = g.label[lang];
    push("skills.md", label, label);
    for (const s of g.items) push("skills.md", label, s);
  }

  // Languages
  for (const l of cv.languages) {
    const name = `${l.name[lang]} · ${l.level[lang]}`;
    push("languages.md", name, name);
    push("languages.md", name, l.details[lang]);
  }

  // Education + Courses
  for (const e of cv.education) {
    push("education.md", "Degrees", `${e.degree[lang]} · ${e.institution}`);
  }
  for (const c of cv.courses) {
    push("education.md", "Courses", `${c.name[lang]} · ${c.provider}`);
  }

  // Contact
  for (const c of cv.contacts) {
    push("contact.md", "Contact", `${c.label}: ${c.display}`);
  }

  return list;
}

function SearchPanel({
  cv,
  lang,
  query,
  setQuery,
  onOpen,
}: {
  cv: CV;
  lang: Lang;
  query: string;
  setQuery: (q: string) => void;
  onOpen: (f: FileKey) => void;
}) {
  const index = useMemo(() => buildSearchIndex(cv, lang), [cv, lang]);

  const q = query.trim().toLowerCase();
  const hits: SearchHit[] = q.length === 0
    ? []
    : index
        .map((entry) => ({ entry, index: entry.text.toLowerCase().indexOf(q) }))
        .filter((h) => h.index >= 0);

  // Group hits by file
  const grouped = new Map<FileKey, SearchHit[]>();
  for (const h of hits) {
    const arr = grouped.get(h.entry.file) ?? [];
    arr.push(h);
    grouped.set(h.entry.file, arr);
  }

  return (
    <div
      className="vscode-scrollbar flex min-h-0 w-[260px] shrink-0 flex-col overflow-y-auto border-r text-[12px]"
      style={{ backgroundColor: C.bg2, borderColor: C.border, color: C.text }}
    >
      <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/60">
        {lang === "en" ? "Search" : "Buscar"}
      </div>

      <div className="px-3 pb-2">
        <div
          className="flex items-center gap-2 rounded border px-2 py-1.5"
          style={{ borderColor: C.border, backgroundColor: C.bg }}
        >
          <VscSearch size={13} className="text-white/45" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "en" ? "Search resume…" : "Buscar no currículo…"}
            className="w-full bg-transparent text-[12.5px] text-white placeholder:text-white/40 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="cursor-pointer text-[10px] text-white/45 hover:text-white"
              aria-label={lang === "en" ? "Clear" : "Limpar"}
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>

      {q.length === 0 ? (
        <p className="px-4 py-6 text-[12px] text-white/45">
          {lang === "en"
            ? "Type to search across the whole CV: names, roles, bullets, tech, languages…"
            : "Digite para buscar no currículo: nomes, cargos, bullets, tech, idiomas…"}
        </p>
      ) : hits.length === 0 ? (
        <p className="px-4 py-6 text-[12px] text-white/45">
          {lang === "en" ? "No matches." : "Sem resultados."}
        </p>
      ) : (
        <div className="px-1 pb-4">
          <p className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/45">
            {lang === "en"
              ? `${hits.length} results in ${grouped.size} files`
              : `${hits.length} resultados em ${grouped.size} arquivos`}
          </p>
          {Array.from(grouped.entries()).map(([file, fileHits]) => (
            <div key={file} className="mb-2">
              <button
                type="button"
                onClick={() => onOpen(file)}
                className="flex w-full cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-left hover:bg-white/5"
              >
                <VscMarkdown size={13} color="#519aba" />
                <span className="font-semibold text-white">{file}</span>
                <span className="ml-auto font-mono text-[10px] text-white/40">
                  {fileHits.length}
                </span>
              </button>
              <ul className="mt-0.5">
                {fileHits.slice(0, 6).map((hit, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => onOpen(hit.entry.file)}
                      className="flex w-full cursor-pointer flex-col items-start gap-0.5 rounded px-3 py-1 text-left hover:bg-white/5"
                    >
                      <span className="font-mono text-[9.5px] uppercase tracking-wider text-white/45">
                        {hit.entry.section}
                      </span>
                      <span className="text-[11.5px] leading-snug text-white/85">
                        {renderHighlight(hit.entry.text, hit.index, q.length)}
                      </span>
                    </button>
                  </li>
                ))}
                {fileHits.length > 6 ? (
                  <li className="px-3 py-1 text-[10px] text-white/40">
                    +{fileHits.length - 6} {lang === "en" ? "more" : "outros"}
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function renderHighlight(text: string, start: number, length: number): React.ReactNode {
  // Trim long lines around the match for snippet feel.
  const before = text.slice(Math.max(0, start - 30), start);
  const match = text.slice(start, start + length);
  const after = text.slice(start + length, start + length + 60);
  const ellipsisL = start - 30 > 0 ? "…" : "";
  const ellipsisR = start + length + 60 < text.length ? "…" : "";
  return (
    <>
      {ellipsisL}
      {before}
      <mark
        className="rounded-sm px-0.5"
        style={{ backgroundColor: "rgba(245, 215, 110, 0.35)", color: "#fff" }}
      >
        {match}
      </mark>
      {after}
      {ellipsisR}
    </>
  );
}

function Sidebar({
  active,
  onOpen,
  lang,
}: {
  active: FileKey;
  onOpen: (f: FileKey) => void;
  lang: Lang;
}) {
  return (
    <div
      className="vscode-scrollbar flex min-h-0 w-[260px] shrink-0 flex-col overflow-y-auto border-r text-[12px]"
      style={{ backgroundColor: C.bg2, borderColor: C.border, color: C.text }}
    >
      <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/60">
        {lang === "en" ? "Explorer" : "Explorador"}
      </div>

      <details open className="text-white/85">
        <summary className="flex cursor-pointer select-none items-center gap-1 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider hover:bg-white/5">
          <VscChevronDown size={14} />
          <span>tiago-duarte-cv</span>
        </summary>
        <FileButton name="README.md" active={active === "README.md"} onClick={() => onOpen("README.md")}>
          <VscMarkdown size={14} color="#519aba" />
        </FileButton>
        <details open>
          <summary className="flex cursor-pointer select-none items-center gap-1 py-0.5 pl-2 hover:bg-white/5">
            <VscChevronDown size={12} />
            <VscFolderOpened size={14} color="#dcb67a" />
            <span>sections</span>
          </summary>
          {FILE_ORDER.filter((f) => f !== "README.md").map((f, i) => (
            <FileButton
              key={f}
              name={`${String(i + 1).padStart(2, "0")}_${f}`}
              indent={2}
              active={active === f}
              onClick={() => onOpen(f)}
            >
              <VscMarkdown size={14} color="#519aba" />
            </FileButton>
          ))}
        </details>
      </details>

      {/* Helper hint at the bottom */}
      <div
        className="mt-auto border-t px-4 py-3 text-[11px] leading-relaxed text-white/55"
        style={{ borderColor: C.border }}
      >
        <div className="flex items-start gap-2">
          <VscEye size={13} className="mt-0.5 shrink-0" />
          <span>
            {lang === "en"
              ? "Click any file to open it. Use the buttons in the top-right to switch view modes."
              : "Clique num arquivo para abrir. Use os botões no canto superior direito para trocar o modo de visualização."}
          </span>
        </div>
      </div>
    </div>
  );
}

function FileButton({
  name,
  active,
  onClick,
  children,
  indent = 1,
  disabled,
}: {
  name: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  indent?: number;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex cursor-pointer items-center gap-1.5 py-0.5 ${
        active ? "bg-[#37373d] text-white" : "text-white/85 hover:bg-white/5"
      } ${disabled ? "opacity-60" : ""}`}
      style={{ paddingLeft: `${indent * 16}px` }}
      onClick={disabled ? undefined : onClick}
    >
      <span className="w-3" />
      {children}
      <span>{name}</span>
    </div>
  );
}

/* ─────────── Tab bar ─────────── */
function TabBar({
  tabs,
  active,
  onSwitch,
  onClose,
  mode,
  onModeChange,
  onMenuClick,
  lang,
}: {
  tabs: FileKey[];
  active: FileKey;
  onSwitch: (f: FileKey) => void;
  onClose: (f: FileKey) => void;
  mode: ViewMode;
  onModeChange: (m: ViewMode) => void;
  onMenuClick?: () => void;
  lang: Lang;
}) {
  const labels = {
    preview: lang === "en" ? "Preview" : "Visualização",
    source: lang === "en" ? "Source" : "Código",
    split: lang === "en" ? "Split" : "Dividido",
  } as const;
  return (
    <div
      className="vscode-scrollbar flex items-center overflow-x-auto border-b"
      style={{ backgroundColor: C.bg2, borderColor: C.border }}
    >
      {/* Hamburger, opens the activity/file drawer on mobile */}
      {onMenuClick ? (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={lang === "en" ? "Open file explorer" : "Abrir explorador de arquivos"}
          title={lang === "en" ? "Files & search" : "Arquivos & busca"}
          className="grid h-8 w-9 shrink-0 cursor-pointer place-items-center border-r text-white/65 transition hover:bg-white/10 hover:text-white md:hidden"
          style={{ borderColor: C.border }}
        >
          <VscMenu size={16} />
        </button>
      ) : null}
      {tabs.map((tab) => {
        const pinned = tab === "README.md" && tabs.length === 1;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onSwitch(tab)}
            onAuxClick={(e) => {
              if (e.button === 1 && !pinned) onClose(tab);
            }}
            onMouseDown={(e) => {
              // Suppress the middle-click autoscroll cursor.
              if (e.button === 1) e.preventDefault();
            }}
            className={`group flex shrink-0 cursor-pointer items-center gap-2 border-r px-3 py-1.5 text-[12px] ${
              tab === active ? "text-white" : "text-white/55 hover:text-white/80"
            }`}
            style={{
              backgroundColor: tab === active ? C.bg : "transparent",
              borderColor: C.border,
              borderTop: tab === active ? `1px solid ${C.status}` : "1px solid transparent",
            }}
          >
            <VscMarkdown size={13} color="#519aba" />
            <span>{tab}</span>
            {pinned ? null : (
              <span
                role="button"
                tabIndex={0}
                aria-label={`Close ${tab}`}
                className="ml-1 cursor-pointer text-white/40 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tab);
                }}
              >
                ✕
              </span>
            )}
          </button>
        );
      })}
      {/* View mode toggle (right side, like VSCode) */}
      <div className="ml-auto flex items-center gap-1 px-2">
        <ModeButton
          active={mode === "source"}
          onClick={() => onModeChange("source")}
          title={labels.source}
        >
          <VscCode size={15} />
        </ModeButton>
        <ModeButton
          active={mode === "split"}
          onClick={() => onModeChange("split")}
          title={labels.split}
        >
          <VscSplitHorizontal size={15} />
        </ModeButton>
        <ModeButton
          active={mode === "preview"}
          onClick={() => onModeChange("preview")}
          title={labels.preview}
        >
          <VscOpenPreview size={15} />
        </ModeButton>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`grid h-7 w-7 cursor-pointer place-items-center rounded transition ${
        active ? "bg-white/15 text-white" : "text-white/55 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Breadcrumb({ active, mode }: { active: FileKey; mode: ViewMode }) {
  const path = active === "README.md" ? ["tiago-duarte-cv"] : ["tiago-duarte-cv", "sections"];
  return (
    <div
      className="flex items-center gap-1.5 px-4 py-1 text-[11px] text-white/55"
      style={{ backgroundColor: C.bg, borderBottom: `1px solid ${C.border}` }}
    >
      {path.map((p) => (
        <span key={p} className="flex items-center gap-1.5">
          <VscFolder size={11} color="#dcb67a" />
          <span>{p}</span>
          <VscChevronRight size={12} />
        </span>
      ))}
      <VscMarkdown size={11} color="#519aba" />
      <span className="text-white">{active}</span>
      <span className="ml-auto flex items-center gap-1 text-white/45">
        {mode === "preview" ? <VscOpenPreview size={11} /> : null}
        {mode === "source" ? <VscCode size={11} /> : null}
        {mode === "split" ? <VscSplitHorizontal size={11} /> : null}
        <span className="font-mono uppercase tracking-wider">{mode}</span>
      </span>
    </div>
  );
}

/* ─────────── File editor: source / preview / split ─────────── */
function FileEditor({
  file,
  cv,
  lang,
  mode,
  onJumpToFile,
}: {
  file: FileKey;
  cv: CV;
  lang: Lang;
  mode: ViewMode;
  onJumpToFile?: (f: FileKey) => void;
}) {
  const { source, preview } = buildFile(file, cv, lang, onJumpToFile);

  const showSource = mode === "source" || mode === "split";
  const showPreview = mode === "preview" || mode === "split";

  const sourceRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // The scroll containers are reused across tab switches (same DOM, different
  // file content), so without this each tab inherits the previous tab's
  // scrollTop and lands mid-document.
  useEffect(() => {
    sourceRef.current?.scrollTo({ top: 0 });
    previewRef.current?.scrollTo({ top: 0 });
  }, [file]);

  // Prev / next navigation
  const idx = FILE_ORDER.indexOf(file);
  const prev = idx > 0 ? FILE_ORDER[idx - 1] : null;
  const next = idx >= 0 && idx < FILE_ORDER.length - 1 ? FILE_ORDER[idx + 1] : null;

  return (
    <div className={`grid min-h-0 flex-1 ${mode === "split" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
      {showSource ? (
        <div
          ref={sourceRef}
          className={`vscode-scrollbar min-h-0 overflow-auto font-mono text-[13px] ${mode === "split" ? "border-r" : ""}`}
          style={{ backgroundColor: C.bg, color: C.text, borderColor: C.border }}
        >
          <div className="py-2">
            {source.split("\n").map((line, i) => (
              <div key={i} className="flex min-h-[20px] gap-3 leading-[20px]">
                <span
                  className="select-none pl-3 pr-1 text-right tabular-nums"
                  style={{ color: C.muted, minWidth: "44px" }}
                >
                  {i + 1}
                </span>
                <span className="whitespace-pre-wrap break-words pr-6">{highlightMd(line)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {showPreview ? (
        <div ref={previewRef} className="vscode-scrollbar min-h-0 overflow-auto" style={{ backgroundColor: C.bg }}>
          {/* Top nav, all categories */}
          <SectionTabs
            current={file}
            onJumpToFile={onJumpToFile}
            lang={lang}
          />

          <div className="px-4 pb-4 pt-3 font-sans text-[14.5px] leading-relaxed text-white/85 md:px-6">
            {preview}
          </div>

          {/* Bottom nav, sequential prev/next */}
          <FileNav
            prev={prev}
            next={next}
            onJumpToFile={onJumpToFile}
            lang={lang}
            bottom
          />
        </div>
      ) : null}
    </div>
  );
}

function SectionTabs({
  current,
  onJumpToFile,
  lang,
}: {
  current: FileKey;
  onJumpToFile?: (f: FileKey) => void;
  lang: Lang;
}) {
  const [open, setOpen] = useState(false);
  if (!onJumpToFile) return null;
  const labelOf = (f: FileKey): string => {
    const map: Record<string, [string, string]> = {
      "README.md": ["Overview", "Início"],
      "about.md": ["About", "Sobre"],
      "experience.md": ["Experience", "Experiência"],
      "projects.md": ["Projects", "Projetos"],
      "skills.md": ["Skills", "Habilidades"],
      "languages.md": ["Languages", "Idiomas"],
      "education.md": ["Education", "Formação"],
      "contact.md": ["Contact", "Contato"],
    };
    const t = map[f] ?? [f, f];
    return lang === "en" ? t[0] : t[1];
  };
  const handleSelect = (f: FileKey) => {
    onJumpToFile(f);
    setOpen(false);
  };
  return (
    <>
      {/* Desktop: scrollable horizontal tabs */}
      <nav
        aria-label={lang === "en" ? "Sections" : "Seções"}
        className="no-scrollbar hidden items-center gap-1 overflow-x-auto border-b px-3 py-1.5 md:flex md:px-5"
        style={{ borderColor: C.border }}
      >
        {FILE_ORDER.map((f) => {
          const active = f === current;
          return (
            <button
              key={f}
              type="button"
              onClick={() => onJumpToFile(f)}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 cursor-pointer rounded px-2.5 py-1 text-[11.5px] font-medium transition ${
                active
                  ? "text-white"
                  : "text-white/55 hover:bg-white/5 hover:text-white/85"
              }`}
              style={{
                backgroundColor: active ? "rgba(255,255,255,0.08)" : "transparent",
                boxShadow: active ? `inset 0 -2px 0 0 ${C.func}` : undefined,
              }}
            >
              {labelOf(f)}
            </button>
          );
        })}
      </nav>

      {/* Mobile: dropdown, tap to reveal full list */}
      <div
        className="relative border-b md:hidden"
        style={{ borderColor: C.border }}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-[12.5px] font-medium text-white/85 hover:bg-white/5"
        >
          <span className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {lang === "en" ? "Section" : "Seção"}
            </span>
            <span>{labelOf(current)}</span>
          </span>
          <VscChevronDown
            size={14}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open ? (
          <>
            <button
              type="button"
              aria-label={lang === "en" ? "Close menu" : "Fechar menu"}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-20 cursor-default"
            />
            <div
              role="menu"
              className="absolute inset-x-0 top-full z-30 border-b shadow-lg"
              style={{ backgroundColor: C.bg2, borderColor: C.border }}
            >
              {FILE_ORDER.map((f) => {
                const active = f === current;
                return (
                  <button
                    key={f}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelect(f)}
                    aria-current={active ? "page" : undefined}
                    className={`flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-[12.5px] font-medium transition ${
                      active
                        ? "text-white"
                        : "text-white/65 hover:bg-white/5 hover:text-white"
                    }`}
                    style={{
                      backgroundColor: active ? "rgba(255,255,255,0.08)" : "transparent",
                      boxShadow: active ? `inset 2px 0 0 0 ${C.func}` : undefined,
                    }}
                  >
                    <span>{labelOf(f)}</span>
                    <span className="font-mono text-[10px] text-white/35">{f}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

function FileNav({
  prev,
  next,
  onJumpToFile,
  lang,
  bottom,
}: {
  prev: FileKey | null;
  next: FileKey | null;
  onJumpToFile?: (f: FileKey) => void;
  lang: Lang;
  bottom?: boolean;
}) {
  if (!prev && !next) return null;
  const labelOf = (f: FileKey): string => {
    const map: Record<string, [string, string]> = {
      "README.md": ["Overview", "Início"],
      "about.md": ["About", "Sobre"],
      "experience.md": ["Experience", "Experiência"],
      "projects.md": ["Projects", "Projetos"],
      "skills.md": ["Skills", "Habilidades"],
      "languages.md": ["Languages", "Idiomas"],
      "education.md": ["Education", "Formação"],
      "contact.md": ["Contact", "Contato"],
    };
    const t = map[f] ?? [f, f];
    return lang === "en" ? t[0] : t[1];
  };
  return (
    <div
      className={`flex items-stretch justify-between gap-2 px-4 md:px-6 ${
        bottom ? "border-t pt-3 mt-2" : "pt-2 pb-1"
      }`}
      style={{ borderColor: C.border }}
    >
      {prev && onJumpToFile ? (
        <button
          type="button"
          onClick={() => onJumpToFile(prev)}
          className="group flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-left text-[12px] transition hover:bg-white/5"
          style={{ borderColor: C.border, backgroundColor: C.bg2 }}
        >
          <span className="text-[16px] text-white/55 transition group-hover:-translate-x-0.5">‹</span>
          <span>
            <span className="block text-[10px] uppercase tracking-wider text-white/45">
              {lang === "en" ? "Previous" : "Anterior"}
            </span>
            <span className="block font-semibold text-white">{labelOf(prev)}</span>
          </span>
        </button>
      ) : (
        <span />
      )}
      {next && onJumpToFile ? (
        <button
          type="button"
          onClick={() => onJumpToFile(next)}
          className="group flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-right text-[12px] transition hover:bg-white/5"
          style={{ borderColor: C.border, backgroundColor: C.bg2 }}
        >
          <span>
            <span className="block text-[10px] uppercase tracking-wider text-white/45">
              {lang === "en" ? "Next" : "Próximo"}
            </span>
            <span className="block font-semibold text-white">{labelOf(next)}</span>
          </span>
          <span className="text-[16px] text-white/55 transition group-hover:translate-x-0.5">›</span>
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

/* ─────────── Markdown light syntax highlight ─────────── */
function highlightMd(line: string): React.ReactNode {
  if (line.startsWith("# ")) return <span style={{ color: C.keyword, fontWeight: 700 }}>{line}</span>;
  if (line.startsWith("## ")) return <span style={{ color: C.func, fontWeight: 700 }}>{line}</span>;
  if (line.startsWith("### ")) return <span style={{ color: C.type }}>{line}</span>;
  if (line.startsWith("> ")) return <span style={{ color: C.comment, fontStyle: "italic" }}>{line}</span>;
  if (line.startsWith("- ") || line.startsWith("* ")) {
    return (
      <>
        <span style={{ color: C.keyword }}>{line.slice(0, 2)}</span>
        <span>{line.slice(2)}</span>
      </>
    );
  }
  if (line.startsWith("---")) return <span style={{ color: C.muted }}>{line}</span>;
  // inline ** bold ** and `code`
  const out: React.ReactNode[] = [];
  let s = line;
  let i = 0;
  while (s.length > 0) {
    const bold = s.match(/^\*\*(.+?)\*\*/);
    const code = s.match(/^`([^`]+)`/);
    const link = s.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (bold) {
      out.push(<strong key={i++} style={{ color: C.string }}>{bold[1]}</strong>);
      s = s.slice(bold[0].length);
      continue;
    }
    if (code) {
      out.push(
        <span key={i++} style={{ color: C.number, background: "rgba(255,255,255,0.07)", padding: "0 4px", borderRadius: 3 }}>
          {code[1]}
        </span>,
      );
      s = s.slice(code[0].length);
      continue;
    }
    if (link) {
      out.push(
        <a key={i++} href={link[2]} target="_blank" rel="noreferrer" style={{ color: C.variable }}>
          {link[1]}
        </a>,
      );
      s = s.slice(link[0].length);
      continue;
    }
    out.push(s[0]);
    s = s.slice(1);
  }
  return <>{out}</>;
}

/* ─────────── Per-file content ─────────── */
function buildFile(
  file: FileKey,
  cv: CV,
  lang: Lang,
  onJumpToFile?: (f: FileKey) => void,
): { source: string; preview: React.ReactNode } {
  const t = (en: string, pt: string) => (lang === "en" ? en : pt);

  switch (file) {
    case "README.md": {
      const source = `# ${cv.name}

**${cv.headline[lang]}** · *${cv.tagline[lang]}*

\`${cv.disciplines.join("\` · \`")}\`

---

## ${t("How to read this", "Como ler isto")}

${
  lang === "en"
    ? `This page mimics a code editor, but you don't need to read any code.
The **Preview** mode (the one open right now) shows everything in plain text.

> 💡 You're looking at \`README.md\`. The summary, sections and how to navigate are all here.`
    : `Esta página imita um editor de código, mas você **não precisa ler código**.
O modo **Visualização** (aberto agora) mostra tudo em texto simples.

> 💡 Você está vendo o \`README.md\`. O resumo, as seções e como navegar estão todos aqui.`
}

### ${t("Quick navigation", "Navegação rápida")}

- 📂 ${t("**Sidebar (left)**: click a file to open that section.", "**Barra lateral (esquerda)**: clique num arquivo para abrir essa seção.")}
- 👁 ${t("**Top-right buttons**: switch between Source · Split · Preview.", "**Botões no topo à direita**: alternam entre Código · Dividido · Visualização.")}
- 🌐 ${t("**Toolbar (top)**: change theme, language, or print to PDF.", "**Barra de ferramentas (topo)**: muda tema, idioma, ou imprime em PDF.")}

---

## ${t("About me", "Sobre mim")}

${cv.summary[lang]}

## ${t("Sections in this page", "Seções desta página")}

${FILE_ORDER.filter((f) => f !== "README.md").map((f) => {
  const titles: Record<string, [string, string]> = {
    "about.md": ["About", "Sobre"],
    "experience.md": ["Experience", "Experiência"],
    "projects.md": ["Projects", "Projetos"],
    "skills.md": ["Skills", "Habilidades"],
    "languages.md": ["Languages", "Idiomas"],
    "education.md": ["Education", "Formação"],
    "contact.md": ["Contact", "Contato"],
  };
  const [en, pt] = titles[f] ?? [f, f];
  return `- [${lang === "en" ? en : pt}](${f}) · \`${f}\``;
}).join("\n")}

## ${t("Quick contact", "Contato rápido")}

${cv.contacts.map((c) => `- **${c.label}** · [${c.display}](${c.href})`).join("\n")}
`;
      const preview = (
        <div>
          <h1 className="text-[32px] font-extrabold text-white">{cv.name}</h1>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-sans text-[18px] font-bold text-white">
              {cv.headline[lang]}
            </span>
            <span style={{ color: C.muted }}>·</span>
            <span className="font-mono text-[14px] italic" style={{ color: C.func }}>
              {cv.tagline[lang]}
            </span>
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {cv.disciplines.map((d) => (
              <li
                key={d}
                className="rounded border px-2 py-0.5 text-[12px] font-mono"
                style={{ borderColor: C.border, backgroundColor: C.bg2, color: C.variable }}
              >
                {d}
              </li>
            ))}
          </ul>

          {/* Friendly tutorial callout */}
          <div
            className="mt-6 rounded-lg border p-4"
            style={{ borderColor: C.border, backgroundColor: C.bg2 }}
          >
            <h2 className="text-[18px] font-bold text-white">
              👋 {t("How to read this page", "Como ler esta página")}
            </h2>
            <p className="mt-2 text-[14.5px]">
              {lang === "en"
                ? "This page is rendered like VSCode's Markdown preview. The Preview mode (open right now) shows everything in plain text, no code required."
                : "Esta página é renderizada como o visualizador de Markdown do VSCode. O modo Visualização (aberto agora) mostra tudo em texto simples, sem precisar ler código."}
            </p>
            <p className="mt-2 text-[14.5px]" style={{ color: C.muted }}>
              {lang === "en"
                ? "If you're a developer and prefer reading raw markdown, switch to Source mode using the top-right buttons, same place and same way you'd do it in real VSCode."
                : "Se você é dev e prefere ler markdown cru, alterna pro modo Código nos botões do canto superior direito, mesmo lugar e mesmo jeito que faria no VSCode de verdade."}
            </p>
            <ul className="mt-3 space-y-2 text-[14px]">
              <li className="flex gap-2">
                <span>📂</span>
                <span>
                  <strong>{t("Sidebar (left)", "Barra lateral (esquerda)")}</strong>
                  {": "}
                  {t("click any file to open that section.", "clique num arquivo para abrir essa seção.")}
                </span>
              </li>
              <li className="flex gap-2">
                <span>👁</span>
                <span>
                  <strong>{t("Top-right buttons", "Botões no canto superior direito")}</strong>
                  {": "}
                  {t("switch between Source · Split · Preview.", "alternam entre Código · Dividido · Visualização.")}
                </span>
              </li>
              <li className="flex gap-2">
                <span>🌐</span>
                <span>
                  <strong>{t("Toolbar (top)", "Barra de ferramentas (topo)")}</strong>
                  {": "}
                  {t("change theme, language, or print to PDF.", "muda tema, idioma, ou imprime em PDF.")}
                </span>
              </li>
            </ul>
          </div>

          <h2 className="mt-8 text-[20px] font-bold text-white">{t("About me", "Sobre mim")}</h2>
          <div className="mt-2 space-y-3">
            {cv.summary[lang].split("\n\n").map((p, i) => (
              <p key={i} className="leading-snug">{linkifyBlog(p, C.variable)}</p>
            ))}
          </div>

          <h2 className="mt-8 text-[20px] font-bold text-white">{t("Sections in this page", "Seções desta página")}</h2>
          <p className="mt-1 text-[13.5px]" style={{ color: C.muted }}>
            {t("Tap to open. Each one is a section of the resume.", "Toque para abrir. Cada um é uma seção do currículo.")}
          </p>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {FILE_ORDER.filter((f) => f !== "README.md").map((f) => {
              const titles: Record<string, [string, string, string]> = {
                "about.md": ["About", "Sobre", "📌"],
                "experience.md": ["Experience", "Experiência", "💼"],
                "projects.md": ["Projects", "Projetos", "🚀"],
                "skills.md": ["Skills", "Habilidades", "🛠"],
                "languages.md": ["Languages", "Idiomas", "🌍"],
                "education.md": ["Education", "Formação", "🎓"],
                "contact.md": ["Contact", "Contato", "✉️"],
              };
              const [en, pt, emoji] = titles[f] ?? [f, f, "📄"];
              return (
                <li key={f}>
                  <button
                    type="button"
                    onClick={() => onJumpToFile?.(f)}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-md border p-3 text-left text-[14px] transition hover:bg-white/5"
                    style={{ borderColor: C.border, backgroundColor: C.bg2 }}
                  >
                    <span className="text-[18px]">{emoji}</span>
                    <span className="flex-1 font-semibold text-white">
                      {lang === "en" ? en : pt}
                    </span>
                    <span className="font-mono text-[10px]" style={{ color: C.muted }}>
                      {f}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <h2 className="mt-8 text-[20px] font-bold text-white">{t("Quick contact", "Contato rápido")}</h2>
          <ul className="mt-2 space-y-1">
            {cv.contacts.map((c) => (
              <li key={c.kind}>
                <span style={{ color: C.string }}>{c.label}</span>{": "}
                <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={{ color: C.variable }}>
                  {c.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
      return { source, preview };
    }

    case "about.md": {
      const source = `# ${t("About me", "Sobre mim")}

${cv.summary[lang]}

## ${t("In short", "Em resumo")}

- ${t("Fullstack with Frontend focus", "Fullstack com foco em Frontend")}
- ${t("React, Next.js, React Native", "React, Next.js, React Native")}
- ${t("Node.js, NestJS, Express", "Node.js, NestJS, Express")}
- ${t("AWS, Docker, CI/CD", "AWS, Docker, CI/CD")}
`;
      const preview = (
        <div>
          <h1 className="text-[28px] font-bold text-white">{t("About me", "Sobre mim")}</h1>
          <div className="mt-3 space-y-3">
            {cv.summary[lang].split("\n\n").map((p, i) => (
              <p key={i} className="text-[15px] leading-snug">{linkifyBlog(p, C.variable)}</p>
            ))}
          </div>
          <h2 className="mt-6 text-[18px] font-bold text-white">{t("In short", "Em resumo")}</h2>
          <ul className="mt-2 space-y-1">
            {[
              t("Fullstack with Frontend focus", "Fullstack com foco em Frontend"),
              t("React, Next.js, React Native", "React, Next.js, React Native"),
              t("Node.js, NestJS, Express", "Node.js, NestJS, Express"),
              t("AWS, Docker, CI/CD", "AWS, Docker, CI/CD"),
            ].map((s, i) => (
              <li key={i} className="flex gap-2">
                <span style={{ color: C.keyword }}>•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      );
      return { source, preview };
    }

    case "experience.md": {
      const source = `# ${t("Experience", "Experiência")}

${cv.experience
  .map((e) => {
    const d = experienceDuration(e.period);
    const periodLine = `> **${e.period[lang]}**${d ? ` · ${d[lang]}` : ""}${e.location ? ` · *${e.location[lang]}*` : ""}`;
    return `## ${e.role[lang]} · ${e.company}\n\n${periodLine}\n\n${e.summary[lang]}\n\n${e.bullets[lang]
      .map((b) => (isBulletIntro(b) ? `\n${b}\n` : `- ${b}`))
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()}\n`;
  })
  .join("\n")}`;
      const preview = (
        <div>
          <h1 className="text-[28px] font-bold text-white">{t("Experience", "Experiência")}</h1>
          <div className="mt-4 space-y-4">
            {cv.experience.map((exp) => {
              const duration = experienceDuration(exp.period);
              return (
              <article
                key={exp.company + exp.period.en}
                id={experienceAnchorId(exp.company)}
                className="scroll-mt-24 rounded-md border bg-white/[0.02] p-4"
                style={{ borderColor: C.border }}
              >
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="inline-flex items-baseline gap-2 text-[17px] font-bold text-white">
                    <span>
                      {exp.role[lang]}{" "}
                      <span style={{ color: C.muted }}>·</span>{" "}
                      <span style={{ color: C.type }}>
                        {exp.url ? (
                          <a href={exp.url} target="_blank" rel="noreferrer" className="hover:underline">
                            {exp.company}
                          </a>
                        ) : (
                          exp.company
                        )}
                      </span>
                    </span>
                    <ExperienceShareLink company={exp.company} lang={lang} size={13} />
                  </h2>
                  <span className="text-[12px]" style={{ color: C.func }}>
                    {exp.period[lang]}
                    {duration ? ` · ${duration[lang]}` : ""}
                    {exp.location ? ` · ${exp.location[lang]}` : ""}
                  </span>
                </header>
                <div className="mt-2 space-y-2 text-white/80">
                  {parseExperienceSummary(exp.summary[lang]).map((block, i) => {
                    if (block.kind === "separator") {
                      return (
                        <div
                          key={i}
                          className="my-1 flex items-center gap-3 select-none"
                        >
                          <span className="h-px flex-1 bg-white/10" />
                          <span className="text-[10.5px] uppercase tracking-[0.18em] text-white/45">
                            {block.text}
                          </span>
                          <span className="h-px flex-1 bg-white/10" />
                        </div>
                      );
                    }
                    if (block.kind === "citation") {
                      const quoted = block.paragraphs.join(" ");
                      return (
                        <figure key={i} className="my-2">
                          <blockquote className="text-white/85">
                            <span
                              aria-hidden
                              className="font-serif"
                              style={{
                                fontSize: "36px",
                                lineHeight: 0,
                                verticalAlign: "-0.35em",
                                marginRight: "0.1em",
                                color: "rgba(255,255,255,0.35)",
                              }}
                            >
                              {"“"}
                            </span>
                            {quoted}
                            <span
                              aria-hidden
                              className="font-serif"
                              style={{
                                fontSize: "36px",
                                lineHeight: 0,
                                verticalAlign: "-0.35em",
                                marginLeft: "0.05em",
                                color: "rgba(255,255,255,0.35)",
                              }}
                            >
                              {"”"}
                            </span>
                          </blockquote>
                          <figcaption className="mt-1 text-[11px] text-white/55">
                            <a
                              href="?section=about"
                              onClick={(e) => {
                                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                                e.preventDefault();
                                dispatchCvNavigate("cv-about");
                              }}
                              className="hover:underline"
                            >
                              <cite className="not-italic">
                                {lang === "pt"
                                  ? "Texto de introdução à empresa/função, retirado e repetido do Sobre mim"
                                  : "Intro text about the company/role, taken from About"}
                              </cite>
                              <span aria-hidden> ↑</span>
                            </a>
                          </figcaption>
                        </figure>
                      );
                    }
                    return <p key={i}>{block.text}</p>;
                  })}
                </div>
                <div className="mt-2 space-y-2">
                  {groupBullets(exp.bullets[lang]).map((g, gi) => (
                    <div key={gi} className="space-y-1">
                      {g.intro ? (
                        <p className="text-white/55">{g.intro}</p>
                      ) : null}
                      {g.items.length > 0 ? (
                        <ul className="space-y-1">
                          {g.items.map((b, i) => (
                            <li key={i} className="flex gap-2">
                              <span style={{ color: C.keyword }}>•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
                {exp.stack.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {exp.stack.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] text-white/85"
                        style={{ borderColor: C.border, backgroundColor: C.bg2 }}
                      >
                        <TechIcon name={s} size={11} />
                        {getTechLabel(s)}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
              );
            })}
          </div>
        </div>
      );
      return { source, preview };
    }

    case "skills.md": {
      const source = `# ${t("Skills & tools", "Habilidades & ferramentas")}

${cv.skills
  .map((g) => `## ${g.label[lang]}\n\n${g.items.map((s) => `- ${getTechLabel(s)}`).join("\n")}\n`)
  .join("\n")}`;
      const preview = (
        <div>
          <h1 className="text-[28px] font-bold text-white">{t("Skills & tools", "Habilidades & ferramentas")}</h1>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {cv.skills.map((g) => (
              <div
                key={g.label.en}
                className="rounded-md border p-4"
                style={{ borderColor: C.border, backgroundColor: C.bg2 }}
              >
                <h2 className="text-[14px] font-bold uppercase tracking-wide" style={{ color: C.func }}>
                  {g.label[lang]}
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[12px] text-white/90"
                      style={{ borderColor: C.border, backgroundColor: C.bg }}
                    >
                      <TechIcon name={s} size={12} />
                      {getTechLabel(s)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      return { source, preview };
    }

    case "languages.md": {
      const source = `# ${t("Languages", "Idiomas")}

${cv.languages.map((l) => `## ${l.name[lang]} · *${l.level[lang]}*\n\n${l.details[lang]}\n`).join("\n")}`;
      const preview = (
        <div>
          <h1 className="text-[28px] font-bold text-white">{t("Languages", "Idiomas")}</h1>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {cv.languages.map((l) => (
              <div
                key={l.name.en}
                className="rounded-md border p-4"
                style={{ borderColor: C.border, backgroundColor: C.bg2 }}
              >
                <div className="flex items-center gap-2">
                  <Flag code={l.flag} size={26} />
                  <div className="flex flex-1 items-baseline justify-between">
                    <span className="text-[15px] font-bold text-white">{l.name[lang]}</span>
                  </div>
                </div>
                <div className="mt-1 text-[12px]" style={{ color: C.func }}>
                  {l.level[lang]}
                </div>
                <p className="mt-2 text-[13px] text-white/85">{l.details[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      );
      return { source, preview };
    }

    case "education.md": {
      const source = `# ${t("Education", "Formação")}

${cv.education.map((e) => `- **${e.degree[lang]}** · ${e.institution}`).join("\n")}
`;
      const preview = (
        <div>
          <h1 className="text-[28px] font-bold text-white">{t("Education", "Formação")}</h1>
          <ul className="mt-3 space-y-2">
            {cv.education.map((e) => (
              <li key={e.institution} className="flex items-baseline justify-between gap-3 border-b pb-2" style={{ borderColor: C.border }}>
                <span className="text-[15px] font-bold text-white">{e.degree[lang]}</span>
                <span className="text-[12px]" style={{ color: C.func }}>{e.institution}</span>
              </li>
            ))}
          </ul>
        </div>
      );
      return { source, preview };
    }

    case "contact.md": {
      const source = `# ${t("Contact", "Contato")}

${cv.contacts.map((c) => `- **${c.label}** · [${c.display}](${c.href})`).join("\n")}
`;
      const preview = (
        <div>
          <h1 className="text-[28px] font-bold text-white">{t("Contact", "Contato")}</h1>
          <ul className="mt-3 space-y-2">
            {cv.contacts.map((c) => (
              <li key={c.kind} className="flex items-baseline justify-between gap-3 rounded-md border p-3" style={{ borderColor: C.border, backgroundColor: C.bg2 }}>
                <span className="text-[14px]" style={{ color: C.string }}>{c.label}</span>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="text-[14px] hover:underline"
                  style={{ color: C.variable }}
                >
                  {c.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
      return { source, preview };
    }
  }
}

/* ─────────── Status bar ─────────── */
function StatusBar({ lang, cv, active }: { lang: Lang; cv: CV; active: FileKey }) {
  return (
    <div
      className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 px-3 py-1 font-sans text-[11px] text-white"
      style={{ backgroundColor: C.status }}
    >
      <span className="flex items-center gap-1">
        <VscGitCommit size={13} />
        main {"↑1"}
      </span>
      <span className="flex items-center gap-1">
        <VscSync size={12} />
      </span>
      <span className="flex items-center gap-1">
        <VscError size={13} />0
      </span>
      <span className="flex items-center gap-1">
        <VscWarning size={13} />0
      </span>
      <span>{active}</span>
      <span>{cv.experience.length} {lang === "en" ? "roles" : "cargos"}</span>
      <div className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>{lang === "en" ? "Spaces: 2" : "Espaços: 2"}</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span className="flex items-center gap-1">
          <VscMarkdown size={12} /> Markdown
        </span>
        <span className="flex items-center gap-1">
          <SiTypescript size={11} />
        </span>
        <span className="flex items-center gap-1">
          <VscBell size={12} />
        </span>
      </div>
    </div>
  );
}
