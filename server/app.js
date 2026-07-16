import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import projectsRoutes from "./routes/projects.js";
import aboutRoutes from "./routes/about.js";
import skillsRoutes from "./routes/skills.js";
import siteRoutes from "./routes/site.js";
import resumeRoutes from "./routes/resume.js";
import githubRoutes from "./routes/github.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.VERCEL) {
  dotenv.config();
}

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:8080", "http://localhost:3001"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Nao permitido por CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Muitas requisicoes. Tente novamente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Muitas tentativas de login. Aguarde 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", generalLimiter);
app.use("/api/auth/", authLimiter);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/site", siteRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/github", githubRoutes);

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
    error: process.env.NODE_ENV === "production"
      ? "Erro interno do servidor"
      : err?.message || "Erro interno do servidor",
  });
});

export default app;
