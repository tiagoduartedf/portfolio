import { notFound } from "next/navigation";
import CVApp from "../components/CVApp";
import { cv } from "../data/cv";
import { SLUG_TO_THEME } from "../data/navigation";

export default async function ThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme: slug } = await params;
  const themeKey = SLUG_TO_THEME[slug];
  if (!themeKey) notFound();
  return <CVApp cv={cv} initialTheme={themeKey} />;
}

export function generateStaticParams() {
  return Object.keys(SLUG_TO_THEME).map((theme) => ({ theme }));
}
