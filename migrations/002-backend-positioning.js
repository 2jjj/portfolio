const NEW = {
  about_text:
    "Desenvolvedor back-end com foco em Node.js, Go e PostgreSQL. Gosto de entender o problema antes de escrever a primeira linha: modelagem, contratos de API, queries e o que acontece quando algo falha.",
  about_secondary:
    "Venho de projetos próprios — APIs, bots para Discord e sistemas com painel administrativo. Hoje aprofundo Go, Docker e Java Spring. Este site é um deles: React no front, Express e Postgres no back, autenticação JWT, migrations e deploy na Vercel.",
  hero_description:
    "Desenvolvedor back-end com foco em Node.js, Go e PostgreSQL. Construo APIs, modelo dados e cuido da parte que precisa funcionar quando ninguém está olhando.",
  hero_phrases:
    '["Back-end Developer","Node.js & PostgreSQL","APIs & Dados","Go & Docker"]',
  skills:
    '[{"title":"Node.js","category":"Back-End","level":80,"color":"#00D4FF"},{"title":"PostgreSQL","category":"Banco de Dados","level":70,"color":"#336791"},{"title":"TypeScript","category":"Linguagem","level":78,"color":"#3178C6"},{"title":"Express","category":"Back-End","level":75,"color":"#A5F3FF"},{"title":"Docker","category":"DevOps","level":60,"color":"#2496ED"},{"title":"Go","category":"Back-End","level":40,"color":"#00ADD8"},{"title":"Spring Boot","category":"Back-End","level":35,"color":"#6DB33F"},{"title":"Git","category":"DevOps","level":80,"color":"#FF6B35"}]',
};

const OLD = {
  about_text:
    "Desenvolvedor com curiosidade por aprender e evoluir. Foco em React e bancos de dados, com experiencia de back-end construindo APIs. Hoje me aprofundo em Node.js, Go, Docker e Java Spring, sempre buscando entender melhor como sistemas complexos funcionam por dentro.",
  about_secondary:
    "Acredito que boas solucoes nascem de entender o problema de verdade — seja otimizando uma query, desenhando a arquitetura de uma API ou explorando uma tecnologia nova. Cada linha de codigo e uma chance de fazer algo melhor.",
  hero_description:
    "Desenvolvedor full stack com base solida em React e bancos de dados. Experiencia pratique em back-end construindo APIs, hoje aprofundando em Node.js, Go, Docker e Java Spring.",
  hero_phrases:
    '["Full Stack Developer","React & Node.js","APIs & Banco de Dados","JavaScript & TypeScript"]',
  skills:
    '[{"title":"Node.js","category":"Back-End","level":80,"color":"#00D4FF"},{"title":"Express","category":"Back-End","level":75,"color":"#A5F3FF"},{"title":"React","category":"Front-End","level":82,"color":"#00D4FF"},{"title":"Git","category":"DevOps","level":80,"color":"#FF6B35"},{"title":"Docker","category":"DevOps","level":60,"color":"#2496ED"},{"title":"Go","category":"Back-End","level":35,"color":"#00ADD8"},{"title":"Spring Boot","category":"Back-End","level":30,"color":"#6DB33F"},{"title":"PostgreSQL","category":"Banco de Dados","level":70,"color":"#336791"}]',
};

export async function up(pgm) {
  // Só troca conteúdo que ainda é exatamente o default antigo.
  // Qualquer texto editado no admin fica preservado.

  await pgm.sql(`
    UPDATE site_info
    SET value = $new$${NEW.about_text}$new$
    WHERE key = 'about_text'
      AND value = $old$${OLD.about_text}$old$
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $new$${NEW.about_secondary}$new$
    WHERE key = 'about_secondary'
      AND value = $old$${OLD.about_secondary}$old$
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $new$${NEW.hero_description}$new$
    WHERE key = 'hero_description'
      AND value = $old$${OLD.hero_description}$old$
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $new$${NEW.hero_phrases}$new$
    WHERE key = 'hero_phrases'
      AND value = $old$${OLD.hero_phrases}$old$
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $new$${NEW.skills}$new$
    WHERE key = 'skills'
      AND value = $old$${OLD.skills}$old$
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = '5'
    WHERE key = 'stats_years' AND value = '3'
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = '12'
    WHERE key = 'stats_projects' AND value = '5'
  `);

  await pgm.sql(`DELETE FROM site_info WHERE key = 'stats_dedication'`);
}

export async function down(pgm) {
  await pgm.sql(`
    UPDATE site_info
    SET value = $old$${OLD.about_text}$old$
    WHERE key = 'about_text' AND value = $new$${NEW.about_text}$new$
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $old$${OLD.about_secondary}$old$
    WHERE key = 'about_secondary' AND value = $new$${NEW.about_secondary}$new$
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $old$${OLD.hero_description}$old$
    WHERE key = 'hero_description' AND value = $new$${NEW.hero_description}$new$
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $old$${OLD.hero_phrases}$old$
    WHERE key = 'hero_phrases' AND value = $new$${NEW.hero_phrases}$new$
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $old$${OLD.skills}$old$
    WHERE key = 'skills' AND value = $new$${NEW.skills}$new$
  `);
}
