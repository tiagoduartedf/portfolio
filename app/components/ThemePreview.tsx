/**
 * Faithful mini-mockups of each theme, used in the picker cards.
 * Every preview is a self-contained block sized to fill its parent.
 *
 * Layout is flex-based (not absolute pixel positions) so content fills the
 * full preview area regardless of card aspect ratio. Keep these in sync with
 * the actual theme components, when you change a theme's silhouette
 * (chrome, sidebar layout, defining motifs), update its preview here.
 */

import type { ThemeKey } from "../data/navigation";

type Props = { theme: ThemeKey };

export default function ThemePreview({ theme }: Props) {
  switch (theme) {
    case "notion":
      return <NotionPreview />;
    case "dark":
      return <VSCodePreview />;
    case "terminal":
      return <TerminalPreview />;
    case "starwars":
      return <StarWarsPreview />;
  }
}

function Frame({
  bg,
  children,
}: {
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: bg, containerType: "inline-size" }}
    >
      {children}
    </div>
  );
}

/* ─────────── Notion ─────────── */
/* Featured preview for the recommended theme. Typography and gaps are sized
 * in `cqi` units (1% of the container's inline-size) so the layout scales
 * cleanly between the small theme-picker tile and the hero card on the
 * landing page. Content mirrors the actual theme: masthead with extrabold
 * sans name and mono date, properties strip, an About skeleton, the
 * signature database-style Skills table, and the serif cream Languages
 * cards that replaced the green callouts. */
function NotionPreview() {
  return (
    <Frame bg="#fff">
      {/* Browser-style chrome so a white-on-white preview reads as a
       * "window/page" instead of blending into the picker card. Mirrors the
       * macOS dots used by VSCodePreview, with a notion.so URL bar that
       * signals what app the theme imitates. */}
      <div className="absolute inset-x-0 top-0 z-10 flex h-3 items-center gap-1 border-b border-zinc-200 bg-[#f7f7f5] px-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f56]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#27c93f]" />
        <span className="ml-2 truncate text-[5px] text-zinc-500">
          notion.so/tiago-duarte
        </span>
      </div>
      {/* Notion-style sidebar, the most recognizable element of the actual app.
       * Populated with utility shortcuts, a section label, and the full page
       * tree so the preview reads as a real Notion workspace at a glance. */}
      <div className="absolute bottom-0 left-0 top-3 z-10 flex w-[12cqi] flex-col overflow-hidden border-r border-zinc-200 bg-[#f7f7f5] px-[1.1cqi] py-[1.2cqi]">
        {/* Workspace header */}
        <div className="flex items-center gap-[0.5cqi]">
          <span
            className="grid h-[1.8cqi] w-[1.8cqi] place-items-center rounded-[0.25cqi] text-[1.2cqi] font-bold text-white"
            style={{ backgroundColor: "#2f3437" }}
          >
            T
          </span>
          <span className="truncate text-[1.15cqi] font-semibold text-[#37352f]">
            tiago-duarte
          </span>
          <span className="ml-auto text-[1cqi] text-[#787774]">⌄</span>
        </div>

        {/* Utility shortcuts (search / updates / settings) */}
        <div className="mt-[1.1cqi] flex flex-col gap-[0.3cqi] text-[1.1cqi] leading-tight text-[#787774]">
          <span className="flex items-center gap-[0.4cqi] truncate">
            <span>🔍</span>
            <span className="truncate">Search</span>
          </span>
          <span className="flex items-center gap-[0.4cqi] truncate">
            <span>🕐</span>
            <span className="truncate">Updates</span>
          </span>
          <span className="flex items-center gap-[0.4cqi] truncate">
            <span>⚙</span>
            <span className="truncate">Settings</span>
          </span>
        </div>

        {/* Section label */}
        <div className="mt-[1.1cqi] flex items-center justify-between text-[0.9cqi] font-semibold uppercase tracking-[0.08em] text-[#787774]">
          <span>Private</span>
          <span className="text-[#9b9a97]">+</span>
        </div>

        {/* Page tree */}
        <div className="mt-[0.4cqi] flex flex-col gap-[0.4cqi] text-[1.15cqi] leading-tight text-[#37352f]/85">
          <span
            className="flex items-center gap-[0.4cqi] truncate rounded-[0.25cqi] px-[0.4cqi]"
            style={{ backgroundColor: "rgba(55,53,47,0.1)" }}
          >
            <span className="text-[#787774]">▾</span>
            <span>📄</span>
            <span className="truncate font-semibold">README</span>
          </span>
          <span className="flex items-center gap-[0.4cqi] truncate pl-[1cqi]">
            <span className="text-[#787774]">▸</span>
            <span>📝</span>
            <span className="truncate">About</span>
          </span>
          <span className="flex items-center gap-[0.4cqi] truncate pl-[1cqi]">
            <span className="text-[#787774]">▸</span>
            <span>💼</span>
            <span className="truncate">Experience</span>
          </span>
          <span className="flex items-center gap-[0.4cqi] truncate pl-[1cqi]">
            <span className="text-[#787774]">▸</span>
            <span>🔧</span>
            <span className="truncate">Stack</span>
          </span>
          <span className="flex items-center gap-[0.4cqi] truncate pl-[1cqi]">
            <span className="text-[#787774]">▸</span>
            <span>🚀</span>
            <span className="truncate">Projects</span>
          </span>
          <span className="flex items-center gap-[0.4cqi] truncate pl-[1cqi]">
            <span className="text-[#787774]">▸</span>
            <span>🎓</span>
            <span className="truncate">Education</span>
          </span>
          <span className="flex items-center gap-[0.4cqi] truncate pl-[1cqi]">
            <span className="text-[#787774]">▸</span>
            <span>🌍</span>
            <span className="truncate">Languages</span>
          </span>
          <span className="flex items-center gap-[0.4cqi] truncate pl-[1cqi]">
            <span className="text-[#787774]">▸</span>
            <span>✉</span>
            <span className="truncate">Contact</span>
          </span>
        </div>
      </div>
      <div className="absolute bottom-[4cqi] left-[14cqi] right-[4cqi] top-[15px] flex flex-col gap-[1.8cqi]">
        {/* Name + mono meta */}
        <div className="flex items-baseline justify-between gap-[2cqi]">
          <div className="font-sans text-[6cqi] font-extrabold leading-[1] tracking-tight text-[#37352f]">
            Tiago Duarte
          </div>
          <div className="flex items-baseline gap-[1cqi] text-[#787774]">
            <span className="font-mono text-[1.4cqi] uppercase tracking-[0.3em]">
              Curriculum Vitae
            </span>
            <span className="h-[2.2cqi] w-[0.18cqi] bg-[#37352f]/25" />
            <span className="font-mono text-[1.5cqi]">09/05/26</span>
          </div>
        </div>

        {/* Headline + italic tagline */}
        <div>
          <div className="font-sans text-[2.4cqi] font-semibold leading-[1.15] text-[#37352f]">
            Fullstack Software Engineer & Design Engineer
          </div>
          <div className="mt-[0.4cqi] font-sans text-[1.7cqi] italic leading-[1.2] text-[#787774]">
            Designs UIs, ships APIs, deploys at scale.
          </div>
        </div>

        {/* Properties bar with contact icons */}
        <div
          className="flex items-center gap-[1.4cqi] rounded-[0.5cqi] border px-[1.4cqi] py-[0.9cqi] text-[1.55cqi] text-[#37352f]"
          style={{
            borderColor: "rgba(55,53,47,0.09)",
            backgroundColor: "#fafaf8",
          }}
        >
          <span style={{ color: "#787774" }}>✉</span>
          <span>email</span>
          <span style={{ color: "#787774" }}>in</span>
          <span>linkedin</span>
          <span style={{ color: "#787774" }}>◎</span>
          <span>github</span>
          <span className="ml-auto" style={{ color: "#787774" }}>
            🎓
          </span>
          <span className="font-semibold">B.Sc. CS · UFF</span>
        </div>

        {/* About H2 + prose skeleton */}
        <div className="mt-[0.6cqi] flex items-center gap-[1cqi]">
          <span className="text-[2.4cqi]" style={{ color: "#787774" }}>
            📝
          </span>
          <span className="text-[2.5cqi] font-extrabold tracking-tight text-[#37352f]">
            About
          </span>
        </div>
        <div className="space-y-[0.7cqi]">
          <div className="h-[0.5cqi] w-[97%] rounded-sm bg-[#37352f]/35" />
          <div className="h-[0.5cqi] w-[93%] rounded-sm bg-[#37352f]/30" />
          <div className="h-[0.5cqi] w-[80%] rounded-sm bg-[#37352f]/30" />
          <div className="h-[0.5cqi] w-[64%] rounded-sm bg-[#37352f]/25" />
        </div>

        {/* Skills H2 + database table, the signature Notion element */}
        <div className="mt-[0.6cqi] flex items-center gap-[1cqi]">
          <span className="text-[2.6cqi]" style={{ color: "#787774" }}>
            🔧
          </span>
          <span className="text-[2.7cqi] font-extrabold tracking-tight text-[#37352f]">
            Skills
          </span>
        </div>
        <div
          className="overflow-hidden rounded-[0.5cqi] border"
          style={{ borderColor: "rgba(55,53,47,0.09)" }}
        >
          <div
            className="grid grid-cols-[34%_54%_12%] text-[1.4cqi] font-medium"
            style={{
              backgroundColor: "#fafaf9",
              color: "#787774",
              borderBottom: "1px solid rgba(55,53,47,0.09)",
            }}
          >
            <div className="px-[1cqi] py-[0.55cqi] uppercase tracking-wider">
              Category
            </div>
            <div
              className="border-l px-[1cqi] py-[0.55cqi] uppercase tracking-wider"
              style={{ borderColor: "rgba(55,53,47,0.09)" }}
            >
              Items
            </div>
            <div
              className="border-l px-[1cqi] py-[0.55cqi] text-right"
              style={{ borderColor: "rgba(55,53,47,0.09)" }}
            >
              ∑
            </div>
          </div>
          {[
            ["Frontend", ["React", "TS", "Next"], 5],
            ["Backend", ["Node", "Mongo"], 4],
            ["DevOps", ["AWS", "Docker"], 3],
          ].map(([cat, items, count], i) => (
            <div
              key={String(cat)}
              className="grid grid-cols-[34%_54%_12%] text-[1.6cqi]"
              style={{
                borderBottom:
                  i < 2 ? "1px solid rgba(55,53,47,0.09)" : undefined,
              }}
            >
              <div className="px-[1cqi] py-[0.6cqi] font-semibold text-[#37352f]">
                {cat}
              </div>
              <div
                className="flex items-center gap-[0.4cqi] border-l px-[1cqi] py-[0.6cqi]"
                style={{ borderColor: "rgba(55,53,47,0.09)" }}
              >
                {(items as string[]).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[0.4cqi] px-[0.8cqi] py-[0.15cqi] text-[1.45cqi] text-[#37352f]"
                    style={{ backgroundColor: "rgba(55,53,47,0.06)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div
                className="border-l px-[1cqi] py-[0.6cqi] text-right font-mono text-[1.4cqi]"
                style={{
                  borderColor: "rgba(55,53,47,0.09)",
                  color: "#787774",
                }}
              >
                {count}
              </div>
            </div>
          ))}
        </div>

        {/* Languages H2 + serif cream cards, fills the bottom */}
        <div className="mt-auto">
          <div className="mb-[0.8cqi] flex items-center gap-[1cqi]">
            <span className="text-[2.4cqi]" style={{ color: "#787774" }}>
              🌍
            </span>
            <span className="text-[2.5cqi] font-extrabold tracking-tight text-[#37352f]">
              Languages
            </span>
          </div>
          <div className="grid grid-cols-3 gap-[1cqi]">
            {[
              ["🇧🇷", "Portuguese", "Native", "Born here, fluent across formal and casual registers."],
              ["🇺🇸", "English", "Fluent", "Daily working language, written and spoken at C1."],
              ["🇪🇸", "Spanish", "B1", "Reads and writes comfortably; conversational at intermediate level."],
            ].map(([flag, name, level, blurb]) => (
              <div
                key={name}
                className="rounded-[0.8cqi] border px-[1.2cqi] py-[0.9cqi]"
                style={{
                  borderColor: "rgba(55,53,47,0.09)",
                  backgroundColor: "#fbfaf6",
                  color: "#1a1a1a",
                }}
              >
                <div
                  className="flex items-center gap-[0.8cqi] border-b pb-[0.6cqi]"
                  style={{ borderColor: "rgba(55,53,47,0.09)" }}
                >
                  <span className="text-[2.6cqi] leading-none">{flag}</span>
                  <div className="flex flex-1 items-baseline justify-between">
                    <span
                      className="text-[2cqi] font-bold leading-none"
                      style={{
                        fontFamily:
                          "var(--font-serif), Georgia, 'Times New Roman', serif",
                      }}
                    >
                      {name}
                    </span>
                    <span
                      className="font-mono text-[1.2cqi] uppercase tracking-[0.18em]"
                      style={{ color: "#1d3557" }}
                    >
                      {level}
                    </span>
                  </div>
                </div>
                <div
                  className="mt-[0.6cqi] text-[1.35cqi] leading-[1.3]"
                  style={{
                    fontFamily:
                      "var(--font-serif-text), Georgia, 'Times New Roman', serif",
                    color: "rgba(26,26,26,0.78)",
                  }}
                >
                  {blurb}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ─────────── VS Code ─────────── */
function VSCodePreview() {
  return (
    <Frame bg="#1e1e1e">
      {/* title bar with macOS dots */}
      <div className="absolute inset-x-0 top-0 flex h-3 items-center gap-1 bg-[#3c3c3c] px-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f56]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#27c93f]" />
        <span className="ml-2 text-[5px] text-white/60">
          README.md · tiago-duarte-cv
        </span>
      </div>
      {/* activity bar (vertical icons) */}
      <div className="absolute bottom-3 left-0 top-3 flex w-3 flex-col items-center gap-1 bg-[#333] py-1 text-[5.5px] text-white/55">
        <span>📁</span>
        <span>🔍</span>
        <span>⌨</span>
      </div>
      {/* sidebar, file tree */}
      <div className="absolute bottom-3 left-3 top-3 w-[44px] bg-[#252526] px-1 py-1 text-[4.5px] text-white/85">
        <div className="text-[3.8px] uppercase tracking-wider text-white/45">
          Explorer
        </div>
        <div className="mt-1">▾ tiago-cv</div>
        <div className="ml-1 text-white/65">▾ sections</div>
        <div className="ml-2 text-white">readme.md</div>
        <div className="ml-2 text-white/55">about.md</div>
        <div className="ml-2 text-white/55">work.md</div>
        <div className="ml-2 text-white/55">skills.md</div>
      </div>
      {/* tab bar */}
      <div
        className="absolute right-0 top-3 flex items-center gap-1 bg-[#252526] px-1 py-[2px]"
        style={{ left: "59px" }}
      >
        <span className="border-t border-[#007acc] bg-[#1e1e1e] px-1 text-[4.5px] text-white">
          README.md
        </span>
      </div>
      {/* breadcrumb */}
      <div
        className="absolute right-1 top-[26px] flex items-center gap-1 text-[4px] text-white/45"
        style={{ left: "59px" }}
      >
        <span>tiago-cv</span>
        <span>›</span>
        <span>sections</span>
        <span>›</span>
        <span>readme.md</span>
      </div>
      {/* editor */}
      <div
        className="absolute right-1 bottom-3 top-[34px] px-1 text-[5px] leading-[1.4]"
        style={{ left: "59px", color: "#d4d4d4" }}
      >
        <div style={{ color: "#569cd6" }}># Tiago Duarte</div>
        <div style={{ color: "#6a9955" }}>{`> Fullstack Developer`}</div>
        <div className="mt-0.5">Multidisciplinary creator.</div>
        <div className="mt-1" style={{ color: "#dcdcaa" }}>
          ## Sections
        </div>
        <div className="text-[#9cdcfe]">- about</div>
        <div className="text-[#9cdcfe]">- experience</div>
      </div>
      {/* status bar */}
      <div
        className="absolute inset-x-0 bottom-0 flex h-3 items-center gap-1 px-1.5 text-[4.5px] text-white"
        style={{ backgroundColor: "#007acc" }}
      >
        <span>main</span>
        <span>·</span>
        <span>0 errors</span>
        <span className="ml-auto">UTF-8</span>
      </div>
    </Frame>
  );
}

/* ─────────── Terminal ─────────── */
function TerminalPreview() {
  return (
    <Frame bg="#300A24">
      {/* title bar with OS variant chips (Ubuntu / Debian) */}
      <div className="absolute inset-x-0 top-0 flex h-3 items-center gap-1 bg-[#2c2c2c] px-1.5">
        <span className="text-[5px] text-white/70">tiago@cv: ~</span>
        <span className="ml-auto rounded-sm bg-[#dd4814] px-1 text-[4.5px] font-bold text-white">
          UB
        </span>
        <span className="rounded-sm bg-white/10 px-1 text-[4.5px] text-white/55">
          DB
        </span>
        <span className="ml-1 h-1.5 w-1.5 rounded-full bg-[#cc0000]" />
      </div>
      {/* shell history */}
      <div
        className="absolute inset-x-2 top-4 font-mono text-[5.5px] leading-[1.55]"
        style={{ color: "#d3d7cf" }}
      >
        <Prompt cmd="whoami" />
        <div className="text-white">Tiago Duarte</div>
        <div>Fullstack · multidisciplinary</div>
        <div className="mt-0.5">
          <Prompt cmd="tree skills" inline />
        </div>
        <div className="text-[#d3d7cf]/85">├── frontend/</div>
        <div className="text-[#d3d7cf]/85">│   └── react</div>
        <div className="text-[#d3d7cf]/85">└── backend/</div>
        <div className="text-[#d3d7cf]/85">    └── node</div>
        <div className="mt-0.5">
          <span style={{ color: "#8ae234" }}>tiago</span>@
          <span style={{ color: "#8ae234" }}>cv</span>:
          <span style={{ color: "#729fcf" }}>~</span>${" "}
          <span
            className="ml-0.5 inline-block h-2 w-1 align-middle"
            style={{ background: "#d3d7cf" }}
          />
        </div>
      </div>
    </Frame>
  );
}

function Prompt({ cmd, inline }: { cmd: string; inline?: boolean }) {
  return (
    <span style={inline ? undefined : { display: "block" }}>
      <span style={{ color: "#8ae234" }}>tiago</span>@
      <span style={{ color: "#8ae234" }}>cv</span>:
      <span style={{ color: "#729fcf" }}>~</span>${" "}
      <span style={{ color: "#fff" }}>{cmd}</span>
    </span>
  );
}

/* ─────────── Star Wars ─────────── */
/* Two signature elements of the real theme rendered with real text:
 *   1) the opening crawl in yellow credits-style serif uppercase, receding
 *      into space via rotateX perspective
 *   2) the contact hologram, R2-style droid casting a cyan light cone
 *      onto a glowing frame that lists EMAIL / LINKEDIN / GITHUB as a
 *      "transmission" of contact channels (mirrors ContactHologram). */
function StarWarsPreview() {
  return (
    <Frame bg="#000">
      {/* Starfield */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 70"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <circle
            key={i}
            cx={(i * 17) % 100}
            cy={(i * 11) % 70}
            r={0.3 + ((i * 7) % 5) / 12}
            fill="#fff"
            opacity={0.3 + ((i * 13) % 7) / 10}
            className={i % 4 === 0 ? "sw-twinkle" : ""}
            style={
              i % 4 === 0
                ? { animationDelay: `${((i * 3) % 30) / 10}s` }
                : undefined
            }
          />
        ))}
      </svg>

      <div className="absolute inset-2 flex flex-col">
        {/* Episode subtitle */}
        <div
          className="text-center font-mono text-[4px] uppercase tracking-[0.4em]"
          style={{ color: "#bfae18" }}
        >
          Episode IV: A New Career
        </div>

        {/* CRAWL, credits-style serif uppercase text, receding into space */}
        <div
          className="mt-0.5 flex-1 overflow-hidden"
          style={{ perspective: "55px" }}
        >
          <div
            className="mx-auto flex flex-col items-center text-center uppercase"
            style={{
              transform: "rotateX(42deg)",
              transformOrigin: "center top",
              color: "#ffe81f",
              textShadow: "0 0 4px rgba(255,232,31,0.55)",
              fontFamily: "var(--font-serif), 'Times New Roman', Georgia, serif",
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            <div
              className="text-[10px] font-black tracking-[-0.02em]"
              style={{ textShadow: "0 0 6px rgba(255,232,31,0.7)" }}
            >
              Tiago Duarte
            </div>
            <div
              className="mt-[1px] text-[4px] tracking-[0.18em]"
              style={{ opacity: 0.9 }}
            >
              Fullstack Engineer
            </div>
            <div
              className="mt-[3px] max-w-[88%] text-[3.6px] tracking-[0.04em]"
              style={{ opacity: 0.95 }}
            >
              It is a period of fullstack
              <br />
              renaissance. From the
              <br />
              ashes of the legacy stack,
              <br />
              a developer rises with
              <br />
              react, node and a vision
              <br />
              to ship interfaces that
              <br />
              serve millions across
              <br />
              the galaxy…
            </div>
          </div>
        </div>

        {/* CONTACT HOLOGRAM, droid → light cone → transmission frame */}
        <div className="relative pt-0.5">
          {/* R2-style droid with blinking cyan eye */}
          <svg
            className="mx-auto block"
            width="14"
            height="13"
            viewBox="0 0 22 20"
          >
            <ellipse cx="11" cy="6" rx="5.5" ry="4" fill="#cfcfcf" />
            <circle cx="11" cy="6" r="1.4" fill="#5af2ff">
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="1.6s"
                repeatCount="indefinite"
              />
            </circle>
            <rect
              x="5.5"
              y="7"
              width="11"
              height="11"
              rx="0.6"
              fill="#9a9a9a"
            />
            <rect x="7" y="10" width="2" height="2" fill="#fff" />
            <rect x="13" y="10" width="2" height="2" fill="#fff" />
            <rect
              x="7"
              y="13.5"
              width="8"
              height="1.2"
              fill="#5af2ff"
              opacity="0.6"
            />
          </svg>
          {/* Light cone projecting downward */}
          <div
            aria-hidden
            className="mx-auto h-2.5 w-14"
            style={{
              background:
                "linear-gradient(180deg, rgba(90,242,255,0.55) 0%, rgba(90,242,255,0.05) 100%)",
              clipPath: "polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)",
              filter: "blur(0.6px)",
              marginTop: "-1px",
            }}
          />
          {/* Hologram frame, contact transmission */}
          <div
            className="relative -mt-1 overflow-hidden rounded border px-1.5 py-1"
            style={{
              borderColor: "rgba(90,242,255,0.5)",
              background:
                "radial-gradient(ellipse at top, rgba(90,242,255,0.2) 0%, transparent 75%), #050810",
              boxShadow:
                "0 0 12px -3px rgba(90,242,255,0.5), inset 0 0 8px rgba(90,242,255,0.06)",
            }}
          >
            <div
              className="text-center font-mono text-[3.5px] uppercase tracking-[0.4em]"
              style={{ color: "#5af2ff", opacity: 0.95 }}
            >
              ◉ Holographic Transmission
            </div>
            <div className="mt-1 grid grid-cols-3 gap-0.5">
              {[
                ["✉", "EMAIL"],
                ["in", "LINKEDIN"],
                ["⌬", "GITHUB"],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-0 font-mono"
                  style={{ color: "#5af2ff" }}
                >
                  <span
                    className="text-[6px] leading-none"
                    style={{ textShadow: "0 0 3px rgba(90,242,255,0.8)" }}
                  >
                    {icon}
                  </span>
                  <span
                    className="text-[3.5px] uppercase tracking-[0.15em]"
                    style={{ opacity: 0.9 }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
