import type { NextConfig } from "next";

// `next build` emits the static site into ./out so any HTML host (GitHub
// Pages, S3, Nginx) can serve it. The deployment's URL prefix is supplied
// via NEXT_PUBLIC_BASE_PATH (e.g. "/portfolio" on GitHub project pages);
// the CI workflow sets it for the prod build, dev and the local preview
// leave it empty. `app/lib/basePath.ts` reads the same env var so raw
// asset paths and fetch() calls stay in sync with this option.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  // GitHub Pages has no Image Optimization API; the app currently uses
  // raw <img>/SVG <image> only, but flagging unoptimized keeps any future
  // next/image usage from breaking the build.
  images: { unoptimized: true },
  // Emit /me/index.html instead of /me.html so the route resolves on
  // static hosts without rewrite rules (GitHub Pages serves /me/ → file).
  trailingSlash: true,
};

export default nextConfig;
