import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_URL?.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
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
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("[DB] Erro ao iniciar schema:", err?.message);
  }
};

const seedIfEmpty = async () => {
  try {
    const { rows } = await pool.query("SELECT COUNT(*)::int as count FROM projects");
    if (rows[0].count > 0) return;

    const defaultInfo = {
      about_text:
        "Desenvolvedor com curiosidade por aprender e evoluir. Foco em React e bancos de dados, com experiência de back-end construindo bots para Discord. Hoje me aprofundo em Node.js, Go, Docker e Java Spring, sempre buscando entender melhor como sistemas complexos funcionam por dentro.",
      about_secondary:
        "Acredito que boas soluções nascem de entender o problema de verdade — seja otimizando uma query, desenhando a arquitetura de uma API ou explorando uma tecnologia nova. Cada linha de código é uma chance de fazer algo melhor.",
      hero_description:
        "Desenvolvedor front-end com base sólida em React e bancos de dados. Experiência prática em back-end construindo bots para Discord, hoje aprofundando em Node.js, Go, Docker e Java Spring.",
      stats_years: "5",
      stats_projects: "10",
      stats_dedication: "100",
      skills: JSON.stringify([
        { title: "Node.js", category: "Back-End", level: 94, color: "#00D4FF" },
        { title: "Express", category: "Back-End", level: 88, color: "#A5F3FF" },
        { title: "React", category: "Front-End", level: 90, color: "#00D4FF" },
        { title: "Git", category: "DevOps", level: 92, color: "#FF6B35" },
        { title: "Docker", category: "DevOps", level: 80, color: "#2496ED" },
        { title: "Go", category: "Back-End", level: 50, color: "#00ADD8" },
        { title: "Spring Boot", category: "Back-End", level: 40, color: "#6DB33F" },
      ]),
    };

    const insertInfo = `INSERT INTO site_info (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;

    for (const [key, value] of Object.entries(defaultInfo)) {
      await pool.query(insertInfo, [key, value]);
    }

    await pool.query(
      `INSERT INTO projects (title, description, category, tags, image, github, live, featured, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        "Resolute",
        "Bot para Discord verificado em mais de 1.000 servidores. Multi-funcionalidade com moderação, economia e entretenimento usando Node.js e MongoDB.",
        "Back-End",
        JSON.stringify(["Discord.js", "Node.js", "MongoDB"]),
        "https://static-www.adweek.com/wp-content/uploads/2021/07/DiscordLogo.jpg?w=890",
        "https://github.com/2jjj/resolute",
        "",
        1,
        1,
      ]
    );

    await pool.query(
      `INSERT INTO projects (title, description, category, tags, image, github, live, featured, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        "API Fetch Discord Info",
        "API REST escalável que entrega dados de usuários e servidores do Discord com arquitetura limpa e desempenho otimizado.",
        "Back-End",
        JSON.stringify(["Node.js", "Express", "REST API"]),
        "https://irp.cdn-website.com/08ff45e1/dms3rep/multi/Banner-Principal-1920x1080px-1+%281%29.png",
        "https://github.com/2jjj/fetch_discord_info_site",
        "",
        1,
        2,
      ]
    );

    await pool.query(
      `INSERT INTO projects (title, description, category, tags, image, github, live, featured, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        "Status Correios",
        "Front-end leve que consulta status em tempo real e mostra se os Correios estão em greve ou não.",
        "Front-End",
        JSON.stringify(["React", "Vite"]),
        "https://assets.b9.com.br/wp-content/uploads/2014/05/correios2.jpg",
        "https://github.com/2jjj/greve",
        "",
        0,
        3,
      ]
    );
  } catch (err) {
    console.error("[DB] Erro ao seed:", err?.message);
  }
};

initSchema().then(() => seedIfEmpty());

export default pool;
