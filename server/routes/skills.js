import { Router } from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../lib/validate.js";
import { skillsUpdateSchema } from "../lib/validate.js";
import { createAuditLog } from "../lib/audit.js";

const router = Router();

router.get("/", async (_, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT value FROM site_info WHERE key = 'skills'"
    );
    res.json(rows[0] ? JSON.parse(rows[0].value) : []);
  } catch (err) {
    next(err);
  }
});

router.put("/", authenticateToken, validate(skillsUpdateSchema), async (req, res, next) => {
  try {
    const { skills } = req.body;

    const { rows: existing } = await pool.query(
      "SELECT value FROM site_info WHERE key = 'skills'"
    );

    await pool.query(
      "INSERT INTO site_info (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      ["skills", JSON.stringify(skills)]
    );

    await createAuditLog({
      action: "UPDATE",
      entity: "skills",
      oldData: existing[0] ? JSON.parse(existing[0].value) : null,
      newData: skills,
      ip: req.ip,
    });

    res.json({ message: "Skills atualizadas" });
  } catch (err) {
    next(err);
  }
});

export default router;
