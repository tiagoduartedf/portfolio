import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fraunces, Newsreader, Pathway_Gothic_One } from "next/font/google";
import "./globals.css";
import { ui } from "./data/cv";

// Runs synchronously while the browser parses the HTML, BEFORE React
// hydrates. Path-gates itself to /blog routes so non-blog pages stay
// clean. Reads the persisted theme mode (cookie first, localStorage
// fallback) and toggles `html.dark` so /blog paints with the right
// surface on the first frame. Required because static export can't
// read cookies at build time, so the prerendered HTML always carries
// the light default. CSS rules scoped to `html.dark .blog-shell` in
// globals.css consume the class; BlogShell's effect keeps it in sync
// after hydration and removes it on unmount.
//
// Inlined as a raw <script> (not `next/script`) because we need
// synchronous execution during HTML parse: `next/script` with
// `beforeInteractive` queues the body in `self.__next_s` and the
// runtime evaluates it later, after first paint — too late to avoid
// the flash. The dev console warning "Scripts inside React components
// are never executed when rendering on the client" is benign here:
// the script lives in the SSR HTML and only needs to run on full
// loads (client nav is handled by BlogShell's mount effect).
const BLOG_NO_FLASH = `(function(){try{
if(!/\\/blog(\\/|$)/.test(location.pathname))return;
var m=document.cookie.match(/(?:^|; )blog-theme-mode=([^;]+)/),v=m&&m[1];
if(v!=='dark'&&v!=='light'){try{v=localStorage.getItem('blog-theme-mode')}catch(e){}}
if(v==='dark')document.documentElement.classList.add('dark');
}catch(e){}})();`;

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

// Text serif optimized for reading at body sizes; used in the serif
// language cards inside the Notion theme so Fraunces can stay where it
// shines (headlines).
const newsreader = Newsreader({
  variable: "--font-serif-text",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Condensed-ish sans designed to mimic ITC Franklin Gothic, the actual
// font used in the Star Wars opening crawl. Loaded just for the Star
// Wars theme's `<StarWarsCrawl />` text.
const swCrawl = Pathway_Gothic_One({
  variable: "--font-sw-crawl",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: ui.meta.title.en,
  description: ui.meta.description.en,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${newsreader.variable} ${mono.variable} ${swCrawl.variable} h-full antialiased`}
      // The blog no-flash <script> below adds `dark` to this element
      // synchronously before React hydrates, so the server-rendered
      // className differs from the client-side className after the
      // script runs. Suppressing avoids the hydration warning on this
      // element only (children are unaffected). Same pattern used by
      // next-themes and most other theme libraries.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BLOG_NO_FLASH }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
