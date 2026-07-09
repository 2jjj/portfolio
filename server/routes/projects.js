import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (_, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM projects ORDER BY order_index ASC, created_at DESC"
  );
  res.json(rows.map((p) => ({ ...p, tags: JSON.parse(p.tags) })));
});

router.get("/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM projects WHERE id = $1", [
    req.params.id,
  ]);
  if (!rows[0]) return res.status(404).json({ error: "Projeto não encontrado" });
  res.json({ ...rows[0], tags: JSON.parse(rows[0].tags) });
});

router.post("/", async (req, res) => {
  const { title, description, category, tags, image, github, live, featured } =
    req.body;

  if (!title) {
    return res.status(400).json({ error: "Título é obrigatório" });
  }

  const { rows: maxRow } = await pool.query(
    "SELECT COALESCE(MAX(order_index), 0) + 1 as next FROM projects"
  );
  const orderIndex = maxRow[0].next;

  const { rows } = await pool.query(
    `INSERT INTO projects (title, description, category, tags, image, github, live, featured, order_index)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      title,
      description || "",
      category || "Back-End",
      JSON.stringify(tags || []),
      image || "",
      github || "",
      live || "",
      featured ? 1 : 0,
      orderIndex,
    ]
  );

  res.status(201).json({ ...rows[0], tags: JSON.parse(rows[0].tags) });
});

router.put("/:id", async (req, res) => {
  const { rows: existing } = await pool.query(
    "SELECT * FROM projects WHERE id = $1",
    [req.params.id]
  );
  if (!existing[0])
    return res.status(404).json({ error: "Projeto não encontrado" });

  const { title, description, category, tags, image, github, live, featured } =
    req.body;

  const { rows } = await pool.query(
    `UPDATE projects
     SET title = $1, description = $2, category = $3, tags = $4, image = $5,
         github = $6, live = $7, featured = $8, updated_at = NOW()
     WHERE id = $9 RETURNING *`,
    [
      title ?? existing[0].title,
      description ?? existing[0].description,
      category ?? existing[0].category,
      JSON.stringify(tags ?? JSON.parse(existing[0].tags)),
      image ?? existing[0].image,
      github ?? existing[0].github,
      live ?? existing[0].live,
      featured !== undefined ? (featured ? 1 : 0) : existing[0].featured,
      req.params.id,
    ]
  );

  res.json({ ...rows[0], tags: JSON.parse(rows[0].tags) });
});

router.delete("/:id", async (req, res) => {
  const { rows: existing } = await pool.query(
    "SELECT * FROM projects WHERE id = $1",
    [req.params.id]
  );
  if (!existing[0])
    return res.status(404).json({ error: "Projeto não encontrado" });

  await pool.query("DELETE FROM projects WHERE id = $1", [req.params.id]);
  res.json({ message: "Projeto removido" });
});

router.put("/:id/order", async (req, res) => {
  const { order_index } = req.body;
  await pool.query("UPDATE projects SET order_index = $1 WHERE id = $2", [
    order_index,
    req.params.id,
  ]);
  res.json({ message: "Ordem atualizada" });
});

export default router;
