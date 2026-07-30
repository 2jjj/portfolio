import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import pool from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET;
const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token nao fornecido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Token invalido ou expirado" });
  }
}

export function generateAccessToken() {
  return jwt.sign(
    { admin: true, jti: randomUUID(), iat: Math.floor(Date.now() / 1000) },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

export function generateRefreshToken() {
  return jwt.sign(
    { admin: true, jti: randomUUID(), iat: Math.floor(Date.now() / 1000) },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN }
  );
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch {
    return null;
  }
}

export async function storeRefreshToken(token) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await pool.query(
    "INSERT INTO refresh_tokens (token, expires_at) VALUES ($1, $2) ON CONFLICT (token) DO NOTHING",
    [token, expiresAt]
  );
}

export async function revokeRefreshToken(token) {
  await pool.query(
    "UPDATE refresh_tokens SET revoked = 1 WHERE token = $1",
    [token]
  );
}

export async function revokeAllRefreshTokens() {
  await pool.query(
    "UPDATE refresh_tokens SET revoked = 1 WHERE user_id = 'admin' AND revoked = 0"
  );
}

export async function isRefreshTokenValid(token) {
  const { rows } = await pool.query(
    "SELECT revoked, expires_at FROM refresh_tokens WHERE token = $1",
    [token]
  );
  if (!rows[0]) return false;
  if (rows[0].revoked === 1) return false;
  if (new Date(rows[0].expires_at) < new Date()) return false;
  return true;
}
