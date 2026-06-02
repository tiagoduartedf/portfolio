type Variant = "dloa" | "axcode" | "adastra" | "il8gs" | "iveg" | "default";

type Brand = {
  bg: string;
  bg2: string;
  fg: string;
  accent: string;
  url: string;
  /** Visuals that fill the inner frame, one per shot. */
  Visuals: React.ComponentType[];
  /** Short label per shot (en), surfaced as caption. */
  shotLabels: { en: string; pt: string }[];
  device: "browser" | "phone";
  /** SVG viewBox height. Defaults to 500 (used by all SVG-based shots).
   *  DLOA uses 400 so the slot aspect (2/1) matches the typical photo
   *  ratio (~2:1), avoiding fat letterbox bars on the wider screenshots
   *  (farmaco 2.38, segmentacao 2.58). Width is always 800. */
  slotHeight?: number;
};

const BRANDS: Record<Variant, Brand> = {
  dloa: {
    bg: "#0b0f1f",
    bg2: "#1e1b4b",
    fg: "#ffffff",
    accent: "#7c3aed",
    url: "app.dloa.ai",
    device: "browser",
    slotHeight: 400,
    Visuals: [
      DloaFlowEditor,
      DloaLogin,
      DloaInsights,
      DloaChannelDash,
      DloaTemplates,
      DloaExecutions,
      DloaExecutionsDetail,
      DloaContacts,
      DloaPharmaco,
    ],
    shotLabels: [
      { en: "Flow Editor", pt: "Editor de Fluxo" },
      { en: "Login", pt: "Login" },
      { en: "Dashboard Insights", pt: "Dashboard Insights" },
      { en: "Channel Dashboard", pt: "Régua de Comunicação" },
      { en: "Message Templates", pt: "Modelos de Mensagens" },
      { en: "Flow Executions · list", pt: "Execuções · lista" },
      { en: "Flow Executions · detail", pt: "Execuções · detalhe" },
      { en: "Contacts & Segmentation", pt: "Contatos & Segmentação" },
      { en: "Pharmacovigilance", pt: "Farmacovigilância" },
    ],
  },
  axcode: {
    bg: "#0f172a",
    bg2: "#1e293b",
    fg: "#ffffff",
    accent: "#22d3ee",
    url: "axcode.com.br",
    device: "browser",
    Visuals: [AxcodeLighthouse, AxcodeEditor, AxcodeStack],
    shotLabels: [
      { en: "Lighthouse 100/100", pt: "Lighthouse 100/100" },
      { en: "DX & code quality", pt: "DX & qualidade de código" },
      { en: "Stack overview", pt: "Visão geral da stack" },
    ],
  },
  adastra: {
    bg: "#0a1f3d",
    bg2: "#102a5c",
    fg: "#ffffff",
    accent: "#fbbf24",
    url: "adastra.finance",
    device: "browser",
    Visuals: [AdastraPortfolio, AdastraTransactions, AdastraCheckout],
    shotLabels: [
      { en: "Portfolio dashboard", pt: "Dashboard de portfólio" },
      { en: "Transaction history", pt: "Histórico de transações" },
      { en: "Mercado Pago checkout", pt: "Checkout Mercado Pago" },
    ],
  },
  il8gs: {
    bg: "#1e0b3a",
    bg2: "#3b0764",
    fg: "#ffffff",
    accent: "#a78bfa",
    url: "il.8gs.org",
    device: "browser",
    Visuals: [Il8gsMap, Il8gsLeaderboard, Il8gsAdmin],
    shotLabels: [
      { en: "Live world map", pt: "Mapa ao vivo" },
      { en: "Top players", pt: "Top jogadores" },
      { en: "Admin panel", pt: "Painel admin" },
    ],
  },
  iveg: {
    bg: "#052e1a",
    bg2: "#0a4d2a",
    fg: "#ffffff",
    accent: "#4ade80",
    url: "iVeg",
    device: "phone",
    Visuals: [IvegHome, IvegRecipe, IvegCommunity],
    shotLabels: [
      { en: "Home", pt: "Início" },
      { en: "Recipe detail", pt: "Detalhe de receita" },
      { en: "Community feed", pt: "Feed da comunidade" },
    ],
  },
  default: {
    bg: "#1f2937",
    bg2: "#374151",
    fg: "#ffffff",
    accent: "#a78bfa",
    url: "project",
    device: "browser",
    Visuals: [DefaultVisual],
    shotLabels: [{ en: "Preview", pt: "Preview" }],
  },
};

export function projectVariantFromName(name: string): Variant {
  const k = name.toLowerCase();
  if (k.includes("dloa")) return "dloa";
  if (k.includes("axcode")) return "axcode";
  if (k.includes("adastra")) return "adastra";
  if (k.includes("il.8gs") || k.includes("8gs")) return "il8gs";
  if (k.includes("iveg")) return "iveg";
  return "default";
}

export function getShotCount(variant: Variant): number {
  return BRANDS[variant].Visuals.length;
}

/** Tailwind aspect class for the screenshot slot. DLOA's slot is flatter
 *  (2/1) to match its ~2:1 product screenshots; everything else keeps
 *  16/9. Used by ProjectCaseStudy when sizing the viewer column. */
export function getSlotAspectClass(variant: Variant): string {
  const h = BRANDS[variant].slotHeight ?? 500;
  return h === 400 ? "aspect-[2/1]" : "aspect-[16/9]";
}

export function getShotLabel(
  variant: Variant,
  shotIndex: number,
  lang: "en" | "pt",
): string {
  const labels = BRANDS[variant].shotLabels;
  return labels[shotIndex % labels.length][lang];
}

type Props = {
  variant: Variant;
  className?: string;
  /** 0-based index into the variant's shots array. */
  shotIndex?: number;
};

export default function ProjectMockup({ variant, className, shotIndex = 0 }: Props) {
  const b = BRANDS[variant];
  const idx = ((shotIndex % b.Visuals.length) + b.Visuals.length) % b.Visuals.length;
  if (b.device === "phone") return <PhoneFrame brand={b} className={className} shotIndex={idx} />;
  return <BrowserFrame brand={b} className={className} shotIndex={idx} />;
}

function BrowserFrame({
  brand,
  className,
  shotIndex,
}: {
  brand: Brand;
  className?: string;
  shotIndex: number;
}) {
  const Visual = brand.Visuals[shotIndex];
  const gradientId = `bg-${brand.url}-${shotIndex}`;
  const h = brand.slotHeight ?? 500;
  return (
    <svg
      viewBox={`0 0 800 ${h}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Project preview"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={brand.bg} />
          <stop offset="100%" stopColor={brand.bg2} />
        </linearGradient>
      </defs>
      <rect width="800" height={h} rx="14" fill={`url(#${gradientId})`} />
      <Visual />
    </svg>
  );
}

function PhoneFrame({
  brand,
  className,
  shotIndex,
}: {
  brand: Brand;
  className?: string;
  shotIndex: number;
}) {
  const Visual = brand.Visuals[shotIndex];
  const gradientId = `bg2-${brand.url}-${shotIndex}`;
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-label="Project preview"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={brand.bg} />
          <stop offset="100%" stopColor={brand.bg2} />
        </linearGradient>
      </defs>
      <rect width="800" height="500" rx="14" fill={`url(#${gradientId})`} />
      <g transform="translate(290,30)">
        <rect width="220" height="440" rx="32" fill="#0b0b10" stroke="rgba(255,255,255,0.08)" />
        <rect x="10" y="10" width="200" height="420" rx="22" fill={brand.bg2} />
        <rect x="80" y="14" width="60" height="14" rx="7" fill="#0b0b10" />
        <g transform="translate(10,10)">
          <Visual />
        </g>
      </g>
    </svg>
  );
}

/* ─────────── axCode shots ─────────── */

function AxcodeLighthouse() {
  return (
    <g>
      <text
        x="60"
        y="120"
        fill="#fff"
        fontFamily="system-ui, sans-serif"
        fontSize="48"
        fontWeight="800"
        letterSpacing="-1"
      >
        ax<tspan fill="#22d3ee">Code</tspan>
      </text>
      <text
        x="60"
        y="148"
        fill="rgba(255,255,255,0.7)"
        fontFamily="system-ui, sans-serif"
        fontSize="14"
      >
        Engineering excellence, delivered.
      </text>
      <g transform="translate(60,200)">
        {[
          { label: "Performance", color: "#22c55e" },
          { label: "Accessibility", color: "#22c55e" },
          { label: "Best Practices", color: "#22c55e" },
          { label: "SEO", color: "#22c55e" },
        ].map((s, i) => (
          <g key={s.label} transform={`translate(${i * 165},0)`}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={s.color}
              strokeWidth="6"
              strokeDasharray="251"
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
              strokeLinecap="round"
            />
            <text x="50" y="55" textAnchor="middle" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="800">
              100
            </text>
            <text x="50" y="115" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontFamily="system-ui, sans-serif" fontSize="11">
              {s.label}
            </text>
          </g>
        ))}
      </g>
    </g>
  );
}

function AxcodeEditor() {
  // VS-Code-ish window with tabs and syntax-highlighted code
  return (
    <g>
      {/* Sidebar */}
      <rect x="0" y="0" width="60" height="456" fill="rgba(0,0,0,0.25)" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x="22"
          y={20 + i * 36}
          width="16"
          height="16"
          rx="3"
          fill={i === 1 ? "#22d3ee" : "rgba(255,255,255,0.4)"}
        />
      ))}
      {/* Tabs */}
      <g transform="translate(60,0)">
        <rect width="740" height="36" fill="rgba(0,0,0,0.18)" />
        {["page.tsx", "layout.tsx", "Hero.tsx"].map((f, i) => (
          <g key={f} transform={`translate(${i * 130},0)`}>
            <rect
              width="130"
              height="36"
              fill={i === 0 ? "rgba(255,255,255,0.06)" : "transparent"}
            />
            <text
              x="14"
              y="22"
              fill={i === 0 ? "#fff" : "rgba(255,255,255,0.55)"}
              fontFamily="ui-monospace, monospace"
              fontSize="11"
            >
              ◆ {f}
            </text>
            {i === 0 ? <rect x="0" y="34" width="130" height="2" fill="#22d3ee" /> : null}
          </g>
        ))}
      </g>
      {/* Code body */}
      <g transform="translate(60,36)" fontFamily="ui-monospace, monospace" fontSize="13">
        {[
          { ln: 1, parts: [["import ", "#c084fc"], ["{ Hero }", "#fde68a"], [" from ", "#c084fc"], ["'./Hero'", "#86efac"], [";", "#cbd5e1"]] },
          { ln: 2, parts: [["", "#cbd5e1"]] },
          { ln: 3, parts: [["export default ", "#c084fc"], ["function ", "#22d3ee"], ["Page", "#fde68a"], ["() {", "#cbd5e1"]] },
          { ln: 4, parts: [["  ", "#cbd5e1"], ["return", "#c084fc"], [" (", "#cbd5e1"]] },
          { ln: 5, parts: [["    <", "#94a3b8"], ["Hero", "#22d3ee"], [" ", "#cbd5e1"], ["title", "#fde68a"], ["=", "#cbd5e1"], ["'axCode'", "#86efac"], [" />", "#94a3b8"]] },
          { ln: 6, parts: [["  );", "#cbd5e1"]] },
          { ln: 7, parts: [["}", "#cbd5e1"]] },
          { ln: 8, parts: [["", "#cbd5e1"]] },
          { ln: 9, parts: [["// 100/100 across all metrics ✦", "#64748b"]] },
        ].map((row, ri) => (
          <g key={ri} transform={`translate(0,${30 + ri * 32})`}>
            <text x="14" y="0" fill="#475569">
              {String(row.ln).padStart(2, " ")}
            </text>
            <text x="56" y="0">
              {row.parts.map(([t, c], pi) => (
                <tspan key={pi} fill={c as string}>
                  {t as string}
                </tspan>
              ))}
            </text>
          </g>
        ))}
      </g>
      {/* Status bar */}
      <rect x="0" y="430" width="800" height="26" fill="#22d3ee" />
      <text x="14" y="447" fill="#0f172a" fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="700">
        ✓ Lighthouse · 100 / 100 / 100 / 100
      </text>
      <text x="700" y="447" fill="#0f172a" fontFamily="ui-monospace, monospace" fontSize="11">
        TypeScript
      </text>
    </g>
  );
}

function AxcodeStack() {
  // Tech stack pills + "0 errors" panel
  const pills = ["Next.js 15", "TypeScript", "React 19", "Tailwind", "Vercel", "ESLint"];
  return (
    <g>
      <text x="60" y="60" fill="rgba(255,255,255,0.55)" fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="3">
        STACK · 2026
      </text>
      <text x="60" y="110" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="44" fontWeight="800" letterSpacing="-1">
        Built fast.
      </text>
      <text x="60" y="155" fill="#22d3ee" fontFamily="system-ui, sans-serif" fontSize="44" fontWeight="800" letterSpacing="-1">
        Shipped faster.
      </text>
      <g transform="translate(60,200)">
        {pills.map((p, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          return (
            <g key={p} transform={`translate(${col * 220},${row * 50})`}>
              <rect width="200" height="38" rx="19" fill="rgba(34,211,238,0.12)" stroke="rgba(34,211,238,0.4)" />
              <circle cx="22" cy="19" r="6" fill="#22d3ee" />
              <text x="40" y="24" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="600">
                {p}
              </text>
            </g>
          );
        })}
      </g>
      <g transform="translate(60,360)">
        <rect width="660" height="60" rx="10" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.4)" />
        <text x="22" y="26" fill="#22c55e" fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="700">
          ✓ BUILD
        </text>
        <text x="22" y="48" fill="#fff" fontFamily="ui-monospace, monospace" fontSize="13">
          0 errors · 0 warnings · ready in 1.8s
        </text>
      </g>
    </g>
  );
}

/* ─────────── AdasTra shots ─────────── */

function AdastraPortfolio() {
  const points = [
    "40,260", "120,210", "200,230", "280,160", "360,180",
    "440,120", "520,140", "600,80", "680,100", "760,50",
  ].join(" ");
  return (
    <g>
      <text x="40" y="60" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="700">
        AdasTra
      </text>
      <text x="40" y="80" fill="rgba(255,255,255,0.55)" fontFamily="system-ui, sans-serif" fontSize="11">
        Portfolio · Last 30 days
      </text>
      <text x="40" y="155" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="56" fontWeight="800" letterSpacing="-2">
        R$ 142,389
      </text>
      <text x="40" y="180" fill="#fbbf24" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="700">
        ↑ +18.4% this month
      </text>
      <g transform="translate(0,180)">
        <polyline points={points} fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        <polygon points={`${points} 760,260 40,260`} fill="#fbbf24" opacity="0.12" />
      </g>
      <g transform="translate(40,440)">
        {["Stocks", "FII", "Crypto"].map((p, i) => (
          <g key={p} transform={`translate(${i * 100},0)`}>
            <rect width="84" height="22" rx="11" fill="rgba(251,191,36,0.15)" />
            <circle cx="14" cy="11" r="4" fill="#fbbf24" />
            <text x="26" y="15" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="11">
              {p}
            </text>
          </g>
        ))}
      </g>
    </g>
  );
}

function AdastraTransactions() {
  const rows = [
    { kind: "BUY", asset: "PETR4", amt: "+R$ 4,200.00", color: "#22c55e" },
    { kind: "DIV", asset: "HGLG11", amt: "+R$ 312.45", color: "#22c55e" },
    { kind: "SELL", asset: "BTC", amt: "−R$ 1,820.00", color: "#f97316" },
    { kind: "BUY", asset: "ITUB4", amt: "+R$ 980.00", color: "#22c55e" },
    { kind: "BUY", asset: "VALE3", amt: "+R$ 1,540.00", color: "#22c55e" },
    { kind: "SELL", asset: "MGLU3", amt: "−R$ 220.00", color: "#f97316" },
  ];
  return (
    <g>
      <text x="40" y="50" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="800">
        Transactions
      </text>
      <text x="40" y="72" fill="rgba(255,255,255,0.55)" fontFamily="system-ui, sans-serif" fontSize="12">
        Showing last 6 movements · 247 total
      </text>
      <g transform="translate(40,100)">
        {/* Header */}
        <rect width="720" height="34" rx="6" fill="rgba(255,255,255,0.04)" />
        {["Type", "Asset", "Date", "Amount"].map((h, i) => (
          <text
            key={h}
            x={20 + i * 175}
            y="22"
            fill="rgba(255,255,255,0.5)"
            fontFamily="ui-monospace, monospace"
            fontSize="10"
            letterSpacing="2"
          >
            {h.toUpperCase()}
          </text>
        ))}
        {/* Rows */}
        {rows.map((r, i) => (
          <g key={i} transform={`translate(0,${50 + i * 42})`}>
            <line x1="0" y1="0" x2="720" y2="0" stroke="rgba(255,255,255,0.06)" />
            <rect x="14" y="10" width="44" height="20" rx="10" fill={`${r.color}33`} />
            <text x="36" y="24" textAnchor="middle" fill={r.color} fontFamily="ui-monospace, monospace" fontSize="10" fontWeight="700">
              {r.kind}
            </text>
            <text x="195" y="26" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="700">
              {r.asset}
            </text>
            <text x="370" y="26" fill="rgba(255,255,255,0.7)" fontFamily="system-ui, sans-serif" fontSize="13">
              {`0${i + 1}/05/26`}
            </text>
            <text x="545" y="26" fill={r.color} fontFamily="ui-monospace, monospace" fontSize="13" fontWeight="700">
              {r.amt}
            </text>
          </g>
        ))}
      </g>
    </g>
  );
}

function AdastraCheckout() {
  return (
    <g>
      <text x="40" y="50" fill="rgba(255,255,255,0.55)" fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="3">
        STEP 02 / 03 · PAYMENT
      </text>
      <text x="40" y="92" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="34" fontWeight="800" letterSpacing="-1">
        Confirm subscription
      </text>
      {/* Card */}
      <g transform="translate(40,130)">
        <rect width="380" height="220" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
        <text x="22" y="38" fill="rgba(255,255,255,0.5)" fontFamily="ui-monospace, monospace" fontSize="10">
          CARD NUMBER
        </text>
        <text x="22" y="68" fill="#fff" fontFamily="ui-monospace, monospace" fontSize="20" letterSpacing="2">
          •••• •••• •••• 4242
        </text>
        <g transform="translate(22,100)">
          <text fill="rgba(255,255,255,0.5)" fontFamily="ui-monospace, monospace" fontSize="10">
            EXPIRES
          </text>
          <text y="24" fill="#fff" fontFamily="ui-monospace, monospace" fontSize="14">
            08 / 28
          </text>
        </g>
        <g transform="translate(180,100)">
          <text fill="rgba(255,255,255,0.5)" fontFamily="ui-monospace, monospace" fontSize="10">
            CVV
          </text>
          <text y="24" fill="#fff" fontFamily="ui-monospace, monospace" fontSize="14">
            •••
          </text>
        </g>
        <rect x="22" y="158" width="336" height="42" rx="8" fill="#fbbf24" />
        <text x="190" y="184" textAnchor="middle" fill="#0a1f3d" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="800">
          Pay R$ 49,90
        </text>
      </g>
      {/* Order summary */}
      <g transform="translate(450,130)">
        <rect width="290" height="220" rx="14" fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.3)" />
        <text x="20" y="34" fill="#fbbf24" fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="2">
          ORDER SUMMARY
        </text>
        {[
          ["Plan Pro · Monthly", "R$ 39,90"],
          ["Premium analytics", "R$ 10,00"],
          ["Discount", "− R$ 0,00"],
        ].map(([k, v], i) => (
          <g key={i} transform={`translate(20,${60 + i * 28})`}>
            <text fill="rgba(255,255,255,0.7)" fontFamily="system-ui, sans-serif" fontSize="12">
              {k}
            </text>
            <text x="250" textAnchor="end" fill="#fff" fontFamily="ui-monospace, monospace" fontSize="12">
              {v}
            </text>
          </g>
        ))}
        <line x1="20" y1="160" x2="270" y2="160" stroke="rgba(255,255,255,0.1)" />
        <text x="20" y="190" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="700">
          Total
        </text>
        <text x="270" y="190" textAnchor="end" fill="#fbbf24" fontFamily="ui-monospace, monospace" fontSize="18" fontWeight="800">
          R$ 49,90
        </text>
      </g>
      <text x="40" y="400" fill="rgba(255,255,255,0.4)" fontFamily="ui-monospace, monospace" fontSize="11">
        🔒 Secured by Mercado Pago · JWT session
      </text>
    </g>
  );
}

/* ─────────── il.8gs shots ─────────── */

function Il8gsMap() {
  return (
    <g>
      <g opacity="0.25">
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={460} stroke="#a78bfa" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 50} x2={800} y2={i * 50} stroke="#a78bfa" strokeWidth="0.5" />
        ))}
      </g>
      {[
        { x: 180, y: 130, label: "HQ" },
        { x: 380, y: 200, label: "EVT" },
        { x: 560, y: 110, label: "PvP" },
        { x: 640, y: 320, label: "RAID" },
        { x: 280, y: 350, label: "QST" },
      ].map((m) => (
        <g key={m.label}>
          <circle cx={m.x} cy={m.y} r="22" fill="#a78bfa" opacity="0.18">
            <animate attributeName="r" values="22;30;22" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.18;0;0.18" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={m.x} cy={m.y} r="10" fill="#a78bfa" stroke="#fff" strokeWidth="2" />
          <text x={m.x + 18} y={m.y + 4} fill="#fff" fontFamily="ui-monospace, monospace" fontSize="11" fontWeight="700">
            {m.label}
          </text>
        </g>
      ))}
      <g transform="translate(40,30)">
        <rect width="220" height="60" rx="10" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.1)" />
        <text x="14" y="22" fill="rgba(255,255,255,0.55)" fontFamily="ui-monospace, monospace" fontSize="10">
          ONLINE
        </text>
        <text x="14" y="48" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="800">
          1,284 players
        </text>
        <circle cx="195" cy="20" r="5" fill="#22c55e">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </g>
    </g>
  );
}

function Il8gsLeaderboard() {
  const rows = [
    { rank: 1, name: "DarkWolf", lvl: 87, kills: 4124 },
    { rank: 2, name: "Phoenix_Z", lvl: 82, kills: 3890 },
    { rank: 3, name: "n3on", lvl: 80, kills: 3712 },
    { rank: 4, name: "Hydra", lvl: 76, kills: 3015 },
    { rank: 5, name: "iceR0gue", lvl: 74, kills: 2884 },
    { rank: 6, name: "Vex", lvl: 71, kills: 2710 },
  ];
  return (
    <g>
      <text x="40" y="55" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="26" fontWeight="800" letterSpacing="-1">
        ⚔ Top Players
      </text>
      <text x="40" y="78" fill="rgba(255,255,255,0.55)" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="2">
        SEASON 14 · LIVE
      </text>
      <g transform="translate(40,110)">
        <rect width="720" height="34" rx="6" fill="rgba(167,139,250,0.12)" />
        {[
          ["#", 16],
          ["PLAYER", 80],
          ["LEVEL", 380],
          ["KILLS", 560],
        ].map(([h, x]) => (
          <text
            key={h as string}
            x={x as number}
            y="22"
            fill="rgba(255,255,255,0.6)"
            fontFamily="ui-monospace, monospace"
            fontSize="10"
            letterSpacing="2"
          >
            {h}
          </text>
        ))}
        {rows.map((r, i) => (
          <g key={r.name} transform={`translate(0,${48 + i * 42})`}>
            <rect width="720" height="36" rx="6" fill={i === 0 ? "rgba(167,139,250,0.2)" : "transparent"} />
            <text
              x="22"
              y="22"
              fill={i < 3 ? "#a78bfa" : "rgba(255,255,255,0.55)"}
              fontFamily="ui-monospace, monospace"
              fontSize="14"
              fontWeight="700"
            >
              {r.rank}
            </text>
            <circle cx="92" cy="18" r="11" fill="rgba(167,139,250,0.3)" />
            <text x="118" y="24" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="600">
              {r.name}
            </text>
            <text x="384" y="24" fill="#fff" fontFamily="ui-monospace, monospace" fontSize="13">
              {r.lvl}
            </text>
            <rect x="430" y="14" width="100" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
            <rect x="430" y="14" width={r.lvl} height="8" rx="4" fill="#a78bfa" />
            <text x="564" y="24" fill="#fbbf24" fontFamily="ui-monospace, monospace" fontSize="13" fontWeight="700">
              {r.kills.toLocaleString()}
            </text>
          </g>
        ))}
      </g>
    </g>
  );
}

function Il8gsAdmin() {
  return (
    <g>
      <text x="40" y="50" fill="rgba(255,255,255,0.55)" fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="3">
        ADMIN · MONITOR
      </text>
      <text x="40" y="92" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="32" fontWeight="800" letterSpacing="-1">
        Server Health
      </text>
      {/* KPI cards */}
      {[
        { label: "Uptime", value: "99.97%", c: "#22c55e" },
        { label: "p95 latency", value: "42ms", c: "#a78bfa" },
        { label: "Redis hit", value: "94.2%", c: "#fbbf24" },
        { label: "Active rooms", value: "128", c: "#22d3ee" },
      ].map((k, i) => (
        <g key={k.label} transform={`translate(${40 + i * 180},120)`}>
          <rect width="160" height="92" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
          <text x="16" y="28" fill="rgba(255,255,255,0.55)" fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="2">
            {k.label.toUpperCase()}
          </text>
          <text x="16" y="68" fill={k.c} fontFamily="system-ui, sans-serif" fontSize="26" fontWeight="800" letterSpacing="-1">
            {k.value}
          </text>
        </g>
      ))}
      {/* Sparkline */}
      <g transform="translate(40,240)">
        <rect width="720" height="180" rx="14" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.06)" />
        <text x="20" y="34" fill="rgba(255,255,255,0.6)" fontFamily="ui-monospace, monospace" fontSize="11" letterSpacing="2">
          REQ/S · LAST 5 MIN
        </text>
        <polyline
          points="20,140 80,120 140,128 200,90 260,108 320,72 380,98 440,60 500,84 560,40 620,70 680,52 700,46"
          fill="none"
          stroke="#a78bfa"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polygon
          points="20,140 80,120 140,128 200,90 260,108 320,72 380,98 440,60 500,84 560,40 620,70 680,52 700,46 700,160 20,160"
          fill="#a78bfa"
          opacity="0.16"
        />
      </g>
    </g>
  );
}

/* ─────────── iVeg shots (phone screen 200x420) ─────────── */

function IvegHome() {
  return (
    <g>
      <text x="100" y="40" textAnchor="middle" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="800">
        i<tspan fill="#4ade80">Veg</tspan>
      </text>
      <text x="100" y="58" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontFamily="system-ui, sans-serif" fontSize="9">
        Plant-based community
      </text>
      {[
        { y: 80, title: "Discover", c: "#4ade80", emoji: "🌱" },
        { y: 145, title: "My Recipes", c: "#22c55e", emoji: "🥗" },
        { y: 210, title: "Stores Near", c: "#16a34a", emoji: "🛒" },
        { y: 275, title: "Community", c: "#15803d", emoji: "💬" },
      ].map((c) => (
        <g key={c.title} transform={`translate(15,${c.y})`}>
          <rect width="170" height="55" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" />
          <rect width="6" height="55" rx="3" fill={c.c} />
          <text x="22" y="22" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="700">
            {c.title}
          </text>
          <text x="22" y="40" fill="rgba(255,255,255,0.55)" fontFamily="system-ui, sans-serif" fontSize="9">
            Tap to open
          </text>
          <text x="148" y="34" fontSize="20">
            {c.emoji}
          </text>
        </g>
      ))}
      <g transform="translate(0,375)">
        <rect width="200" height="35" fill="rgba(0,0,0,0.4)" />
        {["⌂", "♡", "+", "◷", "☰"].map((s, i) => (
          <text
            key={i}
            x={20 + i * 40}
            y="22"
            textAnchor="middle"
            fill={i === 0 ? "#4ade80" : "rgba(255,255,255,0.45)"}
            fontFamily="system-ui, sans-serif"
            fontSize="16"
            fontWeight="700"
          >
            {s}
          </text>
        ))}
      </g>
    </g>
  );
}

function IvegRecipe() {
  return (
    <g>
      {/* Hero image */}
      <rect x="0" y="0" width="200" height="120" fill="#15803d" />
      <circle cx="100" cy="60" r="42" fill="rgba(255,255,255,0.1)" />
      <text x="100" y="76" textAnchor="middle" fontSize="48">
        🥗
      </text>
      <rect x="0" y="0" width="200" height="120" fill="url(#iveg-fade)" opacity="0.5" />
      <defs>
        <linearGradient id="iveg-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Title */}
      <text x="14" y="146" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="800">
        Buddha Bowl
      </text>
      <text x="14" y="162" fill="rgba(255,255,255,0.55)" fontFamily="system-ui, sans-serif" fontSize="9">
        25 min · ★ 4.9
      </text>
      {/* Tags */}
      <g transform="translate(14,174)">
        {["vegan", "high-protein", "GF"].map((t, i) => (
          <g key={t} transform={`translate(${i * 56},0)`}>
            <rect width="50" height="16" rx="8" fill="rgba(74,222,128,0.18)" />
            <text x="25" y="11" textAnchor="middle" fill="#4ade80" fontFamily="system-ui, sans-serif" fontSize="8" fontWeight="700">
              {t}
            </text>
          </g>
        ))}
      </g>
      {/* Steps */}
      <text x="14" y="216" fill="rgba(255,255,255,0.55)" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="2">
        STEPS · 3 / 5
      </text>
      <g transform="translate(14,228)">
        {["Soak quinoa", "Roast veg", "Whisk dressing", "Plate it", "Garnish"].map((s, i) => (
          <g key={s} transform={`translate(0,${i * 26})`}>
            <circle
              cx="9"
              cy="10"
              r="7"
              fill={i < 3 ? "#4ade80" : "rgba(255,255,255,0.06)"}
              stroke={i < 3 ? "#4ade80" : "rgba(255,255,255,0.18)"}
            />
            {i < 3 ? (
              <text x="9" y="14" textAnchor="middle" fill="#052e1a" fontFamily="system-ui, sans-serif" fontSize="8" fontWeight="900">
                ✓
              </text>
            ) : null}
            <text
              x="24"
              y="14"
              fill={i < 3 ? "rgba(255,255,255,0.45)" : "#fff"}
              fontFamily="system-ui, sans-serif"
              fontSize="11"
              textDecoration={i < 3 ? "line-through" : undefined}
            >
              {s}
            </text>
          </g>
        ))}
      </g>
      {/* CTA */}
      <g transform="translate(15,365)">
        <rect width="170" height="32" rx="16" fill="#4ade80" />
        <text x="85" y="21" textAnchor="middle" fill="#052e1a" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="800">
          Save recipe
        </text>
      </g>
    </g>
  );
}

function IvegCommunity() {
  return (
    <g>
      <text x="14" y="30" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="800">
        Community
      </text>
      <text x="186" y="30" textAnchor="end" fontSize="13">
        🔔
      </text>
      {/* Stories */}
      <g transform="translate(14,46)">
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${i * 44},0)`}>
            <circle cx="18" cy="18" r="17" fill="none" stroke="#4ade80" strokeWidth="2" />
            <circle cx="18" cy="18" r="13" fill="rgba(74,222,128,0.2)" />
          </g>
        ))}
      </g>
      {/* Posts */}
      {[
        { name: "marina_v", text: "Just made the Buddha bowl 😍", likes: 124, c: "#4ade80" },
        { name: "lucas.pm", text: "Trying tempeh for the first time…", likes: 47, c: "#22c55e" },
        { name: "nina.eats", text: "Sourdough fail or art? 🥖", likes: 88, c: "#16a34a" },
      ].map((p, i) => (
        <g key={p.name} transform={`translate(14,${110 + i * 92})`}>
          <rect width="172" height="80" rx="10" fill="rgba(255,255,255,0.05)" />
          <circle cx="18" cy="20" r="10" fill={p.c} />
          <text x="34" y="20" fill="#fff" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700">
            {p.name}
          </text>
          <text x="34" y="32" fill="rgba(255,255,255,0.5)" fontFamily="system-ui, sans-serif" fontSize="8">
            2h
          </text>
          <text x="12" y="54" fill="rgba(255,255,255,0.85)" fontFamily="system-ui, sans-serif" fontSize="10">
            {p.text}
          </text>
          <text x="12" y="72" fill={p.c} fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="700">
            ♡ {p.likes}
          </text>
          <text x="56" y="72" fill="rgba(255,255,255,0.45)" fontFamily="system-ui, sans-serif" fontSize="9">
            💬 reply
          </text>
        </g>
      ))}
      {/* Tab bar */}
      <g transform="translate(0,375)">
        <rect width="200" height="35" fill="rgba(0,0,0,0.4)" />
        {["⌂", "♡", "+", "◷", "☰"].map((s, i) => (
          <text
            key={i}
            x={20 + i * 40}
            y="22"
            textAnchor="middle"
            fill={i === 4 ? "#4ade80" : "rgba(255,255,255,0.45)"}
            fontFamily="system-ui, sans-serif"
            fontSize="16"
            fontWeight="700"
          >
            {s}
          </text>
        ))}
      </g>
    </g>
  );
}

/* ─────────── DLOA.AI shots ─────────── */
/* Holding placeholder. The previous build used real product screenshots,
 * but use of those assets is pending authorization, so every shot points
 * to the same neutral SVG meanwhile. The screen captions in cv.ts still
 * describe what each shot would have shown; the project itself will be
 * collapsed/hidden from the showcase in a follow-up change. */

function DloaPlaceholder() {
  return (
    <g>
      <text
        x="400"
        y="190"
        textAnchor="middle"
        fill="rgba(255,255,255,0.65)"
        fontFamily="system-ui, sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="3"
      >
        DLOA.AI
      </text>
      <text
        x="400"
        y="220"
        textAnchor="middle"
        fill="rgba(255,255,255,0.4)"
        fontFamily="system-ui, sans-serif"
        fontSize="11"
        letterSpacing="1"
      >
        Screenshot pending authorization
      </text>
    </g>
  );
}

function DloaLogin() { return <DloaPlaceholder />; }
function DloaInsights() { return <DloaPlaceholder />; }
function DloaFlowEditor() { return <DloaPlaceholder />; }
function DloaTemplates() { return <DloaPlaceholder />; }
function DloaChannelDash() { return <DloaPlaceholder />; }
function DloaExecutions() { return <DloaPlaceholder />; }
function DloaExecutionsDetail() { return <DloaPlaceholder />; }
function DloaContacts() { return <DloaPlaceholder />; }
function DloaPharmaco() { return <DloaPlaceholder />; }


function DefaultVisual() {
  return (
    <g>
      <circle cx="400" cy="228" r="120" fill="rgba(255,255,255,0.1)" />
      <circle cx="400" cy="228" r="80" fill="rgba(255,255,255,0.15)" />
      <circle cx="400" cy="228" r="40" fill="#a78bfa" />
    </g>
  );
}
