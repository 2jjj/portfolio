import { Router } from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../lib/validate.js";
import { siteUpdateSchema } from "../lib/validate.js";
import { createAuditLog } from "../lib/audit.js";

const router = Router();

router.get("/", async (_, res, next) => {
  try {
    const { rows } = await pool.query("SELECT key, value FROM site_info");
    const data = {};
    for (const row of rows) {
      if (row.key === "skills" || row.key === "hero_phrases") {
        data[row.key] = JSON.parse(row.value);
      } else {
        data[row.key] = row.value;
      }
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.put("/", authenticateToken, validate(siteUpdateSchema), async (req, res, next) => {
  try {
    const allowedKeys = [
      "hero_description",
      "stats_years",
      "stats_projects",
      "hero_phrases",
    ];

    for (const key of allowedKeys) {
      if (req.body[key] !== undefined) {
        const value = Array.isArray(req.body[key]) ? JSON.stringify(req.body[key]) : String(req.body[key]);
        await pool.query(
          "INSERT INTO site_info (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
          [key, value]
        );
      }
    }

    await createAuditLog({
      action: "UPDATE",
      entity: "site_info",
      ip: req.ip,
    });

    res.json({ message: "Informacoes do site atualizadas" });
  } catch (err) {
    next(err);
  }
});

export default router;
