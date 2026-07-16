import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

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

export function generateToken() {
  return jwt.sign({ admin: true, iat: Math.floor(Date.now() / 1000) }, JWT_SECRET, { expiresIn: "24h" });
}
