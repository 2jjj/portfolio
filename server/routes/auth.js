import { Router } from "express";
import bcrypt from "bcryptjs";
import { validate } from "../lib/validate.js";
import { loginSchema } from "../lib/validate.js";
import {
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
  verifyRefreshToken,
  isRefreshTokenValid,
} from "../middleware/auth.js";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SALT_ROUNDS = 12;
let hashedPassword = null;

function getHashedPassword() {
  if (!hashedPassword) {
    hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, SALT_ROUNDS);
  }
  return hashedPassword;
}

router.post("/login", validate(loginSchema), async (req, res) => {
  const { password } = req.body;

  try {
    const isValid = bcrypt.compareSync(password, getHashedPassword());
    if (!isValid) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const accessToken = generateAccessToken();
    const refreshToken = generateRefreshToken();
    await storeRefreshToken(refreshToken);

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || !!process.env.VERCEL,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });

    res.json({ token: accessToken });
  } catch (err) {
    req.log?.error?.({ err }, "Erro no login");
    return res.status(500).json({ error: "Erro ao processar autenticacao" });
  }
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token nao fornecido" });
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res.status(403).json({ error: "Refresh token invalido" });
  }

  const valid = await isRefreshTokenValid(refreshToken);
  if (!valid) {
    return res.status(403).json({ error: "Refresh token revogado ou expirado" });
  }

  await revokeRefreshToken(refreshToken);

  const newAccessToken = generateAccessToken();
  const newRefreshToken = generateRefreshToken();
  await storeRefreshToken(newRefreshToken);

  res.cookie("refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || !!process.env.VERCEL,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });

  res.json({ token: newAccessToken });
});

router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies?.refresh_token;
  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }
  res.clearCookie("refresh_token", { path: "/api/auth" });
  res.json({ message: "Sessao encerrada" });
});

export default router;
