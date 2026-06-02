import { notFound } from "next/navigation";
import { ARTICLES, articleBySlug } from "../../data/articles";
import ArticlePage from "../_components/ArticlePage";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!articleBySlug(slug)) notFound();
  return <ArticlePage slug={slug} />;
}
