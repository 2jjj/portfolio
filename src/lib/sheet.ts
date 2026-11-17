/** Manifesto das tiras do contact sheet: cada projeto vira uma corrida de quadros. */
export type SheetRun = {
  slug: string;
  title: string;
  note: string;
  meta: string;
  year: string;
  frames: string[];
  video?: string;
};

export const SHEET_RUNS: SheetRun[] = [
  {
    slug: "kamikaze-bot",
    title: "Kamikaze Bot",
    note: "Vendas pelo WhatsApp para a Kamikaze Sports: catálogo, variação, pedido e painel. 219 produtos, 568 variações, 63 testes.",
    meta: "Full stack · vendido",
    year: "2025",
    frames: [
      "/projetos/kamikaze/catalogo.png",
      "/projetos/kamikaze/inbox.png",
      "/projetos/kamikaze/kanban.png",
      "/projetos/kamikaze/pedidos.png",
      "/projetos/kamikaze/produto.png",
      "/projetos/kamikaze/metricas.png",
    ],
    video: "/projetos/kamikaze/demo.mp4",
  },
  {
    slug: "importflow",
    title: "ImportFlow",
    note: "SaaS de importação com checkout Pix: dois gateways (Stripe + InfinitePay), Pix e boleto, cinco Edge Functions e webhook com HMAC.",
    meta: "SaaS · autorais",
    year: "2025",
    frames: [
      "/projetos/importflow/painel.png",
      "/projetos/importflow/cover.png",
    ],
  },
  {
    slug: "startanewday",
    title: "StartANewDay",
    note: "Máquina de vagas: coleta, filtro de Brasil e de stack júnior, proposta automática em 99Freelas e aviso no Discord. Tudo local, nada sai do PC.",
    meta: "Automação · em produção",
    year: "2025",
    frames: [
      "/projetos/startanewday/pipeline.png",
      "/projetos/startanewday/cover.png",
    ],
  },
  {
    slug: "arquivo-pokemon",
    title: "Arquivo",
    note: "Acervo de cartas com preço por edição: 25 cartas, 16 abaixo da mediana da Liga e venda fechada.",
    meta: "Full stack · autorais",
    year: "2024",
    frames: [
      "/projetos/arquivo/acervo.jpg",
      "/projetos/arquivo/hero.jpg",
      "/projetos/arquivo/mewtwo.jpg",
      "/projetos/arquivo/liga.jpg",
    ],
  },
  {
    slug: "fintrack",
    title: "FinTrack",
    note: "Controle financeiro com OCR de nota fiscal: Spring Boot, Next.js, PostgreSQL e JWT.",
    meta: "Full stack · autorais",
    year: "2024",
    frames: [
      "/projetos/fintrack/dashboard.png",
      "/projetos/fintrack/extrato.png",
      "/projetos/fintrack/cover.png",
    ],
  },
  {
    slug: "detoxdigital",
    title: "Detox Digital",
    note: "Extensão do Chrome que limita tempo em sites: Java 21, nove rotas, painel e cliente MV3.",
    meta: "Back-end + extensão",
    year: "2024",
    frames: [
      "/projetos/detoxdigital/extensao.png",
      "/projetos/detoxdigital/dashboard.png",
      "/projetos/detoxdigital/cover.png",
    ],
  },
  {
    slug: "goprices",
    title: "GoPrices",
    note: "Bot de alerta de preço em Go: oito comandos, rastreio de concorrentes na Amazon, Docker.",
    meta: "Back-end · autorais",
    year: "2024",
    frames: [
      "/projetos/goprices/historico.png",
      "/projetos/goprices/discord.png",
      "/projetos/goprices/cover.png",
    ],
  },
  {
    slug: "reconkit",
    title: "reconkit",
    note: "CLI de recon para bug bounty em Python: descoberta de subdomínios, port scan, HTTP probe, headers, segredos e fingerprinting. Stdlib only.",
    meta: "Cyber · bug bounty",
    year: "2026",
    frames: ["/projetos/reconkit/terminal.png"],
  },
  {
    slug: "gastos-crud-spring",
    title: "gastos-crud-spring",
    note: "CRUD de despesas em Java 21 com HTTP Server nativo, persistência em JSON, testes, Docker e Swagger.",
    meta: "Java · Docker · Swagger",
    year: "2026",
    frames: ["/projetos/gastos-crud-spring/terminal.png"],
  },
  {
    slug: "prism",
    title: "prism",
    note: "Extrai a paleta dominante de uma imagem e exporta em hex, JSON, CSS ou Tailwind. Python, sem dependência pesada.",
    meta: "Python · CLI",
    year: "2026",
    frames: ["/projetos/prism/terminal.png"],
  },
  {
    slug: "badgesplus",
    title: "BadgesPlus",
    note: "Parceria: 29 opções de badge, dois idiomas, três camadas de cache, cliente Vencord.",
    meta: "Parceria",
    year: "2024",
    frames: [
      "/projetos/badgesplus/chat.png",
      "/projetos/badgesplus/cover.png",
    ],
  },
  {
    slug: "cron-help",
    title: "cron-help",
    note: "CLI que traduz expressões cron para texto em português e lista as próximas execuções. Publicado no npm.",
    meta: "Node · npm",
    year: "2026",
    frames: ["/projetos/cron-help/terminal.png"],
  },
  {
    slug: "pomodoro-foco",
    title: "pomodoro-foco",
    note: "Timer pomodoro minimal em React + TypeScript: sessões no localStorage, zero backend, pronto pra uso.",
    meta: "React · TypeScript",
    year: "2026",
    frames: ["/projetos/pomodoro-foco/app.png"],
  },
  {
    slug: "quicknotes-cli",
    title: "quicknotes-cli",
    note: "Notebook de linha de comando: notas em JSON local, add/list/search/rm em segundos.",
    meta: "Node · CLI · npm",
    year: "2026",
    frames: ["/projetos/quicknotes-cli/terminal.png"],
  },
  {
    slug: "gastos-cli",
    title: "gastos-cli",
    note: "Controle de despesas no terminal em Java: lançamentos em CSV local e totais por mês.",
    meta: "Java · CLI",
    year: "2026",
    frames: ["/projetos/gastos-cli/terminal.png"],
  },
  {
    slug: "treino-seguro-60",
    title: "Treino Seguro 60+",
    note: "Produto digital fechado: ebook, página de vendas, criativos e campanha no Meta Ads.",
    meta: "Produto · completo",
    year: "2025",
    frames: [
      "/projetos/treino-seguro-60/cover.png",
      "/projetos/treino-seguro-60/feed.png",
      "/projetos/treino-seguro-60/story.png",
      "/projetos/treino-seguro-60/capa.png",
      "/projetos/treino-seguro-60/criativo.png",
    ],
  },
];
