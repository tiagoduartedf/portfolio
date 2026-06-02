/** URL prefix the deployed site lives under, e.g. `/portfolio` on GitHub
 *  project pages. Empty string in dev and on the local preview, so the
 *  same code works in both. The CI workflow sets this via the
 *  `NEXT_PUBLIC_BASE_PATH` env var; `next.config.ts` mirrors it into the
 *  framework's own `basePath` option. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a project-absolute path (one that starts with `/`) with the
 *  deployment's basePath. `next/link` and `next/router` do this for you,
 *  but raw `<a href>`, `<img src>`, SVG `<image href>`, and `fetch()`
 *  calls do not — those have to go through this helper, otherwise they
 *  break under a non-empty basePath. Pass-through for already-absolute
 *  URLs and relative paths. */
export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
