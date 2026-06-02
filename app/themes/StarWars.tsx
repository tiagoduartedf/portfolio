import type { Bilingual, ContactLink, CV, Education, Lang } from "../data/cv";
import { getDisciplineDetail, experienceAnchorId } from "../data/cv";
import ExperienceShareLink from "../components/ExperienceShareLink";
import { TechIcon, getTechLabel } from "../components/icons/TechIcon";
import { Flag } from "../components/icons/Flag";
import { groupBullets } from "../lib/bullets";
import { experienceDuration } from "../lib/period";
import { parseExperienceSummary } from "../lib/summaryBlocks";
import { dispatchCvNavigate } from "../data/navigation";
import {
  TbBrandGithub,
  TbBrandLinkedin,
  TbLink,
  TbMail,
  TbPhone,
  TbSchool,
  TbWorldWww,
} from "react-icons/tb";
import StarsField from "./StarsField";
import StarWarsCrawl from "./StarWarsCrawl";

type Props = { cv: CV; lang: Lang };

const SW = {
  bg: "#000",
  ink: "#ffe81f",
  inkDim: "#bfae18",
  paper: "#fff",
  white: "#f3f4f6",
  gray: "rgba(243,244,246,0.6)",
  rule: "rgba(255,232,31,0.25)",
  ruleDim: "rgba(255,232,31,0.12)",
  surface: "#0d0c05",
};

export default function StarWars({ cv, lang }: Props) {
  const hologramBlock = (
    <div className="relative pt-3">
      {/* Droid centered above the hologram, with a flickering projector eye */}
      <div className="relative z-20 mx-auto w-fit">
        <DroidIcon />
        <span
          aria-hidden
          className="sw-blink pointer-events-none absolute h-3 w-3 rounded-full"
          style={{
            left: "calc(50% - 6px)",
            top: "8px",
            background:
              "radial-gradient(circle at center, rgba(90,242,255,1) 0%, rgba(90,242,255,0) 75%)",
            filter: "blur(1.5px)",
          }}
        />
      </div>

      {/* Cone of projected light widening from droid to hologram */}
      <div
        aria-hidden
        className="pointer-events-none -mt-2 h-16"
        style={{
          background:
            "linear-gradient(180deg, rgba(90,242,255,0.35) 0%, rgba(90,242,255,0.08) 100%)",
          clipPath: "polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%)",
          filter: "blur(2px)",
        }}
      />

      {/* Hologram lifted slightly to meet the cone */}
      <div className="-mt-3">
        <ContactHologram
          name={cv.name}
          headline={cv.headline}
          tagline={cv.tagline}
          disciplines={cv.disciplines}
          education={cv.education}
          contacts={cv.contacts}
          lang={lang}
        />
      </div>
    </div>
  );

  const crawlBlock = (
    <>
      {/* SW lore intro leading into the crawl. */}
      <p
        className="text-center font-sans text-[14px] leading-tight tracking-[0.3em] md:text-[16px]"
        style={{ color: SW.ink, opacity: 0.7 }}
      >
        {lang === "en"
          ? "A long time ago in a galaxy far, far away…"
          : "Há muito tempo, numa galáxia muito, muito distante…"}
      </p>

      <p
        className="mt-4 text-center font-sans text-[11px] uppercase tracking-[0.5em]"
        style={{ color: SW.inkDim }}
      >
        {lang === "en" ? "Episode IV: A New Career" : "Episódio IV: Uma Nova Carreira"}
      </p>

      {/* Animated crawl, paused until scrolled into view so the user reads from
          the start, not from wherever the looping animation happens to be. */}
      <StarWarsCrawl cv={cv} lang={lang} />
    </>
  );

  return (
    <article className="theme-starwars relative w-full min-h-screen overflow-hidden bg-black text-white print:shadow-none">
      <StarsField />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 py-10 md:px-10 md:py-14">
        {crawlBlock}
        <div className="mt-16">{hologramBlock}</div>

        {/* EXPERIENCE */}
        <Section
          id="cv-experience"
          title={lang === "en" ? "Service Record" : "Folha de Serviço"}
          subtitle={lang === "en" ? "Missions completed" : "Missões cumpridas"}
          icon={<SaberIcon />}
        >
          <div className="space-y-4">
            {cv.experience.map((exp, i) => {
              const duration = experienceDuration(exp.period);
              return (
              <article
                key={exp.company + exp.period.en}
                id={experienceAnchorId(exp.company)}
                className="grid gap-4 scroll-mt-24 rounded border p-5 backdrop-blur md:grid-cols-[200px_1fr]"
                style={{ borderColor: SW.rule, backgroundColor: SW.surface }}
              >
                <div>
                  <div
                    className="font-mono text-[10px] uppercase tracking-[0.3em] flex items-center justify-between gap-2"
                    style={{ color: SW.inkDim }}
                  >
                    <span>{lang === "en" ? "Mission" : "Missão"} № {String(i + 1).padStart(2, "0")}</span>
                    <ExperienceShareLink
                      company={exp.company}
                      lang={lang}
                      size={12}
                    />
                  </div>
                  <div className="mt-1 font-sans text-[20px] font-black uppercase leading-tight" style={{ color: SW.ink }}>
                    {exp.company}
                  </div>
                  <div className="mt-1 font-mono text-[11px]" style={{ color: SW.gray }}>
                    {exp.period[lang]}
                    {duration ? ` · ${duration[lang]}` : ""}
                    {exp.location ? ` · ${exp.location[lang]}` : ""}
                  </div>
                </div>
                <div>
                  <h3 className="font-sans text-[16px] font-bold uppercase tracking-wide text-white">
                    {exp.role[lang]}
                  </h3>
                  <div className="mt-2 space-y-2 font-sans text-[14px] text-white/85">
                    {parseExperienceSummary(exp.summary[lang]).map((block, i) => {
                      if (block.kind === "separator") {
                        return (
                          <div
                            key={i}
                            className="my-1 flex items-center gap-3 select-none"
                          >
                            <span className="h-px flex-1 bg-white/15" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                              {block.text}
                            </span>
                            <span className="h-px flex-1 bg-white/15" />
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
                  <div className="mt-2 space-y-2 font-sans text-[13.5px] text-white/85">
                    {groupBullets(exp.bullets[lang]).map((g, gi) => (
                      <div key={gi} className="space-y-1">
                        {g.intro ? (
                          <p className="text-white/55">{g.intro}</p>
                        ) : null}
                        {g.items.length > 0 ? (
                          <ul className="space-y-1">
                            {g.items.map((b, j) => (
                              <li key={j} className="flex gap-2">
                                <span style={{ color: SW.ink }}>›</span>
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
                          className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/80"
                          style={{ borderColor: SW.ruleDim }}
                        >
                          <TechIcon name={s} size={11} />
                          {getTechLabel(s)}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
              );
            })}
          </div>
        </Section>

        {/* SKILLS */}
        <Section
          id="cv-skills"
          title={lang === "en" ? "Force Abilities" : "Habilidades da Força"}
          subtitle={lang === "en" ? "Toolkit & disciplines" : "Ferramentas & disciplinas"}
          icon={<YodaIcon />}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cv.skills.map((g) => (
              <div
                key={g.label.en}
                className="rounded border p-5"
                style={{ borderColor: SW.rule, backgroundColor: SW.surface }}
              >
                <div className="flex items-baseline justify-between border-b pb-1.5" style={{ borderColor: SW.ruleDim }}>
                  <h3 className="font-sans text-[16px] font-bold uppercase tracking-wider" style={{ color: SW.ink }}>
                    {g.label[lang]}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: SW.gray }}>
                    {g.items.length} {lang === "en" ? "items" : "itens"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 rounded border px-2 py-1 font-mono text-[11px] text-white/85"
                      style={{ borderColor: SW.ruleDim, background: "rgba(0,0,0,0.4)" }}
                    >
                      <TechIcon name={s} size={12} />
                      {getTechLabel(s)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* LANGUAGES */}
        <Section
          id="cv-languages"
          title={lang === "en" ? "Galactic Languages" : "Línguas Galácticas"}
          subtitle={lang === "en" ? "Spoken across systems" : "Faladas pelos sistemas"}
          icon={<TieIcon />}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {cv.languages.map((l) => (
              <div
                key={l.name.en}
                className="rounded border p-5"
                style={{ borderColor: SW.rule, backgroundColor: SW.surface }}
              >
                <div className="flex items-center gap-3 border-b pb-2" style={{ borderColor: SW.ruleDim }}>
                  <Flag code={l.flag} size={26} />
                  <div className="flex flex-1 items-baseline justify-between">
                    <h4 className="font-sans text-[16px] font-bold" style={{ color: SW.ink }}>
                      {l.name[lang]}
                    </h4>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: SW.gray }}>
                      {l.level[lang]}
                    </span>
                  </div>
                </div>
                <p className="mt-2 font-sans text-[13px] text-white/85">
                  {l.details[lang]}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Academy Training section removed: courses dropped entirely;
            education moved into the contact hologram as part of the
            dossier transmission. */}

        {/* Projects section removed pending DLOA authorization for product
            screenshots. Droid + projection cone that used to live here
            moved up to the contact section (see ContactHologram intro). */}

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center gap-2 border-t pt-6 text-center" style={{ borderColor: SW.rule }}>
          <p
            className="sw-glow font-sans text-[12px] uppercase tracking-[0.5em]"
            style={{ color: SW.ink }}
          >
            {lang === "en" ? "May the Force be with you" : "Que a Força esteja com você"}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: SW.gray }}>
            © {cv.name} · {lang === "en" ? "Republic Year" : "Ano da República"} 2026
          </p>
        </footer>
      </div>
    </article>
  );
}

function Section({
  title,
  subtitle,
  children,
  id,
  hologram,
  icon,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  id?: string;
  hologram?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-24">
      {/* Mobile stacks title on its own line and subtitle below; desktop
          keeps the doc-header row (icon + title + divider + subtitle). */}
      <div className="mb-6 flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
        <div className="flex items-center gap-3">
          {icon ? <span className="shrink-0" aria-hidden>{icon}</span> : null}
          <h2
            className={`font-sans text-[28px] font-black uppercase leading-none tracking-tight md:text-[36px] ${
              hologram ? "sw-holo" : ""
            }`}
            style={hologram ? undefined : { color: SW.ink }}
          >
            {title}
          </h2>
        </div>
        <span
          className="hidden h-px flex-1 md:block"
          style={{
            background: hologram
              ? "linear-gradient(90deg, rgba(90,242,255,0.5), transparent)"
              : `linear-gradient(90deg, ${SW.rule}, transparent)`,
          }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-[0.4em]"
          style={{ color: hologram ? "#5af2ff" : SW.inkDim, opacity: hologram ? 0.85 : 1 }}
        >
          {subtitle}
        </span>
      </div>
      {children}
    </section>
  );
}

/* ─────────── Inline section icons (next to each section title) ─────────── */

/** A single flat face of the saber, blade + hilt stack. */
function SaberFace() {
  const BLADE = "#4ea0ff";
  const BLADE_HOT = "#aedcff";
  return (
    <>
      <span
        className="block"
        style={{
          width: "9px",
          height: "60px",
          borderRadius: "9999px 9999px 0 0",
          background: `linear-gradient(90deg, ${BLADE} 0%, ${BLADE_HOT} 30%, #ffffff 50%, ${BLADE_HOT} 70%, ${BLADE} 100%)`,
          boxShadow: `0 0 8px ${BLADE}, 0 0 18px ${BLADE}cc, 0 0 36px ${BLADE}55`,
        }}
      />
      <span
        className="block"
        style={{
          width: "13px",
          height: "5px",
          background: "linear-gradient(90deg, #2a2a2a, #707070 50%, #2a2a2a)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      />
      <span
        className="relative block"
        style={{
          width: "12px",
          height: "14px",
          background:
            "linear-gradient(90deg, #1a1a1a 0%, #707070 28%, #2a2a2a 50%, #707070 72%, #1a1a1a 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
        }}
      >
        <span
          className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "#cc1818", boxShadow: "0 0 4px rgba(255,80,80,0.7)" }}
        />
      </span>
      <span
        className="block"
        style={{
          width: "11px",
          height: "5px",
          borderRadius: "0 0 2px 2px",
          background: "linear-gradient(90deg, #1a1a1a, #4a4a4a 50%, #1a1a1a)",
        }}
      />
    </>
  );
}

/** Lightsaber, two perpendicular flat faces rotated together to fake a 3D cylinder.
 * When one face goes edge-on, the other is showing, saber never collapses to a line. */
function SaberIcon() {
  return (
    <span
      aria-hidden
      className="relative inline-block"
      style={{ width: "44px", height: "96px", perspective: "220px" }}
    >
      <span
        className="sw-saber-spin3d absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <SaberFace />
        </span>
        <span
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: "rotateY(90deg)" }}
        >
          <SaberFace />
        </span>
      </span>
    </span>
  );
}

/* ─────────── Contact hologram (full-width holographic transmission) ─────────── */

function ContactHologram({
  name,
  headline,
  tagline,
  disciplines,
  education,
  contacts,
  lang,
}: {
  name: string;
  headline: Bilingual;
  tagline: Bilingual;
  disciplines: string[];
  education: Education[];
  contacts: ContactLink[];
  lang: Lang;
}) {
  // Skip the location, this is a comm channel, not an address.
  const visible = contacts.filter((c) => c.kind !== "location");
  return (
    <section
      id="cv-contact"
      className="relative scroll-mt-24 overflow-hidden rounded-md border"
      style={{
        borderColor: "rgba(90,242,255,0.45)",
        background:
          "radial-gradient(ellipse at top, rgba(90,242,255,0.08) 0%, transparent 70%), #050810",
        boxShadow:
          "0 0 30px -10px rgba(90,242,255,0.5), inset 0 0 30px rgba(90,242,255,0.05)",
      }}
    >
      <div className="relative px-8 py-12 md:px-12 md:py-14">
        {/* Header band: BigJedi on the left as the projected presenter,
            and on the right a Notion-style document header that fills
            the BigJedi's vertical space with name + meta + headline +
            tagline + disciplines + contacts + education, all inline /
            compact so nothing stacks taller than it needs to. */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-10">
          <div className="mx-auto shrink-0 md:mx-0">
            <BigJediProjector />
          </div>

          <div className="min-w-0 flex-1 text-center md:text-left">
            {/* Name + meta on the same baseline, doc-header style. */}
            <div className="flex flex-col gap-x-6 gap-y-2 md:flex-row md:items-baseline md:justify-between">
              <h1
                className="sw-holo whitespace-nowrap font-sans font-black uppercase leading-[0.9] tracking-[-0.02em]"
                style={{
                  color: "#5af2ff",
                  // Min 30px so "TIAGO DUARTE" fits inside the
                  // hologram's content area on narrow phones without
                  // overflowing past the cyan border.
                  fontSize: "clamp(30px, 6vw, 76px)",
                }}
              >
                {name}
              </h1>
              <div
                className="sw-holo font-mono md:shrink-0 md:text-right"
                style={{ color: "#5af2ff" }}
                title={lang === "en" ? "Last updated" : "Última atualização"}
              >
                <div className="flex items-baseline justify-center gap-3 md:justify-end">
                  <span className="text-[10px] uppercase tracking-[0.4em]">
                    Curriculum Vitae
                  </span>
                  <span
                    aria-hidden
                    className="h-3 w-px"
                    style={{ backgroundColor: "rgba(90,242,255,0.4)" }}
                  />
                  <span className="text-[11px]" suppressHydrationWarning>
                    {(() => {
                      const d = new Date();
                      const dd = String(d.getDate()).padStart(2, "0");
                      const mm = String(d.getMonth() + 1).padStart(2, "0");
                      return `${dd}/${mm}/${d.getFullYear()}`;
                    })()}
                  </span>
                </div>
                <p
                  className="mt-0.5 whitespace-nowrap text-[10px]"
                  style={{ opacity: 0.8 }}
                >
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

            <p
              className="sw-holo mt-5 font-sans text-[16px] font-bold uppercase tracking-[0.2em] md:text-[18px]"
              style={{ color: "#5af2ff" }}
            >
              {headline[lang]}
            </p>
            <p
              className="sw-holo mt-2 font-serif text-[16px] italic leading-snug md:text-[17px]"
              style={{ color: "#5af2ff", opacity: 0.9 }}
            >
              {tagline[lang]}
            </p>

            {/* Disciplines as an inline "label: desc" list. Mobile
                stacks one per line (each pair was wrapping mid-string
                otherwise); desktop keeps the flex-wrap row layout. */}
            <dl className="sw-holo mt-6 flex flex-col items-center gap-1.5 text-[13.5px] md:flex-row md:flex-wrap md:items-baseline md:gap-x-7 md:gap-y-1.5">
              {disciplines.map((d) => {
                const details = getDisciplineDetail(d);
                return (
                  <div key={d} className="flex items-baseline gap-1.5">
                    <dt className="font-bold" style={{ color: "#5af2ff" }}>
                      {d}
                    </dt>
                    {details ? (
                      <dd className="text-white/85">{details[lang]}</dd>
                    ) : null}
                  </div>
                );
              })}
            </dl>

            {/* Contacts on the left + education pushed right via
                ml-auto so the two clusters share one row on desktop.
                Sizes tuned so all 5 items fit on a single line at
                1360x768 — anything wider just keeps fitting; narrower
                viewports wrap naturally. */}
            <div className="sw-holo mt-6 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2 text-[12.5px] md:justify-start">
              {visible.map((c) => (
                <a
                  key={c.kind}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group inline-flex items-baseline gap-1.5"
                  title={c.label}
                >
                  <span
                    className="self-center text-[13px]"
                    style={{ color: "#5af2ff", opacity: 0.85 }}
                  >
                    {iconForContact(c.kind)}
                  </span>
                  <span className="font-mono group-hover:underline md:whitespace-nowrap">
                    {c.display}
                  </span>
                </a>
              ))}
              {education.length > 0
                ? education.map((e) => (
                    <span
                      key={e.institution}
                      // Star Wars only renders the degree (no
                      // institution / period) to keep the contacts
                      // row on one line on desktop. Full education
                      // detail still lives in cv.education and shows
                      // up in the other themes.
                      className="inline-flex items-baseline gap-x-1.5 md:ml-auto md:whitespace-nowrap"
                      title={`${e.degree[lang]} · ${e.institution}${e.period ? ` · ${e.period}` : ""}`}
                    >
                      <span
                        className="self-center text-[13px]"
                        style={{ color: "#5af2ff", opacity: 0.85 }}
                      >
                        <TbSchool />
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: "#5af2ff" }}
                      >
                        {e.degree[lang]}
                      </span>
                    </span>
                  ))
                : null}
            </div>
          </div>
        </div>

        {/* Scanlines + sweep overlays */}
        <div className="sw-holo-scan" />
        <div className="sw-holo-sweep" />

        {/* Emitter glow at the bottom edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-3 mx-auto h-6 w-[60%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(90,242,255,0.55) 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
      </div>
    </section>
  );
}

/** Icon picker for the contact properties strip inside ContactHologram.
 *  Mirrors the helper in Notion so the same set of contact kinds gets
 *  the same set of icons across themes. */
function iconForContact(kind: string): React.ReactNode {
  switch (kind) {
    case "email":
      return <TbMail />;
    case "phone":
      return <TbPhone />;
    case "linkedin":
      return <TbBrandLinkedin />;
    case "github":
      return <TbBrandGithub />;
    case "website":
      return <TbWorldWww />;
    default:
      return <TbLink />;
  }
}

/** Big projector with the Jedi Master speaking, 4× the size of the inline option. */
function BigJediProjector() {
  return (
    <span aria-hidden className="relative inline-block" style={{ width: 190, height: 245 }}>
      <svg viewBox="0 0 80 110" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <path
          d="M 22 96 L 58 96 L 70 12 L 10 12 Z"
          fill="rgba(90,242,255,0.07)"
          stroke="rgba(90,242,255,0.25)"
          strokeWidth="0.6"
        />
        <JediBody />
        <g opacity="0.45">
          {[18, 28, 38, 48, 58, 68, 78, 88].map((y) => (
            <line key={y} x1="14" y1={y} x2="66" y2={y} stroke="#5af2ff" strokeWidth="0.6" />
          ))}
        </g>
        <ellipse cx="40" cy="100" rx="22" ry="5" fill="#0c2a30" stroke="#5af2ff" strokeWidth="0.6" />
        <ellipse cx="40" cy="98" rx="18" ry="3" fill="#143a44" />
        <ellipse cx="40" cy="97" rx="12" ry="1.6" fill="#5af2ff" opacity="0.6">
          <animate attributeName="opacity" values="0.4;0.85;0.4" dur="2s" repeatCount="indefinite" />
        </ellipse>
      </svg>
    </span>
  );
}

/** Hooded Jedi master (Qui-Gon / Obi-Wan style), peaked hood, peaceful face, white beard. */
function JediBody() {
  return (
    <g className="sw-holo">
      {/* Hood, peaked top with curved sides, drapes down to shoulders */}
      <path
        d="
          M 18 30
          Q 18 14, 32 12
          Q 40 8, 48 12
          Q 62 14, 62 30
          L 64 56
          Q 60 60, 56 58
          L 56 90
          L 24 90
          L 24 58
          Q 20 60, 16 56
          Z
        "
        fill="rgba(90,242,255,0.45)"
        stroke="rgba(90,242,255,0.8)"
        strokeWidth="0.7"
      />
      {/* Inner hood shadow surrounding the face */}
      <path
        d="
          M 26 32
          Q 26 22, 40 20
          Q 54 22, 54 32
          L 54 50
          Q 48 54, 40 54
          Q 32 54, 26 50
          Z
        "
        fill="rgba(0,0,0,0.45)"
      />
      {/* Face, pale oval, lit by the projection */}
      <ellipse cx="40" cy="34" rx="11" ry="12" fill="rgba(120,238,255,0.55)" />
      {/* Eyebrows, peaceful arched */}
      <path d="M 32 30 Q 35 28 38 30" stroke="rgba(0,0,0,0.5)" strokeWidth="1" fill="none" />
      <path d="M 42 30 Q 45 28 48 30" stroke="rgba(0,0,0,0.5)" strokeWidth="1" fill="none" />
      {/* Closed / serene eyes (just slits) */}
      <path d="M 32 33 L 38 33" stroke="rgba(0,0,0,0.6)" strokeWidth="0.9" />
      <path d="M 42 33 L 48 33" stroke="rgba(0,0,0,0.6)" strokeWidth="0.9" />
      {/* Nose hint */}
      <path d="M 40 35 L 40 38" stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" />
      {/* Mustache, white, two halves */}
      <path
        d="M 31 40 Q 36 43 40 41 Q 44 43 49 40 L 47 42 Q 42 45 38 45 Q 34 45 33 42 Z"
        fill="rgba(220,250,255,0.85)"
      />
      {/* Beard, full white, pointed downward */}
      <path
        d="
          M 30 41
          Q 34 50, 40 52
          Q 46 50, 50 41
          L 49 56
          Q 44 60, 40 60
          Q 36 60, 31 56
          Z
        "
        fill="rgba(220,250,255,0.85)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.4"
      />
      {/* Hood fold lines (subtle) */}
      <path d="M 22 38 Q 22 50 26 56" stroke="rgba(90,242,255,0.5)" strokeWidth="0.6" fill="none" />
      <path d="M 58 38 Q 58 50 54 56" stroke="rgba(90,242,255,0.5)" strokeWidth="0.6" fill="none" />
      {/* Robe collar V */}
      <path d="M 32 60 L 40 70 L 48 60" stroke="rgba(90,242,255,0.7)" strokeWidth="0.8" fill="rgba(0,0,0,0.25)" />
      {/* Belt */}
      <rect x="24" y="76" width="32" height="2" fill="rgba(90,242,255,0.95)" />
    </g>
  );
}

/** R2-D2-style droid, colored small icon for the Holocron Archive section. */
function DroidIcon() {
  return (
    <span aria-hidden className="inline-flex h-12 w-10 items-center">
      <svg viewBox="0 0 40 48" className="h-full w-full">
        {/* Antenna */}
        <line x1="20" y1="6" x2="20" y2="2" stroke="#5a6770" strokeWidth="0.8" />
        <circle cx="20" cy="2" r="0.8" fill="#5a6770" />
        {/* Dome head, silver/white half-circle */}
        <path
          d="M 8 18 A 12 10 0 0 1 32 18 L 32 22 L 8 22 Z"
          fill="#e3e8eb"
          stroke="#5a6770"
          strokeWidth="0.6"
        />
        {/* Dome side panels */}
        <rect x="11" y="11" width="3" height="2.5" fill="#234960" stroke="#5a6770" strokeWidth="0.3" />
        <rect x="26" y="11" width="3" height="2.5" fill="#234960" stroke="#5a6770" strokeWidth="0.3" />
        {/* Central main eye */}
        <circle cx="20" cy="14" r="3" fill="#0a0a0a" stroke="#5a6770" strokeWidth="0.5" />
        <circle cx="20" cy="14" r="1.4" fill="#3fa9f5">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Small holoprojector */}
        <circle cx="14" cy="12" r="0.7" fill="#3fa9f5" />
        {/* Body cylinder */}
        <rect x="9" y="22" width="22" height="20" fill="#ffffff" stroke="#5a6770" strokeWidth="0.6" />
        {/* Big rectangular body panel, blue accent */}
        <rect x="11" y="24" width="18" height="3.5" fill="#3fa9f5" stroke="#1f5e80" strokeWidth="0.4" />
        {/* Circular detail */}
        <circle cx="20" cy="32" r="2.2" fill="#bcc4c8" stroke="#234960" strokeWidth="0.5" />
        <circle cx="20" cy="32" r="0.8" fill="#3fa9f5" />
        {/* Small data port (red) */}
        <rect x="13" y="36.5" width="3" height="2" fill="#cc3030" stroke="#5a6770" strokeWidth="0.3" />
        {/* Lower grille line */}
        <line x1="11" y1="40" x2="29" y2="40" stroke="#5a6770" strokeWidth="0.4" />
        {/* Legs */}
        <path d="M 9 36 L 5 46 L 9 46 L 11 38 Z" fill="#bcc4c8" stroke="#5a6770" strokeWidth="0.4" />
        <path d="M 31 36 L 35 46 L 31 46 L 29 38 Z" fill="#bcc4c8" stroke="#5a6770" strokeWidth="0.4" />
        {/* Foot pads */}
        <rect x="3" y="46" width="8" height="2" fill="#5a6770" />
        <rect x="29" y="46" width="8" height="2" fill="#5a6770" />
      </svg>
    </span>
  );
}

/** TIE fighter, small inline icon with red cockpit glow. */
function TieIcon() {
  return (
    <span aria-hidden className="inline-flex h-9 w-12 items-center">
      <svg viewBox="0 0 60 30" className="h-full w-full">
        {/* Left hex panel */}
        <polygon points="3,4 13,1 19,15 13,29 3,26" fill="#3a3a3a" stroke="#0a0a0a" strokeWidth="0.5" />
        <polygon points="5,6 11,4 16,15 11,26 5,24" fill="none" stroke="#1a1a1a" strokeWidth="0.4" />
        {/* Right hex panel */}
        <polygon points="57,4 47,1 41,15 47,29 57,26" fill="#3a3a3a" stroke="#0a0a0a" strokeWidth="0.5" />
        <polygon points="55,6 49,4 44,15 49,26 55,24" fill="none" stroke="#1a1a1a" strokeWidth="0.4" />
        {/* Struts */}
        <rect x="19" y="14" width="7" height="1.5" fill="#5a5a5a" />
        <rect x="34" y="14" width="7" height="1.5" fill="#5a5a5a" />
        {/* Cockpit ball */}
        <circle cx="30" cy="15" r="5" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="0.5" />
        <circle cx="30" cy="15" r="3" fill="#0a0a0a" />
        <circle cx="30" cy="15" r="1.4" fill="#ff3a3a">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </span>
  );
}

/** Yoda, small floating icon. */
function YodaIcon() {
  return (
    <span aria-hidden className="sw-float inline-flex h-10 w-9 items-center">
      <svg viewBox="0 0 36 40" className="h-full w-full">
        {/* Ears */}
        <path d="M3 14 L9 10 L10 18 Z" fill="#7c8a52" stroke="#3a4626" strokeWidth="0.6" />
        <path d="M33 14 L27 10 L26 18 Z" fill="#7c8a52" stroke="#3a4626" strokeWidth="0.6" />
        {/* Head */}
        <ellipse cx="18" cy="16" rx="11" ry="9" fill="#9aac68" stroke="#3a4626" strokeWidth="0.7" />
        {/* Eyes */}
        <ellipse cx="14" cy="17" rx="1.4" ry="1.1" fill="#3a3a3a" />
        <ellipse cx="22" cy="17" rx="1.4" ry="1.1" fill="#3a3a3a" />
        <circle cx="14.4" cy="16.7" r="0.3" fill="#fff" />
        <circle cx="22.4" cy="16.7" r="0.3" fill="#fff" />
        {/* Mouth */}
        <path d="M15 21 Q18 22.5 21 21" stroke="#3a4626" strokeWidth="0.6" fill="none" />
        {/* Robe */}
        <path d="M9 26 Q18 22 27 26 L29 39 L7 39 Z" fill="#6a5a3a" stroke="#3a3022" strokeWidth="0.6" />
        <path d="M18 26 L18 38" stroke="#3a3022" strokeWidth="0.5" />
      </svg>
    </span>
  );
}


