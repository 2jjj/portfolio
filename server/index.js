import dotenv from "dotenv";

if (!process.env.VERCEL) {
  dotenv.config();
}

const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "ADMIN_PASSWORD"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`[FATAL] Variavel de ambiente ${envVar} nao esta definida.`);
    process.exit(1);
  }
}

const { default: app } = await import("./app.js");
import { dbReady } from "./db.js";

const PORT = process.env.PORT || 3001;

dbReady.finally(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
