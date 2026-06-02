"use client";

import BlogShell from "./BlogShell";
import BlogList from "./BlogList";

export default function BlogPage() {
  return (
    <BlogShell>
      {({ lang, dark, mobileSidebarOpen, setMobileSidebarOpen }) => (
        <BlogList
          lang={lang}
          dark={dark}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
      )}
    </BlogShell>
  );
}
