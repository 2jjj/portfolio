const SITE_DEFAULTS = {
  github_url: "https://github.com/2jjj",
  linkedin_url: "https://www.linkedin.com/in/pedro-sakamoto-3b94091a1/",
  public_email: "pedrosakamoto27@gmail.com",
  site_url: "https://www.pedrosakamoto.site",
  location: "Ribeirão Preto, SP",
  availability: "Disponibilidade imediata",
  resume_path: "/curriculo",
};

export async function up(pgm) {
  for (const [key, value] of Object.entries(SITE_DEFAULTS)) {
    await pgm.sql(`
      INSERT INTO site_info (key, value)
      VALUES ('${key}', $value$${value}$value$)
      ON CONFLICT (key) DO NOTHING
    `);
  }

  await pgm.sql(`CREATE TABLE IF NOT EXISTS job_applications (
    id SERIAL PRIMARY KEY,
    source TEXT NOT NULL,
    external_id TEXT NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT '',
    apply_url TEXT NOT NULL DEFAULT '',
    location TEXT NOT NULL DEFAULT '',
    remote INTEGER NOT NULL DEFAULT 0,
    salary TEXT NOT NULL DEFAULT '',
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'saved'
      CHECK (status IN ('saved', 'applied', 'interview', 'offer', 'rejected')),
    match_score INTEGER NOT NULL DEFAULT 0,
    matched_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    top_projects JSONB NOT NULL DEFAULT '[]'::jsonb,
    notes TEXT NOT NULL DEFAULT '',
    next_action_at TIMESTAMP,
    applied_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (source, external_id)
  )`);

  await pgm.sql(`CREATE TABLE IF NOT EXISTS job_application_events (
    id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    from_status TEXT,
    to_status TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`);

  await pgm.sql(`CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status)`);
  await pgm.sql(`CREATE INDEX IF NOT EXISTS idx_job_applications_updated ON job_applications(updated_at DESC)`);
  await pgm.sql(`CREATE INDEX IF NOT EXISTS idx_job_application_events_app ON job_application_events(application_id, created_at DESC)`);
}

export async function down(pgm) {
  await pgm.sql(`DROP TABLE IF EXISTS job_application_events`);
  await pgm.sql(`DROP TABLE IF EXISTS job_applications`);
  for (const key of Object.keys(SITE_DEFAULTS)) {
    await pgm.sql(`DELETE FROM site_info WHERE key = '${key}'`);
  }
}
