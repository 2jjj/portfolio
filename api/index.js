import app from "../server/app.js";

export default function handler(req, res) {
  try {
    return app(req, res);
  } catch (err) {
    console.error("[Vercel Handler Error]", err?.stack || err?.message || err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
