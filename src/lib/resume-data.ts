import type { ResumeData } from "@/types";

/**
 * Modelo de currículo que abre no admin e alimenta a página pública.
 * Tudo aqui é editável em /admin/curriculo e persiste em site_info.resume_data.
 */
export const DEFAULT_RESUME: ResumeData = {
  name: "Pedro Sakamoto",
  title: "Desenvolvedor Full Stack · React, Node.js e PostgreSQL",
  targetRole: "Desenvolvedor Full Stack Júnior / Estágio em Engenharia de Software",
  email: "pedrosakamoto27@gmail.com",
  phone: "",
  location: "Ribeirão Preto, SP — remoto ou presencial",
  linkedin: "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/",
  github: "https://github.com/2jjj",
  site: "https://www.pedrosakamoto.site",
  summary:
    "Desenvolvedor full stack em Ribeirão Preto, cursando Engenharia da Computação na Unaerp. Construo do banco à interface: um sistema de vendas no WhatsApp em operação para uma loja real, um SaaS de importação com checkout Pix e um dashboard que automatiza a busca por vagas e as candidaturas. Disponibilidade imediata para estágio, vaga júnior ou projeto freelance.",
  experiences: [
    {
      role: "Desenvolvedor Full Stack — Freelance",
      company: "Kamikaze Sports",
      startDate: "2025",
      endDate: "Atual",
      location: "Ribeirão Preto, SP",
      description:
        "Modelei o banco em SQLite com categorias muitos-para-muitos, controle de estoque e revalidação no fechamento do pedido.\nImplementei painel operacional com inbox, Kanban, métricas, backup e retenção de mensagens.\nCobri pedido, estoque e catálogo com 63 testes automatizados.",
    },
    {
      role: "Fundador e Desenvolvedor",
      company: "StartANewDay",
      startDate: "2025",
      endDate: "Atual",
      location: "Remoto",
      description:
        "Construí um dashboard local que busca vagas em 4 fontes públicas, calcula aderência ao perfil e organiza candidaturas.\nIntegrei GitHub, LinkedIn e as fontes de vagas com automação de navegador em Playwright, API em Node.js/Express e interface em React.",
    },
    {
      role: "Desenvolvedor Full Stack",
      company: "ImportFlow",
      startDate: "2025",
      endDate: "Atual",
      location: "Remoto",
      description:
        "Construí o SaaS de gestão de importações em React, TypeScript e Supabase, com autenticação e painel administrativo.\nIntegrei 2 gateways de pagamento — Stripe (cartão, Pix e boleto) e InfinitePay — com webhooks assinados e conciliação.",
    },
  ],
  education: [
    {
      degree: "Bacharelado em Engenharia da Computação",
      institution: "Unaerp — Universidade de Ribeirão Preto",
      startDate: "",
      endDate: "Cursando",
      description:
        "Formação com base em algoritmos, estrutura de dados, sistemas operacionais, redes e engenharia de software.",
    },
  ],
  skills: [
    { name: "Node.js", category: "Back-End" },
    { name: "TypeScript", category: "Linguagem" },
    { name: "JavaScript", category: "Linguagem" },
    { name: "Go", category: "Linguagem" },
    { name: "Java", category: "Linguagem" },
    { name: "Python", category: "Linguagem" },
    { name: "Express", category: "Back-End" },
    { name: "Spring Boot", category: "Back-End" },
    { name: "REST APIs", category: "Back-End" },
    { name: "PostgreSQL", category: "Banco de Dados" },
    { name: "SQL", category: "Banco de Dados" },
    { name: "SQLite", category: "Banco de Dados" },
    { name: "Docker", category: "DevOps" },
    { name: "Git e GitHub Actions", category: "DevOps" },
    { name: "Linux", category: "DevOps" },
    { name: "Vercel", category: "DevOps" },
    { name: "React", category: "Front-End" },
    { name: "Next.js", category: "Front-End" },
    { name: "Tailwind CSS", category: "Front-End" },
    { name: "Testes automatizados", category: "Qualidade" },
    { name: "Playwright", category: "Qualidade" },
    { name: "Supabase", category: "Back-End" },
  ],
  projects: [
    {
      name: "Kamikaze Bot",
      description:
        "Sistema de vendas no WhatsApp para loja de artes marciais: catálogo real, estoque, pedidos e painel operacional.",
      tech: "TypeScript, Node.js, Baileys, Hono, SQLite, Playwright, Docker",
      link: "https://www.pedrosakamoto.site/projetos/kamikaze-bot",
    },
    {
      name: "ImportFlow",
      description:
        "SaaS de gestão de importações com checkout Stripe, Pix, webhooks e painel administrativo.",
      tech: "React, TypeScript, Supabase, Stripe, Edge Functions",
      link: "https://www.pedrosakamoto.site/projetos/importflow",
    },
    {
      name: "StartANewDay",
      description:
        "Dashboard de carreira que busca vagas, calcula match com o perfil e organiza candidaturas.",
      tech: "Node.js, Express, React, Playwright, IA",
      link: "https://www.pedrosakamoto.site/vagas",
    },
    {
      name: "Arquivo — vitrine Pokémon",
      description:
        "Vitrine de 25 cartas com estado, preço e comparação com a Liga; painel local e anúncio na OLX e no Facebook.",
      tech: "HTML, CSS, JavaScript, Chrome DevTools Protocol",
      link: "https://site-tau-mocha-13.vercel.app",
    },
    {
      name: "badgesPlus",
      description:
        "Plugin Vencord que mostra a badge do perfil direto no chat e na lista de membros, com busca por badge no servidor.",
      tech: "TypeScript, React, Vencord API",
      link: "https://github.com/2jjj/Vencord",
    },
  ],
  languages: [
    { name: "Português", level: "Nativo" },
    { name: "Inglês", level: "Intermediário — leitura técnica avançada" },
  ],
  certifications: [],
  updatedAt: "",
};

export const DEFAULT_RESUME_EN: ResumeData = {
  ...DEFAULT_RESUME,
  title: "Full Stack Developer · React, Node.js and PostgreSQL",
  targetRole: "Junior Full Stack Developer / Software Engineering Intern",
  location: "Ribeirão Preto, Brazil — remote or on-site",
  summary:
    "Full stack developer based in Ribeirão Preto, Brazil, studying Computer Engineering at Unaerp. I build from database to interface: a WhatsApp sales system running for a real store, an import SaaS with Pix checkout and a dashboard that automates job search and applications. Available now for an internship, junior role or freelance project.",
  experiences: [
    {
      role: "Full Stack Developer — Freelance",
      company: "Kamikaze Sports",
      startDate: "2025",
      endDate: "Present",
      location: "Ribeirão Preto, Brazil",
      description:
        "Designed the SQLite database with many-to-many categories, stock control and revalidation when the order is closed.\nShipped an operations panel with inbox, Kanban, metrics, backup and message retention.\nTested orders, stock and catalogue with 63 automated tests.",
    },
    {
      role: "Founder and Developer",
      company: "StartANewDay",
      startDate: "2025",
      endDate: "Present",
      location: "Remote",
      description:
        "Created a local dashboard that searches jobs across 4 public sources, scores fit against the profile and organises applications.\nIntegrated GitHub, LinkedIn and the job sources through Playwright browser automation, a Node.js/Express API and a React interface.",
    },
    {
      role: "Full Stack Developer",
      company: "ImportFlow",
      startDate: "2025",
      endDate: "Present",
      location: "Remote",
      description:
        "Built an import-management SaaS with React, TypeScript and Supabase, including authentication and an admin panel.\nIntegrated 2 payment gateways — Stripe (card, Pix and boleto) and InfinitePay — with signed webhooks and reconciliation.",
    },
  ],
  education: DEFAULT_RESUME.education.map((education) => ({
    ...education,
    degree: "B.Sc. in Computer Engineering",
    institution: "Unaerp — University of Ribeirão Preto",
    endDate: "In progress",
    description:
      "Coursework in algorithms, data structures, operating systems, networks and software engineering.",
  })),
  skills: DEFAULT_RESUME.skills.map((skill) => ({
    ...skill,
    name:
      skill.name === "Git e GitHub Actions"
        ? "Git and GitHub Actions"
        : skill.name === "Testes automatizados"
          ? "Automated testing"
          : skill.name,
    category:
      skill.category === "Linguagem"
        ? "Language"
        : skill.category === "Banco de Dados"
          ? "Database"
          : skill.category === "Qualidade"
            ? "Quality"
            : skill.category,
  })),
  projects: [
    {
      name: "Kamikaze Bot",
      description:
        "WhatsApp sales system for a martial-arts store: live catalogue, stock, orders and an operations panel.",
      tech: "TypeScript, Node.js, Baileys, Hono, SQLite, Playwright, Docker",
      link: "https://www.pedrosakamoto.site/projetos/kamikaze-bot",
    },
    {
      name: "ImportFlow",
      description:
        "Import-management SaaS with Stripe checkout (card, Pix and boleto), webhooks and an admin panel.",
      tech: "React, TypeScript, Supabase, Stripe, Edge Functions",
      link: "https://www.pedrosakamoto.site/projetos/importflow",
    },
    {
      name: "StartANewDay",
      description:
        "Career dashboard that searches jobs, scores profile fit and organises applications.",
      tech: "Node.js, Express, React, Playwright, AI",
      link: "https://www.pedrosakamoto.site/projetos/startanewday",
    },
    {
      name: "Arquivo — Pokémon showcase",
      description:
        "25-card showcase with condition, pricing and Liga comparison; local panel plus OLX and Facebook listings.",
      tech: "HTML, CSS, JavaScript, Chrome DevTools Protocol",
      link: "https://www.pedrosakamoto.site/projetos/arquivo-pokemon",
    },
    {
      name: "badgesPlus",
      description:
        "Vencord plugin that shows profile badges in chat and in the member list, with badge search across the server.",
      tech: "TypeScript, React, Vencord API",
      link: "https://github.com/2jjj/Vencord",
    },
  ],
  languages: [
    { name: "Portuguese", level: "Native" },
    { name: "English", level: "Intermediate — advanced technical reading" },
  ],
};

export function resumeFor(lang: "pt" | "en"): ResumeData {
  return lang === "en" ? DEFAULT_RESUME_EN : DEFAULT_RESUME;
}
