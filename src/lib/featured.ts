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
    image: "/projetos/importflow/painel.png",
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
      "Automação de procura de emprego que roda na minha máquina: coleta vaga, pontua o match, monta rascunho e acompanha a candidatura. Não é parte deste site — a integração entre o app e o portfólio fica por baixo dos panos.",
    problem:
      "Procurar vaga espalha tudo em aba, planilha e mensagem. Quando você percebe, gastou a tarde organizando link e não se candidatou a nada.",
    architecture:
      "Servidor Express em Node.js que comanda o Playwright no LinkedIn e nos outros portais, um pipeline de IA para ler o perfil e escrever o rascunho, e um painel React com timeline ao vivo. O estado fica em JSON local e nada sai sem eu confirmar. O que chega até o portfólio passa por um sync local — currículo em public/curriculo, dados em JSON — e fica invisível na cara do site.",
    decisions:
      "Rodar na máquina do usuário, porque sessão e dado de vaga são privados. Navegador de verdade em vez de scraping frágil. Fila única para as automações não brigarem. Confirmação humana antes de qualquer envio. E se a IA falhar, cai no JSON.",
    results:
      "Painel com quatro fontes, score explicado por stack e senioridade, fila de candidatura e auditoria de perfil. É ferramenta pessoal — o portfólio aqui é só a vitrine; nada nesse app é público.",
    role: "Fundador e Desenvolvedor",
    timeline: "2025 — atual",
    metrics: [
      { label: "Fontes", value: "4" },
      { label: "Vagas", value: "41" },
      { label: "Dados no PC", value: "100%" },
      { label: "Stack", value: "Node + React" },
    ],
    tags: ["Node.js", "Express", "React", "Playwright", "Automação", "IA"],
    image: "/projetos/startanewday/pipeline.png",
    github: "https://github.com/2jjj/startanewday",
    live: "",
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
    image: "/projetos/arquivo/hero.jpg",
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
    image: "/projetos/fintrack/dashboard.png",
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
    image: "/projetos/detoxdigital/dashboard.png",
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
    image: "/projetos/goprices/discord.png",
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
    image: "/projetos/badgesplus/chat.png",
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
  {
    id: 9110,
    slug: "reconkit",
    title: "reconkit",
    category: "Cyber",
    description:
      "CLI de recon para bug bounty: descoberta de subdomínios, port scan, HTTP probe, headers, segredos em bundles e fingerprinting — tudo em Python puro, stdlib only.",
    summary:
      "Juntei num comando só o recon que faço sempre na mão: enumeração de subdomínios, varredura de portas, sonda HTTP, leitura de headers, busca de segredos vazados em bundles JavaScript e fingerprinting da stack. Roda em qualquer máquina com Python, sem dependência, sem chave de API.",
    problem:
      "Recon de bug bounty é uma fila de ferramentas pequenas com saídas incompatíveis: uma lista aqui, um CSV ali, um texto solto acolá. Conciliar na mão antes de atacar queima o tempo que deveria ir para a análise.",
    architecture:
      "CLI em Python 3 stdlib only: subfinder-like caseiro para subdomínios (wordlist + permutação + resolução DNS em pool), socket connect para port scan, urllib para HTTP probe, parser de headers, regex de segredos em bundles e tabela de fingerprints de framework/servidor/WAF. Saída unificada em texto, JSON ou HTML.",
    decisions:
      "Stdlib only para rodar em qualquer ambiente sem pip install. Concorrência por threads com pool limitado, porque port scan sequencial é suicídio de tempo. Saída HTML para ler depois e JSON para encadear no próximo passo. E zero dependência de API paga — o objetivo é recon, não depender de SaaS.",
    results:
      "Kit de recon funcional para estudo de superfície de ataque e bug bounty: subdomínios, portas, headers, segredos e fingerprint num único comando, com relatório HTML pronto para anexo em write-up.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Linguagem", value: "Python" },
      { label: "Dependências", value: "0" },
      { label: "Módulos", value: "6" },
      { label: "Foco", value: "Recon" },
    ],
    tags: ["Python", "Segurança", "Recon", "Bug Bounty", "CLI"],
    image: "/projetos/reconkit/terminal.png",
    github: "https://github.com/2jjj/reconkit",
    live: "",
    featured: 1,
    order_index: 9,
    created_at: "2026-09-17T00:00:00.000Z",
    updated_at: "2026-09-17T00:00:00.000Z",
  },
  {
    id: 9111,
    slug: "gastos-crud-spring",
    title: "gastos-crud-spring",
    category: "Back-End",
    description:
      "CRUD de despesas em Java 21 com HTTP Server nativo, persistência em JSON, testes, Docker e Swagger — sem framework pesado.",
    summary:
      "CRUD de despesas sem Spring, para provar a base: Java 21 puro, com.sun.net.httpserver, persistência em arquivo JSON, testes de contrato e Swagger documentando as rotas. Sobe com docker compose.",
    problem:
      "Todo mundo sobe Spring para CRUD e nunca vê o que acontece embaixo. Quis montar as mesmas rotas na unha para entender roteamento, serialização e erro antes de deixar o framework decidir por mim.",
    architecture:
      "com.sun.net.httpserver com handlers por rota, Jackson para JSON, repositório em arquivo (gastos.json) com escrita atômica, testes com a stack nativa de java.net.http e imagem Docker multi-stage. Swagger UI servido estático documentando GET/POST/PUT/DELETE /api/despesas.",
    decisions:
      "Sem framework para sentir cada camada na mão. Arquivo JSON em vez de banco para o exemplo subir em qualquer máquina. Escrita atômica (tmp + rename) porque perder o arquivo de dados é o pior bug de um CRUD local. Swagger junto para virar contrato, não só demo.",
    results:
      "API completa com 14 testes verdes, Swagger em /swagger-ui.html e imagem Docker que sobe com um comando. Serve como vitrine de fundamento de HTTP sem framework.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Linguagem", value: "Java 21" },
      { label: "Testes", value: "14" },
      { label: "Deploy", value: "Docker" },
      { label: "Docs", value: "Swagger" },
    ],
    tags: ["Java", "HTTP Server", "Docker", "Swagger", "Testes"],
    image: "/projetos/gastos-crud-spring/terminal.png",
    github: "https://github.com/2jjj/gastos-crud-spring-http-docker",
    live: "",
    featured: 1,
    order_index: 10,
    created_at: "2026-11-17T00:00:00.000Z",
    updated_at: "2026-11-17T00:00:00.000Z",
  },
  {
    id: 9112,
    slug: "prism",
    title: "prism",
    category: "Ferramentas",
    description:
      "CLI em Python que extrai a paleta dominante de uma imagem e exporta em hex, JSON, CSS ou Tailwind.",
    summary:
      "Você aponta para uma imagem e recebe a paleta dominante quantizada, com percentual por cor, pronta para colar como tokens CSS, objeto Tailwind, JSON ou hex puro. Uso sempre que começo uma página nova.",
    problem:
      "Tirar paleta na mão de um screenshot é olho e chute. Preciso dos 5-6 hex certos, com proporção, sem abrir editor de imagem.",
    architecture:
      "Python com Pillow para leitura de pixels e k-means caseiro (sem numpy pesado) para quantização, contadores por cluster, exportações para quatro formatos. CLI com argparse: --format hex|json|css|tailwind, --colors para k.",
    decisions:
      "Quantização por k-means em vez de histograma simples, porque histograma devolve cores que não existem na imagem. Exportação em quatro formatos para o resultado ir direto para o projeto. E rodando offline, porque referência de design não pode depender de SaaS.",
    results:
      "Ferramenta de bolso para abrir qualquer referência visual e sair com tokens prontos — hex, CSS variables, JSON ou config do Tailwind.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Linguagem", value: "Python" },
      { label: "Formatos", value: "4" },
      { label: "Método", value: "k-means" },
      { label: "Offline", value: "Sim" },
    ],
    tags: ["Python", "CLI", "Design", "Tokens", "Ferramenta"],
    image: "/projetos/prism/terminal.png",
    github: "https://github.com/2jjj/prism",
    live: "",
    featured: 1,
    order_index: 11,
    created_at: "2026-09-17T00:00:00.000Z",
    updated_at: "2026-09-17T00:00:00.000Z",
  },
  {
    id: 9113,
    slug: "cron-help",
    title: "cron-help",
    category: "Ferramentas",
    description:
      "CLI que traduz expressões cron para texto em português e lista as próximas execuções. Publicado no npm.",
    summary:
      "Cron é a única sintaxe que todo mundo copia e ninguém lê. O cron-help traduz \"*/5 9-18 * * 1-5\" para \"a cada 5 minutos, das 9h às 18h55, de segunda a sexta\" e mostra as próximas execuções reais.",
    problem:
      "Discordei de deploy com cron errado mais vezes do que gostaria de contar. Ver a expressão em português antes do deploy evita metade dos tickets \"o job não rodou\".",
    architecture:
      "Node.js puro, parser próprio de 5 campos (minuto, hora, dia, mês, dow) com ranges, steps (*/n), listas e nomes JAN/FEB. Cálculo das próximas N execuções por iteração sobre o calendário, limitado para nunca travar em expressão vazia. CLI com flags --next e --tz.",
    decisions:
      "Parser próprio em vez de dependência, porque a parte interessante é exatamente o parser. Texto em português porque é o público real da ferramenta. --next para conferir o deploy antes de subir.",
    results:
      "Publicado no npm, usado no meu próprio pipeline de vagas (StartANewDay) para conferir o agendamento da coleta das 06:00.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Linguagem", value: "Node.js" },
      { label: "Distribuição", value: "npm" },
      { label: "Parser", value: "Próprio" },
      { label: "Idioma", value: "PT-BR" },
    ],
    tags: ["Node.js", "CLI", "npm", "Cron", "Automação"],
    image: "/projetos/cron-help/terminal.png",
    github: "https://github.com/2jjj/cron-help",
    live: "",
    featured: 1,
    order_index: 12,
    created_at: "2026-10-28T00:00:00.000Z",
    updated_at: "2026-10-28T00:00:00.000Z",
  },
  {
    id: 9114,
    slug: "pomodoro-foco",
    title: "pomodoro-foco",
    category: "Front-End",
    description:
      "Timer pomodoro minimal em React + TypeScript: sessões no localStorage, sem backend, pronto para uso.",
    summary:
      "Pomodoro sem fricção: abre a página e o timer começa. Sessões e contagem de ciclos ficam no localStorage, então o progresso sobrevive ao refresh — zero backend, zero conta, zero distração.",
    problem:
      "Todo app de pomodoro quer vender assinatura antes de você terminar o primeiro ciclo. Eu só queria um relógio bonito que não me julgasse.",
    architecture:
      "React 18 + TypeScript + Vite, estado do timer com useReducer e intervalo único, persistência em localStorage com versionamento de schema, CSS puro sem biblioteca de componentes. Deploy estático.",
    decisions:
      "LocalStorage porque não tem dado sensível e não precisa de conta para valer a pena. useReducer porque máquina de estados de timer tem mais bordas do que parece (pausa, pausa longa, skip). E zero dependência de UI — o design é o produto.",
    results:
      "App no ar e usado diariamente no meu fluxo de estudo — inclusive nas sessões de deep work deste portfólio.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Stack", value: "React + TS" },
      { label: "Backend", value: "Nenhum" },
      { label: "Persistência", value: "localStorage" },
      { label: "Deploy", value: "Estático" },
    ],
    tags: ["React", "TypeScript", "Vite", "Produtividade"],
    image: "/projetos/pomodoro-foco/app.png",
    github: "https://github.com/2jjj/pomodoro-foco",
    live: "",
    featured: 1,
    order_index: 13,
    created_at: "2026-11-14T00:00:00.000Z",
    updated_at: "2026-11-14T00:00:00.000Z",
  },
  {
    id: 9115,
    slug: "quicknotes-cli",
    title: "quicknotes-cli",
    category: "Ferramentas",
    description:
      "Notebook de linha de comando: notas em JSON local, add/list/search/rm em segundos.",
    summary:
      "Anotam-se 40 coisas por dia e perde-se 38. O quicknotes-cli é um qn add \"texto\" e pronto: fica num JSON local, busca full-text na hora, sem nuvem e sem app Electron.",
    problem:
      "Ideia boa dura segundos. Abrir app de notas, esperar carregar e escolher pasta mata a anotação no meio.",
    architecture:
      "Node.js stdlib only: parse de subcomandos na unha, armazenamento em ~/.quicknotes.json com IDs incrementais, busca por substring normalizada (sem acentos) e saída alinhada em colunas.",
    decisions:
      "JSON local e não SQLite, porque o volume nunca justifica binário nativo. Busca sem acentos porque pt-BR digita errado com pressa. Sem daemon, sem sync — a graça é ser instantâneo.",
    results:
      "Ferramenta diária: todo comando deste portfólio que eu esqueço, eu qn add antes de esquecer.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Linguagem", value: "Node.js" },
      { label: "Storage", value: "JSON local" },
      { label: "Distribuição", value: "npm" },
      { label: "Busca", value: "Full-text" },
    ],
    tags: ["Node.js", "CLI", "npm", "Produtividade"],
    image: "/projetos/quicknotes-cli/terminal.png",
    github: "https://github.com/2jjj/quicknotes-cli",
    live: "",
    featured: 1,
    order_index: 14,
    created_at: "2026-11-16T00:00:00.000Z",
    updated_at: "2026-11-16T00:00:00.000Z",
  },
  {
    id: 9116,
    slug: "gastos-cli",
    title: "gastos-cli",
    category: "Ferramentas",
    description:
      "Controle de despesas no terminal em Java: lançamentos em CSV local e totais por mês.",
    summary:
      "Gastos sem planilha e sem conta: gastos add mercado 183.40 entra no CSV, gastos mes mostra o mês agrupado com total. Java puro, um arquivo, zero dependência.",
    problem:
      "Registrar gasto tem que ser mais rápido que não registrar. Aplicativo com tela e gráfico não sobrevive à terceira semana.",
    architecture:
      "Java 17+ puro, leitor/escritor de CSV caseiro (quoted fields, vírgula decimal), comandos add/mes/list/total via main(String[]), datas via java.time. Arquivo gastos.csv na pasta atual.",
    decisions:
      "CSV e não banco, para abrir no Excel quando bater a curiosidade. Sem dependência para rodar em qualquer JDK velho de máquina emprestada. E datas em java.time porque manipulação de LocalDate na mão é armadilha.",
    results:
      "Uso real por meses: é para onde vai cada lançamento antes de virar orçamento mental do mês.",
    role: "Autor",
    timeline: "2026",
    metrics: [
      { label: "Linguagem", value: "Java" },
      { label: "Storage", value: "CSV" },
      { label: "Dependências", value: "0" },
      { label: "Comandos", value: "4" },
    ],
    tags: ["Java", "CLI", "CSV", "Finanças"],
    image: "/projetos/gastos-cli/terminal.png",
    github: "https://github.com/2jjj/gastos-cli",
    live: "",
    featured: 1,
    order_index: 15,
    created_at: "2026-11-15T00:00:00.000Z",
    updated_at: "2026-11-15T00:00:00.000Z",
  },
];

const FEATURED_SLUGS = new Set(FEATURED_PROJECTS.map((project) => project.slug));

export function withFeaturedProjects(projects: Project[]): Project[] {
  const rest = projects.filter((project) => !FEATURED_SLUGS.has(project.slug));
  return [...FEATURED_PROJECTS, ...rest];
}
