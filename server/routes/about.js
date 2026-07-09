import { Router } from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_, res) => {
  const { rows } = await pool.query(
    "SELECT key, value FROM site_info WHERE key IN ('about_text', 'about_secondary')"
  );
  const data = {};
  for (const row of rows) data[row.key] = row.value;
  res.json(data);
});

router.put("/", authenticateToken, async (req, res) => {
  const { about_text, about_secondary } = req.body;

  if (about_text !== undefined) {
    await pool.query(
      "INSERT INTO site_info (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      ["about_text", about_text]
    );
  }
  if (about_secondary !== undefined) {
    await pool.query(
      "INSERT INTO site_info (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      ["about_secondary", about_secondary]
    );
  }

  res.json({ message: "Informações atualizadas" });
});

export default router;
