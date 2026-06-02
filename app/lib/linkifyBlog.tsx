import React from "react";
import { withBase } from "./basePath";

/** Split a paragraph on the literal token `/blog` and replace each occurrence
 *  with an anchor that opens the local /blog route in a new tab. Used by the
 *  CV themes so the "/blog of this site" mention in the About summary becomes
 *  a real link without changing `cv.summary` to a structured node type. The
 *  `color` opt matches each theme's accent/link color so the URL reads as
 *  clickable in context (same hue used for company names in experience).
 *  `href` is a raw `<a>` (not `next/link`) because the link opens in a new
 *  tab, so we prefix the basePath manually. */
export function linkifyBlog(text: string, color?: string): React.ReactNode {
  const parts = text.split("/blog");
  if (parts.length === 1) return text;
  const nodes: React.ReactNode[] = [];
  parts.forEach((part, i) => {
    if (i > 0) {
      nodes.push(
        <a
          key={`b-${i}`}
          href={withBase("/blog")}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-2 hover:no-underline"
          style={color ? { color } : undefined}
        >
          /blog
        </a>,
      );
    }
    if (part) nodes.push(<React.Fragment key={`t-${i}`}>{part}</React.Fragment>);
  });
  return nodes;
}
