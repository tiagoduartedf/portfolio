"use client";

import { useEffect, useState } from "react";

/** Top edge band: while the user is within the first 200px of scroll the FAB
 * stack is visible. Captures the "just landed on page" reading window. */
const TOP_THRESHOLD = 200;
/** Bottom edge band: same idea at the other end — the last 200px before the
 * page bottom keeps the FABs visible so end-of-content actions stay reachable
 * without scrolling back up. */
const BOTTOM_THRESHOLD = 200;
/** Middle band radius, as a fraction of viewport height. 0.18 means the FAB
 * reappears when the scroll position is within ±18% of the page midpoint, i.e.
 * roughly one short paragraph either side of the centre line. Wider feels
 * permanent, narrower feels jumpy. */
const MIDDLE_RADIUS_VH = 0.18;

/** Returns true when the current scroll position is inside one of three
 * "bands" — top, middle, end — and false in between. Used by FloatingActions
 * to surface the action stack at three natural checkpoints during a long read
 * (top of page, around the fold-and-a-half mark, and near the end) without
 * occluding content the rest of the time.
 *
 * SSR-safe: returns true on the server / first hydration tick so the markup
 * matches. The first effect tick re-evaluates against real `window.scrollY`,
 * which fixes the "show then hide" flicker browsers used to cause when they
 * restored the scroll position after hydration. */
export function useScrollBands(): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const compute = (): boolean => {
      const scrollY = window.scrollY;
      const innerH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const maxScroll = Math.max(0, docH - innerH);

      // Page is shorter than the viewport: always visible, no scrolling to
      // hide between.
      if (maxScroll <= TOP_THRESHOLD + BOTTOM_THRESHOLD) return true;

      if (scrollY <= TOP_THRESHOLD) return true;
      if (scrollY >= maxScroll - BOTTOM_THRESHOLD) return true;

      const midpoint = maxScroll / 2;
      if (Math.abs(scrollY - midpoint) <= innerH * MIDDLE_RADIUS_VH) return true;

      return false;
    };

    const update = () => setVisible(compute());
    // Re-evaluate once on mount so a scroll-restored landing computes the
    // right band immediately rather than starting visible and snapping out.
    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return visible;
}
