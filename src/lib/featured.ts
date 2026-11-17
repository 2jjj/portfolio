import type { Project } from "@/types";

/**
 * Cases que ficam sempre no topo, fora do que vier da API.
 * Alguns sÃ£o de cÃ³digo fechado: o case continua valendo mesmo sem repo pÃºblico.
 */
export const FEATURED_PROJECTS: Project[] = [
  {
    id: 9100,
    slug: "kamikaze-bot",
    title: "Kamikaze Bot",
    category: "Full Stack",
    description:
      "Sistema de vendas pelo WhatsApp que fiz para a Kamikaze Sports, loja de artes marciais: catÃ¡logo, preÃ§o, estoque e pedido dentro da conversa.",
    summary:
      "Foi o projeto que vendi para a Kamikaze Sports â€” nÃ£o Ã© projeto pessoal, Ã© sistema em produÃ§Ã£o na loja. O bot atende no WhatsApp com o catÃ¡logo real, fecha o pedido e joga tudo num painel que a equipe usa no dia a dia. Antes disso o atendimento era conversa solta e planilha.",
    contextLabel: "Projeto vendido",
    context:
      "Entreguei e vendi o sistema para a Kamikaze Sports. O cÃ³digo nÃ£o Ã© aberto porque virou operaÃ§Ã£o da empresa, nÃ£o vitrine de portfÃ³lio.",
    problem:
      "A loja vendia por WhatsApp na mÃ£o: catÃ¡logo no site, estoque em planilha, pedido perdido no meio de um monte de conversa e nenhuma ideia de quantos orÃ§amentos viravam venda. O site ainda roda com WAF, entÃ£o ler o catÃ¡logo com uma requisiÃ§Ã£o simples nÃ£o resolve.",
    architecture:
      "Bot em Node.js/TypeScript com Baileys no WhatsApp e painel em Hono com server-side rendering, tudo em SQLite (better-sqlite3) no modo WAL. Quando nÃ£o tem API, a sincronizaÃ§Ã£o abre a loja com Playwright e lÃª o catÃ¡logo real: categoria, preÃ§o, grade de tamanho e disponibilidade. O painel tem inbox, kanban, mÃ©tricas, destino dos pedidos, backup e retenÃ§Ã£o de mensagem.",
    decisions:
      "Navegador de verdade em vez de HTTP puro, porque o WAF bloqueia e o catÃ¡logo precisa bater com a loja. Categoria N:N, porque produto de artes marciais vive em mais de uma. Estoque conferido de novo no fechamento do pedido. Menu numerado como plano B, jÃ¡ que botÃ£o nativo sÃ³ existe na API oficial. Loja Integrada deixei conectada esperando a chave.",
    results:
      "219 produtos e 568 variaÃ§Ãµes sincronizados, categoria arrumada (kimono, jiu-jitsu, judÃ´, muay thai, karate, aikido, MMA e feminino) e o fluxo completo do primeiro oi atÃ© o pedido registrado, com aviso para o dono e conversa no inbox. 63 testes cobrindo fluxo, estoque, categoria e pedido.",
    role: "Desenvolvimento e entrega",
    timeline: "2025 â€” atual",
    metrics: [
      { label: "Produtos", value: "219" },
      { label: "VariaÃ§Ãµes", value: "568" },
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
      "Sistema de gestÃ£o de importaÃ§Ã£o com checkout prÃ³prio: cartÃ£o, Pix e boleto, webhook assinado, Ã¡rea do cliente e admin.",
    summary:
      "Produto que montei do zero: plano, checkout, pagamento, liberaÃ§Ã£o de acesso e operaÃ§Ã£o. O cÃ³digo abre em breve, entÃ£o o case mostra as decisÃµes e o que jÃ¡ estÃ¡ de pÃ©.",
    problem:
      "Quem importa controla pedido, plano e pagamento em planilha. Falta um lugar Ãºnico onde a pessoa assina, paga e jÃ¡ entra, sem ninguÃ©m conciliar pagamento na mÃ£o no fim do dia.",
    architecture:
      "Front em React + TypeScript com Vite e Tailwind. Back no Supabase: Postgres com RLS, Auth e Edge Functions em Deno. O checkout abre sessÃ£o na Stripe (cartÃ£o, Pix e boleto) e na InfinitePay (Pix); o webhook confere o HMAC antes de liberar o acesso. Venda nova cai no Discord e o admin cria usuÃ¡rio com plano e permissÃ£o.",
    decisions:
      "Dois gateways porque Pix e boleto tÃªm custo e prazo de liquidaÃ§Ã£o diferentes. O webhook Ã© a fonte da verdade, nunca o retorno do navegador. Segredo fica na Edge Function, longe do cliente. RLS separa dado por conta. E o admin cria usuÃ¡rio para nÃ£o depender de suporte manual.",
    results:
      "Checkout de ponta a ponta com trÃªs meios de pagamento, assinatura validada, acesso liberado sozinho, painel de admin e ambiente de teste com pagamento mock. Falta sÃ³ abrir o cÃ³digo.",
    role: "Produto, cÃ³digo e entrega",
    timeline: "2025 â€” atual",
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
      "AutomaÃ§Ã£o de procura de emprego que roda na minha mÃ¡quina: coleta vaga, pontua o match, monta rascunho e acompanha a candidatura. Ã‰ o motor por trÃ¡s da pÃ¡gina /vagas daqui do site.",
    problem:
      "Procurar vaga espalha tudo em aba, planilha e mensagem. Quando vocÃª percebe, gastou a tarde organizando link e nÃ£o se candidatou a nada.",
    architecture:
      "Servidor Express em Node.js que comanda o Playwright no LinkedIn e nos outros portais, um pipeline de IA para ler o perfil e escrever o rascunho, e um painel React com timeline ao vivo. O estado fica em JSON local e nada sai sem eu confirmar. A parte pÃºblica vira /jobs.json, que Ã© o que a pÃ¡gina /vagas lÃª.",
    decisions:
      "Rodar na mÃ¡quina do usuÃ¡rio, porque sessÃ£o e dado de vaga sÃ£o privados. Navegador de verdade em vez de scraping frÃ¡gil. Fila Ãºnica para as automaÃ§Ãµes nÃ£o brigarem. ConfirmaÃ§Ã£o humana antes de qualquer envio. E se a IA falhar, cai no JSON.",
    results:
      "Painel com quatro fontes, score explicado por stack e senioridade, fila de candidatura e auditoria de perfil. A versÃ£o pÃºblica lista 41 vagas e alimenta o Career HQ do site.",
    role: "Fundador e Desenvolvedor",
    timeline: "2025 â€” atual",
    metrics: [
      { label: "Fontes", value: "4" },
      { label: "Vagas", value: "41" },
      { label: "Dados no PC", value: "100%" },
      { label: "Stack", value: "Node + React" },
    ],
    tags: ["Node.js", "Express", "React", "Playwright", "AutomaÃ§Ã£o", "IA"],
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
      "Vitrine da minha coleÃ§Ã£o de PokÃ©mon: 25 cartas com condiÃ§Ã£o e preÃ§o, comparaÃ§Ã£o com a Liga e anÃºncio sincronizado na OLX e no Facebook.",
    summary:
      "Fiz para vender a coleÃ§Ã£o sem enlouquecer. O site mostra cada carta com estado e preÃ§o, compara com a mÃ©dia da Liga e o painel local reescreve tudo. A Mewtwo-EX 163/162 Secret Rare anunciei por R$ 700 e fechei em R$ 550.",
    problem:
      "Anunciar carta Ã© sempre a mesma novela: foto, descriÃ§Ã£o, estado, preÃ§o de mercado e o anÃºncio envelhecendo. Planilha nÃ£o mostra quanto o meu preÃ§o estÃ¡ longe da Liga, e eu acabava refazendo anÃºncio de 25 cartas na mÃ£o.",
    architecture:
      "Site sem framework: HTML, CSS e JavaScript puro na Vercel, para abrir rÃ¡pido no celular. Um painel local em Node.js edita o JSON e regenera os dados. O motor de anÃºncio usa o Chrome via DevTools Protocol para ler e atualizar OLX e Facebook direto na API interna, e o preÃ§o de referÃªncia vem da mÃ©dia de venda da Liga PokÃ©mon.",
    decisions:
      "Zero framework no site porque era vitrine, nÃ£o app. Painel separado do site para nÃ£o ter ediÃ§Ã£o exposta em produÃ§Ã£o. API interna da OLX em vez de clicar em interface que quebra toda semana. PreÃ§o por condiÃ§Ã£o, sempre abaixo da mediana, para vender rÃ¡pido em vez de ficar anunciado. A Mewtwo-EX foi a exceÃ§Ã£o: anunciei acima da Liga e negociei na conversa.",
    results:
      "25 cartas publicadas com estado, preÃ§o e comparaÃ§Ã£o contra a Liga, 16 delas abaixo da mediana. O painel faz ediÃ§Ã£o, leitura de carta por IA, log ao vivo e publica com um comando. A Mewtwo-EX saiu por R$ 550.",
    role: "Desenvolvedor",
    timeline: "2025 â€” atual",
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
      "App de gastos que lÃª a foto do extrato, extrai as transaÃ§Ãµes, categoriza e mostra para onde o dinheiro foi no mÃªs.",
    summary:
      "FinanÃ§as pessoais sem digitar lanÃ§amento. Manda foto ou PDF do extrato, o OCR e a IA puxam as transaÃ§Ãµes, o app categoriza e monta o painel. Back em Spring Boot, tela em Next.js.",
    problem:
      "Organizar gasto em planilha dura uma semana. Depois ninguÃ©m tem paciÃªncia de digitar os 60 lanÃ§amentos do extrato, e sem lanÃ§amento nÃ£o existe orÃ§amento que funcione.",
    architecture:
      "API em Java 17 com Spring Boot 3.2, Spring Security com JWT e Postgres via JPA. O OCR do extrato vai no Google Cloud Vision, porque foto de extrato Ã© sombra, reflexo e perspectiva. O front Ã© Next.js 14 com TypeScript, Tailwind e shadcn/ui, grÃ¡fico em Recharts. Tudo sobe com um docker-compose.",
    decisions:
      "OCR na nuvem em vez de modelo local, porque a foto Ã© ruim e o extrato Ã© o dado mais importante do app. Categoria sugerida com revisÃ£o, porque categorizar errado calado Ã© pior que pedir confirmaÃ§Ã£o. JWT no back para o front nÃ£o precisar guardar sessÃ£o. E orÃ§amento por categoria, nÃ£o sÃ³ total do mÃªs.",
    results:
      "Fluxo inteiro funcionando: cadastro, login, upload do extrato, transaÃ§Ãµes extraÃ­das e categorizadas, painel com grÃ¡fico, orÃ§amento e alerta de estouro, detector de assinatura recorrente e exportaÃ§Ã£o. Ainda sem instÃ¢ncia pÃºblica: roda no docker-compose.",
    role: "Desenvolvedor",
    timeline: "2026",
    metrics: [
      { label: "Back-end", value: "Spring Boot" },
      { label: "Front-end", value: "Next.js" },
      { label: "Banco", value: "PostgreSQL" },
      { label: "ExtraÃ§Ã£o", value: "OCR" },
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
      "Back-end em Spring Boot com extensÃ£o do Chrome: mede o tempo em site que rouba atenÃ§Ã£o e avisa quando passa do limite que vocÃª mesmo marcou.",
    summary:
      "VocÃª escolhe os sites que te distraem e quanto tempo tolera em cada um. A extensÃ£o conta, o back-end guarda e o painel mostra o dia e a semana. Passou do limite, chega o aviso.",
    problem:
      "NinguÃ©m percebe quanto tempo passou rolando. E app de bloqueio Ã© fÃ¡cil de desligar no primeiro impulso, entÃ£o bloquear nÃ£o resolve nada.",
    architecture:
      "Java 21 com Spring Boot, H2 em arquivo, Spring Data JPA e pÃ¡ginas Thymeleaf com Bootstrap. A extensÃ£o em Manifest V3 conversa com a API local (/api/check, /api/track, /api/alert) e dispara a notificaÃ§Ã£o quando o tempo estoura.",
    decisions:
      "H2 em arquivo em vez de Postgres para nÃ£o pedir instalaÃ§Ã£o a quem sÃ³ quer testar. Aviso em vez de bloqueio, porque bloqueio gera raiva e desinstalaÃ§Ã£o. Limite por site em vez de cota diÃ¡ria, porque o problema Ã© o site e nÃ£o o dia. E a extensÃ£o sÃ³ mede: quem decide parar Ã© a pessoa.",
    results:
      "Sistema rodando local: dashboard com visita, alerta e tempo por site (hoje e na semana), cadastro dos sites distrativos e extensÃ£o instalÃ¡vel em modo desenvolvedor.",
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
      "Bot de Discord em Go que acompanha o preÃ§o de um produto, guarda o histÃ³rico, desenha o grÃ¡fico e chama quando o valor cai.",
    summary:
      "Cansado de abrir o mesmo link todo dia para ver se baixou. VocÃª manda o link no Discord, o bot lÃª o preÃ§o de tempos em tempos, guarda cada leitura e avisa quando chega no valor que vocÃª pediu.",
    problem:
      "PromoÃ§Ã£o boa dura horas. Conferir preÃ§o na mÃ£o todo dia Ã© chato, e quando vocÃª lembra de olhar jÃ¡ voltou ao normal. Grupo de promoÃ§Ã£o avisa de tudo, menos do produto que vocÃª quer.",
    architecture:
      "Go com discordgo para os slash commands, colly para ler a pÃ¡gina do produto, SQLite via modernc (sem CGO) para o histÃ³rico e go-chart para gerar o grÃ¡fico em PNG. Um scheduler em background checa os produtos monitorados e grava cada leitura; o histÃ³rico Ã© o que vira o grÃ¡fico do /historico. Docker com volume em ./data para o banco sobreviver ao restart.",
    decisions:
      "SQLite sem CGO porque eu queria binÃ¡rio Ãºnico e deploy sem dor. Gravar preÃ§o em toda checagem, e nÃ£o sÃ³ quando muda, para o grÃ¡fico ter linha do tempo de verdade. Alerta por produto, nÃ£o um global. E o scraper atrÃ¡s de uma interface, para trocar por API no dia que o site oferecer.",
    results:
      "Oito comandos no ar, do /monitorar ao /comparar, com histÃ³rico, estatÃ­stica de menor e maior preÃ§o e alerta por valor. Hoje funciona com a Amazon; Mercado Livre e Magazine Luiza estÃ£o na fila.",
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
      "Badge do Discord sÃ³ aparecia abrindo o perfil de cada pessoa. O plugin joga ela direto no chat, ao lado do nome, e ainda cria uma busca para achar quem tem Nitro, Early Supporter ou 24 meses de boost.",
    problem:
      "Em servidor grande, descobrir quem tem boost ou Nitro Ã© clicar perfil por perfil. E carregar o perfil de mil membros de uma vez estoura o rate limit e trava o cliente na sua frente.",
    architecture:
      "Plugin em TypeScript em cima da API do Vencord, com React injetado onde a mensagem e o membro sÃ£o desenhados. TrÃªs camadas de cache (badge, membro e perfil), fila de perfil com velocidade configurÃ¡vel e busca que varre o servidor em lote. Tem instalador .bat que resolve Git, Node e pnpm sozinho.",
    decisions:
      "Userplugin em vez de fork do Vencord, porque fork vira dÃ­vida na primeira atualizaÃ§Ã£o. Perfil carrega devagar e na ordem de quem estÃ¡ na tela, jÃ¡ que o que importa Ã© o chat aberto. A busca nunca manda mensagem: sÃ³ abre a conversa. E as 29 opÃ§Ãµes existem porque servidor de 20 mil membros nÃ£o se comporta como servidor de 30.",
    results:
      "Badge no chat e na lista de membros, busca por badge com contagem por servidor e instalador automÃ¡tico no Windows. O projeto Ã© em parceria: eu fiquei com a parte de performance, cache e busca.",
    role: "Desenvolvedor (parceria)",
    timeline: "2025",
    metrics: [
      { label: "OpÃ§Ãµes", value: "29" },
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
      "Produto digital para o pÃºblico 60+: ebook, pÃ¡gina de venda, marca, criativos e a operaÃ§Ã£o de venda montada.",
    summary:
      "Do produto Ã  campanha: guia em PDF, pÃ¡gina de venda, identidade, 30 posts, stories, criativo de anÃºncio e checkout configurado. Foi projeto de produto, nÃ£o sÃ³ de cÃ³digo.",
    problem:
      "Quem tem 60+ quer voltar a treinar e encontra conteÃºdo tÃ©cnico, letra pequena e promessa exagerada. Faltava uma oferta clara, segura e fÃ¡cil de ler no celular.",
    architecture:
      "PÃ¡gina em HTML/CSS puro, com foco em legibilidade e contraste, ebook diagramado em HTML para virar PDF, identidade prÃ³pria e checkout na Cakto. A campanha usa trÃªs Ã¢ngulos no Meta Ads, com criativo estÃ¡tico e vÃ­deo curto.",
    decisions:
      "Tipografia grande e texto simples no lugar da estÃ©tica fitness de sempre. Promessa realista, com aviso de seguranÃ§a. PÃ¡gina leve para abrir rÃ¡pido no 4G. E produto de entrada a R$ 37 para validar a oferta antes de pensar em escalar.",
    results:
      "Oferta completa no ar: produto, pÃ¡gina, marca, 30 posts, 10 stories, roteiro de reels, trÃªs criativos e plano de campanha. A pÃ¡gina vende sem app e sem cadastro.",
    role: "Produto, Design e Desenvolvimento",
    timeline: "2025 â€” atual",
    metrics: [
      { label: "Produtos", value: "2 ebooks" },
      { label: "PeÃ§as", value: "30+" },
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
