import pkg from "pg";
const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  console.error("[DB] DATABASE_URL nao definida! Defina a variavel de ambiente DATABASE_URL.");
}

const isLocal = process.env.DATABASE_URL?.includes("localhost") || process.env.DATABASE_URL?.includes("127.0.0.1");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  family: 4,
});

pool.on("error", (err) => {
  console.error("[DB] Erro no pool:", err?.message || err);
});

const initSchema = async () => {
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          category TEXT NOT NULL DEFAULT 'Back-End',
          tags TEXT NOT NULL DEFAULT '[]',
          image TEXT DEFAULT '',
          github TEXT DEFAULT '',
          live TEXT DEFAULT '',
          featured INTEGER NOT NULL DEFAULT 0,
          order_index INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS site_info (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
      `);
      console.log("[DB] Schema inicializado com sucesso");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("[DB] Erro ao iniciar schema:", err?.message || err);
  }
};

const seedIfEmpty = async () => {
  try {
    const { rows } = await pool.query("SELECT COUNT(*)::int as count FROM projects");
    console.log("[DB] Projetos existentes:", rows[0].count);
    if (rows[0].count > 0) return;

    const defaultInfo = {
      about_text:
        "Desenvolvedor com curiosidade por aprender e evoluir. Foco em React e bancos de dados, com experiencia de back-end construindo APIs. Hoje me aprofundo em Node.js, Go, Docker e Java Spring, sempre buscando entender melhor como sistemas complexos funcionam por dentro.",
      about_secondary:
        "Acredito que boas solucoes nascem de entender o problema de verdade — seja otimizando uma query, desenhando a arquitetura de uma API ou explorando uma tecnologia nova. Cada linha de codigo e uma chance de fazer algo melhor.",
      hero_description:
        "Desenvolvedor full stack com base solida em React e bancos de dados. Experiencia pratique em back-end construindo APIs, hoje aprofundando em Node.js, Go, Docker e Java Spring.",
      stats_years: "3",
      stats_projects: "5",
      stats_dedication: "100",
      skills: JSON.stringify([
        { title: "Node.js", category: "Back-End", level: 80, color: "#00D4FF" },
        { title: "Express", category: "Back-End", level: 75, color: "#A5F3FF" },
        { title: "React", category: "Front-End", level: 82, color: "#00D4FF" },
        { title: "Git", category: "DevOps", level: 80, color: "#FF6B35" },
        { title: "Docker", category: "DevOps", level: 60, color: "#2496ED" },
        { title: "Go", category: "Back-End", level: 35, color: "#00ADD8" },
        { title: "Spring Boot", category: "Back-End", level: 30, color: "#6DB33F" },
        { title: "PostgreSQL", category: "Banco de Dados", level: 70, color: "#336791" },
      ]),
      hero_phrases: JSON.stringify([
        "Full Stack Developer",
        "React & Node.js",
        "APIs & Banco de Dados",
        "JavaScript & TypeScript",
      ]),
    };

    const insertInfo = `INSERT INTO site_info (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;

    for (const [key, value] of Object.entries(defaultInfo)) {
      await pool.query(insertInfo, [key, value]);
    }

    console.log("[DB] Seed concluido com sucesso");
  } catch (err) {
    console.error("[DB] Erro ao seed:", err?.message || err);
  }
};

initSchema().then(() => seedIfEmpty());

export default pool;
