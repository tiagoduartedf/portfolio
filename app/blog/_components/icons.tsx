/**
 * Custom inline SVG icons for the blog. Thin (1.4px) strokes, designed as a
 * coherent set rather than the off-the-shelf react-icons mix we used before.
 * Every icon paints with `currentColor` so the parent controls hue.
 */

import type { SVGProps } from "react";

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
} & Omit<SVGProps<SVGSVGElement>, "ref" | "width" | "height" | "stroke" | "strokeWidth" | "viewBox" | "fill">;

function Svg({
  size = 18,
  strokeWidth = 1.4,
  className,
  children,
  ...rest
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ─────────── search & navigation ─────────── */

export function SearchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.6-3.6" />
    </Svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </Svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 14, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} {...rest}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 14, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} {...rest}>
      <path d="m9 6 6 6-6 6" />
    </Svg>
  );
}

export function MenuIcon({ size = 18, strokeWidth = 1.6, ...rest }: IconProps) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} {...rest}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </Svg>
  );
}

export function CloseIcon({ size = 18, strokeWidth = 1.6, ...rest }: IconProps) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} {...rest}>
      <path d="m6 6 12 12" />
      <path d="m6 18 12-12" />
    </Svg>
  );
}

/* ─────────── ornaments ─────────── */

export function StarFilledIcon({ size = 18, className, strokeWidth = 1.2, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <path d="M12 3.2 14.55 8.9l6.2.6-4.65 4.25 1.35 6.05L12 16.85 6.55 19.8 7.9 13.75 3.25 9.5l6.2-.6Z" />
    </svg>
  );
}

export function SparkleIcon({ size = 16, className, strokeWidth = 1.2, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <path d="M12 3 13.4 9 19.5 10 13.4 11 12 17 10.6 11 4.5 10 10.6 9Z" />
      <path d="M19 16.5 19.6 18.6 21.7 19.2 19.6 19.8 19 21.9 18.4 19.8 16.3 19.2 18.4 18.6Z" />
    </svg>
  );
}

export function BookmarkIcon({ size = 16, className, strokeWidth = 1.4, ...rest }: IconProps) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} className={className} {...rest}>
      <path d="M6 3h12v18l-6-4-6 4Z" />
    </Svg>
  );
}

export function DotIcon({ size = 8, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 8 8"
      fill="currentColor"
      className={className}
      {...rest}
    >
      <circle cx="4" cy="4" r="3.2" />
    </svg>
  );
}

export function RingDotIcon({ size = 12, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      {...rest}
    >
      <circle cx="6" cy="6" r="4.5" />
    </svg>
  );
}

export function TargetDotIcon({ size = 14, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={className}
      {...rest}
    >
      <circle cx="7" cy="7" r="5.5" />
      <circle cx="7" cy="7" r="2.2" fill="currentColor" />
    </svg>
  );
}

/* ─────────── chrome ─────────── */

export function CompassIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5Z" />
    </Svg>
  );
}

export function FeatherIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 4c-7 0-13 6-13 13v4h4c7 0 13-6 13-13" />
      <path d="M8 16 4 20" />
      <path d="M14 9 9 14" />
    </Svg>
  );
}

export function MapIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20Z" />
      <path d="M9 4v13.5" />
      <path d="M15 6.5V20" />
    </Svg>
  );
}

export function HashIcon({ size = 12, strokeWidth = 1.7, ...rest }: IconProps) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} {...rest}>
      <path d="M4 9h16" />
      <path d="M4 15h16" />
      <path d="M10 3 8 21" />
      <path d="M16 3l-2 18" />
    </Svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m12 3 9 5-9 5-9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </Svg>
  );
}

export function CodeBracketsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m14 4-4 16" />
    </Svg>
  );
}

export function WrenchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14.5 4a4.5 4.5 0 0 1 4.5 4.5c0 1.4-.65 2.65-1.66 3.47L20.6 15.1a2.4 2.4 0 1 1-3.4 3.4l-3.13-3.26c-.82 1-2.07 1.66-3.47 1.66A4.5 4.5 0 0 1 6.1 12.4l2.5 2.5 2.4-2.4-2.5-2.5A4.5 4.5 0 0 1 14.5 4Z" />
    </Svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </Svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <circle cx="3.5" cy="6" r="1.2" fill="currentColor" />
      <circle cx="3.5" cy="12" r="1.2" fill="currentColor" />
      <circle cx="3.5" cy="18" r="1.2" fill="currentColor" />
    </Svg>
  );
}

export function RoadmapIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="5" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="6" cy="19" r="1.6" fill="currentColor" stroke="none" />
      <path d="M6 6.6V11a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3v.4" />
    </Svg>
  );
}

export function BookOpenIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 5.5a1 1 0 0 1 1-1h5a3 3 0 0 1 3 3v12a3 3 0 0 0-3-3H4a1 1 0 0 1-1-1Z" />
      <path d="M21 5.5a1 1 0 0 0-1-1h-5a3 3 0 0 0-3 3v12a3 3 0 0 1 3-3h5a1 1 0 0 0 1-1Z" />
    </Svg>
  );
}

export function PaperPlaneIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 11 21 3l-8 18-2-7Z" />
      <path d="m11 14 10-11" />
    </Svg>
  );
}

export function PenIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m4 20 1-4 11-11a2 2 0 1 1 3 3L8 19Z" />
      <path d="m13 6 4 4" />
    </Svg>
  );
}
