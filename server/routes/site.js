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
    const jsonKeys = new Set(["skills", "hero_phrases", "resume_data", "resume_data_en"]);
    for (const row of rows) {
      if (jsonKeys.has(row.key)) {
        try {
          data[row.key] = JSON.parse(row.value);
        } catch {
          data[row.key] = row.value;
        }
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
      "github_url",
      "linkedin_url",
      "public_email",
      "site_url",
      "location",
      "availability",
      "resume_path",
      "resume_data",
      "resume_data_en",
    ];

    for (const key of allowedKeys) {
      if (req.body[key] !== undefined) {
        const raw = req.body[key];
        const value =
          typeof raw === "object" ? JSON.stringify(raw) : Array.isArray(raw) ? JSON.stringify(raw) : String(raw);
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
