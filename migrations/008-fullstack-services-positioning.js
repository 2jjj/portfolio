const NEW = {
  hero_description:
    "Desenvolvedor full stack em Ribeirão Preto. Faço site de uma página, bot de WhatsApp, automação e API com Pix — preço fechado, entrega em dias. Aberto a freela e a vaga júnior.",
  about_text:
    "Desenvolvedor full stack em Ribeirão Preto. Construo do banco à interface: API, banco, painel e a tela que o cliente usa. Gosto de entender o problema antes da primeira linha — modelagem, contrato de API e o que acontece quando algo falha.",
  about_secondary:
    "Venho de projetos próprios e de cliente: um sistema de vendas no WhatsApp em operação, um SaaS de importação com checkout Pix e este site — React no front, Express e Postgres no back, autenticação JWT, migrations e deploy na Vercel. Se você precisa de site, bot ou API, os serviços e o preço estão na página de serviços.",
  hero_phrases:
    '["Full Stack Developer","React & Node.js","Sites, bots e APIs","Java & Spring Boot"]',
};

export async function up(pgm) {
  await pgm.sql(`
    UPDATE site_info
    SET value = $new$${NEW.hero_description}$new$
    WHERE key = 'hero_description'
      AND value LIKE 'Desenvolvedor back-end%'
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $new$${NEW.about_text}$new$
    WHERE key = 'about_text'
      AND value LIKE 'Desenvolvedor back-end%'
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $new$${NEW.about_secondary}$new$
    WHERE key = 'about_secondary'
      AND value LIKE 'Venho de projetos pr%'
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $new$${NEW.hero_phrases}$new$
    WHERE key = 'hero_phrases'
      AND value LIKE '%Back-end Developer%'
  `);
}
