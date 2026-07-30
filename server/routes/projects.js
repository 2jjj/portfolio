import { Router } from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate, validateQuery } from "../lib/validate.js";
import { projectSchema, projectUpdateSchema } from "../lib/validate.js";
import { z } from "zod";
import { createAuditLog } from "../lib/audit.js";

const router = Router();

const paginationSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  category: z.string().optional(),
  search: z.string().optional(),
  featured: z.coerce.number().optional(),
  sort: z.enum(["order_index", "created_at", "title"]).optional().default("order_index"),
  direction: z.enum(["asc", "desc"]).optional().default("asc"),
});

router.get("/", validateQuery(paginationSchema), async (req, res, next) => {
  try {
    const { page, limit, category, search, featured, sort, direction } = req.query;
    const offset = (page - 1) * limit;

    const conditions = ["deleted_at IS NULL"];
    const params = [];
    let paramIndex = 1;

    if (category && category !== "all") {
      conditions.push(`category = $${paramIndex++}`);
      params.push(category);
    }

    if (featured !== undefined) {
      conditions.push(`featured = $${paramIndex++}`);
      params.push(featured);
    }

    if (search) {
      conditions.push(`to_tsvector('portuguese', title || ' ' || description || ' ' || tags) @@ plainto_tsquery('portuguese', $${paramIndex})`);
      params.push(search);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const allowedSorts = { order_index: "order_index", created_at: "created_at", title: "title" };
    const sortColumn = allowedSorts[sort] || "order_index";
    const sortDir = direction === "desc" ? "DESC" : "ASC";

    const countResult = await pool.query(
      `SELECT COUNT(*)::int as total FROM projects ${whereClause}`,
      params
    );
    const total = countResult.rows[0].total;

    const { rows } = await pool.query(
      `SELECT * FROM projects ${whereClause} ORDER BY ${sortColumn} ${sortDir}, id ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    const parsed = rows.map((p) => ({ ...p, tags: JSON.parse(p.tags) }));

    res.json({
      data: parsed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + limit < total,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/all", async (_, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM projects WHERE deleted_at IS NULL ORDER BY order_index ASC, created_at DESC"
    );
    res.json(rows.map((p) => ({ ...p, tags: JSON.parse(p.tags) })));
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM projects WHERE id = $1 AND deleted_at IS NULL",
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Projeto nao encontrado" });
    res.json({ ...rows[0], tags: JSON.parse(rows[0].tags) });
  } catch (err) {
    next(err);
  }
});

router.post("/", authenticateToken, validate(projectSchema), async (req, res, next) => {
  try {
    const { title, description, category, tags, image, github, live, featured } = req.body;

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

    await createAuditLog({
      action: "CREATE",
      entity: "project",
      entityId: String(rows[0].id),
      newData: rows[0],
      ip: req.ip,
    });

    res.status(201).json({ ...rows[0], tags: JSON.parse(rows[0].tags) });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authenticateToken, validate(projectUpdateSchema), async (req, res, next) => {
  try {
    const { rows: existing } = await pool.query(
      "SELECT * FROM projects WHERE id = $1 AND deleted_at IS NULL",
      [req.params.id]
    );
    if (!existing[0])
      return res.status(404).json({ error: "Projeto nao encontrado" });

    const { title, description, category, tags, image, github, live, featured } = req.body;

    const { rows } = await pool.query(
      `UPDATE projects
       SET title = COALESCE($1, title), description = COALESCE($2, description),
           category = COALESCE($3, category), tags = COALESCE($4, tags),
           image = COALESCE($5, image), github = COALESCE($6, github),
           live = COALESCE($7, live), featured = COALESCE($8, featured),
           updated_at = NOW()
       WHERE id = $9 AND deleted_at IS NULL RETURNING *`,
      [
        title ?? null,
        description ?? null,
        category ?? null,
        tags ? JSON.stringify(tags) : null,
        image ?? null,
        github ?? null,
        live ?? null,
        featured !== undefined ? (featured ? 1 : 0) : null,
        req.params.id,
      ]
    );

    await createAuditLog({
      action: "UPDATE",
      entity: "project",
      entityId: String(req.params.id),
      oldData: existing[0],
      newData: rows[0],
      ip: req.ip,
    });

    res.json({ ...rows[0], tags: JSON.parse(rows[0].tags) });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const { rows: existing } = await pool.query(
      "SELECT * FROM projects WHERE id = $1 AND deleted_at IS NULL",
      [req.params.id]
    );
    if (!existing[0])
      return res.status(404).json({ error: "Projeto nao encontrado" });

    await pool.query(
      "UPDATE projects SET deleted_at = NOW() WHERE id = $1",
      [req.params.id]
    );

    await createAuditLog({
      action: "DELETE",
      entity: "project",
      entityId: String(req.params.id),
      oldData: existing[0],
      ip: req.ip,
    });

    res.json({ message: "Projeto removido" });
  } catch (err) {
    next(err);
  }
});

router.put("/:id/order", authenticateToken, async (req, res, next) => {
  try {
    const { order_index } = req.body;
    if (typeof order_index !== "number") {
      return res.status(400).json({ error: "order_index deve ser um numero" });
    }
    await pool.query("UPDATE projects SET order_index = $1 WHERE id = $2 AND deleted_at IS NULL", [
      order_index,
      req.params.id,
    ]);
    res.json({ message: "Ordem atualizada" });
  } catch (err) {
    next(err);
  }
});

export default router;
