import pkg from "pg";
const { Pool } = pkg;
import { runMigrations } from "./migrate.js";

if (!process.env.DATABASE_URL) {
  console.error("[DB] DATABASE_URL nao definida!");
}

const isLocal = process.env.DATABASE_URL?.includes("localhost") || process.env.DATABASE_URL?.includes("127.0.0.1");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  family: 4,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("[DB] Erro no pool:", err?.message || err);
});

const seedDefaults = async () => {
  try {
    const defaultInfo = {
      about_text:
        "Desenvolvedor back-end com foco em Node.js, Go e PostgreSQL. Gosto de entender o problema antes de escrever a primeira linha: modelagem, contratos de API, queries e o que acontece quando algo falha.",
      about_secondary:
        "Venho de projetos próprios — APIs, bots para Discord e sistemas com painel administrativo. Hoje aprofundo Go, Docker e Java Spring. Este site é um deles: React no front, Express e Postgres no back, autenticação JWT, migrations e deploy na Vercel.",
      hero_description:
        "Desenvolvedor back-end com foco em Node.js, Go e PostgreSQL. Construo APIs, modelo dados e cuido da parte que precisa funcionar quando ninguém está olhando.",
      stats_years: "4",
      stats_projects: "10",
      skills: JSON.stringify([
        { title: "Node.js", category: "Back-End", level: 80, color: "#00D4FF" },
        { title: "PostgreSQL", category: "Banco de Dados", level: 70, color: "#336791" },
        { title: "TypeScript", category: "Linguagem", level: 78, color: "#3178C6" },
        { title: "Express", category: "Back-End", level: 75, color: "#A5F3FF" },
        { title: "Docker", category: "DevOps", level: 60, color: "#2496ED" },
        { title: "Go", category: "Back-End", level: 40, color: "#00ADD8" },
        { title: "Spring Boot", category: "Back-End", level: 35, color: "#6DB33F" },
        { title: "Git", category: "DevOps", level: 80, color: "#FF6B35" },
      ]),
      hero_phrases: JSON.stringify([
        "Back-end Developer",
        "Node.js & PostgreSQL",
        "APIs & Dados",
        "Go & Docker",
      ]),
    };

    const insertInfo = `INSERT INTO site_info (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`;

    for (const [key, value] of Object.entries(defaultInfo)) {
      await pool.query(insertInfo, [key, value]);
    }

    console.log("[DB] Defaults inseridos com sucesso");
  } catch (err) {
    console.error("[DB] Erro ao inserir defaults:", err?.message || err);
  }
};

// Em produção as migrations rodam por um endpoint de manutenção explícito.
// Rodar no cold start pode segurar a função e competir por locks entre instâncias.
const shouldRunStartupMigrations =
  !process.env.VERCEL || process.env.RUN_MIGRATIONS === "1";

export const dbReady = (async () => {
  if (!shouldRunStartupMigrations) return;

  try {
    await runMigrations(process.env.DATABASE_URL);
    await seedDefaults();
  } catch (err) {
    console.error("[DB] Erro na inicializacao:", err?.message || err);
  }
})();

export default pool;

