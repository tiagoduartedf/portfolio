"use client";

import { useEffect, useRef, useState } from "react";
import type { CV, Lang } from "../data/cv";

const SW_INK = "#ffe81f";

export default function StarWarsCrawl({ cv, lang }: { cv: CV; lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      // Fires while the box is still well below the viewport so the animation
      // has time to bring the headline into the opaque mask band before the
      // user scrolls the box into view. 1500px is generous on mobile, where
      // the inner crawl text wraps to ~2× the desktop height.
      { threshold: 0, rootMargin: "0px 0px 1500px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const playState = running ? "running" : "paused";

  return (
    <div
      ref={ref}
      className="relative mx-auto mt-12 h-[340px] w-full max-w-[1400px] overflow-hidden md:h-[480px]"
      style={{
        perspective: "500px",
        // Wider opaque band (10% top, 90% bottom fade) so more of the
        // text is plainly visible on landing; the previous 18/78
        // window cut tight against the headline at the entry pre-roll
        // and left users feeling there was nothing in the box.
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, #000 10%, #000 90%, transparent 100%)",
        maskImage:
          "linear-gradient(180deg, transparent 0%, #000 10%, #000 90%, transparent 100%)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: "rotateX(22deg)",
          transformOrigin: "50% 100%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Animation duration / delay / fill-mode live in `.sw-crawl` so a mobile
            media query can re-tune them, since the inner text is ~2× taller on
            narrow viewports, so the desktop pre-roll leaves the headline below
            the mask. Only `animationPlayState` stays inline because it's
            driven by the IntersectionObserver. */}
        <div
          className="absolute inset-x-0 sw-crawl origin-top px-6 pt-2 pb-6 text-justify md:px-10 md:pb-10"
          style={{
            color: SW_INK,
            animationPlayState: playState,
            fontFamily: "var(--font-sw-crawl), 'ITC Franklin Gothic', 'Franklin Gothic Demi', 'Arial Narrow', sans-serif",
          }}
        >
          <p className="text-center text-[36px] font-bold uppercase leading-tight tracking-[0.04em] md:text-[52px]">
            {cv.headline[lang]}.
          </p>
          {cv.summary[lang].split(/\n\n+/).map((p, i) => (
            <p
              key={i}
              className="mt-8 text-[26px] leading-[1.35] tracking-[0.01em] md:text-[36px]"
            >
              {p}
            </p>
          ))}
          <p className="mt-8 text-center text-[26px] leading-[1.35] tracking-[0.01em] md:text-[36px]">
            {lang === "en"
              ? "May the Force be with you."
              : "Que a Força esteja com você."}
          </p>
        </div>
      </div>
    </div>
  );
}
