import { Router } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/auth.js";

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

router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Senha e obrigatoria" });
  }

  try {
    const isValid = bcrypt.compareSync(password, getHashedPassword());

    if (!isValid) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = generateToken();
    res.json({ token });
  } catch {
    return res.status(500).json({ error: "Erro ao processar autenticacao" });
  }
});

export default router;
