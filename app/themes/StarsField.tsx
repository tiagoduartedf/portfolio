"use client";

import { useEffect, useRef } from "react";

const STAR_COUNT = 600;
const VIEW_W = 1200;
const VIEW_H = 800;

type Star = {
  cx: number;
  cy: number;
  r: number;
  tone: string;
  opacity: number;
  twinkle: boolean;
  delay: number;
  dur: number;
};

function tint(roll: number): string {
  if (roll < 78) return "#ffffff";
  if (roll < 90) return "#dde6ff";
  if (roll < 96) return "#fff5cf";
  return "#ffe1b4";
}

const STARS: Star[] = Array.from({ length: STAR_COUNT }, (_, i) => {
  const cx = (i * 977 + 31) % VIEW_W;
  const cy = (i * 613 + 47) % VIEW_H;
  const sizeRoll = (i * 7) % 100;
  let r: number;
  if (sizeRoll < 65) r = 1.0 + ((i * 11) % 6) / 12;
  else if (sizeRoll < 88) r = 1.8 + ((i * 13) % 8) / 10;
  else if (sizeRoll < 96) r = 2.6 + ((i * 17) % 10) / 8;
  else r = 3.6 + ((i * 19) % 14) / 8;
  return {
    cx: (cx / VIEW_W) * 100,
    cy: (cy / VIEW_H) * 100,
    r,
    tone: tint((i * 41) % 100),
    opacity: 0.45 + ((i * 19) % 7) / 10,
    twinkle: i % 3 === 0,
    delay: ((i * 137) % 50) / 10,
    dur: 2 + (i % 5),
  };
});

export default function StarsField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastY = window.scrollY;
    let lastT = performance.now();
    let intensity = 0;
    let direction = 1;
    let raf = 0;
    let scrolling = false;
    let stopTimer: number | null = null;

    const tick = () => {
      raf = 0;
      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      const dy = window.scrollY - lastY;
      const v = Math.abs(dy) / dt; // px / ms
      const target = Math.min(v / 0.4, 1);
      // Progressive ramp-up while scrolling, faster release so the streaks
      // collapse back to dots quickly when scrolling stops.
      intensity += (target - intensity) * (target > intensity ? 0.18 : 0.22);
      if (intensity < 0.003) intensity = 0;
      if (Math.abs(dy) > 0.3) direction = dy > 0 ? -1 : 1;

      el.style.setProperty("--streak", intensity.toFixed(3));
      el.style.setProperty("--streak-dir", String(direction));

      lastY = window.scrollY;
      lastT = now;

      if (intensity > 0.005 || scrolling) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      scrolling = true;
      if (stopTimer) window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => {
        scrolling = false;
      }, 120);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (stopTimer) window.clearTimeout(stopTimer);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="sw-stars pointer-events-none absolute inset-0 overflow-hidden"
      style={
        {
          ["--streak"]: "0",
          ["--streak-dir"]: "1",
        } as React.CSSProperties
      }
    >
      {STARS.map((s, i) => (
        <span
          key={i}
          className={s.twinkle ? "sw-star sw-twinkle" : "sw-star"}
          style={
            {
              left: `${s.cx}%`,
              top: `${s.cy}%`,
              ["--r"]: `${s.r}px`,
              ["--op"]: String(s.opacity),
              ["--c"]: s.tone,
              ...(s.twinkle
                ? { animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }
                : null),
            } as React.CSSProperties
          }
        >
          <i className="sw-star-tail" />
          <i className="sw-star-dot" />
        </span>
      ))}
    </div>
  );
}
