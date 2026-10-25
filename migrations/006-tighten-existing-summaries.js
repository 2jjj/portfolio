const UPDATES = [
  {
    slug: "goprices",
    oldDescription: "bot monitorador de precos usando golang no discord",
    description: "Bot em Go para monitorar preços e avisar no Discord quando algo muda.",
  },
  {
    slug: "fintrack",
    oldDescription: "sistema de gerenciamento de gastos com ia",
    description:
      "Aplicação de finanças pessoais com categorização de transações e apoio de IA.",
  },
  {
    slug: "detoxdigital",
    oldDescriptionPrefix: "Um sistema que combina",
    description:
      "Spring Boot + extensão Chrome para medir tempo em sites distrativos e alertar sobre quebra de foco.",
  },
];

export async function up(pgm) {
  for (const item of UPDATES) {
    const condition = item.oldDescription
      ? `description = $old$${item.oldDescription}$old$`
      : `description LIKE $old$${item.oldDescriptionPrefix}$old$ || '%'`;

    await pgm.sql(`
      UPDATE projects
      SET description = $new$${item.description}$new$,
          summary = $new$${item.description}$new$,
          updated_at = NOW()
      WHERE slug = $s$${item.slug}$s$
        AND ${condition}
    `);
  }
}
