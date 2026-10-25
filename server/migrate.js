import pkg from "pg";
const { Pool } = pkg;
import * as migration001 from "../migrations/001-initial-schema.js";
import * as migration002 from "../migrations/002-backend-positioning.js";
import * as migration003 from "../migrations/003-project-case-studies.js";
import * as migration004 from "../migrations/004-content-backend-copy.js";
import * as migration005 from "../migrations/005-fill-existing-cases.js";
import * as migration006 from "../migrations/006-tighten-existing-summaries.js";

const MIGRATIONS_TABLE = "schema_migrations";

// Static imports garantem que o bundle da Vercel inclua todas as migrations.
// Ao criar uma nova migration, adicione o import e a entrada aqui.
const MIGRATIONS = [
  { name: "001-initial-schema.js", up: migration001.up },
  { name: "002-backend-positioning.js", up: migration002.up },
  { name: "003-project-case-studies.js", up: migration003.up },
  { name: "004-content-backend-copy.js", up: migration004.up },
  { name: "005-fill-existing-cases.js", up: migration005.up },
  { name: "006-tighten-existing-summaries.js", up: migration006.up },
];

export async function runMigrations(databaseUrl) {
  if (!databaseUrl) {
    console.log("[Migrate] DATABASE_URL nao definida, pulando migracoes");
    return;
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
    family: 4,
    max: 1,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 30000,
  });

  try {
    // Limpa transações órfãs de invocações serverless que morreram no meio.
    // Sem isso, um UPDATE pode ficar preso em um lock antigo para sempre.
    try {
      const cleaned = await pool.query(`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = current_database()
          AND state = 'idle in transaction'
          AND query_start < NOW() - INTERVAL '30 seconds'
          AND pid <> pg_backend_pid()
      `);
      if (cleaned.rowCount > 0) {
        console.log(`[Migrate] Conexoes ociosas encerradas: ${cleaned.rowCount}`);
      }
    } catch (cleanupError) {
      console.log(`[Migrate] Aviso ao limpar conexoes: ${cleanupError.message}`);
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        executed_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    const { rows: executed } = await pool.query(
      `SELECT name FROM ${MIGRATIONS_TABLE} ORDER BY name`
    );
    const executedSet = new Set(executed.map((row) => row.name));
    console.log(
      `[Migrate] Plano: ${MIGRATIONS.map((migration) => migration.name).join(", ")}`
    );

    for (const migration of MIGRATIONS) {
      if (executedSet.has(migration.name)) {
        continue;
      }

      console.log(`[Migrate] Executando: ${migration.name}`);
      const client = await pool.connect();

      try {
        await client.query("BEGIN");
        await client.query("SET LOCAL lock_timeout = '5s'");
        await client.query("SET LOCAL statement_timeout = '30s'");
        await migration.up({
          query: (sql) => client.query(sql),
          sql: (sql) => client.query(sql),
          addColumn: async (table, column, options) => {
            const parts = [`ALTER TABLE ${table} ADD COLUMN ${column}`];
            if (options?.type) parts[0] += ` ${options.type}`;
            if (options?.default) parts[0] += ` DEFAULT ${options.default}`;
            if (options?.notNull) parts[0] += " NOT NULL";
            await client.query(parts[0]);
          },
        });
        await client.query(
          `INSERT INTO ${MIGRATIONS_TABLE} (name) VALUES ($1)`,
          [migration.name]
        );
        await client.query("COMMIT");
        console.log(`[Migrate] ${migration.name} executada com sucesso`);
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`[Migrate] Erro em ${migration.name}:`, err.message);
        throw err;
      } finally {
        client.release();
      }
    }

    console.log("[Migrate] Todas as migracoes concluidas");
  } catch (err) {
    console.error("[Migrate] Erro:", err.message);
  } finally {
    await pool.end();
  }
}



