import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  family: 4,
});

const tables = await pool.query(
  "select table_name from information_schema.tables where table_schema='public' order by 1"
);
console.log("TABLES:", tables.rows.map((r) => r.table_name).join(", "));

const info = await pool.query("select * from site_info limit 1");
if (info.rows.length) {
  for (const [k, v] of Object.entries(info.rows[0])) {
    const s = typeof v === "string" ? v : JSON.stringify(v);
    console.log(`${k}: ${String(s).slice(0, 160)}`);
  }
} else {
  console.log("site_info vazio");
}
await pool.end();
