export type Lang = "en" | "pt";

export type Bilingual = Record<Lang, string>;
export type BilingualList = Record<Lang, string[]>;

export type ContactLink = {
  label: string;
  href: string;
  display: string;
  kind: "email" | "phone" | "website" | "linkedin" | "github" | "location";
};

export type Experience = {
  company: string;
  url?: string;
  role: Bilingual;
  period: Bilingual;
  location?: Bilingual;
  summary: Bilingual;
  bullets: BilingualList;
  stack: string[];
};

export type ProjectScreen = {
  /** Short headline shown above the explanation, like a chapter title. */
  title: Bilingual;
  /** Body copy explaining what the screen shows and why it matters. */
  body: Bilingual;
};

/** Grouped stack chips: a category label + items, rendered as one row per group. */
export type ProjectStackGroup = {
  label: Bilingual;
  items: string[];
};

export type Project = {
  name: string;
  url?: string;
  tagline: Bilingual;
  /** Long-form description of the project. Optional: when an
   *  `experienceCompany` is set, the case study quotes the matching
   *  experience entry's summary instead, so we don't duplicate the same
   *  content in two places. */
  description?: Bilingual;
  highlights: BilingualList;
  /** Either a flat list of tech names or grouped categories with labels. */
  stack: string[] | ProjectStackGroup[];
  /** Optional path under /public to use a real screenshot instead of the procedural mockup. */
  image?: string;
  /** Per-screen captions + explanations, paged through in the case-study view. */
  screens?: ProjectScreen[];
  /** Optional accent color that overrides the theme's accent when this project is active in the case-study view. Matches the brand color of the product so the navigation echoes its screenshots. */
  accent?: string;
  /** Foreground color used on top of `accent`. Defaults to the theme's `accentText`. */
  accentText?: string;
  /** When this project was built during a specific job, link to that
   *  experience entry by matching `cv.experience[].company`. The case-study
   *  renders a small "see in experience" link that scrolls to that entry. */
  experienceCompany?: string;
};

export const isGroupedStack = (
  stack: Project["stack"],
): stack is ProjectStackGroup[] =>
  stack.length > 0 && typeof stack[0] !== "string";

export type Education = {
  institution: string;
  degree: Bilingual;
  period?: string;
};

export type Course = {
  name: Bilingual;
  provider: string;
};

export type SkillGroup = {
  label: Bilingual;
  items: string[];
};

export type FlagCode = "br" | "us" | "es";

export type Language = {
  name: Bilingual;
  level: Bilingual;
  details: Bilingual;
  flag: FlagCode;
};

export type CV = {
  name: string;
  headline: Bilingual;
  tagline: Bilingual;
  /** Short labels for the 4 main practice areas, shown as a row under the title in every theme. */
  disciplines: string[];
  summary: Bilingual;
  contacts: ContactLink[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  courses: Course[];
  skills: SkillGroup[];
  languages: Language[];
};

export const cv: CV = {
  name: "Tiago Duarte",
  headline: {
    en: "Fullstack Software Engineer & Design Engineer",
    pt: "Engenheiro de Software Fullstack & Design Engineer",
  },
  tagline: {
    en: "Can collaborate at any stage: design, frontend (screen code), backend (api), deploy and monitoring at scale for thousands of users",
    pt: "Posso colaborar em qualquer etapa: design, frontend (código da tela), backend (api), deploy e monitoramento em escala pra milhares de usuários",
  },
  disciplines: ["Frontend", "Backend", "UX/UI", "DevOps"],
  summary: {
    en: "I was already coding games for fun, but didn't even know web development was a profession. As an IT technician at Basilio Advogados, I picked up the office's intranet when the company that had built it stopped being able to make changes, kept the system running and even shipped new features. That's when it clicked: what I did for fun was actually a profession.\n\nI started my career as an intern at Globo, working on the micro-frontend library that served all of the company's brands: ge, gshow, globo.com and the publishing teams in general. That's where I built my technical foundation: algorithms, data structures, complexity, design patterns, testing, code review, and the weight of writing code that other teams would consume in a product with an audience of millions.\n\nAfter Globo, videos of a game of mine blew up on YouTube and the average player count exploded. It became a priority overnight. The multiplayer server had been written from scratch, and to handle the new volume I rewrote important pieces: optimized code to reduce CPU usage, and reshaped both the application and database structure to run across multiple servers in parallel. To come back to the web market I picked up freelance work with people from Globo, and it was through one of them that I joined Digital LOA.\n\nToday I'm responsible for the DLOA AI platform, a B2B omnichannel communication solution serving the largest pharmaceutical companies in Brazil. The system integrates with almost all pharmacies in the country, call centers and websites: every patient adherence or medication purchase triggers the right communication sequence for that patient. I work end-to-end: design, front-end, api, database, deploy and monitoring. The platform processes tens of millions of flow executions per month.\n\nI can collaborate at any stage: design, frontend (screen code), backend (api), deploy and monitoring. I work with Scrum/Kanban and GitHub Flow, on teams of any size, and document what I learn at https://tiagoduartedf.github.io/portfolio/blog/, both to consolidate the knowledge for myself and to share it with other developers. Above all, I see myself as a problem solver, with an ownership mindset and a focus on delivering value to the end client.",
    pt: "Eu já programava jogos por diversão, mas nem sabia que existia a profissão de desenvolvedor web. Como técnico de TI no Basilio Advogados peguei pra mexer na intranet quando a empresa que tinha criado parou de conseguir fazer alterações, mantive o sistema de pé e ainda entreguei novas features. Foi ali que percebi: o que eu fazia por diversão era profissão.\n\nComecei minha carreira como estagiário na Globo, trabalhando na biblioteca de micro-frontends que atendia ge, gshow, globo.com e os times de publicação no geral. Construí ali a base técnica: algoritmos, estrutura de dados, complexidade, padrões de projeto, testes, code review, e o peso de escrever código que outros times iam consumir em produto com audiência de milhões.\n\nDepois da Globo, vídeos de um jogo meu estouraram no YouTube e a média de jogadores explodiu. Virou prioridade da noite pro dia. O servidor multiplayer tinha sido escrito do zero, e pra aguentar o volume novo refiz pedaços importantes: otimizei código pra reduzir uso de CPU, e mudei a estrutura da aplicação e do banco pra rodar em múltiplos servidores em paralelo. Pra voltar pro mercado web peguei freelances com a galera da Globo, e foi com uma dessas pessoas que cheguei na Digital LOA.\n\nHoje sou responsável pela plataforma do DLOA AI, solução B2B de comunicação omnichannel que atende as maiores farmacêuticas do Brasil. O sistema integra com quase todas as farmácias do país, call centers e sites: cada adesão ou compra de medicamento dispara a régua certa pro paciente. Atuo ponta a ponta: design, front-end, api, banco, deploy e monitoramento. A plataforma processa dezenas de milhões de execuções de fluxo por mês.\n\nColaboro em qualquer etapa: design, frontend (código da tela), backend (api), deploy e monitoramento. Trabalho com Scrum/Kanban e GitHub Flow, em times de qualquer tamanho, e documento o que aprendo em https://tiagoduartedf.github.io/portfolio/blog/, tanto pra consolidar o conhecimento pra mim quanto pra compartilhar com outros devs. Acima de tudo, me considero resolvedor de problemas, com mentalidade de dono e foco em entregar valor pro cliente final.",
  },
  contacts: [
    {
      kind: "email",
      label: "Email",
      href: "mailto:tiagoduartedf@gmail.com",
      display: "tiagoduartedf@gmail.com",
    },
    {
      kind: "phone",
      label: "Phone",
      href: "tel:+5521970460945",
      display: "+55 21 97046-0945",
    },
    {
      kind: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/tiagoduartedf/",
      display: "in/tiagoduartedf",
    },
    {
      kind: "github",
      label: "GitHub",
      href: "https://github.com/tiagoduartedf",
      display: "github.com/tiagoduartedf",
    },
  ],
  experience: [
    {
      company: "Digital Loa",
      url: "https://digitalloa.com.br",
      role: {
        en: "Fullstack Software Developer",
        pt: "Desenvolvedor de Software Fullstack",
      },
      period: {
        en: "Oct 2025 - Present",
        pt: "Out/2025 - Atual",
      },
      location: { en: "São Paulo · Remote", pt: "São Paulo · Brasil · Remota" },
      summary: {
        en: "For context, same text from About above:\n\nResponsible for the DLOA AI platform, a B2B omnichannel communication solution serving the largest pharmaceutical companies in Brazil. The system integrates with almost all pharmacies in the country, call centers and websites: every patient adherence or medication purchase triggers the right communication sequence for that patient. I work end-to-end: design, front-end, api, database, deploy and monitoring. The platform processes tens of millions of flow executions per month.\n\nThe heart of the system is the flow, modeled as two entities.\n\nConfiguration: the campaign design, assembled visually by the marketing team (low-code). A linked list of typed blocks (send, wait, conditional, tag...) pointing to the next. Waits accept a specific day, X days, or a patient variable; conditionals branch based on patient data.\n\nExecution: a runtime instance that runs a patient through a configuration, with history, a pointer to the current block, and its own state. Many run in parallel (one per patient), applying the type's effect: a send dispatches the message, a conditional picks the branch, a wait holds the pointer until the condition fires.\n\nPersisted as a state machine in PostgreSQL via TypeORM.\n\nFront-end: React/TypeScript SPA, Reactflow on the visual flow builder, TanStack Query on the data-heavy screens, Chart.js on the KPI dashboards.\n\nBack-end: NestJS/Node.js API. Multi-tenant SaaS with layered permissions (per industry and per user). Routes in Swagger, JWT with tenant/plan claims feeding the RBAC.\n\nMessaging: producer/consumer on Azure Service Bus. Workers dispatch per channel (WhatsApp BSP, SMS gateways, email ESP), respecting rate-limits per domain, IP and phone.\n\nInfra: managed cloud behind a load balancer, observability on its own host, automated CI/CD, auxiliary microservices, separate staging environment.\n\nObservability on the Grafana stack: Prometheus for metrics, Pino + Loki for logs, OpenTelemetry + Tempo for tracing, Alertmanager for paging.",
        pt: "Pra contexto, mesmo texto do Sobre mim acima:\n\nResponsável pela plataforma do DLOA AI, solução B2B de comunicação omnichannel que atende as maiores farmacêuticas do Brasil. O sistema integra com quase todas as farmácias do país, call centers e sites: cada adesão ou compra de medicamento dispara a régua certa pro paciente. Atuo ponta a ponta: design, front-end, api, banco, deploy e monitoramento. A plataforma processa dezenas de milhões de execuções de fluxo por mês.\n\nO coração do sistema é o flow, modelado em duas entidades.\n\nConfiguração: o desenho da campanha, montado visualmente pelo time de marketing (low-code). Lista encadeada de blocos tipados (envio, espera, condicional, tag...) apontando pro próximo. Esperas aceitam dia específico, X dias ou variável do paciente; condicionais ramificam com base nos dados do paciente.\n\nExecução: instância runtime que roda um paciente dentro de uma configuração, com histórico, ponteiro pro bloco atual e estado próprio. Várias em paralelo (uma por paciente), aplicando o efeito do tipo: envio dispara a mensagem, condicional escolhe a ramificação, espera segura o ponteiro até a condição disparar.\n\nPersistido como máquina de estados em PostgreSQL via TypeORM.\n\nFront-end: SPA React/TypeScript, Reactflow no builder visual de fluxos, TanStack Query nas telas data-heavy, Chart.js nos dashboards de KPI.\n\nBack-end: API NestJS/Node.js. SaaS multi-tenant com permissionamento em camadas (por indústria e por usuário). Rotas no Swagger, JWT com claims de tenant/plano no RBAC.\n\nMensageria: producer/consumer no Azure Service Bus. Workers despacham por canal (BSP de WhatsApp, gateways de SMS, ESP de email), respeitando rate-limits por domínio, IP e telefone.\n\nInfra: cloud gerenciada atrás de load balancer, observabilidade em host próprio, CI/CD, microserviços auxiliares, homologação separada.\n\nObservabilidade no stack Grafana: Prometheus pras métricas, Pino + Loki pros logs, OpenTelemetry + Tempo pro tracing, Alertmanager pra paging.",
      },
      bullets: {
        // Summary above already walks through each architecture layer with
        // the tech chosen and why. Bullets here would just echo it back as
        // a generic skill list, so the entry intentionally leaves them
        // empty — the stack chips below cover the at-a-glance view.
        en: [],
        pt: [],
      },
      // Chips mirror the techs justified in the summary above, so the at-a-
      // glance stack matches the deep-dive.
      stack: [
        "TypeScript",
        "React",
        "Tailwind",
        "TanStack Query",
        "Reactflow",
        "Chart.js",
        "NestJS",
        "Node.js",
        "Swagger",
        "JWT",
        "PostgreSQL",
        "TypeORM",
        "Azure",
        "AWS",
        "Azure Service Bus",
        "Docker",
        "Nginx",
        "Linux",
        "Grafana",
        "Prometheus",
        "OpenTelemetry",
        "Tempo",
        "Loki",
        "Pino",
        "CI/CD",
        "Jest",
        "english",
      ],
    },
    {
      company: "Freelancer",
      role: {
        en: "Fullstack Developer",
        pt: "Desenvolvedor Fullstack",
      },
      period: {
        en: "Nov 2024 - May 2025",
        pt: "Nov/2024 - Mai/2025",
      },
      location: { en: "Remote", pt: "Remoto" },
      summary: {
        en: "Solo or embedded in teams, from screen design to front and back. Projects of different sizes across institutional sites and web platforms.",
        pt: "Sozinho ou integrado a times, do design das telas ao front e back. Projetos de portes diferentes em sites institucionais e plataformas web.",
      },
      bullets: {
        en: [
          "Main projects:",
          "Several institutional sites in Next.js, one of them for a software house hitting 100/100/100/100 on Lighthouse (performance, accessibility, best practices and SEO).",
          "Web investment platform for a proprietary trading desk, working on the front across different areas: integration with external investment APIs, interactive charts (Chart.js) and payment gateway (Mercado Pago Bricks).",
          "Web platform (UCP) integrating in real time with the game server's systems and events: map, live activity, and support tickets opened by players inside the game and answered by admins on the site. Node.js (Express), MySQL without ORM, Redis and React Query.",
          "Cross-platform mobile app built with a team, working on UI, front and back. React Native, Expo and React Native Web, 100+ Figma screens and 200+ unit tests (Jest + React Testing Library). Back-end in NestJS, MySQL (TypeORM) and a state machine (pending, approved, rejected).",
        ],
        pt: [
          "Principais projetos:",
          "Diversos sites institucionais em Next.js, um deles para uma software house fechando 100/100/100/100 no Lighthouse (performance, acessibilidade, boas práticas e SEO).",
          "Plataforma web de investimentos para uma mesa proprietária, atuando no front em diferentes áreas: integração com APIs externas de investimentos, gráficos interativos (Chart.js) e gateway de pagamento (Mercado Pago Bricks).",
          "Plataforma web (UCP) integrando em tempo real com sistemas e acontecimentos do servidor de jogo: mapa, atividades e tickets de suporte abertos pelo jogador dentro do jogo e respondidos pelo admin no site. Node.js (Express), MySQL sem ORM, Redis e React Query.",
          "App mobile multiplataforma desenvolvido em time, atuando em UI, front e back. React Native, Expo e React Native Web, mais de 100 telas no Figma e mais de 200 testes unitários (Jest + React Testing Library). Back em NestJS, MySQL (TypeORM) e máquina de estados (pending, approved, rejected).",
        ],
      },
      stack: [
        "Next.js",
        "React Native",
        "Expo",
        "NestJS",
        "Express",
        "MySQL",
        "TypeORM",
        "Redis",
        "React Query",
        "Chart.js",
        "Jest",
        "React Testing Library",
      ],
    },
    {
      company: "Globo.com",
      url: "https://globo.com",
      role: {
        en: "Software Development Intern",
        pt: "Estagiário de Desenvolvimento de Software",
      },
      period: {
        en: "Jan 2020 - Jan 2021",
        pt: "Jan/2020 - Jan/2021",
      },
      location: { en: "Rio de Janeiro · Brazil", pt: "Rio de Janeiro e Região, Brasil" },
      summary: {
        en: "I worked on a team that developed and maintained a React library for building micro-frontends, consumed by other Globo teams to assemble the admins of their internal services. Each team-built admin ran as a micro-frontend inside the company's main admin, integrated with the publishing portals of ge, gshow, globo.com and the various publishing teams. The flow: a team spun up an internal API, ran the lib's CLI to scaffold a pre-configured admin, wired up the integration, and on publish it appeared as a new page inside the main admin. Everything Globo-specific (authentication, permission handling, the design system, visual standards and the shared product configurations) was already baked into the library.\n\nOn the technical side: React components configurable via props following Single Responsibility, test coverage with Jest and Enzyme, and interactive Storybook documentation generated from code comments. Walked out with strong foundations in complexity analysis, applied design patterns in React, structured code review and the discipline of shipping code into a high-scale product.",
        pt: "Atuei em um time que desenvolvia e mantinha uma biblioteca React de criação de micro-frontends, consumida por outros times da Globo pra montar os admins dos seus serviços internos. Cada admin criado pelos times rodava como um micro-frontend dentro do admin principal da empresa, integrado aos portais de publicação de ge, gshow, globo.com e dos times de publicação no geral. O fluxo: o time subia uma API interna, rodava a CLI da lib pra gerar um admin pré-configurado, plugava a integração, e ao publicar virava uma página dentro do admin principal. Tudo o que era 'globice' (autenticação, controle de permissões, design system, padrões visuais e configurações comuns entre os produtos) já vinha embarcado na lib.\n\nNo lado técnico: componentes React configuráveis via props seguindo Single Responsibility, cobertura de testes com Jest e Enzyme, e documentação interativa em Storybook gerada a partir dos comentários do código. Saí com base sólida em análise de complexidade, design patterns aplicados em React, code review estruturado e a disciplina de entregar código pra produto de alta escala.",
      },
      bullets: {
        // Summary already walks through the lib's role, the "globice" stack
        // (auth, RBAC, design system, visual standards), the per-component
        // technical breakdown (React/props/SRP, Jest+Enzyme, Storybook) and
        // the technical foundation it built. Bullets here would just echo
        // those points, so the entry intentionally leaves them empty.
        en: [],
        pt: [],
      },
      stack: ["React", "Storybook", "Jest", "Enzyme", "Design Systems", "JavaScript", "Micro-frontends", "Git"],
    },
    {
      company: "Basilio Advogados",
      role: {
        en: "IT Technician",
        pt: "Técnico de TI",
      },
      period: { en: "Apr 2017 - Apr 2019", pt: "Abr/2017 - Abr/2019" },
      location: { en: "Rio de Janeiro · Brazil", pt: "Rio de Janeiro e Região, Brasil" },
      summary: {
        en: "",
        pt: "",
      },
      bullets: {
        en: [
          "Technical support for the lawyers: day-to-day software issues, plus coordinating with court technicians to extend case deadlines when external failures came up.",
          "Automation of manual processes (phone extension registration, employee onboarding): reused my background building game bots to cut down repetitive work for the team.",
          "Maintenance and evolution of the office intranet after the original vendor stopped supporting it: kept the system running and shipped the features the office asked for.",
        ],
        pt: [
          "Suporte técnico aos advogados: resolução de problemas com softwares do dia a dia e contato com técnicos dos tribunais pra adiar prazos quando havia falha externa.",
          "Automação de processos manuais (cadastro de ramais, onboarding de colaboradores): reaproveitei a experiência de fazer bots pra jogos pra cortar trabalho repetitivo do time.",
          "Manutenção e evolução da intranet quando o fornecedor original deixou de dar suporte: mantive o sistema no ar e entreguei as features que o escritório pedia.",
        ],
      },
      stack: ["HTML", "CSS", "JavaScript", "Linux", "Windows Server"],
    },
    {
      company: "MSM Serviços Gerais",
      role: {
        en: "Bilingual Receptionist (2016 Olympics)",
        pt: "Recepcionista Bilíngue (Olimpíadas 2016)",
      },
      period: { en: "2016", pt: "2016" },
      location: { en: "Rio de Janeiro · Brazil", pt: "Rio de Janeiro e Região, Brasil" },
      summary: {
        en: "",
        pt: "",
      },
      bullets: {
        en: [
          "Bilingual front-line contact with the international press accredited to cover the Games: lodging guidance and operational procedures.",
          "Routed requests to the responsible departments and covered shifts across buildings, gates and reception.",
        ],
        pt: [
          "Atendimento bilíngue à imprensa internacional credenciada para a cobertura dos Jogos: orientação sobre hospedagem e procedimentos da operação.",
          "Encaminhamento de demandas aos setores responsáveis e cobertura de turnos em prédios, portões e recepção.",
        ],
      },
      stack: ["english"],
    },
  ],
  projects: [],
  education: [
    {
      institution: "Estácio S.A.",
      degree: {
        en: "Bachelor's degree · Information Systems",
        pt: "Bacharelado · Sistemas de Informação",
      },
      period: "2016 - 2022",
    },
  ],
  // Udemy course list intentionally empty: it wasn't pulling weight on
  // the CV. Theme renderers that still iterate cv.courses (Terminal,
  // VS Code) will produce empty sections; their containers are pruned
  // separately so no empty headings show.
  courses: [],
  skills: [
    {
      label: { en: "Frontend", pt: "Frontend" },
      items: [
        "TypeScript",
        "JavaScript",
        "React",
        "Next.js",
        "React Native",
        "Expo",
        "React Query",
        "HTML",
        "CSS",
        "Tailwind",
        "Jest",
        "React Testing Library",
      ],
    },
    {
      label: { en: "Backend", pt: "Backend" },
      items: ["Node.js", "NestJS", "Express", "TypeScript", "REST", "Swagger", "TypeORM"],
    },
    {
      label: { en: "Infra & DevOps", pt: "Infra & DevOps" },
      items: ["Docker", "Kubernetes", "CI/CD", "AWS", "Azure", "Linux", "Git"],
    },
    {
      label: { en: "Observability", pt: "Observabilidade" },
      items: [
        "Grafana",
        "Prometheus",
        "OpenTelemetry",
        "Tempo",
        "Loki",
        "Pino",
        "Alertmanager",
      ],
    },
    {
      label: { en: "Design", pt: "Design" },
      items: ["Figma", "Design Systems", "UX/UI fundamentals"],
    },
    {
      label: { en: "Methodologies", pt: "Metodologias" },
      items: ["Scrum", "Kanban", "GitHub Flow"],
    },
  ],
  languages: [
    {
      name: { en: "Portuguese", pt: "Português" },
      level: { en: "Native", pt: "Nativo" },
      flag: "br",
      details: {
        en: "Native speaker. Carioca, born and raised in Rio de Janeiro.",
        pt: "Idioma nativo. Carioca, nascido e criado no Rio de Janeiro.",
      },
    },
    {
      name: { en: "English", pt: "Inglês" },
      level: { en: "Advanced", pt: "Avançado" },
      flag: "us",
      details: {
        en: "Strong reading, writing and speaking (self-taught). Worked paid roles handling international press at the 2014 FIFA World Cup and the 2016 Olympic Games.",
        pt: "Boa leitura, escrita e fala (autodidata). Trabalhei remuneradamente com a imprensa internacional na Copa do Mundo 2014 e nas Olimpíadas 2016.",
      },
    },
    {
      name: { en: "Spanish", pt: "Espanhol" },
      level: { en: "Basic", pt: "Básico" },
      flag: "es",
      details: {
        en: "Currently learning. Picking it up through films, music and reading: building reading comprehension first, conversation comes next.",
        pt: "Aprendendo no momento. Estudando por filmes, música e leitura: primeiro construindo a compreensão escrita, depois a conversação.",
      },
    },
  ],
};

/** Kebab-case slug for an experience company name. Used to build per-entry
 *  anchor ids (`cv-experience-<slug>`) and to recognize the `?company=` URL
 *  param that scrolls to a specific job on page load. NFD-normalizes first
 *  so accented letters (ç, ã, é, …) flatten to ASCII before slugifying;
 *  otherwise "MSM Serviços Gerais" would slug as "msm-servi-os-gerais". */
export function experienceSlug(company: string): string {
  return company
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** DOM id for one experience entry. Themes that render experiences as a
 *  static list attach this so the topbar (or a shared link) can scroll
 *  straight to the right entry. */
export function experienceAnchorId(company: string): string {
  return `cv-experience-${experienceSlug(company)}`;
}

/** Disabled placeholder tabs the case-study deck appends after the real
 *  projects. Pure shape, no brand: visitors see that more projects are
 *  coming without having to commit to a name in the data. The tooltip on
 *  hover spells out "em breve" / "coming soon". */
export const comingSoonProjects: Bilingual[] = [
  { en: "Other 1", pt: "Outro 1" },
  { en: "Other 2", pt: "Outro 2" },
];

export const ui = {
  sections: {
    about: { en: "About", pt: "Sobre" },
    experience: { en: "Experience", pt: "Experiência" },
    projects: { en: "Featured Projects", pt: "Projetos em Destaque" },
    skills: { en: "Skills & Stack", pt: "Habilidades & Stack" },
    education: { en: "Education", pt: "Formação" },
    courses: { en: "Courses & Training", pt: "Cursos & Treinamentos" },
    languages: { en: "Languages", pt: "Idiomas" },
    contact: { en: "Contact", pt: "Contato" },
  },
  // One short bilingual blurb per discipline shown next to the four core
  // pillars (Frontend / Backend / UX/UI / DevOps). Themes used to redefine
  // this dictionary verbatim — kept here so a wording tweak is a one-file
  // change.
  disciplineDetails: {
    Frontend: {
      en: "Complex, accessible interfaces",
      pt: "Interfaces complexas e acessíveis",
    },
    Backend: {
      en: "Scalable APIs and services",
      pt: "APIs e serviços escaláveis",
    },
    "UX/UI": {
      en: "Wireframes and prototypes",
      pt: "Wireframes e protótipos",
    },
    DevOps: {
      en: "Cloud, CI/CD and observability",
      pt: "Cloud, CI/CD e observabilidade",
    },
  },
  // Labels for the project case-study deck. Two flavours: "screen" for the
  // app-like themes (Notion/Dark) and "frame" for the cinematic themes
  // (Star Wars/Terminal) where the wording reads better.
  caseStudy: {
    screen: {
      step: { en: "Screen", pt: "Tela" },
      prev: { en: "Previous screen", pt: "Tela anterior" },
      next: { en: "Next screen", pt: "Próxima tela" },
      screen: { en: "Screen", pt: "Tela" },
    },
    frame: {
      step: { en: "Frame", pt: "Frame" },
      prev: { en: "Previous frame", pt: "Frame anterior" },
      next: { en: "Next frame", pt: "Próximo frame" },
      screen: { en: "Frame", pt: "Frame" },
    },
  },
  meta: {
    title: { en: "Tiago Duarte · CV", pt: "Tiago Duarte · Currículo" },
    description: {
      en: "Fullstack developer focused on Frontend: React, Next.js, React Native and Node.",
      pt: "Desenvolvedor Fullstack focado em Frontend: React, Next.js, React Native e Node.",
    },
    pdfDownload: { en: "Download PDF", pt: "Baixar PDF" },
    print: { en: "Print", pt: "Imprimir" },
    theme: { en: "Theme", pt: "Tema" },
    language: { en: "Language", pt: "Idioma" },
    themes: {
      dark: { en: "VS Code", pt: "VS Code" },
      terminal: { en: "Terminal", pt: "Terminal" },
      notion: { en: "Notion", pt: "Notion" },
      starwars: { en: "Star Wars", pt: "Star Wars" },
    },
  },
} as const;

// Lookup helper for the discipline blurbs. `cv.disciplines` is `string[]`, so
// the `as const` keys in `ui.disciplineDetails` don't narrow on direct access;
// this wraps the cast in one spot and returns `null` for unknown disciplines
// so callers can branch on it cleanly.
export function getDisciplineDetail(name: string): Bilingual | null {
  const dict = ui.disciplineDetails as Record<string, Bilingual>;
  return dict[name] ?? null;
}
