import type { Lang } from "../../data/cv";

export type FlagCode = "br" | "us" | "es";

type Props = {
  code?: FlagCode;
  /** Convenience for locale toggle: en → us, pt → br */
  lang?: Lang;
  size?: number;
  className?: string;
};

export function Flag({ code, lang, size = 20, className }: Props) {
  const c: FlagCode = code ?? (lang === "en" ? "us" : "br");
  const w = size;
  const h = size * (20 / 28);
  const style = { borderRadius: 3, overflow: "hidden", display: "inline-block" } as const;

  if (c === "br") {
    return (
      <svg viewBox="0 0 28 20" width={w} height={h} className={className} aria-label="Brasil" role="img" style={style}>
        <rect width="28" height="20" fill="#009b3a" />
        <path d="M14 2 L25 10 L14 18 L3 10 Z" fill="#fedd00" />
        <circle cx="14" cy="10" r="4" fill="#002776" />
        <path d="M10.4 9.4 Q14 8.3 17.6 9.4" stroke="#fff" strokeWidth="0.7" fill="none" />
      </svg>
    );
  }
  if (c === "es") {
    return (
      <svg viewBox="0 0 28 20" width={w} height={h} className={className} aria-label="España" role="img" style={style}>
        <rect width="28" height="20" fill="#aa151b" />
        <rect y="5" width="28" height="10" fill="#f1bf00" />
        {/* Coat-of-arms rough mark */}
        <rect x="7" y="8" width="3.5" height="4" fill="#aa151b" stroke="#7a0e10" strokeWidth="0.3" />
        <rect x="7.4" y="7.2" width="2.7" height="1" fill="#7a0e10" />
      </svg>
    );
  }
  // us
  return (
    <svg viewBox="0 0 28 20" width={w} height={h} className={className} aria-label="United States" role="img" style={style}>
      <rect width="28" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} y={y * 1.54} width="28" height="1.54" fill="#b22234" />
      ))}
      <rect width="12" height="11" fill="#3c3b6e" />
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 6 }).map((__, c2) => (
          <circle
            key={`${r}-${c2}`}
            cx={1 + c2 * 2}
            cy={1.2 + r * 2}
            r="0.5"
            fill="#fff"
          />
        )),
      )}
    </svg>
  );
}
