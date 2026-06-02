import { cv } from "../data/cv";
import type { Lang } from "../data/cv";

/**
 * Browsers use document.title as the default filename when "Save as PDF".
 * Swap it before printing so the saved file is cv-{lang}-{name}-{DD-MM-YYYY},
 * then restore the original on afterprint.
 */
export function printAsPdf(lang: Lang) {
  if (typeof window === "undefined") return;
  const slug = cv.name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const langSlug = lang === "en" ? "en" : "ptbr";
  const original = document.title;
  document.title = `cv-${langSlug}-${slug}-${dd}-${mm}-${yyyy}`;
  const restore = () => {
    document.title = original;
    window.removeEventListener("afterprint", restore);
  };
  window.addEventListener("afterprint", restore);
  window.print();
}
