import { Router } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/auth.js";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);

router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Senha é obrigatória" });
  }

  if (!bcrypt.compareSync(password, hashedPassword)) {
    return res.status(401).json({ error: "Senha incorreta" });
  }

  const token = generateToken();
  res.json({ token });
});

export default router;
