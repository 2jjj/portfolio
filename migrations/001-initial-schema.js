export async function up(pgm) {
  await pgm.sql(`CREATE TABLE IF NOT EXISTS site_info (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )`);

  await pgm.sql(`CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL DEFAULT 'admin',
    expires_at TIMESTAMP NOT NULL,
    revoked INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`);

  await pgm.sql(`CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'admin',
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`);

  await pgm.sql(`CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category)`);
  await pgm.sql(`CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured)`);
  await pgm.sql(`CREATE INDEX IF NOT EXISTS idx_projects_order_index ON projects(order_index)`);
  await pgm.sql(`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token)`);
  await pgm.sql(`CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id)`);
  await pgm.sql(`CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC)`);
  await pgm.sql(`CREATE INDEX IF NOT EXISTS idx_projects_search ON projects USING gin(to_tsvector('portuguese', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(tags,'')))`);
}

export async function down(pgm) {
  await pgm.sql(`DROP INDEX IF EXISTS idx_projects_search`);
  await pgm.sql(`DROP INDEX IF EXISTS idx_audit_logs_created_at`);
  await pgm.sql(`DROP INDEX IF EXISTS idx_audit_logs_entity`);
  await pgm.sql(`DROP INDEX IF EXISTS idx_refresh_tokens_token`);
  await pgm.sql(`DROP INDEX IF EXISTS idx_projects_order_index`);
  await pgm.sql(`DROP INDEX IF EXISTS idx_projects_featured`);
  await pgm.sql(`DROP INDEX IF EXISTS idx_projects_category`);
  await pgm.sql(`DROP TABLE IF EXISTS audit_logs`);
  await pgm.sql(`DROP TABLE IF EXISTS refresh_tokens`);
}
