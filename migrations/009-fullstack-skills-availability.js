const SKILLS = JSON.stringify([
  { title: "React", category: "Front-End", level: 85, color: "#61DAFB" },
  { title: "TypeScript", category: "Linguagem", level: 80, color: "#3178C6" },
  { title: "Next.js", category: "Front-End", level: 72, color: "#E7E7E7" },
  { title: "Node.js", category: "Back-End", level: 82, color: "#00D4FF" },
  { title: "Express", category: "Back-End", level: 75, color: "#A5F3FF" },
  { title: "Java", category: "Back-End", level: 58, color: "#ED8B00" },
  { title: "Spring Boot", category: "Back-End", level: 55, color: "#6DB33F" },
  { title: "PostgreSQL", category: "Banco de Dados", level: 72, color: "#336791" },
  { title: "Docker", category: "DevOps", level: 62, color: "#2496ED" },
  { title: "Git", category: "DevOps", level: 80, color: "#FF6B35" },
  { title: "Playwright", category: "Qualidade", level: 68, color: "#2EAD33" },
]);

export async function up(pgm) {
  await pgm.sql(`
    UPDATE site_info
    SET value = $new$Seg a sex, 13h–19h · remoto ou presencial$new$
    WHERE key = 'availability'
      AND (value IS NULL OR value = '' OR value = 'Disponibilidade imediata')
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $new$${SKILLS}$new$
    WHERE key = 'skills'
      AND (value IS NULL OR value = '' OR value = '[]' OR value NOT LIKE '%React%')
  `);

  await pgm.sql(`
    UPDATE site_info
    SET value = $new$["Full Stack Developer","React & Node.js","Sites, bots e APIs","Java & Spring Boot"]$new$
    WHERE key = 'hero_phrases'
      AND (value IS NULL OR value = '' OR value NOT LIKE '%Full Stack Developer%')
  `);
}
