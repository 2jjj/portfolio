import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (_, res) => {
  const { rows } = await pool.query("SELECT key, value FROM site_info");
  const data = {};
  for (const row of rows) {
    if (row.key === "skills") {
      data[row.key] = JSON.parse(row.value);
    } else {
      data[row.key] = row.value;
    }
  }
  res.json(data);
});

router.put("/", async (req, res) => {
  const allowedKeys = [
    "hero_description",
    "stats_years",
    "stats_projects",
    "stats_dedication",
  ];

  for (const key of allowedKeys) {
    if (req.body[key] !== undefined) {
      await pool.query(
        "INSERT INTO site_info (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
        [key, String(req.body[key])]
      );
    }
  }

  res.json({ message: "Informações do site atualizadas" });
});

export default router;
