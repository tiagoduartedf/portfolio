"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ARTICLES,
  CURRICULUM,
  blogUI,
  walkCurriculum,
  type Article,
  type CurriculumPart,
  type CurriculumSection,
  type CurriculumStep,
} from "../../../data/articles";
import { pathForBlog } from "../../../data/navigation";
import {
  ArrowRightIcon,
  RoadmapIcon,
  SparkleIcon,
  StarFilledIcon,
} from "../icons";
import type { Lang } from "../../../data/cv";
import { chromeFor, hueFor, type PartHue } from "../partHues";

type Props = {
  lang: Lang;
  dark: boolean;
  query: string;
};

/**
 * Roadmap index: track-driven layout. Hero has a small accent dot, then a
 * "trip plan" row that summarizes the three parts, then per-part station
 * blocks (numbered milestones) and finally featured cards.
 */
export default function RoadmapIndex({ lang, dark, query }: Props) {
  const chrome = chromeFor(dark);
  const allSteps = useMemo(() => walkCurriculum(), []);
  const stepByPath = useMemo(() => {
    const m = new Map<string, CurriculumStep>();
    for (const s of allSteps) m.set(s.article.path, s);
    return m;
  }, [allSteps]);

  const featured = useMemo(() => ARTICLES.filter((a) => a.featured), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return allSteps.filter((s) => {
      const a = s.article;
      return (
        a.title.toLowerCase().includes(q) ||
        a.path.toLowerCase().includes(q) ||
        (a.blurb?.[lang] ?? "").toLowerCase().includes(q) ||
        s.sectionTitle[lang].toLowerCase().includes(q) ||
        s.partTitle[lang].toLowerCase().includes(q)
      );
    });
  }, [query, allSteps, lang]);

  // The hero gradient is bumped in dark mode: rgba opacities are wrong on
  // near-black surfaces, so we widen them to keep the wash visible.
  const heroGradient = dark
    ? "radial-gradient(ellipse 55% 60% at 12% 18%, rgba(167,139,250,0.18), transparent 65%), " +
      "radial-gradient(ellipse 50% 55% at 85% 0%, rgba(240,171,252,0.14), transparent 65%), " +
      "radial-gradient(ellipse 40% 45% at 60% 110%, rgba(94,234,212,0.12), transparent 65%)"
    : "radial-gradient(ellipse 55% 60% at 12% 18%, rgba(124,58,237,0.22), transparent 65%), " +
      "radial-gradient(ellipse 50% 55% at 85% 0%, rgba(217,70,239,0.18), transparent 65%), " +
      "radial-gradient(ellipse 40% 45% at 60% 110%, rgba(20,184,166,0.14), transparent 65%)";

  const heroStrap = dark ? "text-violet-300/90" : "text-violet-700/80";
  const heroAccent = dark ? "text-violet-300" : "text-violet-600";
  const heroDivider = dark ? "bg-violet-400/40" : "bg-violet-500/30";

  return (
    <>
      {/* Hero */}
      <header className="relative mb-12 pt-2">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -top-10 -bottom-6 -z-10"
          style={{ backgroundImage: heroGradient }}
        />
        {/* Eyebrow strip. On phones we stack the two labels and drop the rule
         * line so the row never has to wrap. On md+ we restore the inline
         * "BLOG ── study path · 44 stops" layout. The wide tracking is what
         * blew it past the viewport edge before; mobile gets a tighter value. */}
        <div className={`font-mono text-[10.5px] uppercase ${heroStrap}`}>
          <div className="flex items-center gap-2 tracking-[0.22em] md:tracking-[0.3em]">
            <RoadmapIcon size={13} className={heroAccent} />
            <span>{blogUI.blogTab[lang]}</span>
            <span className={`hidden h-px w-12 md:inline-block ${heroDivider}`} />
            <span className="hidden md:inline">
              {lang === "en" ? "study path · 44 stops" : "trilha de estudo · 44 paradas"}
            </span>
          </div>
          <p className={`mt-1 pl-[21px] tracking-[0.18em] md:hidden ${heroStrap}`}>
            {lang === "en" ? "study path · 44 stops" : "trilha · 44 paradas"}
          </p>
        </div>
        <h1 className="mt-4 font-sans text-[44px] font-extrabold leading-[1.02] tracking-tight md:text-[68px]">
          {blogUI.title[lang]}
          <span className={heroAccent}>.</span>
        </h1>
        <p className={`mt-4 max-w-2xl font-sans text-[15.5px] leading-relaxed ${chrome.textMuted}`}>
          {blogUI.subtitle[lang]}
        </p>
        <p className={`mt-2 max-w-2xl font-sans text-[14px] italic leading-relaxed ${chrome.textMuted}`}>
          {blogUI.pathIntro[lang]}
        </p>
      </header>

      {filtered ? (
        <SearchResults results={filtered} lang={lang} dark={dark} />
      ) : (
        <>
          {/* Trip plan: 3 parts overview */}
          <section className="mb-12">
            <SectionHeader
              label={lang === "en" ? "Trip plan" : "Plano de viagem"}
              dark={dark}
            />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {CURRICULUM.map((p, i) => (
                <PartTeaser
                  key={p.slug}
                  part={p}
                  index={i}
                  total={CURRICULUM.length}
                  lang={lang}
                  dark={dark}
                />
              ))}
            </div>
          </section>

          {/* Featured */}
          {featured.length > 0 ? (
            <section className="mb-14">
              <SectionHeader
                icon={<SparkleIcon size={13} className={dark ? "text-violet-300" : "text-violet-400"} />}
                label={blogUI.featured[lang]}
                dark={dark}
              />
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {featured.map((a) => (
                  <FeaturedCard
                    key={a.path}
                    article={a}
                    step={stepByPath.get(a.path)}
                    lang={lang}
                    dark={dark}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {/* Per-part station blocks */}
          <div className="space-y-14">
            {CURRICULUM.map((part) => (
              <PartStation
                key={part.slug}
                part={part}
                lang={lang}
                dark={dark}
                stepByPath={stepByPath}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

/* ─────────── bits ─────────── */
function SectionHeader({
  icon,
  label,
  dark,
}: {
  icon?: React.ReactNode;
  label: string;
  dark: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.3em]">
        {icon}
        {label}
      </span>
      <span className={`h-px flex-1 ${dark ? "bg-violet-400/25" : "bg-violet-500/20"}`} />
    </div>
  );
}

function PartTeaser({
  part,
  index,
  total,
  lang,
  dark,
}: {
  part: CurriculumPart;
  index: number;
  total: number;
  lang: "en" | "pt";
  dark: boolean;
}) {
  const articleCount = countPartArticles(part);
  const hue = hueFor(part.slug, dark);
  const chrome = chromeFor(dark);
  return (
    <Link
      href={`#part-${part.slug}`}
      className={`group relative flex flex-col gap-2 rounded-2xl border bg-gradient-to-br ${hue.cardGrad} p-4 transition hover:scale-[1.01] ${hue.hoverBorder}`}
      style={{ borderColor: `rgba(${hue.rgba},${hue.borderAlpha})` }}
    >
      <div className="flex items-center gap-3">
        <span className="text-[24px] leading-none">{part.emoji}</span>
        <span className={`font-mono text-[10px] uppercase tracking-[0.3em] ${hue.text}`}>
          {blogUI.partLabel[lang]} {part.number}
        </span>
        <span className={`ml-auto font-mono text-[10px] ${chrome.textFaint}`}>
          {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
      </div>
      <h3 className={`font-sans text-[18px] font-extrabold leading-tight tracking-tight ${chrome.textBody}`}>
        {part.title[lang]}
      </h3>
      <p className={`text-[12.5px] leading-snug ${chrome.textMuted}`}>{part.description[lang]}</p>
      <div className={`mt-2 inline-flex items-center gap-1 text-[11.5px] font-semibold ${hue.textDeep}`}>
        {articleCount} {blogUI.notes[lang]}
        <ArrowRightIcon size={12} className="transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function PartStation({
  part,
  lang,
  dark,
  stepByPath,
}: {
  part: CurriculumPart;
  lang: "en" | "pt";
  dark: boolean;
  stepByPath: Map<string, CurriculumStep>;
}) {
  const hue = hueFor(part.slug, dark);
  const chrome = chromeFor(dark);
  return (
    <section id={`part-${part.slug}`}>
      <header
        className="relative mb-6 border-b pb-5"
        style={{ borderColor: `rgba(${hue.rgba},${hue.borderAlpha + 0.02})` }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 right-0 select-none font-sans text-[120px] font-extrabold leading-none tracking-tight"
          style={{ color: `rgba(${hue.rgba},${hue.watermarkAlpha})` }}
        >
          {part.number.padStart(2, "0")}
        </span>
        <div className="flex items-baseline gap-3">
          <span className="text-[38px] leading-none">{part.emoji}</span>
          <div className="flex-1">
            <p className={`font-mono text-[10px] uppercase tracking-[0.4em] ${hue.text}`}>
              {blogUI.partLabel[lang]} {part.number} · {countPartArticles(part)} {blogUI.notes[lang]}
            </p>
            <h2 className={`mt-1 font-sans text-[28px] font-extrabold leading-tight tracking-tight md:text-[34px] ${chrome.textBody}`}>
              {part.title[lang]}
            </h2>
          </div>
        </div>
        <p className={`mt-3 max-w-3xl text-[14.5px] leading-relaxed ${chrome.textMuted}`}>
          {part.description[lang]}
        </p>
      </header>

      <div className="space-y-8">
        {part.sections.map((section) => (
          <SectionStation
            key={section.slug}
            section={section}
            lang={lang}
            dark={dark}
            stepByPath={stepByPath}
            hue={hue}
          />
        ))}
      </div>
    </section>
  );
}

function SectionStation({
  section,
  lang,
  dark,
  stepByPath,
  hue,
}: {
  section: CurriculumSection;
  lang: "en" | "pt";
  dark: boolean;
  stepByPath: Map<string, CurriculumStep>;
  hue: PartHue;
}) {
  const chrome = chromeFor(dark);
  return (
    <div>
      <header className="mb-3 flex items-baseline gap-3">
        {section.number ? (
          <span className={`font-mono text-[11px] font-bold tracking-[0.2em] ${hue.textDeep}`}>
            {section.number}
          </span>
        ) : null}
        <h3 className={`font-sans text-[17px] font-bold leading-tight tracking-tight ${chrome.textBody}`}>
          {section.title[lang]}
        </h3>
        <span
          className="h-px flex-1"
          style={{ backgroundColor: `rgba(${hue.rgba},${hue.borderAlpha})` }}
        />
        <span className={`font-mono text-[10px] uppercase tracking-[0.25em] ${chrome.textFaint}`}>
          {countArticlesIn(section)} {blogUI.notes[lang]}
        </span>
      </header>
      {section.description ? (
        <p className={`mb-3 text-[13.5px] ${chrome.textMuted}`}>{section.description[lang]}</p>
      ) : null}
      <ul className="grid gap-2 lg:grid-cols-2">
        {section.articles.map((a) => (
          <li key={a.path}>
            <StationRow step={stepByPath.get(a.path)} lang={lang} dark={dark} />
          </li>
        ))}
      </ul>
      {section.subSections?.map((sub) => (
        <div
          key={sub.slug}
          className="mt-4 border-l pl-4"
          style={{ borderColor: `rgba(${hue.rgba},${hue.borderAlpha + 0.10})` }}
        >
          <h4 className={`mb-2 font-sans text-[13.5px] font-bold tracking-tight ${chrome.textBody}`}>
            {sub.title[lang]}
          </h4>
          <ul className="grid gap-2 lg:grid-cols-2">
            {sub.articles.map((a) => (
              <li key={a.path}>
                <StationRow step={stepByPath.get(a.path)} lang={lang} dark={dark} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function StationRow({
  step,
  lang,
  dark,
}: {
  step?: CurriculumStep;
  lang: "en" | "pt";
  dark: boolean;
}) {
  if (!step) return null;
  const a = step.article;
  const hue = hueFor(step.partSlug, dark);
  const chrome = chromeFor(dark);
  return (
    <Link
      href={pathForBlog(a.slug)}
      className={`group flex h-full w-full items-start gap-3 rounded-xl border ${chrome.cardBg} px-4 py-3 text-left transition ${hue.hoverBg} ${hue.hoverBorder}`}
      style={{ borderColor: `rgba(${hue.rgba},${hue.borderAlpha - 0.02})` }}
    >
      <span
        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[10px] font-bold ${hue.textDeep}`}
        style={{
          background: `rgba(${hue.rgba},${dark ? 0.16 : 0.12})`,
          border: `1px solid rgba(${hue.rgba},${dark ? 0.36 : 0.28})`,
        }}
        title={`${blogUI.step[lang]} ${step.number}`}
      >
        {String(step.number).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          {a.featured ? (
            <StarFilledIcon size={10} className={`shrink-0 ${hue.text}`} />
          ) : null}
          <span className={`font-sans text-[14px] font-semibold leading-tight ${chrome.textBody}`}>
            {a.title}
          </span>
        </div>
        {a.blurb ? (
          <p className={`mt-1 line-clamp-2 text-[12.5px] leading-snug ${chrome.textMuted}`}>
            {a.blurb[lang]}
          </p>
        ) : (
          <p className={`mt-1 truncate font-mono text-[10.5px] ${chrome.textFaint}`}>{a.path}</p>
        )}
      </div>
      <ArrowRightIcon
        size={14}
        className={`mt-1 shrink-0 transition group-hover:translate-x-0.5 ${hue.text}`}
      />
    </Link>
  );
}

function FeaturedCard({
  article,
  step,
  lang,
  dark,
}: {
  article: Article;
  step?: CurriculumStep;
  lang: "en" | "pt";
  dark: boolean;
}) {
  const hue = hueFor(step?.partSlug, dark);
  const chrome = chromeFor(dark);
  return (
    <Link
      href={pathForBlog(article.slug)}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-br ${hue.cardGrad} p-5 text-left transition ${hue.hoverBorder}`}
      style={{ borderColor: `rgba(${hue.rgba},${hue.borderAlpha + 0.02})` }}
    >
      <span
        className="pointer-events-none absolute -top-7 -right-2 select-none font-sans text-[120px] leading-none"
        style={{ color: `rgba(${hue.rgba},${hue.watermarkAlpha - 0.02})` }}
        aria-hidden
      >
        {step?.partEmoji ?? ""}
      </span>
      <div className="flex items-baseline justify-between gap-3">
        <div className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] ${hue.text}`}>
          <SparkleIcon size={11} className={hue.text} />
          <span>{step?.partTitle[lang]}</span>
        </div>
        {step ? (
          <span className={`font-mono text-[10px] font-bold ${hue.textDeep}`}>
            {blogUI.step[lang]} {String(step.number).padStart(2, "0")}
          </span>
        ) : null}
      </div>
      <h3 className={`mt-3 font-sans text-[19px] font-extrabold leading-tight tracking-tight ${chrome.textBody}`}>
        {article.title}
      </h3>
      {article.blurb ? (
        <p className={`mt-2 flex-1 text-[13px] leading-relaxed ${chrome.textMuted}`}>
          {article.blurb[lang]}
        </p>
      ) : null}
      <div className={`mt-4 inline-flex items-center gap-1 text-[12px] font-semibold ${hue.textDeep}`}>
        {blogUI.pickUp[lang]}
        <ArrowRightIcon size={13} className="transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function SearchResults({
  results,
  lang,
  dark,
}: {
  results: CurriculumStep[];
  lang: "en" | "pt";
  dark: boolean;
}) {
  const chrome = chromeFor(dark);
  return (
    <section>
      <div className="mb-4 flex items-baseline gap-3">
        <h2 className={`font-sans text-[20px] font-bold tracking-tight ${chrome.textBody}`}>
          {blogUI.searchTitle[lang]}
        </h2>
        <span className={`font-mono text-[11px] uppercase tracking-[0.25em] ${chrome.textFaint}`}>
          {results.length}
        </span>
      </div>
      {results.length === 0 ? (
        <p className={`rounded-md border ${chrome.borderHairline} ${chrome.cardBg} p-4 text-[14px] ${chrome.textMuted}`}>
          {blogUI.noResults[lang]}
        </p>
      ) : (
        <ul className="grid gap-2 md:grid-cols-2">
          {results.map((step) => (
            <li key={step.article.path}>
              <StationRow step={step} lang={lang} dark={dark} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ─────────── helpers ─────────── */
function countArticlesIn(section: CurriculumSection): number {
  return (
    section.articles.length +
    (section.subSections?.reduce((acc, s) => acc + s.articles.length, 0) ?? 0)
  );
}
function countPartArticles(part: CurriculumPart): number {
  return part.sections.reduce((acc, s) => acc + countArticlesIn(s), 0);
}
