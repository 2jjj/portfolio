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
    title: "PresenÃ§a profissional",
    price: "R$ 300",
    unit: "projeto",
    delivery: "48h",
    summary:
      "CurrÃ­culo que passa por filtro automÃ¡tico, portfÃ³lio de uma pÃ¡gina e LinkedIn arrumado. Para quem estÃ¡ procurando emprego e nÃ£o quer parecer amador.",
    includes: [
      "CurrÃ­culo em PDF (PT e EN), uma pÃ¡gina, formato ATS",
      "PortfÃ³lio de uma pÃ¡gina com seus projetos",
      "RevisÃ£o de headline, sobre e experiÃªncia do LinkedIn",
    ],
    tag: "comece por aqui",
  },
  {
    id: "site",
    title: "Site de uma pÃ¡gina",
    price: "R$ 350",
    unit: "projeto",
    delivery: "3 dias",
    summary:
      "Landing page rÃ¡pida, responsiva e pronta para receber cliente. Serve para serviÃ§o local, profissional autÃ´nomo ou produto novo.",
    includes: [
      "PÃ¡gina Ãºnica com seÃ§Ãµes de oferta, prova e contato",
      "Layout mobile-first e formulÃ¡rio de contato",
      "Deploy publicado e uma rodada de ajustes",
    ],
  },
  {
    id: "automacao",
    title: "Bot e automaÃ§Ã£o",
    price: "R$ 450",
    unit: "projeto",
    delivery: "5 dias",
    summary:
      "Aquela tarefa que vocÃª repete todo dia vira um script. Planilha, WhatsApp, Discord, Telegram ou API â€” roda sozinho e te avisa quando termina.",
    includes: [
      "AutomaÃ§Ã£o de planilha, mensagem ou coleta de dados",
      "IntegraÃ§Ã£o com WhatsApp, Discord, Telegram ou API",
      "Rodando em servidor com log e instruÃ§Ãµes de uso",
    ],
  },
  {
    id: "api",
    title: "API e integraÃ§Ã£o Pix",
    price: "R$ 600",
    unit: "projeto",
    delivery: "7 dias",
    summary:
      "Backend para o seu site ou app: cadastro, login, pedidos e cobranÃ§a por Pix com confirmaÃ§Ã£o automÃ¡tica.",
    includes: [
      "API REST documentada (Node.js ou Java/Spring)",
      "CobranÃ§a Pix com webhook de confirmaÃ§Ã£o",
      "Banco de dados, autenticaÃ§Ã£o e deploy",
    ],
  },
  {
    id: "ajuste",
    title: "Ajuste rÃ¡pido",
    price: "R$ 90",
    unit: "hora",
    delivery: "24â€“48h",
    summary:
      "Bug que nÃ£o sai, layout quebrado no celular, deploy que falha ou cÃ³digo que ninguÃ©m quer mexer. Entro, resolvo e explico o que era.",
    includes: [
      "DiagnÃ³stico por escrito antes de cobrar",
      "CorreÃ§Ã£o com commit e explicaÃ§Ã£o",
      "MÃ­nimo de meia hora por chamado",
    ],
  },
];

export const steps = [
  {
    title: "VocÃª conta o problema",
    text: "Uma mensagem com o que precisa e o prazo. Se nÃ£o souber o tamanho, eu ajudo a fechar o escopo.",
  },
  {
    title: "Eu mando o orÃ§amento",
    text: "PreÃ§o fixo, prazo e o que estÃ¡ incluso. Sem surpresa no meio do caminho.",
  },
  {
    title: "Metade no Pix",
    text: "50% para comeÃ§ar, 50% na entrega aprovada. Projeto pequeno pode ser pago tudo no fim.",
  },
  {
    title: "Entrega e ajuste",
    text: "Te entrego funcionando, com uma rodada de ajustes inclusa e instruÃ§Ãµes de uso.",
  },
];

export const faq = [
  {
    q: "Por que o preÃ§o Ã© abaixo do mercado?",
    a: "Sou jÃºnior e estou montando reputaÃ§Ã£o. Prefiro fechar os primeiros trabalhos com preÃ§o honesto e entrega rÃ¡pida do que esperar o telefone tocar. O escopo Ã© o mesmo: coisa pequena, bem feita e documentada.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Pix, direto comigo. Metade para comeÃ§ar e metade na entrega aprovada. Para serviÃ§os de atÃ© R$ 200, pode ser tudo no fim.",
  },
  {
    q: "Em quanto tempo fica pronto?",
    a: "PresenÃ§a profissional em 48h, site de uma pÃ¡gina em 3 dias, automaÃ§Ã£o em 5 e API em 7. Prazo comeÃ§a a contar depois do pagamento inicial e do material recebido.",
  },
  {
    q: "E se eu nÃ£o gostar?",
    a: "Uma rodada de ajustes estÃ¡ inclusa em todo projeto. Se ainda nÃ£o for o que vocÃª queria, a gente combina o que falta antes de eu cobrar a segunda parte.",
  },
  {
    q: "VocÃª atende fora de RibeirÃ£o Preto?",
    a: "Sim. Tudo Ã© remoto, por mensagem e chamada. JÃ¡ trabalhei com gente de outros estados e o fuso nunca foi problema.",
  },
  {
    q: "VocÃª faz nota fiscal?",
    a: "Combino o formato de documento direto no orÃ§amento, conforme o seu caso. O recibo do Pix serve para os dois lados.",
  },
];

export const contact = {
  email: "pedrosakamoto27@gmail.com",
  linkedin: "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/",
  github: "https://github.com/2jjj",
  site: "https://pedrosakamoto.site",
};

export const mailto = (subject = "OrÃ§amento de projeto") =>
  `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`;
