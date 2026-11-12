import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import logger, { createRequestId } from "./lib/logger.js";
import { validateEnv } from "./lib/env.js";
import authRoutes from "./routes/auth.js";
import projectsRoutes from "./routes/projects.js";
import aboutRoutes from "./routes/about.js";
import skillsRoutes from "./routes/skills.js";
import siteRoutes from "./routes/site.js";
import resumeRoutes from "./routes/resume.js";
import githubRoutes from "./routes/github.js";
import jobsRoutes from "./routes/jobs.js";
import maintenanceRoutes from "./routes/maintenance.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./lib/swagger.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.VERCEL) {
  dotenv.config();
}

validateEnv();

const app = express();

if (process.env.VERCEL === "1") {
  app.set("trust proxy", 1);
}

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.github.com"],
      frameSrc: ["'self'"],
    },
  },
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:8080", "http://localhost:3001"];

if (process.env.VERCEL === "1") {
  if (process.env.VERCEL_URL) allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
  if (process.env.VERCEL_BRANCH_URL) allowedOrigins.push(`https://${process.env.VERCEL_BRANCH_URL}`);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (process.env.VERCEL === "1") {
      if (origin.endsWith(".vercel.app")) return callback(null, true);
      try {
        const host = new URL(origin).hostname;
        if (host === (process.env.VERCEL_URL || "") || host === (process.env.VERCEL_BRANCH_URL || "")) {
          return callback(null, true);
        }
      } catch {}
      return callback(null, true);
    }
    callback(new Error("Nao permitido por CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.use((req, _res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    const ct = req.headers["content-type"] || "";
    if (!ct.startsWith("application/json")) {
      return _res.status(415).json({ error: "Content-Type deve ser application/json" });
    }
  }
  next();
});

app.use(createRequestId);

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Muitas requisicoes. Tente novamente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const userId = req.user?.jti || "";
    return `${ipKeyGenerator(req)}-${userId}`;
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Muitas tentativas de login. Aguarde 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = req.body?.email || "";
    return `${ipKeyGenerator(req)}-${email}`;
  },
});

app.use("/api/", generalLimiter);
app.use("/api/auth/", authLimiter);

app.get("/api/health", async (_req, res) => {
  try {
    const { default: pool, migrateNow } = await import("./db.js");
    if (process.env.RUN_MIGRATIONS === "1") {
      await migrateNow();
    }
    const dbResult = await pool.query("SELECT NOW() as time");
    res.json({
      status: "ok",
      env: process.env.NODE_ENV || "development",
      vercel: !!process.env.VERCEL,
      database: dbResult.rows[0]?.time ? "connected" : "disconnected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: "error",
      env: process.env.NODE_ENV || "development",
      vercel: !!process.env.VERCEL,
      database: "disconnected",
      uptime: process.uptime(),
      error: err.message,
    });
  }
});

app.get("/api/api-docs.json", (_req, res) => res.json(swaggerSpec));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Portfolio API Docs",
}));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/site", siteRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/maintenance", maintenanceRoutes);

if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  const distPath = path.join(__dirname, "..", "dist");
  app.use(express.static(distPath));
  app.get("*", (_, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use((err, _req, res, _next) => {
  logger.error({ err, requestId: _req.requestId }, "Erro na requisicao");
  res.status(err?.status || 500).json({
    error: process.env.NODE_ENV === "production"
      ? "Erro interno do servidor"
      : err?.message || "Erro interno do servidor",
  });
});

export default app;

