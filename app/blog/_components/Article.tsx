"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import Link from "next/link";
import { articleBySlug, blogUI, findCurriculumStep } from "../../data/articles";
import type { Lang } from "../../data/cv";
import { pathForBlog } from "../../data/navigation";
import { withBase } from "../../lib/basePath";
import RoadmapSidebar from "./variants/RoadmapSidebar";
import { ArrowLeftIcon, MenuIcon } from "./icons";
import { chromeFor, hueFor } from "./partHues";

type Props = {
  slug: string;
  lang: Lang;
  dark: boolean;
};

export default function Article({ slug, lang, dark }: Props) {
  const article = useMemo(() => articleBySlug(slug), [slug]);
  const path = article?.path;
  const step = useMemo(() => (path ? findCurriculumStep(path) : undefined), [path]);
  const hue = hueFor(step?.partSlug, dark);
  const chrome = chromeFor(dark);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [query, setQuery] = useState("");

  const articleDir = useMemo(() => {
    if (!path) return "";
    const i = path.lastIndexOf("/");
    return i === -1 ? "" : path.slice(0, i);
  }, [path]);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    fetch(withBase(`/articles/${path}`))
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((text) => {
        if (!cancelled) setContent(text);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!article) return null;

  const skeletonBar = dark ? "bg-white/10" : "bg-black/10";
  const buttonPill = `inline-flex items-center gap-2 rounded-full border ${chrome.borderHairline} ${chrome.cardBg} px-3 py-1.5 text-[12px] font-semibold`;

  return (
    <div className={`w-full pl-3 pr-4 pb-24 pt-2 md:pl-6 md:pr-8 ${chrome.textBody}`}>
      <div className="mb-4 flex items-center justify-between md:hidden">
        <button
          type="button"
          onClick={() => setMobileSidebar(true)}
          className={buttonPill}
        >
          <MenuIcon size={14} />
          {blogUI.openTree[lang]}
        </button>
        <Link href={pathForBlog()} className={`${buttonPill} gap-1.5`}>
          <ArrowLeftIcon size={13} />
          {blogUI.back[lang]}
        </Link>
      </div>

      <div className="grid gap-x-10 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)]">
        <RoadmapSidebar
          lang={lang}
          dark={dark}
          activeSlug={slug}
          query={query}
          onQueryChange={setQuery}
          mobileOpen={mobileSidebar}
          onMobileClose={() => setMobileSidebar(false)}
        />

        <article className="min-w-0">
          <div className="mb-6 hidden md:block">
            <Link
              href={pathForBlog()}
              className={`${buttonPill} transition ${hue.hoverBorder} ${hue.hoverBg}`}
            >
              <ArrowLeftIcon size={13} />
              {blogUI.back[lang]}
            </Link>
          </div>

          <header
            className="border-b pb-6"
            style={{ borderColor: `rgba(${hue.rgba},${hue.borderAlpha + 0.04})` }}
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${hue.text}`}>
                {step?.partEmoji} {step?.partTitle[lang]}
              </p>
              {step ? (
                <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${chrome.textMuted}`}>
                  · {step.sectionTitle[lang]}
                  {step.subSectionTitle ? ` · ${step.subSectionTitle[lang]}` : ""}
                </p>
              ) : null}
              {step ? (
                <span className={`ml-auto rounded-md ${hue.pillBg} px-2 py-0.5 font-mono text-[10px] font-bold ${hue.pillText}`}>
                  {blogUI.step[lang]} {String(step.number).padStart(2, "0")}
                </span>
              ) : null}
            </div>
            <h1 className="mt-3 font-sans text-[32px] font-extrabold leading-[1.1] tracking-tight md:text-[44px]">
              {article.title}
            </h1>
            {article.blurb ? (
              <p className={`mt-3 font-sans text-[16px] leading-relaxed ${chrome.textMuted}`}>
                {article.blurb[lang]}
              </p>
            ) : null}
            <p className={`mt-3 font-mono text-[11px] ${chrome.textMuted}`}>{article.path}</p>
          </header>

          <div className={`prose-cv mt-8 ${dark ? "prose-cv--dark" : ""}`}>
            {error ? (
              <div className={`rounded-md ${hue.pillBg} p-4 text-[14px] ${hue.pillText}`}>
                {blogUI.loadError[lang]}
              </div>
            ) : content == null ? (
              <SkeletonLines barClass={skeletonBar} />
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  a: ({ href, ...rest }) => (
                    <a
                      {...rest}
                      href={resolveAssetHref(href, articleDir)}
                      target="_blank"
                      rel="noreferrer"
                    />
                  ),
                  img: ({ src, alt, ...rest }) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      {...rest}
                      src={resolveAssetHref(typeof src === "string" ? src : undefined, articleDir)}
                      alt={alt ?? ""}
                    />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

function resolveAssetHref(raw: string | undefined, articleDir: string): string | undefined {
  if (!raw) return raw;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|mailto:|tel:)/i.test(raw)) return raw;
  if (raw.startsWith("/")) return raw;
  const cleaned = raw.replace(/^\.\//, "");
  return articleDir ? `/articles/${articleDir}/${cleaned}` : `/articles/${cleaned}`;
}

function SkeletonLines({ barClass }: { barClass: string }) {
  return (
    <div className="space-y-3">
      <div className={`h-6 w-3/5 rounded ${barClass}`} />
      <div className={`h-4 w-full rounded ${barClass}`} />
      <div className={`h-4 w-11/12 rounded ${barClass}`} />
      <div className={`h-4 w-10/12 rounded ${barClass}`} />
      <div className={`mt-6 h-32 w-full rounded ${barClass}`} />
      <div className={`h-4 w-full rounded ${barClass}`} />
      <div className={`h-4 w-9/12 rounded ${barClass}`} />
    </div>
  );
}
