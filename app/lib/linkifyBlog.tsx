import React from "react";

/** Wrap inline `https?://` URLs in the given paragraph with anchors that
 *  open in a new tab. Used by the CV themes so an URL mention in the
 *  About summary becomes a real link without changing `cv.summary` to a
 *  structured node type. The `color` opt matches each theme's accent/link
 *  color so the URL reads as clickable in context (same hue used for
 *  company names in experience). `href` is a raw `<a>` (not `next/link`)
 *  because the link is external/absolute. */
export function linkifyBlog(text: string, color?: string): React.ReactNode {
  const URL_RE = /https?:\/\/[^\s,)]+/g;
  const matches = [...text.matchAll(URL_RE)];
  if (matches.length === 0) return text;
  const nodes: React.ReactNode[] = [];
  let lastIdx = 0;
  matches.forEach((m, i) => {
    const url = m[0];
    const start = m.index ?? 0;
    if (start > lastIdx) {
      nodes.push(
        <React.Fragment key={`t-${i}`}>{text.slice(lastIdx, start)}</React.Fragment>,
      );
    }
    nodes.push(
      <a
        key={`u-${i}`}
        href={url}
        target="_blank"
        rel="noreferrer"
        className="font-medium underline underline-offset-2 hover:no-underline"
        style={color ? { color } : undefined}
      >
        {url}
      </a>,
    );
    lastIdx = start + url.length;
  });
  if (lastIdx < text.length) {
    nodes.push(<React.Fragment key="t-end">{text.slice(lastIdx)}</React.Fragment>);
  }
  return nodes;
}
