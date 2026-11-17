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
      "Cliente HTTP em Go, sem dependÃªncias externas, com retry, backoff exponencial e rate limit. Biblioteca pequena, testÃ¡vel e feita para ser lida.",
    summary:
      "Cliente HTTP em Go com retry, backoff exponencial e rate limit, usando apenas a stdlib.",
    problem:
      "Bibliotecas HTTP costumam trazer dependÃªncias grandes e comportamentos difÃ­ceis de prever quando a rede falha.",
    architecture:
      "API pequena em Go com cliente configurÃ¡vel: transporte HTTP, polÃ­tica de retry, backoff exponencial e limite de requisiÃ§Ãµes. Sem dependÃªncias externas.",
    decisions:
      "Manter tudo na stdlib para reduzir superfÃ­cie de dependÃªncia; expor opÃ§Ãµes explÃ­citas em vez de defaults mÃ¡gicos; tratar erros de rede como parte do fluxo.",
    results:
      "Biblioteca legÃ­vel, testÃ¡vel e fÃ¡cil de embutir em serviÃ§os Go. Serve como estudo de resiliÃªncia sem framework.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "DependÃªncias", value: "0" },
      { label: "Linguagem", value: "Go" },
      { label: "Foco", value: "ResiliÃªncia" },
    ],
    category: "Back-End",
    tags: ["Go", "HTTP", "ResiliÃªncia"],
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
      "Backend em Spring Boot com extensÃ£o Chrome para medir tempo em sites distrativos e devolver um aviso quando Ã© hora de voltar ao foco.",
    summary:
      "Spring Boot + extensÃ£o Chrome para medir tempo em sites distrativos e alertar sobre quebra de foco.",
    problem:
      "Ã‰ difÃ­cil perceber quanto tempo passa em sites de distraÃ§Ã£o sem uma mediÃ§Ã£o externa ao navegador.",
    architecture:
      "API em Spring Boot para registrar sessÃµes e uma extensÃ£o Chrome para coletar tempo por domÃ­nio. Os dados alimentam alertas de foco.",
    decisions:
      "Separar coleta (extensÃ£o) de persistÃªncia (API); manter o backend como fonte de verdade; usar Java/Spring para praticar modelagem e endpoints.",
    results:
      "Sistema funcional que conecta uma extensÃ£o de navegador a um backend real, com fluxo de registro e consulta.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Backend", value: "Spring Boot" },
      { label: "Cliente", value: "Chrome" },
      { label: "Foco", value: "HÃ¡bitos" },
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
      "Sistema de gerenciamento de gastos com apoio de IA. Projeto full stack para organizar transaÃ§Ãµes, categorias e visÃ£o de longo prazo.",
    summary:
      "AplicaÃ§Ã£o de finanÃ§as pessoais com categorizaÃ§Ã£o de transaÃ§Ãµes e apoio de IA.",
    problem:
      "Planilhas manuais nÃ£o dÃ£o uma visÃ£o rÃ¡pida de para onde o dinheiro estÃ¡ indo.",
    architecture:
      "AplicaÃ§Ã£o TypeScript com interface web, categorizaÃ§Ã£o de transaÃ§Ãµes e apoio de IA para organizar os lanÃ§amentos.",
    decisions:
      "ComeÃ§ar pelo fluxo de registrar e categorizar; manter a IA como assistente, nÃ£o como fonte de verdade; priorizar uma visÃ£o simples de longo prazo.",
    results:
      "Projeto full stack com foco em produto, dados e experiÃªncia de uso.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Stack", value: "TypeScript" },
      { label: "Foco", value: "FinanÃ§as" },
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
      "Toolkit de recon para bug bounty com descoberta de subdomÃ­nios, port scan, HTTP probe, headers, segredos e fingerprinting. Stdlib only.",
    summary:
      "CLI de recon para bug bounty: subdomÃ­nios, port scan, HTTP probe e fingerprinting.",
    problem:
      "Recon exige vÃ¡rias ferramentas pequenas e saÃ­das em formatos diferentes.",
    architecture:
      "CLI em Python usando apenas stdlib: descoberta de subdomÃ­nios, port scan, HTTP probe, headers, segredos e fingerprinting.",
    decisions:
      "Stdlib only para rodar em qualquer ambiente; comandos pequenos e composÃ¡veis; saÃ­da legÃ­vel.",
    results:
      "Kit de recon unificado para estudo de superfÃ­cie de ataque e bug bounty.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Linguagem", value: "Python" },
      { label: "DependÃªncias", value: "Stdlib" },
      { label: "Foco", value: "Recon" },
    ],
    category: "Back-End",
    tags: ["Python", "SeguranÃ§a", "CLI"],
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
      "Landing page responsiva para o Treino Seguro 60+, com foco em leitura confortÃ¡vel, hierarquia clara e carregamento leve.",
    summary:
      "Landing page responsiva com foco em legibilidade para o pÃºblico 60+.",
    problem:
      "PÃºblico 60+ precisa de leitura confortÃ¡vel e hierarquia clara em qualquer tela.",
    architecture:
      "PÃ¡gina estÃ¡tica em HTML/CSS, sem build complexo, com layout responsivo e foco em legibilidade.",
    decisions:
      "Priorizar contraste, tamanho de fonte e simplicidade; evitar dependÃªncias para carregar rÃ¡pido.",
    results: "PÃ¡gina leve e acessÃ­vel para apresentar o treino.",
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
    "Desenvolvedor full stack em RibeirÃ£o Preto. Construo do banco Ã  interface: API, banco, painel e a tela que o cliente usa. Gosto de entender o problema antes da primeira linha â€” modelagem, contrato de API e o que acontece quando algo falha.",
  about_secondary:
    "Venho de projetos prÃ³prios e de cliente: um sistema de vendas no WhatsApp em operaÃ§Ã£o, um SaaS de importaÃ§Ã£o com checkout Pix e este site â€” React no front, Express e Postgres no back, autenticaÃ§Ã£o JWT, migrations e deploy na Vercel. Se vocÃª precisa de site, bot ou API, os serviÃ§os e o preÃ§o estÃ£o na pÃ¡gina de serviÃ§os.",
};

export const FALLBACK_SITE: SiteInfo = {
  about_text: FALLBACK_ABOUT.about_text,
  about_secondary: FALLBACK_ABOUT.about_secondary,
  hero_description:
    "Desenvolvedor full stack em RibeirÃ£o Preto. FaÃ§o site de uma pÃ¡gina, bot de WhatsApp, automaÃ§Ã£o e API com Pix â€” preÃ§o fechado, entrega em dias. Aberto a freela e a vaga jÃºnior.",
  hero_phrases: [
    "Full Stack Developer",
    "React & Node.js",
    "Sites, bots e APIs",
    "Java & Spring Boot",
  ],
  stats_years: "4",
  stats_projects: "10",
  skills: FALLBACK_SKILLS,
  github_url: "https://github.com/2jjj",
  linkedin_url: "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/",
  public_email: "pedrosakamoto27@gmail.com",
  site_url: "https://www.pedrosakamoto.site",
  location: "RibeirÃ£o Preto, SP",
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

