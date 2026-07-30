import { Router } from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../lib/validate.js";
import { aboutUpdateSchema } from "../lib/validate.js";
import { createAuditLog } from "../lib/audit.js";

const router = Router();

router.get("/", async (_, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT key, value FROM site_info WHERE key IN ('about_text', 'about_secondary')"
    );
    const data = {};
    for (const row of rows) data[row.key] = row.value;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.put("/", authenticateToken, validate(aboutUpdateSchema), async (req, res, next) => {
  try {
    const { about_text, about_secondary } = req.body;
    const updates = [];

    if (about_text !== undefined) {
      updates.push(
        pool.query(
          "INSERT INTO site_info (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
          ["about_text", about_text]
        )
      );
    }
    if (about_secondary !== undefined) {
      updates.push(
        pool.query(
          "INSERT INTO site_info (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
          ["about_secondary", about_secondary]
        )
      );
    }

    await Promise.all(updates);

    await createAuditLog({
      action: "UPDATE",
      entity: "about",
      ip: req.ip,
    });

    res.json({ message: "Informacoes atualizadas" });
  } catch (err) {
    next(err);
  }
});

export default router;
