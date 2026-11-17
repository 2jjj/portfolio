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
        "Dev full stack em Ribeirão Preto. Crio SaaS do zero ao go-live: modelo, banco, API, cobrança Pix, painel admin e deploy. Encaro qualquer tarefa — eu faço tudo.",
      about_secondary:
        "Penso sistema como quem pensa produto: começo pelo objetivo, depois modelo arquitetura, escrevo, testo e entrego funcionando. Crio SaaS, automação, bot de WhatsApp com venda de verdade e site institucional — eu faço tudo: do primeiro commit até o deploy. Este site é um deles: React no front, Express e Postgres no back, JWT, migrations e Vercel.",
      hero_description:
        "Dev full stack e criador de SaaS. Banco, API, cobrança Pix, painel admin, deploy — eu faço tudo mesmo: do primeiro commit até o go-live.",
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
      github_url: "https://github.com/2jjj",
      linkedin_url: "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/",
      public_email: "pedrosakamoto27@gmail.com",
      site_url: "https://www.pedrosakamoto.site",
      location: "Ribeirão Preto, SP",
      availability: "Disponibilidade imediata",
      resume_path: "/curriculo",
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
const shouldRunStartupMigrations = !process.env.VERCEL;

const runStartupMigrations = async () => {
  try {
    await runMigrations(process.env.DATABASE_URL);
    await seedDefaults();
  } catch (err) {
    console.error("[DB] Erro na inicializacao:", err?.message || err);
  }
};

export async function migrateNow() {
  if (!process.env.DATABASE_URL) return;
  await runStartupMigrations();
}

export const dbReady = (async () => {
  if (!shouldRunStartupMigrations) return;
  await runStartupMigrations();
})();

export default pool;

