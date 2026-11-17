import type { Project } from "@/types";

/**
 * Cases que ficam sempre no topo, fora do que vier da API.
 * Alguns são de código fechado: o case continua valendo mesmo sem repo público.
 */
export const FEATURED_PROJECTS: Project[] = [
  {
    id: 9100,
    slug: "kamikaze-bot",
    title: "Kamikaze Bot",
    category: "Full Stack",
    description:
      "Sistema de vendas pelo WhatsApp que fiz para a Kamikaze Sports, loja de artes marciais: catálogo, preço, estoque e pedido dentro da conversa.",
    summary:
      "Foi o projeto que vendi para a Kamikaze Sports — não é projeto pessoal, é sistema em produção na loja. O bot atende no WhatsApp com o catálogo real, fecha o pedido e joga tudo num painel que a equipe usa no dia a dia. Antes disso o atendimento era conversa solta e planilha.",
    contextLabel: "Projeto vendido",
    context:
      "Entreguei e vendi o sistema para a Kamikaze Sports. O código não é aberto porque virou operação da empresa, não vitrine de portfólio.",
    problem:
      "A loja vendia por WhatsApp na mão: catálogo no site, estoque em planilha, pedido perdido no meio de um monte de conversa e nenhuma ideia de quantos orçamentos viravam venda. O site ainda roda com WAF, então ler o catálogo com uma requisição simples não resolve.",
    architecture:
      "Bot em Node.js/TypeScript com Baileys no WhatsApp e painel em Hono com server-side rendering, tudo em SQLite (better-sqlite3) no modo WAL. Quando não tem API, a sincronização abre a loja com Playwright e lê o catálogo real: categoria, preço, grade de tamanho e disponibilidade. O painel tem inbox, kanban, métricas, destino dos pedidos, backup e retenção de mensagem.",
    decisions:
      "Navegador de verdade em vez de HTTP puro, porque o WAF bloqueia e o catálogo precisa bater com a loja. Categoria N:N, porque produto de artes marciais vive em mais de uma. Estoque conferido de novo no fechamento do pedido. Menu numerado como plano B, já que botão nativo só existe na API oficial. Loja Integrada deixei conectada esperando a chave.",
    results:
      "219 produtos e 568 variações sincronizados, categoria arrumada (kimono, jiu-jitsu, judô, muay thai, karate, aikido, MMA e feminino) e o fluxo completo do primeiro oi até o pedido registrado, com aviso para o dono e conversa no inbox. 63 testes cobrindo fluxo, estoque, categoria e pedido.",
    role: "Desenvolvimento e entrega",
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
      "/projetos/kamikaze/catalogo-mobile.png",
      "/projetos/kamikaze/inbox-mobile.png",
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
      "Sistema de gestão de importação com checkout próprio: cartão, Pix e boleto, webhook assinado, área do cliente e admin.",
    summary:
      "Produto que montei do zero: plano, checkout, pagamento, liberação de acesso e operação. O código abre em breve, então o case mostra as decisões e o que já está de pé.",
    problem:
      "Quem importa controla pedido, plano e pagamento em planilha. Falta um lugar único onde a pessoa assina, paga e já entra, sem ninguém conciliar pagamento na mão no fim do dia.",
    architecture:
      "Front em React + TypeScript com Vite e Tailwind. Back no Supabase: Postgres com RLS, Auth e Edge Functions em Deno. O checkout abre sessão na Stripe (cartão, Pix e boleto) e na InfinitePay (Pix); o webhook confere o HMAC antes de liberar o acesso. Venda nova cai no Discord e o admin cria usuário com plano e permissão.",
    decisions:
      "Dois gateways porque Pix e boleto têm custo e prazo de liquidação diferentes. O webhook é a fonte da verdade, nunca o retorno do navegador. Segredo fica na Edge Function, longe do cliente. RLS separa dado por conta. E o admin cria usuário para não depender de suporte manual.",
    results:
      "Checkout de ponta a ponta com três meios de pagamento, assinatura validada, acesso liberado sozinho, painel de admin e ambiente de teste com pagamento mock. Falta só abrir o código.",
    role: "Produto, código e entrega",
    timeline: "2025 — atual",
    metrics: [
      { label: "Pagamentos", value: "3" },
      { label: "Gateways", value: "2" },
      { label: "Edge Functions", value: "5" },
      { label: "Webhooks", value: "2" },
    ],
    tags: ["React", "TypeScript", "Supabase", "Stripe", "Pix", "Edge Functions", "PostgreSQL"],
    image: "/projetos/importflow/cover.png",
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
      "Painel local que busca vaga de verdade, calcula o quanto ela combina com o perfil e organiza cada candidatura.",
    summary:
      "Automação de procura de emprego que roda na minha máquina: coleta vaga, pontua o match, monta rascunho e acompanha a candidatura. É o motor por trás da página /vagas daqui do site.",
    problem:
      "Procurar vaga espalha tudo em aba, planilha e mensagem. Quando você percebe, gastou a tarde organizando link e não se candidatou a nada.",
    architecture:
      "Servidor Express em Node.js que comanda o Playwright no LinkedIn e nos outros portais, um pipeline de IA para ler o perfil e escrever o rascunho, e um painel React com timeline ao vivo. O estado fica em JSON local e nada sai sem eu confirmar. A parte pública vira /jobs.json, que é o que a página /vagas lê.",
    decisions:
      "Rodar na máquina do usuário, porque sessão e dado de vaga são privados. Navegador de verdade em vez de scraping frágil. Fila única para as automações não brigarem. Confirmação humana antes de qualquer envio. E se a IA falhar, cai no JSON.",
    results:
      "Painel com quatro fontes, score explicado por stack e senioridade, fila de candidatura e auditoria de perfil. A versão pública lista 41 vagas e alimenta o Career HQ do site.",
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
    github: "https://github.com/2jjj/startanewday",
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
      "Vitrine da minha coleção de Pokémon: 25 cartas com condição e preço, comparação com a Liga e anúncio sincronizado na OLX e no Facebook.",
    summary:
      "Fiz para vender a coleção sem enlouquecer. O site mostra cada carta com estado e preço, compara com a média da Liga e o painel local reescreve tudo. A Mewtwo-EX 163/162 Secret Rare anunciei por R$ 700 e fechei em R$ 550.",
    problem:
      "Anunciar carta é sempre a mesma novela: foto, descrição, estado, preço de mercado e o anúncio envelhecendo. Planilha não mostra quanto o meu preço está longe da Liga, e eu acabava refazendo anúncio de 25 cartas na mão.",
    architecture:
      "Site sem framework: HTML, CSS e JavaScript puro na Vercel, para abrir rápido no celular. Um painel local em Node.js edita o JSON e regenera os dados. O motor de anúncio usa o Chrome via DevTools Protocol para ler e atualizar OLX e Facebook direto na API interna, e o preço de referência vem da média de venda da Liga Pokémon.",
    decisions:
      "Zero framework no site porque era vitrine, não app. Painel separado do site para não ter edição exposta em produção. API interna da OLX em vez de clicar em interface que quebra toda semana. Preço por condição, sempre abaixo da mediana, para vender rápido em vez de ficar anunciado. A Mewtwo-EX foi a exceção: anunciei acima da Liga e negociei na conversa.",
    results:
      "25 cartas publicadas com estado, preço e comparação contra a Liga, 16 delas abaixo da mediana. O painel faz edição, leitura de carta por IA, log ao vivo e publica com um comando. A Mewtwo-EX saiu por R$ 550.",
    role: "Desenvolvedor",
    timeline: "2025 — atual",
    metrics: [
      { label: "Cartas", value: "25" },
      { label: "Abaixo da Liga", value: "16" },
      { label: "Mewtwo-EX", value: "R$ 550" },
      { label: "APIs pagas", value: "0" },
    ],
    tags: ["HTML", "CSS", "JavaScript", "Node.js", "Playwright", "Vercel"],
    image: "/projetos/arquivo/cover.png",
    gallery: [
      "/projetos/arquivo/hero.jpg",
      "/projetos/arquivo/acervo.jpg",
      "/projetos/arquivo/mewtwo.jpg",
      "/projetos/arquivo/liga.jpg",
    ],
    github: "",
    live: "https://site-tau-mocha-13.vercel.app",
    featured: 1,
    order_index: 3,
    created_at: "2026-11-11T00:00:00.000Z",
    updated_at: "2026-11-11T00:00:00.000Z",
  },
  {
    id: 9106,
    slug: "fintrack",
    title: "FinTrack",
    category: "Full Stack",
    description:
      "App de gastos que lê a foto do extrato, extrai as transações, categoriza e mostra para onde o dinheiro foi no mês.",
    summary:
      "Finanças pessoais sem digitar lançamento. Manda foto ou PDF do extrato, o OCR e a IA puxam as transações, o app categoriza e monta o painel. Back em Spring Boot, tela em Next.js.",
    problem:
      "Organizar gasto em planilha dura uma semana. Depois ninguém tem paciência de digitar os 60 lançamentos do extrato, e sem lançamento não existe orçamento que funcione.",
    architecture:
      "API em Java 17 com Spring Boot 3.2, Spring Security com JWT e Postgres via JPA. O OCR do extrato vai no Google Cloud Vision, porque foto de extrato é sombra, reflexo e perspectiva. O front é Next.js 14 com TypeScript, Tailwind e shadcn/ui, gráfico em Recharts. Tudo sobe com um docker-compose.",
    decisions:
      "OCR na nuvem em vez de modelo local, porque a foto é ruim e o extrato é o dado mais importante do app. Categoria sugerida com revisão, porque categorizar errado calado é pior que pedir confirmação. JWT no back para o front não precisar guardar sessão. E orçamento por categoria, não só total do mês.",
    results:
      "Fluxo inteiro funcionando: cadastro, login, upload do extrato, transações extraídas e categorizadas, painel com gráfico, orçamento e alerta de estouro, detector de assinatura recorrente e exportação. Ainda sem instância pública: roda no docker-compose.",
    role: "Desenvolvedor",
    timeline: "2026",
    metrics: [
      { label: "Back-end", value: "Spring Boot" },
      { label: "Front-end", value: "Next.js" },
      { label: "Banco", value: "PostgreSQL" },
      { label: "Extração", value: "OCR" },
    ],
    tags: ["Java", "Spring Boot", "Next.js", "PostgreSQL", "OCR"],
    image: "/projetos/fintrack/cover.png",
    gallery: [
      "/projetos/fintrack/dashboard.png",
      "/projetos/fintrack/extrato.png",
    ],
    github: "https://github.com/2jjj/FinTrack",
    live: "",
    featured: 1,
    order_index: 4,
    created_at: "2026-07-28T00:00:00.000Z",
    updated_at: "2026-07-28T00:00:00.000Z",
  },
  {
    id: 9107,
    slug: "detoxdigital",
    title: "Detox Digital",
    category: "Full Stack",
    description:
      "Back-end em Spring Boot com extensão do Chrome: mede o tempo em site que rouba atenção e avisa quando passa do limite que você mesmo marcou.",
    summary:
      "Você escolhe os sites que te distraem e quanto tempo tolera em cada um. A extensão conta, o back-end guarda e o painel mostra o dia e a semana. Passou do limite, chega o aviso.",
    problem:
      "Ninguém percebe quanto tempo passou rolando. E app de bloqueio é fácil de desligar no primeiro impulso, então bloquear não resolve nada.",
    architecture:
      "Java 21 com Spring Boot, H2 em arquivo, Spring Data JPA e páginas Thymeleaf com Bootstrap. A extensão em Manifest V3 conversa com a API local (/api/check, /api/track, /api/alert) e dispara a notificação quando o tempo estoura.",
    decisions:
      "H2 em arquivo em vez de Postgres para não pedir instalação a quem só quer testar. Aviso em vez de bloqueio, porque bloqueio gera raiva e desinstalação. Limite por site em vez de cota diária, porque o problema é o site e não o dia. E a extensão só mede: quem decide parar é a pessoa.",
    results:
      "Sistema rodando local: dashboard com visita, alerta e tempo por site (hoje e na semana), cadastro dos sites distrativos e extensão instalável em modo desenvolvedor.",
    role: "Desenvolvedor",
    timeline: "2026",
    metrics: [
      { label: "Back-end", value: "Spring Boot" },
      { label: "Banco", value: "H2" },
      { label: "Cliente", value: "Chrome MV3" },
      { label: "Rotas", value: "9" },
    ],
    tags: ["Java", "Spring Boot", "Chrome MV3", "Thymeleaf", "H2"],
    image: "/projetos/detoxdigital/cover.png",
    gallery: [
      "/projetos/detoxdigital/dashboard.png",
      "/projetos/detoxdigital/extensao.png",
    ],
    github: "https://github.com/2jjj/detoxdigital",
    live: "",
    featured: 1,
    order_index: 5,
    created_at: "2026-07-10T00:00:00.000Z",
    updated_at: "2026-07-26T00:00:00.000Z",
  },
  {
    id: 9108,
    slug: "goprices",
    title: "GoPrices",
    category: "Back-End",
    description:
      "Bot de Discord em Go que acompanha o preço de um produto, guarda o histórico, desenha o gráfico e chama quando o valor cai.",
    summary:
      "Cansado de abrir o mesmo link todo dia para ver se baixou. Você manda o link no Discord, o bot lê o preço de tempos em tempos, guarda cada leitura e avisa quando chega no valor que você pediu.",
    problem:
      "Promoção boa dura horas. Conferir preço na mão todo dia é chato, e quando você lembra de olhar já voltou ao normal. Grupo de promoção avisa de tudo, menos do produto que você quer.",
    architecture:
      "Go com discordgo para os slash commands, colly para ler a página do produto, SQLite via modernc (sem CGO) para o histórico e go-chart para gerar o gráfico em PNG. Um scheduler em background checa os produtos monitorados e grava cada leitura; o histórico é o que vira o gráfico do /historico. Docker com volume em ./data para o banco sobreviver ao restart.",
    decisions:
      "SQLite sem CGO porque eu queria binário único e deploy sem dor. Gravar preço em toda checagem, e não só quando muda, para o gráfico ter linha do tempo de verdade. Alerta por produto, não um global. E o scraper atrás de uma interface, para trocar por API no dia que o site oferecer.",
    results:
      "Oito comandos no ar, do /monitorar ao /comparar, com histórico, estatística de menor e maior preço e alerta por valor. Hoje funciona com a Amazon; Mercado Livre e Magazine Luiza estão na fila.",
    role: "Desenvolvedor",
    timeline: "2026",
    metrics: [
      { label: "Comandos", value: "8" },
      { label: "Linguagem", value: "Go" },
      { label: "Banco", value: "SQLite" },
      { label: "Deploy", value: "Docker" },
    ],
    tags: ["Go", "discordgo", "colly", "SQLite", "Docker"],
    image: "/projetos/goprices/cover.png",
    gallery: [
      "/projetos/goprices/discord.png",
      "/projetos/goprices/historico.png",
    ],
    github: "https://github.com/2jjj/goprices",
    live: "",
    featured: 1,
    order_index: 6,
    created_at: "2026-07-11T00:00:00.000Z",
    updated_at: "2026-07-11T00:00:00.000Z",
  },
  {
    id: 9104,
    slug: "badgesplus",
    title: "badgesPlus",
    category: "Front-End",
    description:
      "Plugin para Vencord/Vesktop que mostra a badge do perfil do lado do nome, no chat e na lista de membros, e deixa achar gente por badge.",
    summary:
      "Badge do Discord só aparecia abrindo o perfil de cada pessoa. O plugin joga ela direto no chat, ao lado do nome, e ainda cria uma busca para achar quem tem Nitro, Early Supporter ou 24 meses de boost.",
    problem:
      "Em servidor grande, descobrir quem tem boost ou Nitro é clicar perfil por perfil. E carregar o perfil de mil membros de uma vez estoura o rate limit e trava o cliente na sua frente.",
    architecture:
      "Plugin em TypeScript em cima da API do Vencord, com React injetado onde a mensagem e o membro são desenhados. Três camadas de cache (badge, membro e perfil), fila de perfil com velocidade configurável e busca que varre o servidor em lote. Tem instalador .bat que resolve Git, Node e pnpm sozinho.",
    decisions:
      "Userplugin em vez de fork do Vencord, porque fork vira dívida na primeira atualização. Perfil carrega devagar e na ordem de quem está na tela, já que o que importa é o chat aberto. A busca nunca manda mensagem: só abre a conversa. E as 29 opções existem porque servidor de 20 mil membros não se comporta como servidor de 30.",
    results:
      "Badge no chat e na lista de membros, busca por badge com contagem por servidor e instalador automático no Windows. O projeto é em parceria: eu fiquei com a parte de performance, cache e busca.",
    role: "Desenvolvedor (parceria)",
    timeline: "2025",
    metrics: [
      { label: "Opções", value: "29" },
      { label: "Idiomas", value: "2" },
      { label: "Cache", value: "3 camadas" },
      { label: "Fork", value: "0" },
    ],
    tags: ["TypeScript", "React", "Vencord", "Discord", "Cache"],
    image: "/projetos/badgesplus/cover.png",
    gallery: ["/projetos/badgesplus/chat.png"],
    github: "https://github.com/lirenzzzin/BadgesPlus",
    live: "",
    featured: 1,
    order_index: 7,
    created_at: "2026-10-05T00:00:00.000Z",
    updated_at: "2026-10-26T00:00:00.000Z",
  },
  {
    id: 9105,
    slug: "treino-seguro-60",
    title: "Treino Seguro 60+",
    category: "Full Stack",
    description:
      "Produto digital para o público 60+: ebook, página de venda, marca, criativos e a operação de venda montada.",
    summary:
      "Do produto à campanha: guia em PDF, página de venda, identidade, 30 posts, stories, criativo de anúncio e checkout configurado. Foi projeto de produto, não só de código.",
    problem:
      "Quem tem 60+ quer voltar a treinar e encontra conteúdo técnico, letra pequena e promessa exagerada. Faltava uma oferta clara, segura e fácil de ler no celular.",
    architecture:
      "Página em HTML/CSS puro, com foco em legibilidade e contraste, ebook diagramado em HTML para virar PDF, identidade própria e checkout na Cakto. A campanha usa três ângulos no Meta Ads, com criativo estático e vídeo curto.",
    decisions:
      "Tipografia grande e texto simples no lugar da estética fitness de sempre. Promessa realista, com aviso de segurança. Página leve para abrir rápido no 4G. E produto de entrada a R$ 37 para validar a oferta antes de pensar em escalar.",
    results:
      "Oferta completa no ar: produto, página, marca, 30 posts, 10 stories, roteiro de reels, três criativos e plano de campanha. A página vende sem app e sem cadastro.",
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
    order_index: 8,
    created_at: "2026-10-20T00:00:00.000Z",
    updated_at: "2026-10-20T00:00:00.000Z",
  },
];

const FEATURED_SLUGS = new Set(FEATURED_PROJECTS.map((project) => project.slug));

export function withFeaturedProjects(projects: Project[]): Project[] {
  const rest = projects.filter((project) => !FEATURED_SLUGS.has(project.slug));
  return [...FEATURED_PROJECTS, ...rest];
}
