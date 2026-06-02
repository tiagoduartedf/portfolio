import type { CV, Lang } from "../data/cv";
import { getDisciplineDetail, experienceAnchorId } from "../data/cv";
import ExperienceShareLink from "../components/ExperienceShareLink";
import { TechIcon, getTechLabel } from "../components/icons/TechIcon";
import { Flag } from "../components/icons/Flag";
import { groupBullets } from "../lib/bullets";
import { experienceDuration } from "../lib/period";
import { parseExperienceSummary } from "../lib/summaryBlocks";
import { linkifyBlog } from "../lib/linkifyBlog";
import { AtsHint } from "../components/AtsHint";
import { dispatchCvNavigate } from "../data/navigation";
import {
  TbBookmark,
  TbBriefcase,
  TbRocket,
  TbTool,
  TbWorld,
  TbSchool,
  TbMail,
  TbPhone,
  TbBrandLinkedin,
  TbBrandGithub,
  TbWorldWww,
  TbMapPin,
  TbLink,
} from "react-icons/tb";

type Props = { cv: CV; lang: Lang };

const N = {
  bg: "#ffffff",
  text: "#37352f",
  textMuted: "#787774",
  border: "rgba(55,53,47,0.09)",
  accent: "#2383e2",
};

const SECTION_ICON = {
  about: <TbBookmark />,
  experience: <TbBriefcase />,
  projects: <TbRocket />,
  skills: <TbTool />,
  languages: <TbWorld />,
  education: <TbSchool />,
} as const;

export default function Notion({ cv, lang }: Props) {
  return (
    <article
      className="theme-notion w-full min-h-screen overflow-hidden bg-white text-[#37352f] print:max-w-none print:shadow-none"
      style={{ fontFamily: "var(--font-sans), 'Segoe UI', system-ui, sans-serif" }}
    >
      {/* Body */}
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-8 md:px-12 print:pb-0 print:pt-4">
        {/* Header */}
        <header>
          <div className="flex flex-col gap-x-6 gap-y-1 md:flex-row md:items-baseline md:justify-between">
            <h1 className="font-sans text-[36px] font-extrabold leading-[1] tracking-tight md:text-[44px]">
              {cv.name}
            </h1>
            <div
              className="font-mono md:relative md:shrink-0"
              style={{ color: N.textMuted }}
              title={lang === "en" ? "Last updated" : "Última atualização"}
            >
              <div className="flex items-center gap-4">
                <span className="text-[11px] uppercase tracking-[0.3em]">
                  Curriculum Vitae
                </span>
                <span aria-hidden className="h-4 w-px" style={{ backgroundColor: N.border }} />
                <span className="text-[11.5px]" suppressHydrationWarning>
                  {(() => {
                    const d = new Date();
                    const dd = String(d.getDate()).padStart(2, "0");
                    const mm = String(d.getMonth() + 1).padStart(2, "0");
                    return `${dd}/${mm}/${d.getFullYear()}`;
                  })()}
                </span>
              </div>
              <p className="mt-0.5 whitespace-nowrap text-[10px] md:absolute md:right-0 md:top-full md:mt-0">
                {lang === "en" ? "from: " : "tirado de: "}
                <a
                  href="https://tiagoduartedf.github.io/portfolio/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  tiagoduartedf.github.io/portfolio
                </a>
              </p>
            </div>
          </div>
          <p className="mt-2 font-sans text-[16px] font-semibold" style={{ color: N.text }}>
            {cv.headline[lang]}
          </p>
          <p
            className="mt-1.5 font-sans text-[12.5px] italic"
            style={{ color: N.textMuted }}
          >
            {cv.tagline[lang]}
          </p>
          <dl className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-0.5 text-[12.5px] print:grid print:grid-cols-2 print:gap-x-4 print:gap-y-2 print:text-[10.5px]">
            {cv.disciplines.map((d) => {
              const details = getDisciplineDetail(d);
              return (
                <div key={d} className="flex items-baseline gap-1.5">
                  <dt className="font-bold" style={{ color: N.accent }}>
                    {d}
                  </dt>
                  {details ? (
                    <dd style={{ color: N.text }}>{details[lang]}</dd>
                  ) : null}
                </div>
              );
            })}
          </dl>
        </header>

        {/* Properties row, contacts + education in one compact strip */}
        <div
          className="mt-3 flex flex-col gap-y-1.5 rounded-md border px-3 py-2 text-[12.5px] md:flex-row md:flex-wrap md:items-center md:gap-x-4 print:flex-row print:flex-wrap print:items-center print:gap-x-4"
          style={{ borderColor: N.border, backgroundColor: "#fafaf8" }}
        >
          {cv.contacts.filter((c) => c.kind !== "location").map((c) => (
            <a
              key={c.kind}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noreferrer" : undefined}
              className="group inline-flex items-baseline gap-1.5"
              title={c.label}
            >
              <span className="self-center text-[14px]" style={{ color: N.textMuted }}>
                {iconForContact(c.kind)}
              </span>
              <span className="group-hover:underline">{c.display}</span>
            </a>
          ))}
          {cv.education.map((e) => (
            <span
              key={e.institution}
              id="cv-education"
              className="flex flex-wrap scroll-mt-24 items-baseline gap-x-1.5 gap-y-0.5 md:ml-auto md:flex-nowrap print:ml-0 print:flex-nowrap"
            >
              <span className="self-center text-[14px]" style={{ color: N.textMuted }}>
                {SECTION_ICON.education}
              </span>
              <AtsHint lang={lang}>
                {lang === "pt" ? "Formação" : "Education"}
              </AtsHint>
              <span className="font-semibold">{e.degree[lang]}</span>
              <span style={{ color: N.textMuted }}>· {e.institution}</span>
              {e.period ? (
                <span className="font-mono text-[11px] md:whitespace-nowrap print:whitespace-nowrap" style={{ color: N.textMuted }}>
                  {e.period}
                </span>
              ) : null}
            </span>
          ))}
        </div>

        <Divider />

        {/* About */}
        <H2 icon={SECTION_ICON.about} id="cv-about">
          {lang === "en" ? "About me" : "Sobre mim"}
        </H2>
        <div className="mt-3 space-y-3">
          {cv.summary[lang].split("\n\n").map((p, i) => (
            <p key={i} className="text-[15px] leading-snug" style={{ color: N.text }}>
              {linkifyBlog(p, N.accent)}
            </p>
          ))}
        </div>

        <Divider />

        {/* Experience */}
        <H2 icon={SECTION_ICON.experience} id="cv-experience">
          {lang === "en" ? "Experience" : "Experiência"}
        </H2>
        <div className="mt-3 space-y-3">
          {cv.experience.map((exp) => {
            const duration = experienceDuration(exp.period);
            return (
            <div
              key={exp.company + exp.period.en}
              id={experienceAnchorId(exp.company)}
              className="scroll-mt-24"
            >
            <ToggleBlock
              defaultOpen
              summary={
                <div className="flex flex-1 items-baseline justify-between gap-3">
                  <span className="inline-flex items-baseline gap-1.5 font-semibold">
                    <AtsHint lang={lang}>
                      {lang === "pt" ? "Cargo" : "Role"}
                    </AtsHint>
                    {exp.role[lang]}
                    <span style={{ color: N.textMuted }}> · </span>
                    <span style={{ color: N.accent }}>{exp.company}</span>
                    <ExperienceShareLink
                      company={exp.company}
                      lang={lang}
                      className="self-center"
                      size={12}
                    />
                  </span>
                  <span className="inline-flex items-baseline gap-1.5 font-mono text-[12px]" style={{ color: N.textMuted }}>
                    <AtsHint lang={lang}>
                      {lang === "pt" ? "Período" : "Period"}
                    </AtsHint>
                    {exp.period[lang]}
                    {duration ? ` · ${duration[lang]}` : ""}
                  </span>
                </div>
              }
            >
              <div className="mt-1 space-y-2">
                {parseExperienceSummary(exp.summary[lang]).map((block, i) => {
                  if (block.kind === "separator") {
                    return (
                      <div
                        key={i}
                        className="my-1 flex items-center gap-3 select-none"
                      >
                        <span className="h-px flex-1" style={{ background: N.border }} />
                        <span
                          className="text-[10.5px] uppercase tracking-[0.18em]"
                          style={{ color: N.textMuted }}
                        >
                          {block.text}
                        </span>
                        <span className="h-px flex-1" style={{ background: N.border }} />
                      </div>
                    );
                  }
                  if (block.kind === "citation") {
                    const quoted = block.paragraphs.join(" ");
                    return (
                      <figure key={i} className="my-2">
                        <blockquote
                          className="text-[15px] leading-snug"
                          style={{ color: N.text }}
                        >
                          <span
                            aria-hidden
                            className="font-serif"
                            style={{
                              fontSize: "36px",
                              lineHeight: 0,
                              verticalAlign: "-0.35em",
                              marginRight: "0.1em",
                              color: N.textMuted,
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
                              color: N.textMuted,
                            }}
                          >
                            {"”"}
                          </span>
                        </blockquote>
                        <figcaption className="mt-1 text-[11px]" style={{ color: N.textMuted }}>
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
                  return (
                    <p
                      key={i}
                      className="text-[15px]"
                      style={{ color: N.text }}
                    >
                      {block.text}
                    </p>
                  );
                })}
              </div>
              <div className="mt-2 space-y-2">
                {groupBullets(exp.bullets[lang]).map((g, gi) => (
                  <div key={gi} className="space-y-1">
                    {g.intro ? (
                      <p className="text-[15px]" style={{ color: N.textMuted }}>
                        {g.intro}
                      </p>
                    ) : null}
                    {g.items.length > 0 ? (
                      <ul className="space-y-1">
                        {g.items.map((b, i) => (
                          <li key={i} className="flex gap-2 text-[15px]">
                            <span style={{ color: N.textMuted }}>•</span>
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
                    <Tag key={s} icon={<TechIcon name={s} size={12} />}>
                      {getTechLabel(s)}
                    </Tag>
                  ))}
                </div>
              ) : null}
            </ToggleBlock>
            </div>
            );
          })}
        </div>

        <Divider />

        {/* Skills as a Notion database table */}
        <H2 icon={SECTION_ICON.skills} id="cv-skills">
          {lang === "en" ? "Skills" : "Habilidades"}
        </H2>

        {/* Mobile: stacked list, category title, tag cloud */}
        <div
          className="mt-3 overflow-hidden rounded-md border md:hidden print:hidden"
          style={{ borderColor: N.border }}
        >
          {cv.skills.map((g, idx) => (
            <div
              key={g.label.en}
              className={`px-3 py-2 ${idx > 0 ? "border-t" : ""}`}
              style={{ borderColor: N.border }}
            >
              <div className="text-[14px] font-semibold">{g.label[lang]}</div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <Tag key={s} icon={<TechIcon name={s} size={12} />}>
                    {getTechLabel(s)}
                  </Tag>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* md+ / print: Notion database table (no count column — chip cloud
            already shows the breadth; the digit only added vertical noise) */}
        <div
          className="mt-3 hidden overflow-hidden rounded-md border md:block print:block"
          style={{ borderColor: N.border }}
        >
          <div
            className="grid grid-cols-[140px_1fr] border-b text-[12px] print:grid-cols-[120px_1fr] print:text-[10px]"
            style={{ borderColor: N.border, color: N.textMuted, backgroundColor: "#fafaf9" }}
          >
            <div className="px-3 py-1.5 font-medium print:px-2 print:py-0.5">
              {lang === "en" ? "Category" : "Categoria"}
            </div>
            <div className="border-l px-3 py-1.5 font-medium print:px-2 print:py-0.5" style={{ borderColor: N.border }}>
              {lang === "en" ? "Items" : "Itens"}
            </div>
          </div>
          {cv.skills.map((g) => (
            <div
              key={g.label.en}
              className="grid grid-cols-[140px_1fr] border-b text-[14px] transition-colors last:border-b-0 hover:bg-[#fafaf9] print:grid-cols-[120px_1fr] print:text-[10.5px]"
              style={{ borderColor: N.border }}
            >
              <div className="px-3 py-1.5 font-semibold print:px-2 print:py-0.5">{g.label[lang]}</div>
              <div className="border-l px-3 py-1.5 print:px-2 print:py-0.5" style={{ borderColor: N.border }}>
                <div className="flex flex-wrap gap-1.5 print:gap-1">
                  {g.items.map((s) => (
                    <Tag key={s} icon={<TechIcon name={s} size={12} />}>
                      {getTechLabel(s)}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Languages */}
        <H2 icon={SECTION_ICON.languages} id="cv-languages">
          {lang === "en" ? "Languages" : "Idiomas"}
        </H2>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3 print:grid-cols-3 print:gap-2">
          {cv.languages.map((l) => (
            <article
              key={l.name.en}
              className="break-inside-avoid rounded-md border p-4 print:p-2.5"
              style={{ borderColor: N.border, backgroundColor: "#fafaf8" }}
            >
              <header
                className="flex items-center gap-3 border-b pb-3 print:gap-2 print:pb-1.5"
                style={{ borderColor: N.border }}
              >
                <Flag code={l.flag} size={28} />
                <div className="flex flex-1 items-baseline justify-between">
                  <h4 className="text-[16px] font-semibold print:text-[13px]" style={{ color: N.text }}>
                    {l.name[lang]}
                  </h4>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.25em] print:text-[8.5px]"
                    style={{ color: N.textMuted }}
                  >
                    {l.level[lang]}
                  </span>
                </div>
              </header>
              <p
                className="mt-3 text-[14px] leading-snug print:mt-1 print:text-[11px] print:leading-normal"
                style={{ color: N.text }}
              >
                {l.details[lang]}
              </p>
            </article>
          ))}
        </div>

        {/* Projects showcase intentionally removed: product screenshots
            and internal feature names are pending authorization, so the
            "Featured Projects" section sits this version out. */}
      </div>
    </article>
  );
}

function H2({
  children,
  icon,
  id,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  id?: string;
}) {
  return (
    <h2 id={id} className="mt-2 flex scroll-mt-24 items-center gap-2 text-[24px] font-extrabold tracking-tight print:text-[20px]">
      <span className="grid h-6 w-6 place-items-center text-[20px]" style={{ color: N.textMuted }}>
        {icon}
      </span>
      <span>{children}</span>
    </h2>
  );
}

function Divider() {
  return (
    <hr
      className="my-6 border-0 print:my-3"
      style={{ borderTop: `1px solid ${N.border}` }}
    />
  );
}

function Tag({
  children,
  icon,
  small,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  small?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[3px] ${small ? "px-1.5 py-0.5 text-[10px]" : "px-1.5 py-0.5 text-[11px]"}`}
      style={{ backgroundColor: "rgba(55,53,47,0.06)" }}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
}

function ToggleBlock({
  summary,
  children,
  defaultOpen,
}: {
  summary: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group border-l-2 pl-3 transition-colors hover:border-[#37352f33]"
      style={{ borderColor: N.border }}
    >
      <summary className="flex cursor-pointer list-none items-baseline gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-[#37352f14] active:bg-[#37352f1f] [&::-webkit-details-marker]:hidden">
        <span
          className="select-none text-[13px] transition-transform duration-150 group-open:rotate-90 group-hover:text-[#37352f]"
          style={{ color: N.textMuted }}
        >
          ▸
        </span>
        {summary}
      </summary>
      <div className="px-1 pb-2 pl-5">{children}</div>
    </details>
  );
}

function iconForContact(kind: string): React.ReactNode {
  switch (kind) {
    case "email": return <TbMail />;
    case "phone": return <TbPhone />;
    case "linkedin": return <TbBrandLinkedin />;
    case "github": return <TbBrandGithub />;
    case "location": return <TbMapPin />;
    case "website": return <TbWorldWww />;
    default: return <TbLink />;
  }
}
