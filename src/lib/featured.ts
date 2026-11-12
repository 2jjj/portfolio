import type { Project } from "@/types";

/**
 * Projetos proprietários em destaque.
 * Ficam sempre visíveis no portfólio, independente do que vier da API.
 * O código pode ser privado: o case e o link público continuam valendo.
 */
export const FEATURED_PROJECTS: Project[] = [
  {
    id: 9100,
    slug: "kamikaze-bot",
    title: "Kamikaze Bot",
    category: "Full Stack",
    description:
      "Sistema de vendas no WhatsApp para uma loja de artes marciais: catálogo sincronizado, preços, estoque, pedidos personalizados, atendimento humano e painel operacional completo.",
    summary:
      "Bot de WhatsApp + painel de operação para a Kamikaze Sports. Catálogo real da loja, preços e estoque, pedidos personalizados, inbox com atendente humano, Kanban, métricas e integração pronta para criar pedidos na Loja Integrada.",
    problem:
      "A loja vendia por WhatsApp de forma manual: catálogo espalhado no site, estoque desatualizado, pedidos em conversas soltas e nenhuma visão de conversão. O site ainda bloqueia leitura automatizada com WAF, o que impedia um catálogo simples por scraping HTTP.",
    architecture:
      "Bot em Node.js/TypeScript com Baileys para WhatsApp, painel em Hono com renderização server-side e SQLite (better-sqlite3) em WAL. A sincronização usa Playwright para ler o catálogo real da loja quando a API não está disponível, com categorias muitos-para-muitos, preços, grade de tamanhos e disponibilidade. O painel tem Inbox, Kanban, métricas, configuração de destino dos pedidos, backup e retenção de mensagens.",
    decisions:
      "Navegador real para contornar o WAF e manter o catálogo fiel à loja; categorias N:N em vez de campo único para refletir a taxonomia real; revalidação de estoque no fechamento do pedido; menus numerados como fallback confiável porque botões nativos não são garantidos fora da API oficial; integração com a Loja Integrada preparada para ativar quando a chave existir.",
    results:
      "Catálogo com 219 produtos e 568 variações sincronizados, categorias corrigidas (kimonos, jiu-jitsu, judô, muay thai, karate, aikido, MMA e feminino), fluxo completo de oi até pedido registrado no painel, notificação ao dono e conversa no Inbox. 63 testes automatizados cobrindo fluxo, estoque, categorias e pedidos.",
    role: "Full Stack Developer",
    timeline: "2025 — atual",
    metrics: [
      { label: "Produtos", value: "219" },
      { label: "Variações", value: "568" },
      { label: "Testes", value: "63" },
      { label: "Categorias", value: "8" },
    ],
    tags: [
      "TypeScript",
      "Node.js",
      "Baileys",
      "WhatsApp",
      "Hono",
      "SQLite",
      "Playwright",
      "Docker",
    ],
    image: "/projetos/kamikaze/catalogo.png",
    gallery: [
      "/projetos/kamikaze/pedidos.png",
      "/projetos/kamikaze/inbox.png",
      "/projetos/kamikaze/metricas.png",
      "/projetos/kamikaze/kanban.png",
      "/projetos/kamikaze/produto.png",
      "/projetos/kamikaze/conexao.png",
    ],
    video: "/projetos/kamikaze/demo.mp4",
    github: "",
    live: "",
    featured: 1,
    order_index: 0,
    created_at: "2026-10-27T00:00:00.000Z",
    updated_at: "2026-10-27T00:00:00.000Z",
  },
  {
    id: 9101,
    slug: "importflow",
    title: "ImportFlow",
    category: "Full Stack",
    description:
      "SaaS de gestão de importações com checkout próprio: cartão, Pix e boleto, webhooks assinados, painel administrativo e criação de usuários.",
    summary:
      "Produto completo de importação: catálogo de planos, checkout com Stripe e Pix, conciliação por webhook, área do cliente e admin. O código abre em breve; o case mostra as decisões.",
    problem:
      "Operações de importação controlavam pedidos, planos e pagamentos em planilhas. Faltava um fluxo único: assinar, pagar, liberar acesso e enxergar a operação sem conciliação manual.",
    architecture:
      "Front-end em React + TypeScript com Vite e Tailwind. Back-end em Supabase: Postgres com RLS, Auth e Edge Functions em Deno. O checkout cria sessões na Stripe (cartão, Pix e boleto) e na InfinitePay (Pix), com webhooks que validam assinatura HMAC antes de liberar o acesso. Notificações de venda caem no Discord e o admin cria usuários com plano e permissão.",
    decisions:
      "Dois gateways porque Pix e boleto têm custo e liquidação diferentes; webhook como fonte de verdade em vez de confiar no retorno do navegador; Edge Functions para segredo nunca tocar o cliente; RLS para separar dados por conta; admin com criação de usuário para não depender de suporte manual.",
    results:
      "Checkout ponta a ponta com três meios de pagamento, assinatura validada, liberação automática de acesso, painel administrativo e ambiente de teste com pagamento mock. A base está pronta para abrir o código.",
    role: "Full Stack Developer",
    timeline: "2025 — atual",
    metrics: [
      { label: "Pagamentos", value: "3" },
      { label: "Gateways", value: "2" },
      { label: "Edge Functions", value: "5" },
      { label: "Webhooks", value: "2" },
    ],
    tags: ["React", "TypeScript", "Supabase", "Stripe", "Pix", "Edge Functions", "PostgreSQL"],
    image: "/projetos/importflow/cover.png",
    gallery: ["/projetos/importflow/cover.png"],
    github: "",
    live: "",
    featured: 1,
    order_index: 1,
    created_at: "2026-11-04T00:00:00.000Z",
    updated_at: "2026-11-04T00:00:00.000Z",
  },
  {
    id: 9102,
    slug: "startanewday",
    title: "StartANewDay",
    category: "Full Stack",
    description:
      "Dashboard local que busca vagas reais, calcula compatibilidade com o perfil e organiza candidaturas — do GitHub ao LinkedIn.",
    summary:
      "Automação de carreira rodando local: coleta vagas, pontua o match, monta currículo e acompanha cada candidatura. É o motor por trás da página /vagas deste portfólio.",
    problem:
      "Buscar vaga manualmente espalha informação em abas, planilhas e mensagens. O tempo vai embora antes de qualquer candidatura sair.",
    architecture:
      "Servidor Express em Node.js que orquestra Playwright para navegar em LinkedIn e portais de vaga, um pipeline de IA para analisar perfil e gerar rascunhos, e um dashboard em React com timeline em tempo real. O estado fica em JSON local; nada sobe sem confirmação. O resultado público é sincronizado em /jobs.json e consumido pela página /vagas.",
    decisions:
      "Rodar na máquina do usuário para manter sessão e dados privados; navegador real em vez de scraping frágil; fila única para evitar concorrência nas automações; confirmação humana antes de qualquer envio; fallback para JSON quando a IA falha.",
    results:
      "Dashboard com quatro fontes de vagas, score explicado por stack e senioridade, fila de candidaturas e auditoria de perfil. A versão pública lista 41 vagas sincronizadas e alimenta o Career HQ do portfólio.",
    role: "Fundador e Desenvolvedor",
    timeline: "2025 — atual",
    metrics: [
      { label: "Fontes", value: "4" },
      { label: "Vagas", value: "41" },
      { label: "Dados no PC", value: "100%" },
      { label: "Stack", value: "Node + React" },
    ],
    tags: ["Node.js", "Express", "React", "Playwright", "Automação", "IA"],
    image: "/projetos/startanewday/cover.png",
    gallery: ["/projetos/startanewday/cover.png"],
    github: "",
    live: "/vagas",
    featured: 1,
    order_index: 2,
    created_at: "2026-11-03T00:00:00.000Z",
    updated_at: "2026-11-03T00:00:00.000Z",
  },
  {
    id: 9103,
    slug: "arquivo-pokemon",
    title: "Arquivo",
    category: "Front-End",
    description:
      "Vitrine estática de 26 cartas Pokémon com painel local, comparação de preço contra a Liga e automação de anúncios.",
    summary:
      "Vitrine editorial de coleção particular: catálogo com condição e preço, painel que reescreve o site, análise de carta por IA e sincronização de anúncios na OLX e no Facebook.",
    problem:
      "Vender coleção em marketplace é repetitivo: cada carta exige foto, descrição, condição e preço alinhado com o mercado. Planilha não mostra a diferença contra a Liga e o anúncio envelhece rápido.",
    architecture:
      "Site sem framework: HTML, CSS e JavaScript puro, publicado na Vercel. Um painel local em Node.js edita o JSON e regenera os dados do site. O motor de anúncios usa Chrome com DevTools Protocol para ler e atualizar OLX e Facebook direto na API interna, e o preço de referência vem da média de venda da Liga Pokémon.",
    decisions:
      "Zero framework no site para carregar rápido e simplificar o deploy; painel separado do site para nunca expor edição em produção; API interna da OLX em vez de clicar na interface quebrada; preço calculado por condição, sempre abaixo da mediana.",
    results:
      "26 cartas publicadas com condição, preço e comparação contra a Liga, 18 delas abaixo da mediana. Painel com edição, leitura de carta por IA, log ao vivo e um comando para publicar.",
    role: "Desenvolvedor",
    timeline: "2025 — atual",
    metrics: [
      { label: "Cartas", value: "26" },
      { label: "Abaixo da Liga", value: "18" },
      { label: "Plataformas", value: "3" },
      { label: "APIs pagas", value: "0" },
    ],
    tags: ["HTML", "CSS", "JavaScript", "Node.js", "Playwright", "Vercel"],
    image: "/projetos/arquivo/cover.png",
    gallery: ["/projetos/arquivo/cover.png"],
    github: "",
    live: "https://site-tau-mocha-13.vercel.app",
    featured: 1,
    order_index: 3,
    created_at: "2026-11-11T00:00:00.000Z",
    updated_at: "2026-11-11T00:00:00.000Z",
  },
  {
    id: 9104,
    slug: "badgesplus",
    title: "badgesPlus",
    category: "Front-End",
    description:
      "Plugin para Vencord que adiciona badges personalizados ao Discord, com cache de perfis, carregamento em lote e busca de membros.",
    summary:
      "Plugin de cliente Discord: badges customizadas no perfil, na lista de membros e nas mensagens, com cache em três camadas e fila de requisições com limite de taxa.",
    problem:
      "Discord não expõe badge personalizada para comunidades. Ler o perfil de milhares de membros de uma vez estoura o rate limit e trava o cliente.",
    architecture:
      "Plugin em TypeScript sobre a API do Vencord, com React injetado nos pontos de decoração de membro e mensagem. Três camadas de cache (badges, membros e perfil), fila com concorrência e delay configuráveis, e um modal de busca que varre o servidor em lotes.",
    decisions:
      "Não fazer fork do Vencord: um userplugin é mais fácil de manter; cache agressivo para não repetir requisição; fila com cooldown em vez de disparar tudo em paralelo; internacionalização PT/EN desde o começo; configuração exposta em vez de constante escondida.",
    results:
      "Badges aparecem no perfil, na lista de membros e nas mensagens; o cache sobrevive à troca de sessão; a busca encontra membros em servidores grandes sem derrubar o cliente.",
    role: "Desenvolvedor",
    timeline: "2025",
    metrics: [
      { label: "Camadas de cache", value: "3" },
      { label: "Módulos", value: "11" },
      { label: "Fork", value: "0" },
      { label: "Idiomas", value: "PT/EN" },
    ],
    tags: ["TypeScript", "React", "Vencord", "Cache", "Discord"],
    image: "/projetos/badgesplus/cover.png",
    gallery: ["/projetos/badgesplus/cover.png"],
    github: "",
    live: "",
    featured: 1,
    order_index: 4,
    created_at: "2026-11-05T00:00:00.000Z",
    updated_at: "2026-11-05T00:00:00.000Z",
  },
  {
    id: 9105,
    slug: "treino-seguro-60",
    title: "Treino Seguro 60+",
    category: "Full Stack",
    description:
      "Produto digital completo para o público 60+: ebook, landing page, identidade, criativos e operação de venda.",
    summary:
      "Do produto à campanha: guia em PDF, página de vendas, marca, 30 posts, stories, criativos de anúncio e checkout configurado. Um projeto de produto, não só de código.",
    problem:
      "Público 60+ quer voltar a treinar, mas encontra conteúdo técnico, letra pequena e promessa exagerada. Faltava uma oferta clara, segura e fácil de ler no celular.",
    architecture:
      "Landing em HTML/CSS puro com foco em legibilidade e contraste, ebook diagramado em HTML para gerar PDF, identidade visual própria e checkout na Cakto. A campanha usa três ângulos de anúncio no Meta Ads com criativos estáticos e vídeo curto.",
    decisions:
      "Tipografia grande e linguagem simples em vez de estética fitness genérica; promessa realista e avisos de segurança; página leve para abrir rápido no 4G; produto de entrada de R$ 37 para validar oferta antes de escalar.",
    results:
      "Oferta completa no ar: produto, página, marca, 30 posts, 10 stories, roteiros de reels, três criativos e plano de campanha. A página vende sem depender de app ou cadastro.",
    role: "Produto, Design e Desenvolvimento",
    timeline: "2025 — atual",
    metrics: [
      { label: "Produtos", value: "2 ebooks" },
      { label: "Peças", value: "30+" },
      { label: "Ticket", value: "R$ 37" },
      { label: "Canais", value: "Meta Ads" },
    ],
    tags: ["HTML", "CSS", "Design", "Copywriting", "Meta Ads", "Cakto"],
    image: "/projetos/treino-seguro-60/cover.png",
    gallery: [
      "/projetos/treino-seguro-60/capa.png",
      "/projetos/treino-seguro-60/feed.png",
      "/projetos/treino-seguro-60/story.png",
      "/projetos/treino-seguro-60/criativo.png",
    ],
    github: "",
    live: "",
    featured: 1,
    order_index: 5,
    created_at: "2026-10-20T00:00:00.000Z",
    updated_at: "2026-10-20T00:00:00.000Z",
  },
];

const FEATURED_SLUGS = new Set(FEATURED_PROJECTS.map((project) => project.slug));

export function withFeaturedProjects(projects: Project[]): Project[] {
  const rest = projects.filter((project) => !FEATURED_SLUGS.has(project.slug));
  return [...FEATURED_PROJECTS, ...rest];
}
