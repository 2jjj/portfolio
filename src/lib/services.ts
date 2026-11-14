export type Service = {
  id: string;
  title: string;
  price: string;
  unit: string;
  delivery: string;
  summary: string;
  includes: string[];
  tag?: string;
};

export const services: Service[] = [
  {
    id: "presenca",
    title: "Presença profissional",
    price: "R$ 300",
    unit: "projeto",
    delivery: "48h",
    summary:
      "Currículo que passa por filtro automático, portfólio de uma página e LinkedIn arrumado. Para quem está procurando emprego e não quer parecer amador.",
    includes: [
      "Currículo em PDF (PT e EN), uma página, formato ATS",
      "Portfólio de uma página com seus projetos",
      "Revisão de headline, sobre e experiência do LinkedIn",
    ],
    tag: "comece por aqui",
  },
  {
    id: "site",
    title: "Site de uma página",
    price: "R$ 350",
    unit: "projeto",
    delivery: "3 dias",
    summary:
      "Landing page rápida, responsiva e pronta para receber cliente. Serve para serviço local, profissional autônomo ou produto novo.",
    includes: [
      "Página única com seções de oferta, prova e contato",
      "Layout mobile-first e formulário de contato",
      "Deploy publicado e uma rodada de ajustes",
    ],
  },
  {
    id: "automacao",
    title: "Bot e automação",
    price: "R$ 450",
    unit: "projeto",
    delivery: "5 dias",
    summary:
      "Aquela tarefa que você repete todo dia vira um script. Planilha, WhatsApp, Discord, Telegram ou API — roda sozinho e te avisa quando termina.",
    includes: [
      "Automação de planilha, mensagem ou coleta de dados",
      "Integração com WhatsApp, Discord, Telegram ou API",
      "Rodando em servidor com log e instruções de uso",
    ],
  },
  {
    id: "api",
    title: "API e integração Pix",
    price: "R$ 600",
    unit: "projeto",
    delivery: "7 dias",
    summary:
      "Backend para o seu site ou app: cadastro, login, pedidos e cobrança por Pix com confirmação automática.",
    includes: [
      "API REST documentada (Node.js ou Java/Spring)",
      "Cobrança Pix com webhook de confirmação",
      "Banco de dados, autenticação e deploy",
    ],
  },
  {
    id: "ajuste",
    title: "Ajuste rápido",
    price: "R$ 90",
    unit: "hora",
    delivery: "24–48h",
    summary:
      "Bug que não sai, layout quebrado no celular, deploy que falha ou código que ninguém quer mexer. Entro, resolvo e explico o que era.",
    includes: [
      "Diagnóstico por escrito antes de cobrar",
      "Correção com commit e explicação",
      "Mínimo de meia hora por chamado",
    ],
  },
];

export const steps = [
  {
    title: "Você conta o problema",
    text: "Uma mensagem com o que precisa e o prazo. Se não souber o tamanho, eu ajudo a fechar o escopo.",
  },
  {
    title: "Eu mando o orçamento",
    text: "Preço fixo, prazo e o que está incluso. Sem surpresa no meio do caminho.",
  },
  {
    title: "Metade no Pix",
    text: "50% para começar, 50% na entrega aprovada. Projeto pequeno pode ser pago tudo no fim.",
  },
  {
    title: "Entrega e ajuste",
    text: "Te entrego funcionando, com uma rodada de ajustes inclusa e instruções de uso.",
  },
];

export const faq = [
  {
    q: "Por que o preço é abaixo do mercado?",
    a: "Sou júnior e estou montando reputação. Prefiro fechar os primeiros trabalhos com preço honesto e entrega rápida do que esperar o telefone tocar. O escopo é o mesmo: coisa pequena, bem feita e documentada.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Pix, direto comigo. Metade para começar e metade na entrega aprovada. Para serviços de até R$ 200, pode ser tudo no fim.",
  },
  {
    q: "Em quanto tempo fica pronto?",
    a: "Presença profissional em 48h, site de uma página em 3 dias, automação em 5 e API em 7. Prazo começa a contar depois do pagamento inicial e do material recebido.",
  },
  {
    q: "E se eu não gostar?",
    a: "Uma rodada de ajustes está inclusa em todo projeto. Se ainda não for o que você queria, a gente combina o que falta antes de eu cobrar a segunda parte.",
  },
  {
    q: "Você atende fora de Ribeirão Preto?",
    a: "Sim. Tudo é remoto, por mensagem e chamada. Já trabalhei com gente de outros estados e o fuso nunca foi problema.",
  },
  {
    q: "Você faz nota fiscal?",
    a: "Combino o formato de documento direto no orçamento, conforme o seu caso. O recibo do Pix serve para os dois lados.",
  },
];

export const contact = {
  email: "pedrosakamoto27@gmail.com",
  linkedin: "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/",
  github: "https://github.com/2jjj",
  site: "https://pedrosakamoto.site",
};

export const mailto = (subject = "Orçamento de projeto") =>
  `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`;
