import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import projectsRoutes from "./routes/projects.js";
import aboutRoutes from "./routes/about.js";
import skillsRoutes from "./routes/skills.js";
import siteRoutes from "./routes/site.js";
import resumeRoutes from "./routes/resume.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.VERCEL) {
  dotenv.config();
}

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  const dbUrl = process.env.DATABASE_URL || "";
  const maskedDbUrl = dbUrl ? dbUrl.replace(/\/\/[^:]+:[^@]+@/, "//***:***@") : "(não definida)";
  res.json({
    status: "ok",
    env: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    db_url: maskedDbUrl,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/site", siteRoutes);
app.use("/api/resume", resumeRoutes);

if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  const distPath = path.join(__dirname, "..", "dist");
  app.use(express.static(distPath));
  app.get("*", (_, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use((err, _req, res, _next) => {
  console.error("[API Error]", err?.stack || err?.message || err);
  res.status(err?.status || 500).json({
    error: err?.message || "Erro interno do servidor",
  });
});

export default app;
