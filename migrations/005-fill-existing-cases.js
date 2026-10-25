const CASES = [
  {
    slug: "goprices",
    summary: "Bot em Go para monitorar preços e avisar no Discord quando algo muda.",
    problem:
      "Acompanhar preços manualmente é repetitivo e fácil de esquecer. O bot centraliza a checagem e leva o aviso para onde a pessoa já está: o Discord.",
    architecture:
      "Serviço em Go que consulta as fontes de preço, compara com o último valor conhecido e publica a notificação em um canal do Discord. O estado fica em memória/arquivo para evitar avisos duplicados.",
    decisions:
      "Go por gerar um binário único, simples de hospedar, com boa concorrência para checagens periódicas. Discord como interface reduz a necessidade de um front próprio.",
    results:
      "Bot funcional que automatiza a checagem de preços e entrega o aviso no Discord.",
    metrics: [
      { label: "Linguagem", value: "Go" },
      { label: "Interface", value: "Discord" },
      { label: "Foco", value: "Automação" },
    ],
    category: null,
  },
  {
    slug: "fintrack",
    summary:
      "Aplicação de finanças pessoais com categorização de transações e apoio de IA.",
    problem:
      "Planilhas manuais não dão uma visão rápida de para onde o dinheiro está indo.",
    architecture:
      "Aplicação TypeScript com interface web, categorização de transações e apoio de IA para organizar lançamentos e manter uma visão de longo prazo.",
    decisions:
      "Começar pelo fluxo de registrar e categorizar; a IA entra como assistente, não como fonte de verdade. A prioridade é uma visão simples e confiável.",
    results:
      "Projeto full stack com foco em produto, dados e experiência de uso.",
    metrics: [
      { label: "Stack", value: "TypeScript" },
      { label: "Foco", value: "Finanças" },
      { label: "IA", value: "Apoio" },
    ],
    category: "Full Stack",
  },
  {
    slug: "detoxdigital",
    summary:
      "Spring Boot + extensão Chrome para medir tempo em sites distrativos e alertar sobre quebra de foco.",
    problem:
      "É difícil perceber quanto tempo passa em sites de distração sem uma medição externa ao navegador.",
    architecture:
      "API em Spring Boot para registrar sessões e uma extensão Chrome para coletar tempo por domínio. Os dados alimentam alertas de foco.",
    decisions:
      "Separar coleta (extensão) de persistência (API); manter o backend como fonte de verdade; usar Java/Spring para praticar modelagem e endpoints.",
    results:
      "Sistema funcional que conecta uma extensão de navegador a um backend real, com fluxo de registro e consulta.",
    metrics: [
      { label: "Backend", value: "Spring Boot" },
      { label: "Cliente", value: "Chrome" },
      { label: "Foco", value: "Hábitos" },
    ],
    category: "Full Stack",
  },
];

export async function up(pgm) {
  for (const item of CASES) {
    await pgm.sql(`
      UPDATE projects
      SET summary = COALESCE(NULLIF(summary, ''), $new$${item.summary}$new$),
          problem = $new$${item.problem}$new$,
          architecture = $new$${item.architecture}$new$,
          decisions = $new$${item.decisions}$new$,
          results = $new$${item.results}$new$,
          role = COALESCE(NULLIF(role, ''), 'Autor'),
          timeline = COALESCE(NULLIF(timeline, ''), '2026'),
          metrics = $new$${JSON.stringify(item.metrics)}$new$::jsonb,
          updated_at = NOW()
      WHERE slug = $s$${item.slug}$s$
        AND (problem IS NULL OR problem = '')
    `);

    if (item.category) {
      await pgm.sql(`
        UPDATE projects
        SET category = $cat$${item.category}$cat$
        WHERE slug = $s$${item.slug}$s$
          AND category <> $cat$${item.category}$cat$
      `);
    }
  }
}
