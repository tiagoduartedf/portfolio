"use client";

import BlogShell from "./BlogShell";
import Article from "./Article";

export default function ArticlePage({ slug }: { slug: string }) {
  return (
    <BlogShell slug={slug}>
      {({ lang, dark }) => <Article slug={slug} lang={lang} dark={dark} />}
    </BlogShell>
  );
}
