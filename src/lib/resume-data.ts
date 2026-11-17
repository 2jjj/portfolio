import type { ResumeData } from "@/types";

/**
 * Modelo de currÃ­culo que abre no admin e alimenta a pÃ¡gina pÃºblica.
 * Tudo aqui Ã© editÃ¡vel em /admin/curriculo e persiste em site_info.resume_data.
 */
export const DEFAULT_RESUME: ResumeData = {
  name: "Pedro Sakamoto",
  title: "Desenvolvedor Full Stack Â· React, Node.js e PostgreSQL",
  targetRole: "Desenvolvedor Full Stack JÃºnior / EstÃ¡gio em Engenharia de Software",
  email: "pedrosakamoto27@gmail.com",
  phone: "(16) 99991-6464",
  location: "RibeirÃ£o Preto, SP â€” remoto ou presencial",
  linkedin: "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/",
  github: "https://github.com/2jjj",
  site: "https://www.pedrosakamoto.site",
  summary:
    "Desenvolvedor full stack em RibeirÃ£o Preto, cursando Engenharia da ComputaÃ§Ã£o na Unaerp. Construo do banco Ã  interface: um sistema de vendas no WhatsApp em operaÃ§Ã£o para uma loja real, um SaaS de importaÃ§Ã£o com checkout Pix e um dashboard que automatiza a busca por vagas e as candidaturas. Disponibilidade imediata para estÃ¡gio, vaga jÃºnior ou projeto freelance.",
  experiences: [
    {
      role: "Desenvolvedor Full Stack â€” Freelance",
      company: "Kamikaze Sports",
      startDate: "2025",
      endDate: "Atual",
      location: "RibeirÃ£o Preto, SP",
      description:
        "Modelei o banco em SQLite com categorias muitos-para-muitos, controle de estoque e revalidaÃ§Ã£o no fechamento do pedido.\nImplementei painel operacional com inbox, Kanban, mÃ©tricas, backup e retenÃ§Ã£o de mensagens.\nCobri pedido, estoque e catÃ¡logo com 63 testes automatizados.",
    },
    {
      role: "Fundador e Desenvolvedor",
      company: "StartANewDay",
      startDate: "2025",
      endDate: "Atual",
      location: "Remoto",
      description:
        "ConstruÃ­ um dashboard local que busca vagas em 4 fontes pÃºblicas, calcula aderÃªncia ao perfil e organiza candidaturas.\nIntegrei GitHub, LinkedIn e as fontes de vagas com automaÃ§Ã£o de navegador em Playwright, API em Node.js/Express e interface em React.",
    },
    {
      role: "Desenvolvedor Full Stack",
      company: "ImportFlow",
      startDate: "2025",
      endDate: "Atual",
      location: "Remoto",
      description:
        "ConstruÃ­ o SaaS de gestÃ£o de importaÃ§Ãµes em React, TypeScript e Supabase, com autenticaÃ§Ã£o e painel administrativo.\nIntegrei 2 gateways de pagamento â€” Stripe (cartÃ£o, Pix e boleto) e InfinitePay â€” com webhooks assinados e conciliaÃ§Ã£o.",
    },
  ],
  education: [
    {
      degree: "Bacharelado em Engenharia da ComputaÃ§Ã£o",
      institution: "Unaerp â€” Universidade de RibeirÃ£o Preto",
      startDate: "",
      endDate: "Cursando",
      description:
        "FormaÃ§Ã£o com base em algoritmos, estrutura de dados, sistemas operacionais, redes e engenharia de software.",
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
        "Sistema de vendas no WhatsApp para loja de artes marciais: catÃ¡logo real, estoque, pedidos e painel operacional.",
      tech: "TypeScript, Node.js, Baileys, Hono, SQLite, Playwright, Docker",
      link: "https://www.pedrosakamoto.site/projetos/kamikaze-bot",
    },
    {
      name: "ImportFlow",
      description:
        "SaaS de gestÃ£o de importaÃ§Ãµes com checkout Stripe, Pix, webhooks e painel administrativo.",
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
      name: "Arquivo â€” vitrine PokÃ©mon",
      description:
        "Vitrine de 25 cartas com estado, preÃ§o e comparaÃ§Ã£o com a Liga; painel local e anÃºncio na OLX e no Facebook.",
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
    { name: "PortuguÃªs", level: "Nativo" },
    { name: "InglÃªs", level: "IntermediÃ¡rio â€” leitura tÃ©cnica avanÃ§ada" },
  ],
  certifications: [],
  updatedAt: "",
};

export const DEFAULT_RESUME_EN: ResumeData = {
  ...DEFAULT_RESUME,
  title: "Full Stack Developer Â· React, Node.js and PostgreSQL",
  targetRole: "Junior Full Stack Developer / Software Engineering Intern",
  location: "RibeirÃ£o Preto, Brazil â€” remote or on-site",
  summary:
    "Full stack developer based in RibeirÃ£o Preto, Brazil, studying Computer Engineering at Unaerp. I build from database to interface: a WhatsApp sales system running for a real store, an import SaaS with Pix checkout and a dashboard that automates job search and applications. Available now for an internship, junior role or freelance project.",
  experiences: [
    {
      role: "Full Stack Developer â€” Freelance",
      company: "Kamikaze Sports",
      startDate: "2025",
      endDate: "Present",
      location: "RibeirÃ£o Preto, Brazil",
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
        "Built an import-management SaaS with React, TypeScript and Supabase, including authentication and an admin panel.\nIntegrated 2 payment gateways â€” Stripe (card, Pix and boleto) and InfinitePay â€” with signed webhooks and reconciliation.",
    },
  ],
  education: DEFAULT_RESUME.education.map((education) => ({
    ...education,
    degree: "B.Sc. in Computer Engineering",
    institution: "Unaerp â€” University of RibeirÃ£o Preto",
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
      name: "Arquivo â€” PokÃ©mon showcase",
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
    { name: "English", level: "Intermediate â€” advanced technical reading" },
  ],
};

export function resumeFor(lang: "pt" | "en"): ResumeData {
  return lang === "en" ? DEFAULT_RESUME_EN : DEFAULT_RESUME;
}
