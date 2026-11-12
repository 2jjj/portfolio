import type { ResumeData } from "@/types";

/**
 * Modelo de currículo que abre no admin e alimenta a página pública.
 * Tudo aqui é editável em /admin/curriculo e persiste em site_info.resume_data.
 */
export const DEFAULT_RESUME: ResumeData = {
  name: "Pedro Sakamoto",
  title: "Desenvolvedor Back-end · Node.js, Go e PostgreSQL",
  targetRole: "Desenvolvedor Back-end Júnior / Estágio em Engenharia de Software",
  email: "pedrosakamoto27@gmail.com",
  phone: "",
  location: "Ribeirão Preto, SP — remoto ou presencial",
  linkedin: "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/",
  github: "https://github.com/2jjj",
  site: "https://www.pedrosakamoto.site",
  summary:
    "Desenvolvedor back-end em formação, cursando Engenharia da Computação na Unaerp. Construo APIs, modelo dados e coloco sistemas em produção — do banco à interface. Meus projetos atuais incluem um bot de vendas em WhatsApp com catálogo real, um SaaS de gestão de importações com pagamentos e um dashboard que automatiza busca de vagas e candidaturas. Gosto de código legível, testes e da parte que precisa funcionar quando ninguém está olhando.",
  experiences: [
    {
      role: "Desenvolvedor Full Stack — Freelance",
      company: "Kamikaze Sports",
      startDate: "2025",
      endDate: "Atual",
      location: "Ribeirão Preto, SP",
      description:
        "Construí um sistema de vendas por WhatsApp com catálogo sincronizado da loja, 219 produtos e 568 variações.\nModelei o banco em SQLite com categorias muitos-para-muitos, controle de estoque e revalidação no fechamento do pedido.\nImplementei painel operacional com inbox, Kanban, métricas, backup e retenção de mensagens.\nCobri o fluxo com 63 testes automatizados (fluxo de pedido, estoque, categorias e catálogo).",
    },
    {
      role: "Fundador e Desenvolvedor",
      company: "StartANewDay",
      startDate: "2025",
      endDate: "Atual",
      location: "Remoto",
      description:
        "Criei um dashboard local que pesquisa vagas em 4 fontes públicas, calcula compatibilidade com o perfil e organiza candidaturas.\nIntegrei GitHub, LinkedIn e as 4 fontes de vagas com automação de navegador via Playwright.\nDesenhei o fluxo de dados, a API em Node.js/Express e a interface em React.\nReutilizei o mesmo motor na página pública de vagas deste portfólio, com 41 vagas na última sincronização.",
    },
    {
      role: "Desenvolvedor Full Stack",
      company: "ImportFlow",
      startDate: "2025",
      endDate: "Atual",
      location: "Remoto",
      description:
        "Desenvolvi um SaaS de gestão de importações com React, TypeScript e Supabase.\nIntegrei 2 gateways de pagamento — Stripe (cartão, Pix e boleto) e InfinitePay — com webhooks assinados e conciliação de pagamentos.\nImplementei autenticação, painel administrativo, criação de usuários e notificações de venda no Discord.\nEstruturei Edge Functions, políticas de acesso e ambiente de desenvolvimento com dados de teste.",
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
        "Vitrine estática de 26 cartas com painel local, automação de anúncios e deploy na Vercel.",
      tech: "HTML, CSS, JavaScript, Chrome DevTools Protocol",
      link: "https://site-tau-mocha-13.vercel.app",
    },
    {
      name: "badgesPlus",
      description:
        "Plugin para Vencord que adiciona badges personalizados e cache de perfis no Discord.",
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
  title: "Back-end Developer · Node.js, Go and PostgreSQL",
  targetRole: "Junior Back-end Developer / Software Engineering Intern",
  location: "Ribeirão Preto, Brazil — remote or on-site",
  summary:
    "Back-end developer in progress, studying Computer Engineering at Unaerp. I build APIs, model data and ship systems to production, from database to interface. Current projects include a WhatsApp sales bot with a real store catalogue, an import-management SaaS with payments and a dashboard that automates job search and applications. I care about readable code, tests and the parts that must work when nobody is watching.",
  experiences: [
    {
      role: "Full Stack Developer — Freelance",
      company: "Kamikaze Sports",
      startDate: "2025",
      endDate: "Present",
      location: "Ribeirão Preto, Brazil",
      description:
        "Built a WhatsApp sales system with a catalogue synced to the store: 219 products and 568 variants.\nModelled the SQLite database with many-to-many categories, stock control and revalidation when the order is closed.\nShipped an operations panel with inbox, Kanban, metrics, backup and message retention.\nCovered the flow with 63 automated tests (orders, stock, categories and catalogue).",
    },
    {
      role: "Founder and Developer",
      company: "StartANewDay",
      startDate: "2025",
      endDate: "Present",
      location: "Remote",
      description:
        "Created a local dashboard that searches jobs across 4 public sources, scores fit against the profile and organises applications.\nIntegrated GitHub, LinkedIn and the 4 job sources through Playwright browser automation.\nDesigned the data flow, the Node.js/Express API and the React interface.\nReused the same engine on the public jobs page of this portfolio, with 41 jobs in the latest sync.",
    },
    {
      role: "Full Stack Developer",
      company: "ImportFlow",
      startDate: "2025",
      endDate: "Present",
      location: "Remote",
      description:
        "Developed an import-management SaaS with React, TypeScript and Supabase.\nIntegrated 2 payment gateways — Stripe (card, Pix and boleto) and InfinitePay — with signed webhooks and payment reconciliation.\nImplemented authentication, an admin panel, user provisioning and sales notifications on Discord.\nStructured Edge Functions, access policies and a development environment seeded with test data.",
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
  projects: DEFAULT_RESUME.projects.map((project) => ({
    ...project,
    description:
      project.description
        .replace("Sistema de vendas no WhatsApp para loja de artes marciais: catálogo real, estoque, pedidos e painel operacional.", "WhatsApp sales system for a martial-arts store: live catalogue, stock, orders and an operations panel.")
        .replace("SaaS de gestão de importações com checkout Stripe, Pix, webhooks e painel administrativo.", "Import-management SaaS with Stripe checkout, Pix, webhooks and an admin panel.")
        .replace("Dashboard de carreira que busca vagas, calcula match com o perfil e organiza candidaturas.", "Career dashboard that searches jobs, scores profile fit and organises applications.")
        .replace("Vitrine estática de 26 cartas com painel local, automação de anúncios e deploy na Vercel.", "Static showcase of 26 cards with a local panel, listing automation and Vercel deploy.")
        .replace("Plugin para Vencord que adiciona badges personalizados e cache de perfis no Discord.", "Vencord plugin that adds custom badges and profile caching to Discord."),
  })),
  languages: [
    { name: "Portuguese", level: "Native" },
    { name: "English", level: "Intermediate — advanced technical reading" },
  ],
};

export function resumeFor(lang: "pt" | "en"): ResumeData {
  return lang === "en" ? DEFAULT_RESUME_EN : DEFAULT_RESUME;
}
