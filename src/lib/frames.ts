export type Frame = {
  src: string;
  alt: string;
  w: number;
  h: number;
  project: string;
  year: string;
};

/** Prints reais dos projetos publicados — a materia-prima do contact sheet. */
export const FRAMES: Frame[] = [
  { src: "/projetos/kamikaze/catalogo.png", alt: "Catálogo de produtos do Kamikaze Bot", w: 4, h: 3, project: "Kamikaze Bot", year: "2025" },
  { src: "/projetos/kamikaze/inbox.png", alt: "Caixa de entrada de conversas do WhatsApp", w: 3, h: 4, project: "Kamikaze Bot", year: "2025" },
  { src: "/projetos/kamikaze/kanban.png", alt: "Quadro de pedidos em kanban", w: 4, h: 3, project: "Kamikaze Bot", year: "2025" },
  { src: "/projetos/kamikaze/metricas.png", alt: "Painel de métricas de vendas", w: 3, h: 4, project: "Kamikaze Bot", year: "2025" },
  { src: "/projetos/kamikaze/pedidos.png", alt: "Lista de pedidos recebidos", w: 4, h: 3, project: "Kamikaze Bot", year: "2025" },
  { src: "/projetos/kamikaze/produto.png", alt: "Ficha de produto com variações", w: 3, h: 4, project: "Kamikaze Bot", year: "2025" },
  { src: "/projetos/importflow/cover.png", alt: "Tela inicial do ImportFlow", w: 4, h: 3, project: "ImportFlow", year: "2025" },
  { src: "/projetos/startanewday/cover.png", alt: "Painel de vagas do StartANewDay", w: 4, h: 3, project: "StartANewDay", year: "2025" },
  { src: "/projetos/arquivo/cover.png", alt: "Acervo de cartas do Arquivo", w: 3, h: 4, project: "Arquivo", year: "2024" },
  { src: "/projetos/arquivo/acervo.jpg", alt: "Grade de cartas do acervo", w: 4, h: 3, project: "Arquivo", year: "2024" },
  { src: "/projetos/arquivo/mewtwo.jpg", alt: "Carta de maior valor do acervo", w: 3, h: 4, project: "Arquivo", year: "2024" },
  { src: "/projetos/fintrack/cover.png", alt: "Capa do FinTrack", w: 4, h: 3, project: "FinTrack", year: "2024" },
  { src: "/projetos/fintrack/dashboard.png", alt: "Dashboard financeiro do FinTrack", w: 4, h: 3, project: "FinTrack", year: "2024" },
  { src: "/projetos/fintrack/extrato.png", alt: "Extrato com leitura de nota fiscal por OCR", w: 3, h: 4, project: "FinTrack", year: "2024" },
  { src: "/projetos/detoxdigital/dashboard.png", alt: "Dashboard da extensão Detox Digital", w: 4, h: 3, project: "Detox Digital", year: "2024" },
  { src: "/projetos/detoxdigital/extensao.png", alt: "Painel da extensão no Chrome", w: 3, h: 4, project: "Detox Digital", year: "2024" },
  { src: "/projetos/goprices/discord.png", alt: "Alerta de preço no Discord", w: 4, h: 3, project: "GoPrices", year: "2024" },
  { src: "/projetos/goprices/historico.png", alt: "Histórico de preços rastreados", w: 3, h: 4, project: "GoPrices", year: "2024" },
  { src: "/projetos/badgesplus/chat.png", alt: "Seleção de badges no chat", w: 4, h: 3, project: "BadgesPlus", year: "2024" },
  { src: "/projetos/treino-seguro-60/feed.png", alt: "Criativo em feed para o ebook Treino Seguro 60+", w: 4, h: 3, project: "Treino Seguro 60+", year: "2025" },
  { src: "/projetos/treino-seguro-60/story.png", alt: "Criativo em story para o ebook", w: 3, h: 4, project: "Treino Seguro 60+", year: "2025" },
  { src: "/projetos/kamikaze/catalogo-mobile.png", alt: "Catálogo no celular", w: 3, h: 4, project: "Kamikaze Bot", year: "2025" },
  { src: "/projetos/detoxdigital/cover.png", alt: "Capa do Detox Digital", w: 4, h: 3, project: "Detox Digital", year: "2024" },
  { src: "/projetos/goprices/cover.png", alt: "Capa do GoPrices", w: 4, h: 3, project: "GoPrices", year: "2024" },
];

/** Fotos de ambiente da direcao "Architecture" (Unsplash, via picsum). */
export const AMBIENT = [
  { src: "https://picsum.photos/id/618/1600/1000?grayscale", alt: "Teto de vidro e aço curvado" },
  { src: "https://picsum.photos/id/1081/1600/1000", alt: "Canto de prédio branco contra o céu" },
  { src: "https://picsum.photos/id/954/1600/1000?grayscale", alt: "Vão estreito em parede branca" },
];
