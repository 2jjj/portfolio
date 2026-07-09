import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "admin-secret-change-in-production";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }
  

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
}

export function generateToken() {
  return jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "7d" });
}
