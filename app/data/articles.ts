/**
 * Static manifest of articles bundled under `public/articles/`.
 * Originally mirrored from gitlab.com/aszarth/mdnotion; the content now lives
 * in this repo so the CV ships self-contained.
 */

import type { Bilingual, Lang } from "./cv";

export type ArticleCategory = {
  slug: string;
  label: Bilingual;
  description: Bilingual;
  emoji: string;
};

export const CATEGORIES: ArticleCategory[] = [
  {
    slug: "base",
    emoji: "🧱",
    label: { en: "Foundations", pt: "Fundamentos" },
    description: {
      en: "Computer-science basics: complexity, data structures, OOP, sorting.",
      pt: "Bases de ciência da computação: complexidade, estruturas, POO, ordenação.",
    },
  },
  {
    slug: "js",
    emoji: "💛",
    label: { en: "JavaScript & Stack", pt: "JavaScript & Stack" },
    description: {
      en: "JS, TypeScript, Node, NestJS, Next.js, Express, React.",
      pt: "JS, TypeScript, Node, NestJS, Next.js, Express, React.",
    },
  },
  {
    slug: "design_patern/react",
    emoji: "🧩",
    label: { en: "React patterns", pt: "Padrões React" },
    description: {
      en: "Composition, hooks for logic, page/feature/UI, single responsibility.",
      pt: "Composição, hooks para lógica, page/feature/UI, responsabilidade única.",
    },
  },
  {
    slug: "mid",
    emoji: "🔧",
    label: { en: "Backend essentials", pt: "Essenciais de backend" },
    description: {
      en: "API gateway, REST/HTTP, BFF, cache, clean code, RabbitMQ, storage, tests.",
      pt: "API gateway, REST/HTTP, BFF, cache, clean code, RabbitMQ, storage, testes.",
    },
  },
  {
    slug: "others",
    emoji: "🧰",
    label: { en: "Practices & DevOps", pt: "Práticas & DevOps" },
    description: {
      en: "CI/CD, design systems, devops, docker, git, html/css, jenkins, kanban, observability, sass, scrum, tailwind, ux/ui.",
      pt: "CI/CD, design systems, devops, docker, git, html/css, jenkins, kanban, observabilidade, sass, scrum, tailwind, ux/ui.",
    },
  },
];

export type Article = {
  /** Path inside the repo, e.g. "others/uxui.md" */
  path: string;
  /** Filename without extension, e.g. "uxui" */
  slug: string;
  /** Category slug, e.g. "others" */
  category: string;
  /** Human title, derived */
  title: string;
  /** Optional curator-set summary in EN/PT shown in the list */
  blurb?: Bilingual;
  /** Optional flag: featured at the top */
  featured?: boolean;
};

const TITLES: Record<string, string> = {
  big_o: "Big O",
  datastruct: "Estruturas de dados",
  logica_de_programacao: "Lógica de programação",
  order_and_select: "Ordenação & seleção",
  poo: "POO · Programação orientada a objetos",
  composition: "Composition",
  hooks_for_logic: "Hooks for logic",
  page_feature_ui: "Page · Feature · UI",
  single_resposibility_principle: "Single responsibility principle",
  expressjs: "Express.js",
  js: "JavaScript",
  js_advanced: "JavaScript avançado",
  js_array: "JavaScript · Array",
  js_object: "JavaScript · Object",
  js_string: "JavaScript · String",
  nestjs: "NestJS",
  nextjs: "Next.js",
  nodejs: "Node.js",
  react: "React",
  typescript: "TypeScript",
  microservices: "Microservices",
  apigateway: "API Gateway",
  apirest_and_http: "REST & HTTP",
  bff: "BFF · Backend for Frontend",
  cache: "Cache",
  cleancode: "Clean Code",
  rabbitmq: "RabbitMQ",
  storage: "Storage",
  tests: "Tests",
  nest: "NestJS · extras",
  cicd: "CI/CD",
  design_system: "Design System",
  devops: "DevOps",
  docker: "Docker",
  escalando_arquitetura_de_software: "Escalando arquitetura de software",
  git: "Git",
  html_and_css: "HTML & CSS",
  jenkins: "Jenkins",
  kanban: "Kanban",
  observabilidade: "Observabilidade",
  sass: "Sass",
  scrum: "Scrum",
  tailwind: "Tailwind",
  uxui: "UX/UI · for Front-End Devs",
};

const BLURBS: Record<string, Bilingual> = {
  uxui: {
    en: "A primer for front-end developers on UX and UI fundamentals, the topic of my published blog post.",
    pt: "Um guia para devs front-end sobre fundamentos de UX e UI, tema do meu post publicado.",
  },
  cleancode: {
    en: "Personal notes from Robert C. Martin: names, functions, error handling, the lot.",
    pt: "Anotações pessoais a partir do Uncle Bob: nomes, funções, erros, tudo.",
  },
  design_system: {
    en: "How design systems are structured and shipped, from tokens to components.",
    pt: "Como design systems são estruturados e entregues, de tokens a componentes.",
  },
  microservices: {
    en: "When (and when not) to break a monolith. Patterns, trade-offs, comms.",
    pt: "Quando (e quando não) quebrar um monolito. Padrões, trade-offs, comunicação.",
  },
  bff: {
    en: "Backend for Frontend pattern: when a single backend can't serve every client well.",
    pt: "Padrão BFF: quando um único backend não serve bem todos os clientes.",
  },
  composition: {
    en: "React composition over inheritance: building flexible UI through children & slots.",
    pt: "Composição em React: UI flexível com children e slots.",
  },
  observabilidade: {
    en: "Logs, metrics, tracing: the three pillars and how they fit together.",
    pt: "Logs, métricas, tracing: os três pilares e como se encaixam.",
  },
  big_o: {
    en: "Time and space complexity, walked through with the examples that finally clicked for me.",
    pt: "Complexidade de tempo e espaço, com os exemplos que finalmente fizeram sentido pra mim.",
  },
};

const FEATURED = new Set([
  "others/observabilidade.md",
  "design_patern/react/composition.md",
  "others/uxui.md",
]);

const PATHS = [
  "base/big_o.md",
  "base/datastruct.md",
  "base/logica_de_programacao.md",
  "base/order_and_select.md",
  "base/poo.md",
  "design_patern/react/composition.md",
  "design_patern/react/hooks_for_logic.md",
  "design_patern/react/page_feature_ui.md",
  "design_patern/react/single_resposibility_principle.md",
  "js/expressjs.md",
  "js/js.md",
  "js/js_advanced.md",
  "js/js_array.md",
  "js/js_object.md",
  "js/js_string.md",
  "js/nestjs.md",
  "js/nextjs.md",
  "js/nodejs.md",
  "js/react.md",
  "js/typescript.md",
  "microservices.md",
  "mid/apigateway.md",
  "mid/apirest_and_http.md",
  "mid/bff.md",
  "mid/cache.md",
  "mid/cleancode.md",
  "mid/rabbitmq.md",
  "mid/storage.md",
  "mid/tests.md",
  "nest.md",
  "others/cicd.md",
  "others/design_system.md",
  "others/devops.md",
  "others/docker.md",
  "others/escalando_arquitetura_de_software.md",
  "others/git.md",
  "others/html_and_css.md",
  "others/jenkins.md",
  "others/kanban.md",
  "others/observabilidade.md",
  "others/sass.md",
  "others/scrum.md",
  "others/tailwind.md",
  "others/uxui.md",
];

function deriveCategory(path: string): string {
  if (path.startsWith("design_patern/react/")) return "design_patern/react";
  if (path.includes("/")) return path.split("/")[0];
  // Top-level files (microservices.md, nest.md) → group under "mid"
  return "mid";
}

function deriveSlug(path: string): string {
  return path.replace(/\.md$/, "").split("/").pop() ?? path;
}

export const ARTICLES: Article[] = PATHS.map((path) => {
  const slug = deriveSlug(path);
  const title = TITLES[slug] ?? slug.replace(/_/g, " ");
  return {
    path,
    slug,
    category: deriveCategory(path),
    title,
    blurb: BLURBS[slug],
    featured: FEATURED.has(path),
  };
});

const BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]));

export function articleBySlug(slug: string): Article | undefined {
  return BY_SLUG.get(slug);
}

/* ─────────────────────────────────────────────────────────
 * CURRICULUM. Learning order from the mdnotion README.
 * Mirrors the "1) BASE, 2) STACK, 3) OUTROS" structure so the
 * blog reads as a guided path from fundamentals to advanced.
 * ───────────────────────────────────────────────────────── */

export type CurriculumSection = {
  slug: string;
  /** Optional letter or label for the section (e.g., "2A"). */
  number?: string;
  title: Bilingual;
  description?: Bilingual;
  articles: Article[];
  /** Optional nested groupings (e.g., React patterns inside Front-End). */
  subSections?: CurriculumSection[];
};

export type CurriculumPart = {
  number: string;
  slug: string;
  emoji: string;
  title: Bilingual;
  description: Bilingual;
  sections: CurriculumSection[];
};

const byPath = new Map(ARTICLES.map((a) => [a.path, a]));
function art(path: string): Article {
  const a = byPath.get(path);
  if (!a) throw new Error(`Curriculum references unknown article: ${path}`);
  return a;
}

export const CURRICULUM: CurriculumPart[] = [
  {
    number: "1",
    slug: "base",
    emoji: "📚",
    title: { en: "Foundations", pt: "Base" },
    description: {
      en: "The literature you need to walk on your own legs: programming logic, complexity, data structures, sorting and OOP.",
      pt: "A literatura pra você andar com as próprias pernas: lógica, complexidade, estruturas de dados, ordenação e POO.",
    },
    sections: [
      {
        slug: "logic",
        title: { en: "Programming logic", pt: "Lógica de programação" },
        description: {
          en: "Start here. The minimum on the tip of your tongue before anything else.",
          pt: "Comece por aqui. O mínimo na ponta da língua antes de tudo.",
        },
        articles: [art("base/logica_de_programacao.md")],
      },
      {
        slug: "complexity",
        title: { en: "Algorithm complexity", pt: "Complexidade de algoritmos" },
        articles: [art("base/big_o.md")],
      },
      {
        slug: "datastructs",
        title: { en: "Data structures", pt: "Estruturas de dados" },
        articles: [art("base/datastruct.md")],
      },
      {
        slug: "sorting",
        title: { en: "Sorting & search", pt: "Ordenação e busca" },
        articles: [art("base/order_and_select.md")],
      },
      {
        slug: "oop",
        title: { en: "Paradigm · Object-Oriented Programming", pt: "Paradigma · Orientação a Objetos" },
        articles: [art("base/poo.md")],
      },
    ],
  },
  {
    number: "2",
    slug: "stack",
    emoji: "💻",
    title: { en: "Specific stack", pt: "Stack específica" },
    description: {
      en: "Putting the foundations to work: language, libraries and frameworks.",
      pt: "Colocando a base em prática: linguagem, bibliotecas e frameworks.",
    },
    sections: [
      {
        slug: "javascript",
        number: "2A",
        title: { en: "JavaScript · language", pt: "JavaScript · linguagem" },
        articles: [
          art("js/js.md"),
          art("js/js_array.md"),
          art("js/js_string.md"),
          art("js/js_object.md"),
          art("js/js_advanced.md"),
          art("js/typescript.md"),
        ],
      },
      {
        slug: "frontend",
        number: "2B",
        title: { en: "Front-End · libs & frameworks", pt: "Front-End · libs & frameworks" },
        description: {
          en: "Bringing business rules into an interface a user can see.",
          pt: "Trazendo regras de negócio para uma interface que o usuário vê.",
        },
        articles: [
          art("others/html_and_css.md"),
          art("js/react.md"),
          art("js/nextjs.md"),
          art("mid/storage.md"),
          art("others/sass.md"),
          art("others/tailwind.md"),
        ],
        subSections: [
          {
            slug: "react-patterns",
            title: { en: "React patterns (advanced)", pt: "Padrões React (avançado)" },
            articles: [
              art("design_patern/react/single_resposibility_principle.md"),
              art("design_patern/react/composition.md"),
              art("design_patern/react/page_feature_ui.md"),
              art("design_patern/react/hooks_for_logic.md"),
            ],
          },
        ],
      },
      {
        slug: "backend",
        number: "2C",
        title: { en: "Backend · libs & frameworks", pt: "Backend · libs & frameworks" },
        articles: [
          art("js/nodejs.md"),
          art("mid/apirest_and_http.md"),
          art("js/expressjs.md"),
          art("js/nestjs.md"),
          art("nest.md"),
          art("mid/cache.md"),
        ],
      },
    ],
  },
  {
    number: "3",
    slug: "others",
    emoji: "🛠️",
    title: { en: "Practices & ecosystem", pt: "Práticas & ecossistema" },
    description: {
      en: "Complementary skills every developer needs.",
      pt: "Habilidades complementares pra qualquer dev.",
    },
    sections: [
      {
        slug: "git",
        title: { en: "Git", pt: "Git" },
        articles: [art("others/git.md")],
      },
      {
        slug: "workflow",
        title: { en: "Work dynamics", pt: "Dinâmica de trabalho" },
        articles: [art("others/scrum.md"), art("others/kanban.md")],
      },
      {
        slug: "tests",
        title: { en: "Tests", pt: "Testes" },
        articles: [art("mid/tests.md")],
      },
      {
        slug: "devops",
        title: { en: "DevOps", pt: "DevOps" },
        description: {
          en: "Containers, orchestration, cloud, IaC, CI/CD, observability.",
          pt: "Containers, orquestração, cloud, IaC, CI/CD, observabilidade.",
        },
        articles: [
          art("others/devops.md"),
          art("others/docker.md"),
          art("others/observabilidade.md"),
          art("others/jenkins.md"),
          art("others/cicd.md"),
        ],
      },
      {
        slug: "queues",
        title: { en: "Queues / messaging", pt: "Filas / mensageria" },
        articles: [art("mid/rabbitmq.md")],
      },
      {
        slug: "uxui",
        title: { en: "UX/UI for front-end", pt: "UX/UI para front" },
        articles: [art("others/uxui.md"), art("others/design_system.md")],
      },
      {
        slug: "bff",
        title: { en: "BFF for front-end", pt: "BFF para front" },
        articles: [art("mid/bff.md")],
      },
      {
        slug: "clean-code",
        title: { en: "Clean code", pt: "Código limpo" },
        articles: [art("mid/cleancode.md")],
      },
      {
        slug: "architecture",
        title: { en: "Software architecture", pt: "Arquitetura de software" },
        articles: [
          art("others/escalando_arquitetura_de_software.md"),
          art("microservices.md"),
          art("mid/apigateway.md"),
        ],
      },
    ],
  },
];

export type CurriculumStep = {
  /** Global 1-based step number across the whole curriculum. */
  number: number;
  partNumber: string;
  partSlug: string;
  partTitle: Bilingual;
  partEmoji: string;
  sectionTitle: Bilingual;
  sectionSlug: string;
  sectionNumber?: string;
  /** Sub-section title when the article lives under a nested grouping. */
  subSectionTitle?: Bilingual;
  article: Article;
};

export function walkCurriculum(): CurriculumStep[] {
  const steps: CurriculumStep[] = [];
  let n = 1;
  for (const part of CURRICULUM) {
    for (const section of part.sections) {
      for (const article of section.articles) {
        steps.push({
          number: n++,
          partNumber: part.number,
          partSlug: part.slug,
          partTitle: part.title,
          partEmoji: part.emoji,
          sectionTitle: section.title,
          sectionSlug: section.slug,
          sectionNumber: section.number,
          article,
        });
      }
      for (const sub of section.subSections ?? []) {
        for (const article of sub.articles) {
          steps.push({
            number: n++,
            partNumber: part.number,
            partSlug: part.slug,
            partTitle: part.title,
            partEmoji: part.emoji,
            sectionTitle: section.title,
            sectionSlug: section.slug,
            sectionNumber: section.number,
            subSectionTitle: sub.title,
            article,
          });
        }
      }
    }
  }
  return steps;
}

export function findCurriculumStep(path: string): CurriculumStep | undefined {
  return walkCurriculum().find((s) => s.article.path === path);
}

export const blogUI = {
  title: { en: "Notes & writing", pt: "Notas & artigos" },
  subtitle: {
    en: "Living notebook of summaries, tutorials and articles: fundamentals first, ecosystem last.",
    pt: "Caderno vivo de resumos, tutoriais e artigos: fundamentos primeiro, ecossistema no fim.",
  },
  searchPlaceholder: { en: "Search articles…", pt: "Buscar artigos…" },
  featured: { en: "Featured", pt: "Em destaque" },
  all: { en: "All", pt: "Todos" },
  back: { en: "Back to notes", pt: "Voltar para notas" },
  loading: { en: "Loading article…", pt: "Carregando artigo…" },
  loadError: {
    en: "Couldn't load this article.",
    pt: "Não consegui carregar esse artigo.",
  },
  noResults: { en: "No articles match.", pt: "Nenhum artigo encontrado." },
  total: { en: "articles", pt: "artigos" },
  views: { en: "Resume", pt: "Currículo" },
  blogTab: { en: "Blog", pt: "Blog" },
  pathIntro: {
    en: "A learning journey, in order: fundamentals first, ecosystem at the end.",
    pt: "Uma trilha de aprendizado, em ordem: fundamentos primeiro, ecossistema no fim.",
  },
  step: { en: "Step", pt: "Passo" },
  pickUp: { en: "Pick it up", pt: "Estudar" },
  searchTitle: { en: "Search results", pt: "Resultados da busca" },
  sidebarTitle: { en: "Curriculum", pt: "Trilha" },
  sidebarHint: {
    en: "Pick a part. Each block builds on the previous one.",
    pt: "Escolha uma parte. Cada bloco se apoia no anterior.",
  },
  openTree: { en: "trail-menu", pt: "trilha-menu" },
  closeTree: { en: "Close", pt: "Fechar" },
  partLabel: { en: "Part", pt: "Parte" },
  notes: { en: "notes", pt: "notas" },
  themePickerTitle: { en: "Blog appearance", pt: "Aparência do blog" },
  themePickerHint: {
    en: "Switches the blog colors. The CV themes stay where they are.",
    pt: "Troca as cores do blog. Os temas do currículo seguem onde estão.",
  },
  themeLight: { en: "Light", pt: "Claro" },
  themeDark: { en: "Dark", pt: "Escuro" },
  themeLightHint: {
    en: "Crisp white surface, calm reading.",
    pt: "Superfície branca, leitura tranquila.",
  },
  themeDarkHint: {
    en: "Deep violet night for low-light reading.",
    pt: "Noite violeta profunda pra leitura em pouca luz.",
  },
} as const;

export type BlogLang = Lang;
