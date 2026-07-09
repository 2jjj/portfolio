import { Router } from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

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

router.put("/", authenticateToken, async (req, res, next) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: "skills deve ser um array" });
    }

    await pool.query(
      "INSERT INTO site_info (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      ["skills", JSON.stringify(skills)]
    );

    res.json({ message: "Skills atualizadas" });
  } catch (err) {
    next(err);
  }
});

export default router;
