"use client";

import { useState } from "react";
import type { Lang } from "../../data/cv";
import RoadmapSidebar from "./variants/RoadmapSidebar";
import RoadmapIndex from "./variants/RoadmapIndex";
import { chromeFor } from "./partHues";

type Props = {
  lang: Lang;
  dark: boolean;
  /** Mobile sidebar drawer state, lifted to the BlogShell so the Topbar's
   * "tree" action can open it. */
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
};

export default function BlogList({
  lang,
  dark,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}: Props) {
  const [query, setQuery] = useState("");
  const chrome = chromeFor(dark);

  return (
    <div className={`w-full overflow-x-clip pl-3 pr-4 pb-24 pt-2 md:pl-6 md:pr-8 ${chrome.textBody}`}>
      <div className="grid gap-x-10 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)]">
        <RoadmapSidebar
          lang={lang}
          dark={dark}
          query={query}
          onQueryChange={setQuery}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        <div className="min-w-0 md:max-w-[1080px]">
          <RoadmapIndex lang={lang} dark={dark} query={query} />
        </div>
      </div>
    </div>
  );
}
