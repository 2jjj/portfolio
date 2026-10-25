function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function up(pgm) {
  await pgm.sql(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug TEXT`);
  await pgm.sql(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS summary TEXT`);
  await pgm.sql(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS problem TEXT`);
  await pgm.sql(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS architecture TEXT`);
  await pgm.sql(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS decisions TEXT`);
  await pgm.sql(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS results TEXT`);
  await pgm.sql(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS metrics JSONB NOT NULL DEFAULT '[]'::jsonb`);
  await pgm.sql(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS role TEXT`);
  await pgm.sql(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS timeline TEXT`);

  await pgm.sql(`
    UPDATE projects
    SET summary = description
    WHERE summary IS NULL OR summary = ''
  `);

  const { rows: projects } = await pgm.query(
    "SELECT id, title FROM projects WHERE slug IS NULL OR slug = '' ORDER BY id"
  );
  const { rows: usedRows } = await pgm.query(
    "SELECT slug FROM projects WHERE slug IS NOT NULL AND slug <> ''"
  );
  const used = new Set(usedRows.map((row) => row.slug));

  for (const project of projects) {
    const base = slugify(project.title) || `projeto-${project.id}`;
    let slug = base;
    let suffix = 2;

    while (used.has(slug)) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }

    await pgm.sql(`UPDATE projects SET slug = $s$${slug}$s$ WHERE id = ${Number(project.id)}`);
    used.add(slug);
  }

  await pgm.sql(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug
    ON projects (slug)
    WHERE slug IS NOT NULL
  `);
}

export async function down(pgm) {
  await pgm.sql(`DROP INDEX IF EXISTS idx_projects_slug`);
  await pgm.sql(`ALTER TABLE projects DROP COLUMN IF EXISTS timeline`);
  await pgm.sql(`ALTER TABLE projects DROP COLUMN IF EXISTS role`);
  await pgm.sql(`ALTER TABLE projects DROP COLUMN IF EXISTS metrics`);
  await pgm.sql(`ALTER TABLE projects DROP COLUMN IF EXISTS results`);
  await pgm.sql(`ALTER TABLE projects DROP COLUMN IF EXISTS decisions`);
  await pgm.sql(`ALTER TABLE projects DROP COLUMN IF EXISTS architecture`);
  await pgm.sql(`ALTER TABLE projects DROP COLUMN IF EXISTS problem`);
  await pgm.sql(`ALTER TABLE projects DROP COLUMN IF EXISTS summary`);
  await pgm.sql(`ALTER TABLE projects DROP COLUMN IF EXISTS slug`);
}
