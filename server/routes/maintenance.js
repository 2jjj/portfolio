import { Router } from "express";
import { runMigrations } from "../migrate.js";

const router = Router();

router.post("/migrate", async (req, res) => {
  const token = process.env.MAINTENANCE_TOKEN;

  if (!token || req.headers.authorization !== `Bearer ${token}`) {
    return res.status(404).json({ error: "Not found" });
  }

  await runMigrations(process.env.DATABASE_URL);
  res.json({ ok: true });
});

export default router;
