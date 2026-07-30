export async function up(pgm) {
  pgm.sql(`
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
      deleted_at TIMESTAMP DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS site_info (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      token TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL DEFAULT 'admin',
      expires_at TIMESTAMP NOT NULL,
      revoked INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL DEFAULT 'admin',
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entity_id TEXT,
      old_data JSONB,
      new_data JSONB,
      ip_address TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
    CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
    CREATE INDEX IF NOT EXISTS idx_projects_order_index ON projects(order_index);
    CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at);
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_projects_search
      ON projects USING gin(to_tsvector('portuguese', title || ' ' || description || ' ' || tags));
  `);
}

export async function down(pgm) {
  pgm.sql(`
    DROP INDEX IF EXISTS idx_projects_search;
    DROP INDEX IF EXISTS idx_audit_logs_created_at;
    DROP INDEX IF EXISTS idx_audit_logs_entity;
    DROP INDEX IF EXISTS idx_refresh_tokens_token;
    DROP INDEX IF EXISTS idx_projects_deleted_at;
    DROP INDEX IF EXISTS idx_projects_order_index;
    DROP INDEX IF EXISTS idx_projects_featured;
    DROP INDEX IF EXISTS idx_projects_category;
    DROP TABLE IF EXISTS audit_logs;
    DROP TABLE IF EXISTS refresh_tokens;
  `);
}
