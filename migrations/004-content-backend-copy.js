const NEW = {
  hero_description:
    "Desenvolvedor back-end com foco em Node.js, Go e PostgreSQL. Construo APIs, modelo dados e cuido da parte que precisa funcionar quando ninguém está olhando.",
  about_text:
    "Desenvolvedor back-end com foco em Node.js, Go e PostgreSQL. Gosto de entender o problema antes de escrever a primeira linha: modelagem, contratos de API, queries e o que acontece quando algo falha.",
  about_secondary:
    "Venho de projetos próprios — APIs, bots para Discord e sistemas com painel administrativo. Hoje aprofundo Go, Docker e Java Spring. Este site é um deles: React no front, Express e Postgres no back, autenticação JWT, migrations e deploy na Vercel.",
  hero_phrases:
    '["Back-end Developer","Node.js & PostgreSQL","APIs & Dados","Go & Docker"]',
  skills:
    '[{"title":"Node.js","category":"Back-End","level":80,"color":"#00D4FF"},{"title":"PostgreSQL","category":"Banco de Dados","level":70,"color":"#336791"},{"title":"TypeScript","category":"Linguagem","level":78,"color":"#3178C6"},{"title":"Express","category":"Back-End","level":75,"color":"#A5F3FF"},{"title":"Docker","category":"DevOps","level":60,"color":"#2496ED"},{"title":"Go","category":"Back-End","level":40,"color":"#00ADD8"},{"title":"Spring Boot","category":"Back-End","level":35,"color":"#6DB33F"},{"title":"Git","category":"DevOps","level":80,"color":"#FF6B35"}]',
};

export async function up(pgm) {
  await pgm.sql(`
    UPDATE site_info
    SET value = $new$${NEW.hero_description}$new$
    WHERE key = 'hero_description'
      AND value LIKE 'Desenvolvedor front-end%'
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $new$${NEW.about_text}$new$
    WHERE key = 'about_text'
      AND value LIKE 'Desenvolvedor com curiosidade%'
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $new$${NEW.about_secondary}$new$
    WHERE key = 'about_secondary'
      AND value LIKE 'Acredito que boas solu%'
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $new$${NEW.hero_phrases}$new$
    WHERE key = 'hero_phrases'
      AND value LIKE '%Full Stack Developer%'
  `);

  await pgm.sql(`
    INSERT INTO site_info (key, value)
    VALUES ('skills', $new$${NEW.skills}$new$)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    WHERE site_info.value IS NULL
       OR site_info.value = ''
       OR site_info.value = '[]'
       OR site_info.value NOT LIKE '%PostgreSQL%'
  `);
}

