import type { ComponentType } from "react";
import { Flag } from "./Flag";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiNestjs,
  SiExpress,
  SiDocker,
  SiKubernetes,
  SiFigma,
  SiMysql,
  SiRedis,
  SiTailwindcss,
  SiGit,
  SiGithub,
  SiLinux,
  SiHtml5,
  SiCss,
  SiJest,
  SiTestinglibrary,
  SiTypeorm,
  SiExpo,
  SiChartdotjs,
  SiStorybook,
  SiJsonwebtokens,
  SiReactquery,
  SiCircleci,
  SiOpenjdk,
  SiGrafana,
  SiPrometheus,
  SiOpentelemetry,
  SiPino,
  SiPostgresql,
  SiSwagger,
  SiNginx,
} from "react-icons/si";
import {
  TbApi,
  TbBell,
  TbBrandAmazon,
  TbBrandAzure,
  TbBuildingFactory2,
  TbComponents,
  TbDots,
  TbHandClick,
  TbLogs,
  TbRoute2,
} from "react-icons/tb";

export type TechMeta = {
  Icon: ComponentType<{ className?: string; size?: number; color?: string }>;
  color: string;
  label?: string;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .replace(/js$/, "");

const TECH: Record<string, TechMeta> = {
  react: { Icon: SiReact, color: "#61DAFB" },
  reactnative: { Icon: SiReact, color: "#61DAFB", label: "React Native" },
  reactquery: { Icon: SiReactquery, color: "#FF4154" },
  reacttestinglibrary: { Icon: SiTestinglibrary, color: "#E33332" },
  rtl: { Icon: SiTestinglibrary, color: "#E33332", label: "RTL" },
  nextjs: { Icon: SiNextdotjs, color: "#000000" },
  next: { Icon: SiNextdotjs, color: "#000000" },
  next15: { Icon: SiNextdotjs, color: "#000000", label: "Next.js 15" },
  typescript: { Icon: SiTypescript, color: "#3178C6" },
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  nodejs: { Icon: SiNodedotjs, color: "#5FA04E" },
  node: { Icon: SiNodedotjs, color: "#5FA04E" },
  nestjs: { Icon: SiNestjs, color: "#E0234E" },
  nest: { Icon: SiNestjs, color: "#E0234E" },
  express: { Icon: SiExpress, color: "#000000" },
  expressjs: { Icon: SiExpress, color: "#000000" },
  docker: { Icon: SiDocker, color: "#2496ED" },
  kubernetes: { Icon: SiKubernetes, color: "#326CE5" },
  aws: { Icon: TbBrandAmazon, color: "#FF9900", label: "AWS" },
  azure: { Icon: TbBrandAzure, color: "#0078D4", label: "Azure" },
  grafana: { Icon: SiGrafana, color: "#F46800" },
  prometheus: { Icon: SiPrometheus, color: "#E6522C" },
  opentelemetry: { Icon: SiOpentelemetry, color: "#425CC7", label: "OpenTelemetry" },
  tempo: { Icon: SiGrafana, color: "#F46800", label: "Tempo" },
  loki: { Icon: TbLogs, color: "#F46800", label: "Loki" },
  pino: { Icon: SiPino, color: "#687634", label: "Pino" },
  alertmanager: { Icon: TbBell, color: "#E6522C", label: "Alertmanager" },
  figma: { Icon: SiFigma, color: "#F24E1E" },
  mysql: { Icon: SiMysql, color: "#4479A1" },
  redis: { Icon: SiRedis, color: "#FF4438" },
  tailwind: { Icon: SiTailwindcss, color: "#06B6D4" },
  tailwindcss: { Icon: SiTailwindcss, color: "#06B6D4" },
  git: { Icon: SiGit, color: "#F05032" },
  github: { Icon: SiGithub, color: "#000000" },
  githubflow: { Icon: SiGithub, color: "#000000", label: "GitHub Flow" },
  linux: { Icon: SiLinux, color: "#000000" },
  html: { Icon: SiHtml5, color: "#E34F26" },
  html5: { Icon: SiHtml5, color: "#E34F26" },
  css: { Icon: SiCss, color: "#1572B6" },
  css3: { Icon: SiCss, color: "#1572B6" },
  jest: { Icon: SiJest, color: "#C21325" },
  testinglibrary: { Icon: SiTestinglibrary, color: "#E33332" },
  typeorm: { Icon: SiTypeorm, color: "#FE0902" },
  expo: { Icon: SiExpo, color: "#000020" },
  chart: { Icon: SiChartdotjs, color: "#FF6384", label: "Chart.js" },
  storybook: { Icon: SiStorybook, color: "#FF4785" },
  jwt: { Icon: SiJsonwebtokens, color: "#000000" },
  cicd: { Icon: SiCircleci, color: "#343434", label: "CI/CD" },
  scrum: { Icon: TbBuildingFactory2, color: "#1f6feb", label: "Scrum" },
  kanban: { Icon: TbBuildingFactory2, color: "#9333ea", label: "Kanban" },
  rest: { Icon: TbApi, color: "#0ea5e9", label: "REST" },
  microfrontends: { Icon: SiOpenjdk, color: "#0ea5e9", label: "Micro-frontends" },
  designsystems: { Icon: TbComponents, color: "#7c3aed", label: "Design Systems" },
  uxuifundamentals: { Icon: TbHandClick, color: "#0ea5e9", label: "UX/UI fundamentals" },
  automation: { Icon: TbBuildingFactory2, color: "#64748b", label: "Automation" },
  windowsserver: { Icon: TbBuildingFactory2, color: "#0078d4", label: "Windows Server" },
  tanstackquery: { Icon: SiReactquery, color: "#FF4154", label: "TanStack Query" },
  reactflow: { Icon: TbRoute2, color: "#FF0072", label: "Reactflow" },
  postgresql: { Icon: SiPostgresql, color: "#4169E1", label: "PostgreSQL" },
  postgres: { Icon: SiPostgresql, color: "#4169E1", label: "PostgreSQL" },
  azureservicebus: { Icon: TbBrandAzure, color: "#0078D4", label: "Azure Service Bus" },
  swagger: { Icon: SiSwagger, color: "#85EA2D" },
  openapi: { Icon: SiSwagger, color: "#85EA2D", label: "OpenAPI" },
  nginx: { Icon: SiNginx, color: "#009639" },
  english: {
    Icon: ({ size }) => <Flag code="us" size={size ?? 14} />,
    color: "",
    label: "English",
  },
  portuguese: {
    Icon: ({ size }) => <Flag code="br" size={size ?? 14} />,
    color: "",
    label: "Português",
  },
};

export function getTechMeta(name: string): TechMeta {
  return TECH[norm(name)] ?? { Icon: TbDots, color: "#8b949e", label: name };
}

type TechIconProps = {
  name: string;
  size?: number;
  /** Use the brand color for the icon. */
  brand?: boolean;
  /** Use a single override color (e.g., currentColor). */
  color?: string;
  className?: string;
};

export function TechIcon({
  name,
  size = 16,
  brand = true,
  color,
  className,
}: TechIconProps) {
  const meta = getTechMeta(name);
  const finalColor = color ?? (brand ? meta.color : "currentColor");
  return <meta.Icon size={size} color={finalColor} className={className} />;
}

export function getTechLabel(name: string) {
  const meta = getTechMeta(name);
  return meta.label ?? name;
}
