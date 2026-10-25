export function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function uniqueSlug(pool, value, currentId = null) {
  const base = slugify(value) || `projeto-${Date.now()}`;
  let slug = base;
  let suffix = 2;

  while (true) {
    const { rows } = await pool.query(
      "SELECT id FROM projects WHERE slug = $1 AND ($2::int IS NULL OR id <> $2::int)",
      [slug, currentId ? Number(currentId) : null]
    );

    if (rows.length === 0) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}
