import pkg from "pg";
const { Pool } = pkg;
import { readdirSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "..", "migrations");
const MIGRATIONS_TABLE = "schema_migrations";

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
    connectionTimeoutMillis: 10000,
  });

  try {
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
    const executedSet = new Set(executed.map((r) => r.name));

    if (!existsSync(MIGRATIONS_DIR)) {
      console.log("[Migrate] Diretorio de migracoes nao encontrado");
      return;
    }

    const files = readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith(".js"))
      .sort();

    for (const file of files) {
      if (executedSet.has(file)) {
        continue;
      }

      console.log(`[Migrate] Executando: ${file}`);
      const migrationPath = `file:///${join(MIGRATIONS_DIR, file).replace(/\\/g, "/")}`;
      const migration = await import(migrationPath);

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
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
          [file]
        );
        await client.query("COMMIT");
        console.log(`[Migrate] ${file} executada com sucesso`);
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`[Migrate] Erro em ${file}:`, err.message);
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
