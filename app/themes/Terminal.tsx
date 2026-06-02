"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CV, Lang } from "../data/cv";
import {
  CV_NAVIGATE_EVENT,
  type CvNavigateDetail,
  type SectionId,
  dispatchCvNavigate,
} from "../data/navigation";
import { parseExperienceSummary } from "../lib/summaryBlocks";
import { linkifyBlog } from "../lib/linkifyBlog";
import { TechIcon, getTechLabel } from "../components/icons/TechIcon";
import { Flag } from "../components/icons/Flag";
import { groupBullets } from "../lib/bullets";
import { experienceDuration } from "../lib/period";

type Props = {
  cv: CV;
  lang: Lang;
  /** Click on the red ✕ button; caller switches back to VS Code. */
  onCloseWindow?: () => void;
};
type Variant = "ubuntu" | "debian";

type TPalette = {
  bg: string;
  fg: string;
  bold: string;
  user: string;
  host: string;
  cwd: string;
  link: string;
  dim: string;
  rule: string;
  surface: string;
};

/* GNOME Terminal palettes (Tango on different default backgrounds) */
const PALETTES: Record<Variant, TPalette> = {
  ubuntu: {
    bg: "#300A24", // aubergine
    fg: "#d3d7cf",
    bold: "#ffffff",
    user: "#8ae234",
    host: "#8ae234",
    cwd: "#729fcf",
    link: "#34e2e2",
    dim: "#888a85",
    rule: "rgba(255,255,255,0.1)",
    surface: "rgba(255,255,255,0.04)",
  },
  debian: {
    bg: "#1d1d1d", // GNOME default near-black
    fg: "#d3d7cf",
    bold: "#ffffff",
    user: "#8ae234",
    host: "#8ae234",
    cwd: "#729fcf",
    link: "#34e2e2",
    dim: "#888a85",
    rule: "rgba(255,255,255,0.08)",
    surface: "rgba(255,255,255,0.03)",
  },
};

const TermContext = createContext<TPalette>(PALETTES.ubuntu);

/* ─────────── Command registry ─────────── */

type CmdId =
  | "help"
  | "whoami"
  | "about"
  | "contact"
  | "experience"
  | "skills"
  | "languages"
  | "education"
  | "clear"
  | "logout";

type CmdMeta = {
  id: CmdId;
  /** Localized command string shown in the menu and echoed back when run. */
  label: { en: string; pt: string };
  /** One-line description shown next to the command in the to-do menu. */
  hint: { en: string; pt: string };
  /** All strings accepted as input for this command. */
  aliases: string[];
  /** Which section in the floating nav maps to this command, if any. */
  section?: SectionId;
};

const COMMANDS: CmdMeta[] = [
  {
    id: "whoami",
    label: { en: "whoami", pt: "whoami" },
    hint: { en: "One-line intro", pt: "Apresentação em uma linha" },
    aliases: ["whoami"],
  },
  {
    id: "about",
    label: { en: "cat about.txt", pt: "cat sobre.txt" },
    hint: { en: "Background and approach", pt: "História e jeito de trabalhar" },
    aliases: ["about", "sobre", "cat about.txt", "cat sobre.txt", "less about", "less sobre"],
    section: "cv-about",
  },
  {
    id: "contact",
    label: { en: "contact", pt: "contato" },
    hint: { en: "Email, links, location", pt: "Email, links, localização" },
    aliases: ["contact", "contato", "contacts", "contatos"],
    section: "cv-contact",
  },
  {
    id: "experience",
    label: { en: "ls experience/", pt: "ls experiencia/" },
    hint: { en: "Jobs and roles (run all)", pt: "Empregos e cargos (roda todos)" },
    aliases: [
      "experience",
      "experiencia",
      "experiência",
      "ls",
      "ls experience",
      "ls experience/",
      "ls experiencia",
      "ls experiencia/",
      "ls experiência",
      "ls experiência/",
      "experience --all",
      "experiencia --all",
      "cat experience",
      "cat experience/*",
    ],
    section: "cv-experience",
  },
  {
    id: "skills",
    label: { en: "skills --tree", pt: "habilidades --tree" },
    hint: { en: "Stack, grouped by category", pt: "Stack agrupado por categoria" },
    aliases: ["skills", "habilidades", "skills --tree", "habilidades --tree", "tree skills"],
    section: "cv-skills",
  },
  {
    id: "languages",
    label: { en: "languages", pt: "idiomas" },
    hint: { en: "Spoken languages", pt: "Idiomas falados" },
    aliases: ["languages", "idiomas", "lang", "langs"],
    section: "cv-languages",
  },
  {
    id: "education",
    label: { en: "cat education.txt", pt: "cat formacao.txt" },
    hint: { en: "Degrees and courses", pt: "Formação e cursos" },
    aliases: [
      "education",
      "formacao",
      "formação",
      "cat education.txt",
      "cat formacao.txt",
      "cat formação.txt",
    ],
    section: "cv-education",
  },
  {
    id: "help",
    label: { en: "help", pt: "ajuda" },
    hint: { en: "Show this list again", pt: "Mostrar essa lista de novo" },
    aliases: ["help", "ajuda", "?", "man", "manual"],
  },
  {
    id: "clear",
    label: { en: "clear", pt: "clear" },
    hint: { en: "Wipe the screen", pt: "Limpa a tela" },
    aliases: ["clear", "cls", "limpar"],
  },
  {
    id: "logout",
    label: { en: "logout", pt: "sair" },
    hint: { en: "Close the terminal window", pt: "Fecha a janela" },
    aliases: ["logout", "exit", "quit", "sair"],
  },
];

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Normalize free-form input the same way the alias table is stored. */
function normalize(input: string): string {
  return input.trim().replace(/\s+/g, " ").toLowerCase();
}

/** After running the command at `justRanId`, pick the row the picker should
 *  highlight by default next. Walk forward from that row looking for the
 *  first not-yet-visited entry; wrap around the end; if everything is
 *  visited just step one forward so the cursor keeps moving instead of
 *  snapping back to row zero. */
function nextHighlight(
  items: CmdMeta[],
  visited: Set<CmdId>,
  justRanId: CmdId,
): number {
  if (items.length === 0) return 0;
  const start = items.findIndex((c) => c.id === justRanId);
  if (start < 0) return 0;
  for (let i = 1; i <= items.length; i++) {
    const idx = (start + i) % items.length;
    if (!visited.has(items[idx].id)) return idx;
  }
  return (start + 1) % items.length;
}

/** Longest common prefix of a list of strings, case-insensitive. Used by Tab
 *  completion to grow the input as far as is unambiguous. */
function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return "";
  let p = strs[0].toLowerCase();
  for (let i = 1; i < strs.length; i++) {
    const s = strs[i].toLowerCase();
    while (!s.startsWith(p)) {
      p = p.slice(0, -1);
      if (!p) return "";
    }
  }
  return p;
}

/** Resolve user input into either a known top-level command or a per-job
 *  experience drill-down. Returns `null` for unknown input. */
function resolveCommand(
  input: string,
  cv: CV,
):
  | { kind: "cmd"; id: CmdId }
  | { kind: "experienceOne"; company: string }
  | null {
  const raw = normalize(input);
  if (!raw) return null;

  for (const c of COMMANDS) {
    if (c.aliases.some((a) => a.toLowerCase() === raw)) {
      return { kind: "cmd", id: c.id };
    }
  }

  // Drill into a single job. All of these resolve to the same entry:
  //   experience/<slug>           ls experience/<slug>
  //   experience <slug>           ls experience/<slug>/
  //   cat experience/<slug>.md    ls experiencia/<slug>
  const expRe =
    /^(?:(?:cat|ls)\s+)?(?:experience|experiencia|experiência)[\/\s]([a-z0-9][a-z0-9-]*)(?:\.md)?\/?$/i;
  const m = raw.match(expRe);
  if (m) {
    const wanted = m[1];
    const match = cv.experience.find((e) => slug(e.company) === wanted);
    if (match) return { kind: "experienceOne", company: match.company };
  }
  return null;
}

const SECTION_TO_CMD: Partial<Record<SectionId, CmdId>> = {
  "cv-about": "about",
  "cv-experience": "experience",
  "cv-skills": "skills",
  "cv-languages": "languages",
  "cv-education": "education",
  "cv-contact": "contact",
};

/* ─────────── Component ─────────── */

type HistoryEntry = {
  key: number;
  cmdText: string;
  output: React.ReactNode;
};

export default function Terminal({ cv, lang, onCloseWindow }: Props) {
  const [variant, setVariant] = useState<Variant>("ubuntu");
  const T = PALETTES[variant];

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [visited, setVisited] = useState<Set<CmdId>>(() => new Set());
  const [input, setInput] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(0);

  /** Items the picker shows by default (empty input). The session commands
   *  `help`, `clear`, `logout` are hidden here because they're meta —
   *  they're not part of the CV manual proper. They DO still surface once
   *  the user starts typing something that matches them. */
  const defaultPickerItems = useMemo(
    () =>
      COMMANDS.filter(
        (c) => c.id !== "help" && c.id !== "clear" && c.id !== "logout",
      ),
    [],
  );

  /** Picker rows for the current input. Empty input → curated default list.
   *  Non-empty input → full COMMANDS pool filtered by substring across the
   *  localized label, hint, and every alias, so that typing `cl` or `lo`
   *  pulls `clear` / `logout` into view as suggestions. */
  const filteredItems = useMemo(() => {
    const q = normalize(input);
    if (!q) return defaultPickerItems;
    return COMMANDS.filter((c) => {
      if (c.label[lang].toLowerCase().includes(q)) return true;
      if (c.hint[lang].toLowerCase().includes(q)) return true;
      if (c.aliases.some((a) => a.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [input, defaultPickerItems, lang]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastEntryRef = useRef<HTMLDivElement | null>(null);
  const keyCounter = useRef(0);

  /** Flat list of every string that's a valid command, including per-job
   *  drill-downs in both PT and EN spellings. Used by Tab completion. */
  const allAliases = useMemo(() => {
    const base = COMMANDS.flatMap((c) => c.aliases);
    const expCmds = cv.experience.flatMap((e) => {
      const s = slug(e.company);
      return [
        `cat experience/${s}.md`,
        `cat experiencia/${s}.md`,
        `ls experience/${s}`,
        `ls experiencia/${s}`,
        `experience/${s}`,
        `experiencia/${s}`,
      ];
    });
    // De-dup while preserving order so completion suggestions stay stable.
    return Array.from(new Set([...base, ...expCmds]));
  }, [cv]);

  const focusInput = useCallback(() => {
    // Don't yank focus from a real text selection or another input/link.
    const sel = typeof window !== "undefined" ? window.getSelection() : null;
    if (sel && sel.toString().length > 0) return;
    inputRef.current?.focus();
  }, []);

  /** Build the renderer for a given command id. Pulled out so it can be
   *  called both from `runCommand` and from `Help`'s click handlers. */
  const renderOutput = useCallback(
    (id: CmdId | { experienceOne: string }): React.ReactNode => {
      if (typeof id === "string") {
        switch (id) {
          case "help":
            return <HelpOutput lang={lang} visited={visited} onPick={(s) => runByText(s)} cv={cv} />;
          case "whoami":
            return <WhoamiOutput cv={cv} lang={lang} />;
          case "about":
            return <AboutOutput cv={cv} lang={lang} />;
          case "contact":
            return <ContactOutput cv={cv} />;
          case "experience":
            return (
              <ExperienceListOutput
                cv={cv}
                lang={lang}
                onPick={(company) => runByText(`cat experience/${slug(company)}.md`)}
              />
            );
          case "skills":
            return <SkillsOutput cv={cv} lang={lang} />;
          case "languages":
            return <LanguagesOutput cv={cv} lang={lang} />;
          case "education":
            return <EducationOutput cv={cv} lang={lang} />;
          // clear / logout don't produce visible output (handled in runCommand)
          default:
            return null;
        }
      }
      const exp = cv.experience.find((e) => e.company === id.experienceOne);
      if (!exp) return null;
      return <ExperienceOneOutput exp={exp} lang={lang} />;
    },
    // runByText is defined below; declared in closure with deps that change
    // (history, visited). Using a function ref avoids cyclic init.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cv, lang, visited, T],
  );

  const appendEntry = useCallback(
    (cmdText: string, output: React.ReactNode) => {
      setHistory((h) => [...h, { key: ++keyCounter.current, cmdText, output }]);
    },
    [],
  );

  const runByText = useCallback(
    (text: string) => {
      const echo = text;
      const resolved = resolveCommand(text, cv);
      setInput("");
      setHighlightIdx(0);

      if (!resolved) {
        appendEntry(
          echo,
          <ErrorOutput
            lang={lang}
            input={echo}
            onHelp={() => runByText(lang === "en" ? "help" : "ajuda")}
          />,
        );
        return;
      }

      if (resolved.kind === "cmd") {
        if (resolved.id === "clear") {
          setHistory([]);
          return;
        }
        if (resolved.id === "logout") {
          appendEntry(echo, null);
          // Give the line one frame to render before unmounting the theme.
          window.setTimeout(() => onCloseWindow?.(), 120);
          return;
        }
        const wasNew = !visited.has(resolved.id);
        const nextVisited = wasNew
          ? new Set(visited).add(resolved.id)
          : visited;
        if (wasNew) setVisited(nextVisited);
        setHighlightIdx(nextHighlight(defaultPickerItems, nextVisited, resolved.id));
        appendEntry(echo, renderOutput(resolved.id));
        return;
      }

      // experienceOne — drilling into a single job also "consumes" the
      // experience row in the picker so the highlight advances past it.
      const wasNewExp = !visited.has("experience");
      const nextVisitedExp = wasNewExp
        ? new Set(visited).add("experience")
        : visited;
      if (wasNewExp) setVisited(nextVisitedExp);
      setHighlightIdx(nextHighlight(defaultPickerItems, nextVisitedExp, "experience"));
      appendEntry(echo, renderOutput({ experienceOne: resolved.company }));
    },
    [appendEntry, cv, lang, onCloseWindow, renderOutput, visited, defaultPickerItems],
  );

  /* Auto-scroll: when a new command runs, land at the *command line itself*
   *  so the user reads the output from the top, like opening a man page,
   *  instead of being teleported past it to the next prompt. */
  useEffect(() => {
    if (history.length === 0) return;
    lastEntryRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [history.length]);

  /* Global Ctrl/Cmd+L wipes the screen, like a real shell. The browser would
   *  otherwise jump to the address bar; preventDefault catches it. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
      if (e.key.toLowerCase() !== "l") return;
      e.preventDefault();
      setHistory([]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Highlight is reset to 0 wherever the filtered list might shrink
  // (input.onChange and runByText), so no effect-based clamping is needed.

  /* Topbar section clicks become commands in this theme. A `sub` payload
   *  (e.g. company slug for experience) drills straight into that entry. */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CvNavigateDetail>).detail;
      if (!detail?.id) return;
      // Drill-down: `?section=experience&company=<slug>` runs the per-job
      // command directly instead of just listing experiences.
      if (detail.id === "cv-experience" && detail.sub) {
        runByText(`cat experience/${detail.sub}.md`);
        e.stopImmediatePropagation();
        return;
      }
      const cmdId = SECTION_TO_CMD[detail.id];
      if (!cmdId) return;
      const def = COMMANDS.find((c) => c.id === cmdId);
      if (!def) return;
      runByText(def.label[lang]);
      e.stopImmediatePropagation();
    };
    window.addEventListener(CV_NAVIGATE_EVENT, handler, true);
    return () => window.removeEventListener(CV_NAVIGATE_EVENT, handler, true);
  }, [lang, runByText]);

  /* Keep the input focused so the user can start typing the moment the
   *  terminal opens, fzf-style. The persistent picker below just mirrors the
   *  filtered options. */
  useEffect(() => {
    focusInput();
  }, [focusInput]);

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const picked = filteredItems[highlightIdx];
      // The highlight wins when the list has any match — that's the "pick
      // from pre-defined options" path. If the user typed something that
      // matches nothing, fall back to running the raw text so they get a
      // proper "command not found" instead of silent no-op.
      if (picked) {
        runByText(picked.label[lang]);
      } else if (input.trim()) {
        runByText(input);
      }
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const picked = filteredItems[highlightIdx];
      if (picked) {
        // Tab fills the input with the highlighted command so the user can
        // see the exact thing they're about to run, and can keep editing
        // before pressing Enter.
        setInput(picked.label[lang]);
        return;
      }
      // No match — try classic prefix completion against every alias so
      // partial typing of an experience drill-down (`cat experience/...`)
      // still completes.
      const raw = input.trim();
      if (!raw) return;
      const lower = raw.toLowerCase();
      const matches = allAliases.filter((a) =>
        a.toLowerCase().startsWith(lower),
      );
      if (matches.length === 0) return;
      if (matches.length === 1) {
        setInput(matches[0]);
        return;
      }
      const prefix = longestCommonPrefix(matches);
      if (prefix.length > lower.length) {
        setInput(matches[0].slice(0, prefix.length));
      }
      return;
    }
    if (e.key === "ArrowDown") {
      if (filteredItems.length === 0) return;
      e.preventDefault();
      setHighlightIdx((i) => (i + 1) % filteredItems.length);
      return;
    }
    if (e.key === "ArrowUp") {
      if (filteredItems.length === 0) return;
      e.preventDefault();
      setHighlightIdx(
        (i) => (i - 1 + filteredItems.length) % filteredItems.length,
      );
      return;
    }
    if (e.key === "Escape") {
      if (!input) return;
      e.preventDefault();
      setInput("");
      setHighlightIdx(0);
      return;
    }
  };

  return (
    <TermContext.Provider value={T}>
      <div
        className="theme-terminal w-full min-h-screen overflow-hidden border-y border-black/40 font-mono text-[13.5px] leading-[1.7] print:rounded-none print:border-0 print:shadow-none"
        style={{ backgroundColor: T.bg, color: T.fg }}
        onClick={focusInput}
      >
        {variant === "ubuntu" ? (
          <UbuntuHeader variant={variant} setVariant={setVariant} lang={lang} onCloseWindow={onCloseWindow} />
        ) : (
          <DebianHeader variant={variant} setVariant={setVariant} lang={lang} onCloseWindow={onCloseWindow} />
        )}

        <div className="w-full p-6 md:px-12 md:py-8" style={{ color: T.fg }}>
          {/* Welcome */}
          <p style={{ color: T.dim }}>
            {lang === "en"
              ? "Welcome to Tiago's resume terminal."
              : "Bem-vindo ao terminal do currículo do Tiago."}
          </p>
          <p style={{ color: T.dim }}>
            {lang === "en"
              ? "Pick a command from the list, type one, or click it."
              : "Escolha um comando da lista, digite um, ou clique."}
          </p>
          <Spacer />

          {/* History */}
          {history.map((h, i) => (
            <div
              key={h.key}
              ref={i === history.length - 1 ? lastEntryRef : undefined}
              className="scroll-mt-24"
            >
              <Cmd cmd={h.cmdText} />
              {h.output ? <Out>{h.output}</Out> : null}
              <Spacer />
            </div>
          ))}

          {/* Active prompt — always typeable, like a regular shell. */}
          <div className="flex flex-wrap items-baseline gap-1">
            <Prompt />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setHighlightIdx(0);
              }}
              onKeyDown={onInputKey}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-label={lang === "en" ? "Terminal input" : "Entrada do terminal"}
              className="flex-1 bg-transparent font-mono outline-none"
              style={{ color: T.bold, caretColor: T.fg }}
            />
          </div>

          {/* Persistent Inquirer-style picker. Typing filters the list and
              ↑/↓ moves the chevron; Enter runs whichever row is highlighted,
              or the raw text if nothing matches. */}
          <CommandPalette
            lang={lang}
            items={filteredItems}
            highlightIdx={highlightIdx}
            visited={visited}
            inputIsEmpty={!input}
            onPick={(i) => {
              const c = filteredItems[i];
              if (!c) return;
              runByText(c.label[lang]);
            }}
          />
        </div>
      </div>
    </TermContext.Provider>
  );
}

/* ─────────── Output components (each command's render) ─────────── */

function WhoamiOutput({ cv, lang }: { cv: CV; lang: Lang }) {
  const T = useContext(TermContext);
  return (
    <>
      <div>
        <span style={{ color: T.bold }} className="font-bold">
          {cv.name}
        </span>
      </div>
      <div>
        {cv.headline[lang]} · <i>{cv.tagline[lang]}</i>
      </div>
      <div>
        <span style={{ color: T.dim }}>disciplines: </span>
        {cv.disciplines.join(" · ")}
      </div>
    </>
  );
}

function AboutOutput({ cv, lang }: { cv: CV; lang: Lang }) {
  const T = useContext(TermContext);
  return (
    <div className="space-y-3">
      {cv.summary[lang].split("\n\n").map((p, i) => (
        <p key={i}>{linkifyBlog(p, T.link)}</p>
      ))}
    </div>
  );
}

function ContactOutput({ cv }: { cv: CV }) {
  const T = useContext(TermContext);
  return (
    <div className="grid gap-y-0.5 sm:grid-cols-2">
      {cv.contacts.map((c) => (
        <div key={c.kind} className="flex items-baseline gap-2">
          <span className="w-20 shrink-0">{c.label}:</span>
          <a
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noreferrer" : undefined}
            className="hover:underline"
            style={{ color: T.link }}
            onClick={(e) => e.stopPropagation()}
          >
            {c.display}
          </a>
        </div>
      ))}
    </div>
  );
}

function ExperienceListOutput({
  cv,
  lang,
  onPick,
}: {
  cv: CV;
  lang: Lang;
  onPick: (company: string) => void;
}) {
  const T = useContext(TermContext);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {cv.experience.map((e) => (
          <button
            key={e.company}
            type="button"
            onClick={(ev) => {
              ev.stopPropagation();
              onPick(e.company);
            }}
            className="hover:underline"
            style={{ color: T.link }}
            title={
              lang === "en"
                ? `Run: cat experience/${slug(e.company)}.md`
                : `Rodar: cat experience/${slug(e.company)}.md`
            }
          >
            {slug(e.company)}/
          </button>
        ))}
      </div>
      <div style={{ color: T.dim }} className="text-[12.5px]">
        {lang === "en"
          ? `Click a folder, or type: cat experience/<name>.md`
          : `Clica numa pasta, ou digita: cat experience/<nome>.md`}
      </div>
      <div className="space-y-4">
        {cv.experience.map((exp) => (
          <ExperienceOneOutput key={exp.company} exp={exp} lang={lang} />
        ))}
      </div>
    </div>
  );
}

function ExperienceOneOutput({
  exp,
  lang,
}: {
  exp: CV["experience"][number];
  lang: Lang;
}) {
  const T = useContext(TermContext);
  const duration = experienceDuration(exp.period);
  return (
    <div>
      <Rule />
      <div>
        <span className="font-bold" style={{ color: T.bold }}>
          {exp.role[lang]}
        </span>
        <span style={{ color: T.dim }}> @ </span>
        <span>
          {exp.url ? (
            <a
              href={exp.url}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
              style={{ color: T.link }}
              onClick={(e) => e.stopPropagation()}
            >
              {exp.company}
            </a>
          ) : (
            exp.company
          )}
        </span>
      </div>
      <div style={{ color: T.dim }}>
        {exp.period[lang]}
        {duration ? ` · ${duration[lang]}` : ""}
        {exp.location ? ` · ${exp.location[lang]}` : ""}
      </div>
      <div className="mt-2 space-y-2">
        {parseExperienceSummary(exp.summary[lang]).map((block, i) => {
          if (block.kind === "separator") {
            return (
              <div
                key={i}
                className="my-1 flex items-center gap-3 select-none"
              >
                <span className="h-px flex-1" style={{ background: T.rule }} />
                <span
                  className="text-[10.5px] uppercase tracking-[0.18em]"
                  style={{ color: T.dim }}
                >
                  {block.text}
                </span>
                <span className="h-px flex-1" style={{ background: T.rule }} />
              </div>
            );
          }
          if (block.kind === "citation") {
            const quoted = block.paragraphs.join(" ");
            return (
              <figure key={i} className="my-2">
                <blockquote style={{ color: T.fg }}>
                  <span
                    aria-hidden
                    className="font-serif"
                    style={{
                      fontSize: "36px",
                      lineHeight: 0,
                      verticalAlign: "-0.35em",
                      marginRight: "0.1em",
                      color: T.dim,
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
                      color: T.dim,
                    }}
                  >
                    {"”"}
                  </span>
                </blockquote>
                <figcaption className="mt-1 text-[11px]" style={{ color: T.dim }}>
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
      <div className="mt-2 space-y-1.5">
        {groupBullets(exp.bullets[lang]).map((g, gi) => (
          <div key={gi} className="space-y-0.5">
            {g.intro ? <p style={{ color: T.dim }}>{g.intro}</p> : null}
            {g.items.length > 0 ? (
              <ul className="space-y-0.5">
                {g.items.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span style={{ color: T.dim }}>·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
      {exp.stack.length > 0 ? (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span style={{ color: T.dim }}>tags:</span>
          {exp.stack.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 border px-1.5 py-0.5 text-[11px]"
              style={{ borderColor: T.rule }}
            >
              <TechIcon name={s} size={11} />
              {getTechLabel(s)}
            </span>
          ))}
        </div>
      ) : null}
      <Rule />
    </div>
  );
}

function SkillsOutput({ cv, lang }: { cv: CV; lang: Lang }) {
  const T = useContext(TermContext);
  return (
    <>
      <pre className="whitespace-pre-wrap" style={{ color: T.fg, fontFamily: "inherit" }}>
        <span style={{ color: T.dim }}>tiago@cv</span>
      </pre>
      {cv.skills.map((g, gi) => (
        <div key={g.label.en}>
          <pre className="whitespace-pre-wrap" style={{ fontFamily: "inherit" }}>
            <span style={{ color: T.dim }}>
              {gi === cv.skills.length - 1 ? "└── " : "├── "}
            </span>
            <span className="font-bold" style={{ color: T.bold }}>
              {g.label[lang]}
            </span>
            <span style={{ color: T.dim }}> ({g.items.length})</span>
          </pre>
          {g.items.map((s, si) => (
            <pre
              key={s}
              className="flex flex-wrap items-center whitespace-pre-wrap"
              style={{ fontFamily: "inherit" }}
            >
              <span style={{ color: T.dim }}>
                {gi === cv.skills.length - 1 ? "    " : "│   "}
                {si === g.items.length - 1 ? "└── " : "├── "}
              </span>
              <TechIcon name={s} size={12} />
              <span className="ml-1">{getTechLabel(s)}</span>
            </pre>
          ))}
        </div>
      ))}
    </>
  );
}

function LanguagesOutput({ cv, lang }: { cv: CV; lang: Lang }) {
  const T = useContext(TermContext);
  return (
    <div className="mt-1 grid gap-3 md:grid-cols-3">
      {cv.languages.map((l) => (
        <div
          key={l.name.en}
          className="border p-3"
          style={{ borderColor: T.rule, backgroundColor: T.surface }}
        >
          <div className="flex items-center gap-2">
            <Flag code={l.flag} size={20} />
            <span className="font-bold" style={{ color: T.bold }}>
              {l.name[lang]}
            </span>
          </div>
          <div style={{ color: T.dim }} className="text-[12px]">
            {l.level[lang]}
          </div>
          <p className="mt-1 text-[12.5px]">{l.details[lang]}</p>
        </div>
      ))}
    </div>
  );
}

function EducationOutput({ cv, lang }: { cv: CV; lang: Lang }) {
  const T = useContext(TermContext);
  return (
    <>
      {cv.education.map((e) => (
        <div key={e.institution}>
          <span className="font-bold" style={{ color: T.bold }}>
            {e.degree[lang]}
          </span>
          <span style={{ color: T.dim }}> · {e.institution}</span>
        </div>
      ))}
    </>
  );
}

function ErrorOutput({
  lang,
  input,
  onHelp,
}: {
  lang: Lang;
  input: string;
  onHelp: () => void;
}) {
  const T = useContext(TermContext);
  return (
    <div>
      <span>
        {lang === "en"
          ? `bash: ${input}: command not found.`
          : `bash: ${input}: comando não encontrado.`}
      </span>{" "}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onHelp();
        }}
        className="hover:underline"
        style={{ color: T.link }}
      >
        {lang === "en" ? "Try `help`." : "Tenta `ajuda`."}
      </button>
    </div>
  );
}

/* ─────────── Persistent picker (Inquirer-style) ─────────── */

/** Always-visible command picker shown below the prompt. The input owns
 *  typing; this surface mirrors the filtered options, marks the row that
 *  `Enter` will run, and accepts a click as a fallback for touch users.
 *  Mouse hover deliberately does NOT move the highlight — that's a real
 *  terminal-selector trait (Inquirer / fzf / gum) and keeps the keyboard
 *  feeling like the primary surface. Visual: `❯` on the active row, no
 *  block highlight. */
function CommandPalette({
  lang,
  items,
  highlightIdx,
  visited,
  inputIsEmpty,
  onPick,
}: {
  lang: Lang;
  items: CmdMeta[];
  highlightIdx: number;
  visited: Set<CmdId>;
  inputIsEmpty: boolean;
  onPick: (idx: number) => void;
}) {
  const T = useContext(TermContext);
  const selectedRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" });
  }, [highlightIdx]);

  if (items.length === 0) {
    return (
      <div className="mt-2 text-[12px]" style={{ color: T.dim }}>
        {lang === "en"
          ? "(no match · Enter runs as-is, Esc clears)"
          : "(sem match · Enter roda do jeito que tá, Esc limpa)"}
      </div>
    );
  }

  // ch-based min-width keeps labels aligned in a column without padding HTML
  // with non-breaking spaces. Safe because we render in monospace.
  const labelWidthCh =
    Math.max(...items.map((c) => c.label[lang].length)) + 2;

  return (
    <div className="mt-2">
      <ul role="listbox" aria-label={lang === "en" ? "Commands" : "Comandos"}>
        {items.map((c, i) => {
          const sel = i === highlightIdx;
          const wasRun = visited.has(c.id);
          return (
            <li
              key={c.id}
              ref={sel ? selectedRef : undefined}
              role="option"
              aria-selected={sel}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPick(i);
                }}
                className="flex w-full items-baseline gap-2 py-0 text-left text-[13px]"
              >
                <span
                  aria-hidden
                  className="shrink-0 select-none font-mono"
                  style={{
                    color: sel ? T.user : "transparent",
                    width: "1.25em",
                  }}
                >
                  ❯
                </span>
                <span
                  className="shrink-0 font-mono"
                  style={{
                    color: sel ? T.user : wasRun ? T.dim : T.fg,
                    fontWeight: sel ? 600 : 400,
                    minWidth: `${labelWidthCh}ch`,
                  }}
                >
                  {c.label[lang]}
                </span>
                <span
                  className="hidden sm:inline"
                  style={{ color: sel ? T.fg : T.dim }}
                >
                  {c.hint[lang]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 text-[11.5px]" style={{ color: T.dim }}>
        {inputIsEmpty
          ? lang === "en"
            ? "↑/↓ to pick · Enter to run · or just start typing · Tab fills the prompt · Ctrl+L clears"
            : "↑/↓ pra escolher · Enter pra rodar · ou começa a digitar · Tab preenche o prompt · Ctrl+L limpa"
          : lang === "en"
            ? "Enter runs the highlighted match · Tab fills it into the prompt · Esc clears"
            : "Enter roda o destacado · Tab preenche no prompt · Esc limpa"}
      </div>
    </div>
  );
}

/* ─────────── Help / to-do menu ─────────── */

function HelpOutput({
  lang,
  visited,
  onPick,
  cv,
}: {
  lang: Lang;
  visited: Set<CmdId>;
  onPick: (cmdText: string) => void;
  /** When provided, render an expandable sub-list of per-company drill-downs
   *  beneath the main list. Omitted for the in-history `help` echo, which
   *  already shows the `experience` row, to keep that echo tight. */
  cv?: CV;
}) {
  const T = useContext(TermContext);
  // Help/clear/logout sit at the very end as session commands.
  const sessionIds = new Set<CmdId>(["help", "clear", "logout"]);
  const core = COMMANDS.filter((c) => !sessionIds.has(c.id));
  const session = COMMANDS.filter((c) => sessionIds.has(c.id));

  const title = lang === "en" ? "available commands" : "comandos disponíveis";
  const hint =
    lang === "en"
      ? "click an item, or type the command and press Enter."
      : "clica num item, ou digita o comando e aperta Enter.";

  return (
    <div>
      <div style={{ color: T.dim }} className="text-[12px] uppercase tracking-wider">
        # {title}
      </div>
      <ul className="mt-1.5 space-y-0.5">
        {core.map((c) => (
          <HelpRow
            key={c.id}
            checked={visited.has(c.id)}
            label={c.label[lang]}
            hint={c.hint[lang]}
            onClick={() => onPick(c.label[lang])}
          />
        ))}
      </ul>
      {cv && cv.experience.length > 0 ? (
        <details className="mt-1.5 group">
          <summary
            className="cursor-pointer text-[12.5px] outline-none"
            style={{ color: T.dim }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="select-none">
              {lang === "en" ? "› cat experience/<company>.md" : "› cat experiencia/<empresa>.md"}
            </span>
          </summary>
          <ul className="mt-1 ml-4 space-y-0.5">
            {cv.experience.map((e) => {
              const cmd = `cat experience/${slug(e.company)}.md`;
              return (
                <li key={e.company}>
                  <button
                    type="button"
                    className="text-left hover:underline"
                    style={{ color: T.link }}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onPick(cmd);
                    }}
                  >
                    {cmd}
                  </button>
                  <span style={{ color: T.dim }}> · {e.role[lang]}</span>
                </li>
              );
            })}
          </ul>
        </details>
      ) : null}
      <ul className="mt-2 space-y-0.5">
        {session.map((c) => (
          <HelpRow
            key={c.id}
            checked={false}
            session
            label={c.label[lang]}
            hint={c.hint[lang]}
            onClick={() => onPick(c.label[lang])}
          />
        ))}
      </ul>
      <div className="mt-2 text-[12px]" style={{ color: T.dim }}>
        {hint}
      </div>
    </div>
  );
}

function HelpRow({
  checked,
  session,
  label,
  hint,
  onClick,
}: {
  checked: boolean;
  session?: boolean;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  const T = useContext(TermContext);
  const box = session ? "[·]" : checked ? "[✓]" : "[ ]";
  return (
    <li>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="group flex w-full items-baseline gap-2 text-left hover:underline"
        style={{ color: checked ? T.dim : T.fg }}
      >
        <span
          className="shrink-0 select-none"
          style={{ color: checked ? T.user : T.dim }}
        >
          {box}
        </span>
        <span
          className="shrink-0 font-mono"
          style={{ color: checked ? T.dim : T.bold }}
        >
          {label}
        </span>
        <span className="hidden sm:inline" style={{ color: T.dim }}>
          {hint}
        </span>
      </button>
    </li>
  );
}

/* ─────────── Module-level helpers (use Terminal palette via context) ─────────── */

function Prompt() {
  const T = useContext(TermContext);
  return (
    <span className="select-none">
      <span style={{ color: T.user }}>tiago</span>
      <span style={{ color: T.fg }}>@</span>
      <span style={{ color: T.host }}>cv</span>
      <span style={{ color: T.fg }}>:</span>
      <span style={{ color: T.cwd }}>~</span>
      <span style={{ color: T.fg }}>$ </span>
    </span>
  );
}

function Cmd({ cmd }: { cmd: string }) {
  const T = useContext(TermContext);
  return (
    <div className="flex flex-wrap items-baseline gap-1">
      <Prompt />
      <span style={{ color: T.bold }}>{cmd}</span>
    </div>
  );
}

function Out({ children }: { children: React.ReactNode }) {
  return <div className="mt-1">{children}</div>;
}

function Rule() {
  const T = useContext(TermContext);
  return <div className="my-1 h-px" style={{ background: T.rule }} />;
}

function Spacer() {
  return <div className="h-4" />;
}

/* ─────────── Variant pickers (rendered inside the title bar) ─────────── */

function VariantPicker({
  variant,
  setVariant,
  light,
}: {
  variant: Variant;
  setVariant: (v: Variant) => void;
  light?: boolean;
}) {
  const fg = light ? "text-white/80" : "text-white/70";
  const bg = light ? "bg-white/15" : "bg-white/10";
  const active = light ? "bg-white text-black" : "bg-white/90 text-black";
  return (
    <div className={`flex items-center rounded-md p-0.5 ${bg}`}>
      {(["ubuntu", "debian"] as Variant[]).map((v) => (
        <button
          key={v}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setVariant(v);
          }}
          className={`rounded px-2 py-0.5 font-sans text-[10.5px] font-semibold uppercase tracking-wider transition ${
            variant === v ? active : `${fg} hover:bg-white/10`
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

/* ─────────── Ubuntu title bar ─────────── */
function UbuntuHeader({
  variant,
  setVariant,
  lang,
  onCloseWindow,
}: {
  variant: Variant;
  setVariant: (v: Variant) => void;
  lang: Lang;
  onCloseWindow?: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between border-b px-3 py-2"
      style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "#2c2c2c", color: "#d3d7cf" }}
    >
      <span className="font-sans text-[12px] text-white/70">tiago@cv: ~</span>
      <div className="flex items-center gap-3">
        <VariantPicker variant={variant} setVariant={setVariant} />
        <div className="flex items-center gap-2" aria-label={lang === "en" ? "Window controls" : "Controles da janela"}>
          <button type="button" onClick={(e) => e.stopPropagation()} className="grid h-5 w-5 place-items-center rounded-full bg-white/10 text-[11px] text-white/70 hover:bg-white/20">−</button>
          <button type="button" onClick={(e) => e.stopPropagation()} className="grid h-5 w-5 place-items-center rounded-full bg-white/10 text-[11px] text-white/70 hover:bg-white/20">▢</button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCloseWindow?.();
            }}
            title={lang === "en" ? "Close · back to VS Code" : "Fechar · volta pro VS Code"}
            className="grid h-5 w-5 place-items-center rounded-full bg-[#cc0000] text-[11px] text-white transition hover:bg-[#ff3a3a]"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Debian / GNOME GTK4 header bar ─────────── */
function DebianHeader({
  variant,
  setVariant,
  lang,
  onCloseWindow,
}: {
  variant: Variant;
  setVariant: (v: Variant) => void;
  lang: Lang;
  onCloseWindow?: () => void;
}) {
  return (
    <div
      className="relative flex h-10 items-center border-b px-2"
      style={{
        borderColor: "rgba(0,0,0,0.5)",
        background: "linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)",
        color: "#e6e6e6",
      }}
    >
      <button
        type="button"
        aria-label="Menu"
        onClick={(e) => e.stopPropagation()}
        className="grid h-7 w-7 place-items-center rounded text-white/80 hover:bg-white/10"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <rect x="2" y="3.5" width="12" height="1.6" rx="0.5" fill="currentColor" />
          <rect x="2" y="7.2" width="12" height="1.6" rx="0.5" fill="currentColor" />
          <rect x="2" y="10.9" width="12" height="1.6" rx="0.5" fill="currentColor" />
        </svg>
      </button>

      <div className="ml-2 flex items-end gap-1 self-end">
        <div
          className="flex h-7 items-center gap-2 rounded-t-md border border-b-0 px-3 text-[12px]"
          style={{
            backgroundColor: PALETTES.debian.bg,
            borderColor: "rgba(0,0,0,0.5)",
            color: "#e6e6e6",
          }}
        >
          <span>tiago@cv: ~</span>
          <span className="text-white/40 hover:text-white/80">✕</span>
        </div>
        <button
          type="button"
          aria-label={lang === "en" ? "New tab" : "Nova aba"}
          onClick={(e) => e.stopPropagation()}
          className="grid h-6 w-6 place-items-center self-center rounded text-white/65 hover:bg-white/10 hover:text-white"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <path d="M6 1 V11 M1 6 H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 font-sans text-[12.5px] text-white/85 md:block">
        Terminal
      </div>

      <div className="ml-auto flex items-center gap-2">
        <VariantPicker variant={variant} setVariant={setVariant} light />
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Minimize"
            onClick={(e) => e.stopPropagation()}
            className="grid h-6 w-6 place-items-center rounded-full bg-[#454545] text-white/75 hover:bg-[#555]"
          >
            <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden>
              <rect x="1" y="4" width="7" height="1" fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Maximize"
            onClick={(e) => e.stopPropagation()}
            className="grid h-6 w-6 place-items-center rounded-full bg-[#454545] text-white/75 hover:bg-[#555]"
          >
            <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden>
              <rect x="1.5" y="1.5" width="6" height="6" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onCloseWindow?.();
            }}
            title={lang === "en" ? "Close · back to VS Code" : "Fechar · volta pro VS Code"}
            className="grid h-6 w-6 place-items-center rounded-full bg-[#454545] text-white/85 hover:bg-[#cc0000] hover:text-white"
          >
            <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden>
              <path d="M1.5 1.5 L7.5 7.5 M7.5 1.5 L1.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
