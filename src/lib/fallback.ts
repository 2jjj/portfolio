import type { AboutData, Project, SiteInfo, Skill } from "@/types";

export const FALLBACK_SKILLS: Skill[] = [
  { title: "Node.js", category: "Back-End", level: 80, color: "#00D4FF" },
  { title: "PostgreSQL", category: "Banco de Dados", level: 70, color: "#336791" },
  { title: "TypeScript", category: "Linguagem", level: 78, color: "#3178C6" },
  { title: "Express", category: "Back-End", level: 75, color: "#A5F3FF" },
  { title: "Docker", category: "DevOps", level: 60, color: "#2496ED" },
  { title: "Go", category: "Back-End", level: 40, color: "#00ADD8" },
  { title: "Spring Boot", category: "Back-End", level: 35, color: "#6DB33F" },
  { title: "Git", category: "DevOps", level: 80, color: "#FF6B35" },
];

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 9001,
    slug: "gofetch",
    title: "gofetch",
    description:
      "Cliente HTTP em Go, sem dependências externas, com retry, backoff exponencial e rate limit. Biblioteca pequena, testável e feita para ser lida.",
    summary:
      "Cliente HTTP em Go com retry, backoff exponencial e rate limit, usando apenas a stdlib.",
    problem:
      "Bibliotecas HTTP costumam trazer dependências grandes e comportamentos difíceis de prever quando a rede falha.",
    architecture:
      "API pequena em Go com cliente configurável: transporte HTTP, política de retry, backoff exponencial e limite de requisições. Sem dependências externas.",
    decisions:
      "Manter tudo na stdlib para reduzir superfície de dependência; expor opções explícitas em vez de defaults mágicos; tratar erros de rede como parte do fluxo.",
    results:
      "Biblioteca legível, testável e fácil de embutir em serviços Go. Serve como estudo de resiliência sem framework.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Dependências", value: "0" },
      { label: "Linguagem", value: "Go" },
      { label: "Foco", value: "Resiliência" },
    ],
    category: "Back-End",
    tags: ["Go", "HTTP", "Resiliência"],
    image: "/placeholder.svg",
    github: "https://github.com/2jjj/gofetch",
    live: "",
    featured: 1,
    order_index: 1,
    created_at: "2026-09-17T00:00:00.000Z",
    updated_at: "2026-09-17T00:00:00.000Z",
  },
  {
    id: 9002,
    slug: "detoxdigital",
    title: "detoxdigital",
    description:
      "Backend em Spring Boot com extensão Chrome para medir tempo em sites distrativos e devolver um aviso quando é hora de voltar ao foco.",
    summary:
      "Spring Boot + extensão Chrome para medir tempo em sites distrativos e alertar sobre quebra de foco.",
    problem:
      "É difícil perceber quanto tempo passa em sites de distração sem uma medição externa ao navegador.",
    architecture:
      "API em Spring Boot para registrar sessões e uma extensão Chrome para coletar tempo por domínio. Os dados alimentam alertas de foco.",
    decisions:
      "Separar coleta (extensão) de persistência (API); manter o backend como fonte de verdade; usar Java/Spring para praticar modelagem e endpoints.",
    results:
      "Sistema funcional que conecta uma extensão de navegador a um backend real, com fluxo de registro e consulta.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Backend", value: "Spring Boot" },
      { label: "Cliente", value: "Chrome" },
      { label: "Foco", value: "Hábitos" },
    ],
    category: "Full Stack",
    tags: ["Java", "Spring Boot", "Chrome Extension"],
    image: "/placeholder.svg",
    github: "https://github.com/2jjj/detoxdigital",
    live: "",
    featured: 1,
    order_index: 2,
    created_at: "2026-07-26T00:00:00.000Z",
    updated_at: "2026-07-26T00:00:00.000Z",
  },
  {
    id: 9003,
    slug: "fintrack",
    title: "FinTrack",
    description:
      "Sistema de gerenciamento de gastos com apoio de IA. Projeto full stack para organizar transações, categorias e visão de longo prazo.",
    summary:
      "Aplicação de finanças pessoais com categorização de transações e apoio de IA.",
    problem:
      "Planilhas manuais não dão uma visão rápida de para onde o dinheiro está indo.",
    architecture:
      "Aplicação TypeScript com interface web, categorização de transações e apoio de IA para organizar os lançamentos.",
    decisions:
      "Começar pelo fluxo de registrar e categorizar; manter a IA como assistente, não como fonte de verdade; priorizar uma visão simples de longo prazo.",
    results:
      "Projeto full stack com foco em produto, dados e experiência de uso.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Stack", value: "TypeScript" },
      { label: "Foco", value: "Finanças" },
      { label: "IA", value: "Apoio" },
    ],
    category: "Full Stack",
    tags: ["TypeScript", "IA", "PostgreSQL"],
    image: "/placeholder.svg",
    github: "https://github.com/2jjj/FinTrack",
    live: "",
    featured: 0,
    order_index: 3,
    created_at: "2026-07-28T00:00:00.000Z",
    updated_at: "2026-07-28T00:00:00.000Z",
  },
  {
    id: 9004,
    slug: "reconkit",
    title: "reconkit",
    description:
      "Toolkit de recon para bug bounty com descoberta de subdomínios, port scan, HTTP probe, headers, segredos e fingerprinting. Stdlib only.",
    summary:
      "CLI de recon para bug bounty: subdomínios, port scan, HTTP probe e fingerprinting.",
    problem:
      "Recon exige várias ferramentas pequenas e saídas em formatos diferentes.",
    architecture:
      "CLI em Python usando apenas stdlib: descoberta de subdomínios, port scan, HTTP probe, headers, segredos e fingerprinting.",
    decisions:
      "Stdlib only para rodar em qualquer ambiente; comandos pequenos e composáveis; saída legível.",
    results:
      "Kit de recon unificado para estudo de superfície de ataque e bug bounty.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Linguagem", value: "Python" },
      { label: "Dependências", value: "Stdlib" },
      { label: "Foco", value: "Recon" },
    ],
    category: "Back-End",
    tags: ["Python", "Segurança", "CLI"],
    image: "/placeholder.svg",
    github: "https://github.com/2jjj/reconkit",
    live: "",
    featured: 0,
    order_index: 4,
    created_at: "2026-09-17T00:00:00.000Z",
    updated_at: "2026-09-17T00:00:00.000Z",
  },
  {
    id: 9005,
    slug: "treino-seguro-60",
    title: "Treino Seguro 60+",
    description:
      "Landing page responsiva para o Treino Seguro 60+, com foco em leitura confortável, hierarquia clara e carregamento leve.",
    summary:
      "Landing page responsiva com foco em legibilidade para o público 60+.",
    problem:
      "Público 60+ precisa de leitura confortável e hierarquia clara em qualquer tela.",
    architecture:
      "Página estática em HTML/CSS, sem build complexo, com layout responsivo e foco em legibilidade.",
    decisions:
      "Priorizar contraste, tamanho de fonte e simplicidade; evitar dependências para carregar rápido.",
    results: "Página leve e acessível para apresentar o treino.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Stack", value: "HTML/CSS" },
      { label: "Foco", value: "Acessibilidade" },
      { label: "Peso", value: "Leve" },
    ],
    category: "Front-End",
    tags: ["HTML", "CSS", "Landing Page"],
    image: "/placeholder.svg",
    github: "https://github.com/2jjj/treino-seguro-60",
    live: "",
    featured: 0,
    order_index: 5,
    created_at: "2026-10-20T00:00:00.000Z",
    updated_at: "2026-10-20T00:00:00.000Z",
  },
];

export const FALLBACK_ABOUT: AboutData = {
  about_text:
    "Desenvolvedor back-end com foco em Node.js, Go e PostgreSQL. Gosto de entender o problema antes de escrever a primeira linha: modelagem, contratos de API, queries e o que acontece quando algo falha.",
  about_secondary:
    "Venho de projetos próprios — APIs, bots para Discord e sistemas com painel administrativo. Hoje aprofundo Go, Docker e Java Spring. Este site é um deles: React no front, Express e Postgres no back, autenticação JWT, migrations e deploy na Vercel.",
};

export const FALLBACK_SITE: SiteInfo = {
  about_text: FALLBACK_ABOUT.about_text,
  about_secondary: FALLBACK_ABOUT.about_secondary,
  hero_description:
    "Desenvolvedor back-end com foco em Node.js, Go e PostgreSQL. Construo APIs, modelo dados e cuido da parte que precisa funcionar quando ninguém está olhando.",
  hero_phrases: [
    "Back-end Developer",
    "Node.js & PostgreSQL",
    "APIs & Dados",
    "Go & Docker",
  ],
  stats_years: "4",
  stats_projects: "10",
  skills: FALLBACK_SKILLS,
  github_url: "https://github.com/2jjj",
  linkedin_url: "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/",
  public_email: "pedrosakamoto27@gmail.com",
  site_url: "https://www.pedrosakamoto.site",
  location: "Ribeirão Preto, SP",
  availability: "Disponibilidade imediata",
  resume_path: "/curriculo",
};

export const FALLBACK_GITHUB_REPOS = FALLBACK_PROJECTS.filter(
  (project) => Boolean(project.github)
).map((project) => ({
  id: project.id,
  name: project.title,
  full_name: `2jjj/${project.title}`,
  description: project.summary || project.description,
  homepage: project.live || "",
  html_url: project.github,
  language: project.tags[0] || null,
  topics: project.tags,
  stargazers_count: 0,
  forks_count: 0,
  open_issues_count: 0,
  created_at: project.created_at,
  updated_at: project.updated_at,
  pushed_at: project.updated_at,
  default_branch: "main",
  archived: false,
  fork: false,
  image: "",
}));

